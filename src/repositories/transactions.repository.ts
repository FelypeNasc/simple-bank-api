import PostgresDB from '.';
import { InternalError } from '../errors';
import TransactionResponseModel from '../models/transaction-response.model';
import TransactionModel from '../models/transaction.model';

export class TransactionRepository extends PostgresDB {
  async newDeposit(
    newDeposit: TransactionModel,
  ): Promise<TransactionResponseModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.transactions (id, destination_account_id, value, type, tax, total_value)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *;
            `;
      const values = [
        newDeposit.id,
        newDeposit.destination_account_id,
        newDeposit.value,
        newDeposit.type,
        newDeposit.tax,
        newDeposit.total_value,
      ];

      const queryResponse = await client.query(query, values);

      if (!queryResponse.rows[0]) {
        throw new InternalError();
      }

      const response: TransactionResponseModel = {
        id: queryResponse.rows[0].id,
        originAccountId: queryResponse.rows[0].origin_account_id,
        destinationAccountId: queryResponse.rows[0].destination_account_id,
        value: queryResponse.rows[0].value,
        type: queryResponse.rows[0].type,
        tax: queryResponse.rows[0].tax,
        totalValue: queryResponse.rows[0].total_value,
        createdAt: queryResponse.rows[0].created_at,
      };
      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
