import PostgresDB from '.';
import { InternalError } from '../errors';
import AccountModel from '../models/account.model';

export class AccountRepository extends PostgresDB {
  public async create(newAccount: AccountModel): Promise<object> {
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
      const response = queryResponse.rows[0];

      return response;
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
