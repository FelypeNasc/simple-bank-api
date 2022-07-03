import { NewAccountDto } from '../models/dtos/new-account.dto';
import { BadRequest } from '../errors';
import { NewAccountValidator } from '../validators/new-account.validator';
import { AccountRepository } from '../repositories/account.repository';
import { UserRepository } from '../repositories/user.repository';
import getRandomInt from '../utils/getRandom.utils';
import AccountModel from '../models/account.model';
import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { StatementDto } from '../models/dtos/statement.dto';
import { ValidatorModule } from '../validators/validator.module';
import { GetAccountDto } from '../models/dtos/get-account.dto';

export class AccountService {
  private accountRepository = new AccountRepository();
  private userRepository = new UserRepository();
  private newAccountValidator = new NewAccountValidator();
  private validatorModule = new ValidatorModule();

  public async createAccount(newAccountDto: NewAccountDto): Promise<any> {
    try {
      this.newAccountValidator.validate(newAccountDto);
      const userExists: object = await this.userRepository.findByCpf(
        newAccountDto.cpf,
      );
      if (userExists) {
        throw new BadRequest('User already exists');
      }

      newAccountDto.id = v4();

      const newUser = this.buildUser(newAccountDto);
      const newAccount = this.buildAccount(newAccountDto);

      const userResponse = await this.userRepository.create(newUser);
      const accountResponse = await this.accountRepository.create(newAccount);

      const response = {
        user: userResponse,
        account: accountResponse,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAccount(getAccountDto: GetAccountDto): Promise<any> {
    try {
      this.validatorModule.cpfValidator(getAccountDto.cpf);
      const userExists: any = await this.userRepository.findByCpf(
        getAccountDto.cpf,
      );
      if (!userExists) {
        throw new BadRequest('User does not exists');
      }
      console.log(userExists.id);
      const accountResponse = await this.accountRepository.findById(
        userExists.id,
      );
      console.log(accountResponse);
      return accountResponse;
    } catch (error) {
      throw error;
    }
  }

  public async getStatement(statementDto: StatementDto): Promise<any> {
    try {
      // const response = await this.accountRepository.findByCpf(statementDto);
      // return response;
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
      user_id: newAccountDto.id,
      password: encriptedPassword,
      agency_number: getRandomInt(100, 999),
      agency_check_digit: getRandomInt(1, 9),
      account_number: getRandomInt(10000, 99999),
      account_check_digit: getRandomInt(1, 9),
      balance: 0,
    };
    return newAccount;
  }
}
