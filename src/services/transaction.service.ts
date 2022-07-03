import { AccountRepository } from '../repositories/account.repository';
import { UserRepository } from '../repositories/user.repository';
import { TransactionRepository } from '../repositories/transactions.repository';
import { DepositDto } from '../models/dtos/deposit.dto';
import { BadRequest } from '../errors';
import { DepositValidator } from '../validators/deposit.validator';
import TransactionModel from '../models/transaction.model';
import AccountModel from '../models/account.model';
import UserModel from '../models/user.model';

import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

export class TransactionService {
  private accountRepository = new AccountRepository();
  private userRepository = new UserRepository();
  private transactionRepository = new TransactionRepository();
  private depositValidator = new DepositValidator();

  public async makeDeposit(depositDto: DepositDto): Promise<any> {
    try {
      this.depositValidator.validate(depositDto);

      const user: UserModel = await this.userRepository.findByCpf(
        depositDto.cpf,
      );
      if (!user) {
        throw new BadRequest('User not found');
      }

      const depositAccount: AccountModel =
        await this.accountRepository.findById(user.id);
      if (!depositAccount) {
        throw new BadRequest('Account not found');
      }

      // const encriptedPassword = depositAccount.password;
      // const isPasswordValid = bcrypt.compareSync(
      //   depositDto.password,
      //   encriptedPassword,
      // );

      // if (!isPasswordValid) {
      //   throw new BadRequest('Wrong password');
      // }

      const newDeposit = this.buildDeposit(depositDto, depositAccount.id);

      await this.transactionRepository.newDeposit(newDeposit);
    } catch (error) {
      throw error;
    }
  }

  private buildDeposit(
    depositDto: DepositDto,
    destinationAccountId: string,
  ): TransactionModel {
    const depositTax = 0.01;
    const taxTotal = depositDto.value * depositTax;
    const value = depositDto.value - taxTotal;
    const newDeposit: TransactionModel = {
      id: v4(),
      destination_account_id: destinationAccountId,
      value: value,
      type: 'deposit',
      tax: taxTotal,
      total_value: depositDto.value,
    };
    return newDeposit;
  }
}
