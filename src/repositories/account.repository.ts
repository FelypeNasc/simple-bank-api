import PostgresDB from '.';
import { InternalError } from '../errors';
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
        accountNumber: queryResponse.rows[0].account_number,
        agencyNumber: queryResponse.rows[0].agency_number,
        agencyCheckDigit: queryResponse.rows[0].agency_check_digit,
        accountCheckDigit: queryResponse.rows[0].account_check_digit,
        balance: queryResponse.rows[0].balance,
      };

      return newAccountData;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async updateBalance(id: string, newBalance: number): Promise<object> {
    try {
      const client = await this.pool.connect();
      const query = `
                UPDATE mybank.accounts
                SET balance = $1
                WHERE id = $2
                RETURNING balance;
                `;
      const queryResponse = await client.query(query, [newBalance, id]);
      const response = queryResponse.rows[0];

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findByAccountNumber(
    userId: string,
    accountData: DepositDto,
  ): Promise<AccountResponseModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT * FROM mybank.accounts 
                WHERE user_id = $1 
                AND account_number = $2 
                AND account_check_digit = $3 
                AND agency_number = $4 
                AND agency_check_digit = $5;
                RETURNING id, account_number, agency_number, agency_check_digit, account_check_digit, balance;
                `;
      const queryResponse = await client.query(query, [
        userId,
        accountData.accountNumber,
        accountData.accountCheckDigit,
        accountData.agencyNumber,
        accountData.agencyCheckDigit,
      ]);
      const accountFound: AccountResponseModel = {
        id: queryResponse.rows[0].id,
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

  public async findById(id: string): Promise<AccountModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT agency_number, 
                agency_check_digit, 
                account_number, 
                account_check_digit, 
                balance 
                FROM mybank.accounts WHERE user_id = $1;
                `;
      const queryResponse = await client.query(query, [id]);
      const response: AccountModel = queryResponse.rows[0];

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
