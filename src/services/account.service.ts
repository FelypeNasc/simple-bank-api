import { NewAccountDto } from '../models/dtos/new-account.dto';
import { StatementDto } from '../models/dtos/statement.dto';
import { GetAccountDto } from '../models/dtos/get-account.dto';
import { BadRequest } from '../errors';
import { NewAccountValidator } from '../validators/new-account.validator';
import { AccountRepository } from '../repositories/account.repository';
import { UserRepository } from '../repositories/user.repository';
import { TransactionRepository } from '../repositories/transactions.repository';
import getRandomInt from '../utils/get-random.utils';
import AccountModel from '../models/account.model';
import UserModel from '../models/user.model';
import { ValidatorModule } from '../validators/validator.module';
import { StatementValidator } from '../validators/statement.validator';

import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

export class AccountService {
  private accountRepository = new AccountRepository();
  private userRepository = new UserRepository();
  private transactionRepository = new TransactionRepository();
  private newAccountValidator = new NewAccountValidator();
  private statementValidator = new StatementValidator();
  private validatorModule = new ValidatorModule();

  public async createAccount(newAccountDto: NewAccountDto): Promise<any> {
    try {
      this.newAccountValidator.validate(newAccountDto);
      const userExists: UserModel | null = await this.userRepository.findByCpf(
        newAccountDto.cpf,
      );
      if (userExists) {
        throw new BadRequest('This CPF already has an account');
      }

      newAccountDto.id = v4();

      const newUser = this.buildUser(newAccountDto);
      const newAccount = this.buildAccount(newAccountDto);

      const userResponse: UserModel = await this.userRepository.create(newUser);
      const accountResponse: AccountModel = await this.accountRepository.create(
        newAccount,
      );

      delete accountResponse.password;
      const newAccountData = {
        user: userResponse,
        account: accountResponse,
      };

      return newAccountData;
    } catch (error) {
      throw error;
    }
  }

  public async getAccount(getAccountDto: GetAccountDto): Promise<any> {
    try {
      this.validatorModule.cpfValidator(getAccountDto.cpf);
      const userExists = await this.userRepository.findByCpf(getAccountDto.cpf);

      if (!userExists) {
        throw new BadRequest('This CPF does not have an account');
      }

      const accountData = await this.accountRepository.findById(userExists.id);

      return accountData;
    } catch (error) {
      throw error;
    }
  }

  public async getStatement(statementDto: StatementDto): Promise<any> {
    try {
      this.statementValidator.validate(statementDto);
      const user = await this.userRepository.findByCpf(statementDto.cpf);

      if (!user) {
        throw new BadRequest('This CPF does not have an account');
      }

      const accountData = await this.accountRepository.findByAccountNumber(
        user.id,
        statementDto,
      );

      if (!accountData) {
        throw new BadRequest('Account not found');
      }

      const hashPassword = accountData.password;
      const match = bcrypt.compareSync(statementDto.password, hashPassword);

      if (!match) {
        throw new BadRequest('Wrong password');
      }

      const statementResponse = await this.transactionRepository.getStatement(
        accountData.id,
      );

      return statementResponse;
    } catch (error) {
      throw error;
    }
  }

  private buildUser(newAccountDto: NewAccountDto): UserModel {
    const newUser: UserModel = {
      id: newAccountDto.id,
      name: newAccountDto.name,
      birthdate: newAccountDto.birthdate,
      cpf: newAccountDto.cpf,
      email: newAccountDto.email,
    };
    return newUser;
  }

  private buildAccount(newAccountDto: NewAccountDto): AccountModel {
    const salt = bcrypt.genSaltSync(8);
    const encriptedPassword = bcrypt.hashSync(newAccountDto.password, salt);
    const newAccount: AccountModel = {
      id: v4(),
      userId: newAccountDto.id,
      password: encriptedPassword,
      accountNumber: getRandomInt(1, 99999),
      accountCheckDigit: getRandomInt(1, 9),
      agencyNumber: getRandomInt(1, 999),
      agencyCheckDigit: getRandomInt(1, 9),
      balance: 0,
    };
    return newAccount;
  }
}
