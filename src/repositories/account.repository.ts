import PostgresDB from '.';
import { BadRequest, InternalError } from '../errors';
import AccountResponseModel from '../models/account-response.model';
import AccountModel from '../models/account.model';
import { DepositDto } from '../models/dtos/deposit.dto';

export class AccountRepository extends PostgresDB {
  public async create(newAccount: AccountModel): Promise<AccountResponseModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.accounts (id, user_id, password, agency_number, agency_check_digit, account_number, account_check_digit, balance)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING account_number, agency_number, agency_check_digit, account_check_digit, balance;
                `;
      const values = [
        newAccount.id,
        newAccount.user_id,
        newAccount.password,
        newAccount.agency_number,
        newAccount.agency_check_digit,
        newAccount.account_number,
        newAccount.account_check_digit,
        newAccount.balance,
      ];
      const queryResponse = await client.query(query, values);

      const newAccountData: AccountResponseModel = {
        id: queryResponse.rows[0].id,
        userId: queryResponse.rows[0].user_id,
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
    accountData: DepositDto,
  ): Promise<AccountResponseModel | null> {
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
      console.log('Values: ', values);
      const queryResponse = await client.query(query, values);

      if (queryResponse.rows.length === 0) {
        return null;
      }

      const accountFound: AccountResponseModel = {
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
      console.log('error: ', e);
      throw new InternalError();
    }
  }

  public async findById(id: string): Promise<AccountResponseModel | null> {
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

      const response: AccountResponseModel = queryResponse.rows[0];

      if (!response) {
        return null;
      }

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
