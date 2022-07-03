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
import AccountResponseModel from '../models/account-response.model';

export class TransactionService {
  private accountRepository = new AccountRepository();
  private userRepository = new UserRepository();
  private transactionRepository = new TransactionRepository();
  private depositValidator = new DepositValidator();

  public async makeDeposit(depositDto: DepositDto): Promise<any> {
    try {
      this.depositValidator.validate(depositDto);
      const user: UserModel | null = await this.userRepository.findByCpf(
        depositDto.cpf,
      );

      if (!user) {
        throw new BadRequest('User not found');
      }

      const depositAccount: AccountResponseModel | null =
        await this.accountRepository.findByAccountNumber(user.id, depositDto);

      if (!depositAccount) {
        throw new BadRequest('Account not found');
      }
      console.log(depositAccount);

      const newDeposit = this.buildDeposit(depositDto, depositAccount.id);
      console.log(newDeposit);

      const depositResponse = await this.transactionRepository.newDeposit(
        newDeposit,
      );

      await this.accountRepository.updateBalance(
        depositAccount.id,
        depositResponse.value,
        'credit',
      );

      const apiResponse = {
        transactionId: depositResponse.id,
        type: depositResponse.type,
        value: depositResponse.value,
        tax: depositResponse.tax,
        totalValue: depositResponse.totalValue,
        cpf: user.cpf,
        agencyNumber: depositAccount.agencyNumber,
        agencyCheckDigit: depositAccount.agencyCheckDigit,
        accountNumber: depositAccount.accountNumber,
        accountCheckDigit: depositAccount.accountCheckDigit,
        timestamp: depositResponse.createdAt,
      };

      console.log(apiResponse);
      return apiResponse;
    } catch (error) {
      throw error;
    }
  }

  // public async makeWithdraw(withdrawDto: DepositDto): Promise<any> {
  //   try {
  //     this.depositValidator.validate(withdrawDto);
  //     const user: UserModel | null = await this.userRepository.findByCpf(
  //       withdrawDto.cpf,
  //     );

  //     if (!user) {
  //       throw new BadRequest('User not found');
  //     }

  //     const withdrawAccount: AccountResponseModel | null =
  //       await this.accountRepository.findByAccountNumber(user.id, withdrawDto);

  //     if (!withdrawAccount) {
  //       throw new BadRequest('Account not found');
  //     }

  //     const newWithdraw = this.buildWithdraw(withdrawDto, withdrawAccount.id);
  //     const withdrawResponse = await this.transactionRepository.newWithdraw(
  //       newWithdraw,
  //     );

  //     await this.accountRepository.updateBalance(
  //       withdrawAccount.id,
  //       withdrawResponse.value,
  //       'debit',
  //     );

  //     const apiResponse = {
  //       transactionId: withdrawResponse.id,
  //       type: withdrawResponse.type,
  //       value: withdrawResponse.value,
  //       tax: withdrawResponse.tax,
  //       totalValue: withdrawResponse.totalValue,
  //       cpf: user.cpf,
  //       agencyNumber: withdrawAccount.agencyNumber,
  //       agencyCheckDigit: withdrawAccount.agencyCheckDigit,
  //       accountNumber: withdrawAccount.accountNumber,
  //       accountCheckDigit: withdrawAccount.accountCheckDigit,
  //       timestamp: withdrawResponse.createdAt,
  //     };

  //     console.log(apiResponse);
  //     return apiResponse;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
