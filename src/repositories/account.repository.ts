import PostgresDB from '.';
import { InternalError } from '../errors';
import AccountModel from '../models/account.model';

export class AccountRepository extends PostgresDB {
  public async create(newAccount: AccountModel): Promise<object> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.accounts (id, user_id, password, agency_number, agency_verifier_code, account_number, account_verifier_code, balance)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING account_number, agency_number, agency_verifier_code, account_verifier_code, balance;
                `;
      const queryResponse = await client.query(query, [
        newAccount.id,
        newAccount.user_id,
        newAccount.password,
        newAccount.agency_number,
        newAccount.agency_verifier_code,
        newAccount.account_number,
        newAccount.account_verifier_code,
        newAccount.balance,
      ]);
      const response = queryResponse.rows[0];
      return response;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findById(id: string): Promise<object> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT agency_number, 
                agency_verifier_code, 
                account_number, 
                account_verifier_code, 
                balance FROM mybank.accounts WHERE user_id = $1;
                `;
      const response = await client.query(query, [id]);
      return response.rows[0];
    } catch (e) {
      throw new InternalError();
    }
  }
}
