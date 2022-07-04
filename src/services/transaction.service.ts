import { AccountRepository } from '../repositories/account.repository';
import { UserRepository } from '../repositories/user.repository';
import { TransactionRepository } from '../repositories/transactions.repository';
import { DepositDto } from '../models/dtos/deposit.dto';
import { BadRequest } from '../errors';
import { DepositValidator } from '../validators/deposit.validator';
import TransactionModel from '../models/transaction.model';
import UserModel from '../models/user.model';

import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import AccountResponseModel from '../models/account-repository.model';
import { WithdrawDto } from '../models/dtos/withdraw.dto';
import { WithdrawValidator } from '../validators/withdraw.validator';
import { TransferDto } from '../models/dtos/transfer.dto';

export class TransactionService {
  private accountRepository = new AccountRepository();
  private userRepository = new UserRepository();
  private transactionRepository = new TransactionRepository();
  private depositValidator = new DepositValidator();
  private withdrawValidator = new WithdrawValidator();

  public async makeDeposit(depositDto: DepositDto): Promise<TransactionModel> {
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

      const newDeposit = this.buildDeposit(depositDto, depositAccount.id);

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

      return apiResponse;
    } catch (error) {
      throw error;
    }
  }

  public async makeWithdraw(
    withdrawDto: WithdrawDto,
  ): Promise<TransactionModel> {
    try {
      this.withdrawValidator.validate(withdrawDto);
      console.log('Withdraw Validated');
      const user: UserModel | null = await this.userRepository.findByCpf(
        withdrawDto.cpf,
      );
      if (!user) {
        throw new BadRequest('User not found');
      }

      const withdrawAccount: AccountResponseModel | null =
        await this.accountRepository.findByAccountNumber(user.id, withdrawDto);

      if (!withdrawAccount) {
        throw new BadRequest('Account not found');
      }

      const hashPassword = withdrawAccount.password;
      const match = bcrypt.compareSync(withdrawDto.password, hashPassword);

      if (!match) {
        throw new BadRequest('Wrong password');
      }
      const newWithdraw = this.buildWithdraw(withdrawDto, withdrawAccount.id);

      if (withdrawAccount.balance < newWithdraw.value) {
        throw new BadRequest('Insufficient balance');
      }
      console.log(newWithdraw);
      console.log('Inserting withdraw');
      const withdrawResponse = await this.transactionRepository.newWithdraw(
        newWithdraw,
      );

      await this.accountRepository.updateBalance(
        withdrawAccount.id,
        withdrawResponse.value,
        'debit',
      );

      const apiResponse = {
        transactionId: withdrawResponse.id,
        type: withdrawResponse.type,
        value: withdrawResponse.value,
        tax: withdrawResponse.tax,
        totalValue: withdrawResponse.totalValue,
        cpf: user.cpf,
        agencyNumber: withdrawAccount.agencyNumber,
        agencyCheckDigit: withdrawAccount.agencyCheckDigit,
        accountNumber: withdrawAccount.accountNumber,
        accountCheckDigit: withdrawAccount.accountCheckDigit,
        timestamp: withdrawResponse.createdAt,
      };

      console.log(apiResponse);
      return apiResponse;
    } catch (error) {
      throw error;
    }
  }

  public async makeTransfer(
    transferDto: TransferDto,
  ): Promise<TransactionModel> {
    try {
      const originAccount: AccountResponseModel | null =
        await this.accountRepository.findByAccountAndCpf(
          transferDto.originAccount,
        );

      if (!originAccount) {
        throw new BadRequest('Origin Account not found');
      }

      const destinationAccount: AccountResponseModel | null =
        await this.accountRepository.findByAccountAndCpf(
          transferDto.destinationAccount,
        );

      if (!destinationAccount) {
        throw new BadRequest('Destination Account not found');
      }

      const hashPassword = originAccount.password;
      const match = bcrypt.compareSync(transferDto.password, hashPassword);

      if (!match) {
        throw new BadRequest('Wrong password');
      }

      const newTransfer = this.buildTransfer(
        transferDto,
        originAccount,
        destinationAccount,
      );

      if (originAccount.balance < newTransfer.value) {
        throw new BadRequest('Insufficient balance');
      }

      const transferResponse = await this.transactionRepository.newTransfer(
        newTransfer,
      );

      await this.accountRepository.updateBalance(
        originAccount.id,
        transferResponse.totalValue,
        'debit',
      );

      await this.accountRepository.updateBalance(
        destinationAccount.id,
        transferResponse.value,
        'credit',
      );

      return transferResponse;
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
      destinationAccountId: destinationAccountId,
      value: value,
      type: 'deposit',
      tax: taxTotal,
      totalValue: depositDto.value,
    };
    return newDeposit;
  }

  private buildWithdraw(
    withdrawDto: WithdrawDto,
    originAccountId: string,
  ): TransactionModel {
    const withdrawTax = 4;
    const value = withdrawDto.value + withdrawTax;
    const newWithdraw: TransactionModel = {
      id: v4(),
      originAccountId: originAccountId,
      value: value,
      type: 'withdraw',
      tax: withdrawTax,
      totalValue: withdrawDto.value,
    };
    return newWithdraw;
  }

  private buildTransfer(
    transferDto: TransferDto,
    originAccount: AccountResponseModel,
    destinationAccount: AccountResponseModel,
  ): TransactionModel {
    const transferTax = 1;
    const value = transferDto.value + transferTax;
    const newTransfer: TransactionModel = {
      id: v4(),
      originAccountId: originAccount.id,
      destinationAccountId: destinationAccount.id,
      value: value,
      type: 'transfer',
      tax: transferTax,
      totalValue: transferDto.value,
    };
    return newTransfer;
  }
}
