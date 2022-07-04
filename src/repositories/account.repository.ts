import PostgresDB from '.';
import { BadRequest, InternalError } from '../errors';
import AccountRepositoryModel from '../models/account-repository.model';
import AccountModel from '../models/account.model';
import { DepositDto } from '../models/dtos/deposit.dto';
import { TransferDto } from '../models/dtos/transfer.dto';

export class AccountRepository extends PostgresDB {
  public async create(
    newAccount: AccountModel,
  ): Promise<AccountRepositoryModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.accounts (id, user_id, password, account_number, account_check_digit, agency_number, agency_check_digit, balance)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING account_number, agency_number, agency_check_digit, account_check_digit, balance;
                `;
      const values = [
        newAccount.id,
        newAccount.userId,
        newAccount.password,
        newAccount.accountNumber,
        newAccount.accountCheckDigit,
        newAccount.agencyNumber,
        newAccount.agencyCheckDigit,
        newAccount.balance,
      ];
      const queryResponse = await client.query(query, values);

      const newAccountData: AccountRepositoryModel = {
        id: queryResponse.rows[0].id,
        userId: queryResponse.rows[0].user_id,
        password: queryResponse.rows[0].password,
        accountNumber: queryResponse.rows[0].account_number,
        accountCheckDigit: queryResponse.rows[0].account_check_digit,
        agencyNumber: queryResponse.rows[0].agency_number,
        agencyCheckDigit: queryResponse.rows[0].agency_check_digit,
        balance: queryResponse.rows[0].balance,
      };

      return newAccountData;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async updateBalance(
    id: string,
    value: number,
    operation: 'debit' | 'credit',
  ): Promise<object> {
    try {
      const client = await this.pool.connect();
      const operationSymbol = operation === 'debit' ? '-' : '+';
      const query = `
                UPDATE mybank.accounts
                SET balance = balance ${operationSymbol} $1
                WHERE id = $2
                RETURNING *;
                `;
      const queryResponse = await client.query(query, [value, id]);
      const response = queryResponse.rows[0];

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findByAccountNumber(
    userId: string,
    accountData: AccountModel,
  ): Promise<AccountRepositoryModel | null> {
    try {
      const client = await this.pool.connect();
      const query = `
                  SELECT *
                  FROM mybank.accounts 
                  WHERE user_id = $1 
                    AND account_number = $2 
                    AND account_check_digit = $3
                    AND agency_number = $4 
                    AND agency_check_digit = $5;
                `;
      const values = [
        userId,
        accountData.accountNumber,
        accountData.accountCheckDigit,
        accountData.agencyNumber,
        accountData.agencyCheckDigit,
      ];
      const queryResponse = await client.query(query, values);

      if (queryResponse.rows.length === 0) {
        return null;
      }

      const accountFound: AccountRepositoryModel = {
        id: queryResponse.rows[0].id,
        userId: queryResponse.rows[0].user_id,
        password: queryResponse.rows[0].password,
        accountNumber: queryResponse.rows[0].account_number,
        accountCheckDigit: queryResponse.rows[0].account_check_digit,
        agencyNumber: queryResponse.rows[0].agency_number,
        agencyCheckDigit: queryResponse.rows[0].agency_check_digit,
        balance: queryResponse.rows[0].balance,
      };

      return accountFound;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findByAccountAndCpf(
    accountData: AccountModel,
  ): Promise<AccountRepositoryModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                  SELECT accounts.id, password, account_number, account_check_digit, agency_number, agency_check_digit, balance
                  FROM mybank.accounts, mybank.users
                  WHERE accounts.user_id = users.id
                    AND users.cpf = $1
                    AND accounts.account_number = $2
                    AND accounts.account_check_digit = $3
                    AND accounts.agency_number = $4
                    AND accounts.agency_check_digit = $5;
                    `;
      const values = [
        accountData.cpf,
        accountData.accountNumber,
        accountData.accountCheckDigit,
        accountData.agencyNumber,
        accountData.agencyCheckDigit,
      ];
      const queryResponse = await client.query(query, values);

      const response: AccountRepositoryModel = {
        id: queryResponse.rows[0].id,
        userId: queryResponse.rows[0].user_id,
        password: queryResponse.rows[0].password,
        accountNumber: queryResponse.rows[0].account_number,
        accountCheckDigit: queryResponse.rows[0].account_check_digit,
        agencyNumber: queryResponse.rows[0].agency_number,
        agencyCheckDigit: queryResponse.rows[0].agency_check_digit,
        balance: queryResponse.rows[0].balance,
      };

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findById(id: string): Promise<AccountRepositoryModel | null> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT  account_number, 
                account_check_digit, 
                agency_number, 
                agency_check_digit, 
                balance 
                FROM mybank.accounts WHERE user_id = $1;
                `;
      const queryResponse = await client.query(query, [id]);

      const response: AccountRepositoryModel = queryResponse.rows[0];

      if (!response) {
        return null;
      }

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
