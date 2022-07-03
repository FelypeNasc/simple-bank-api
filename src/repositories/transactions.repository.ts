import PostgresDB from '.';
import { InternalError } from '../errors';
import TransactionModel from '../models/transaction.model';

export class TransactionRepository extends PostgresDB {
  async newDeposit(newDeposit: TransactionModel) {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.transactions (id, destination_account_id, value, type, tax, total_value)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING id, destination_account_id, value, type, tax, total_value;
            `;
      const queryResponse = await client.query(query, [
        newDeposit.id,
        newDeposit.destination_account_id,
        newDeposit.value,
        newDeposit.type,
        newDeposit.tax,
        newDeposit.total_value,
      ]);
      const response = queryResponse.rows[0];
      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
