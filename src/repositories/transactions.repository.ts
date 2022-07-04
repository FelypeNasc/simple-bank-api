import PostgresDB from '.';
import { InternalError } from '../errors';
import TransactionRepositoryModel from '../models/transaction-repository.model';
import TransactionModel from '../models/transaction.model';

export class TransactionRepository extends PostgresDB {
  async newDeposit(
    newDeposit: TransactionModel,
  ): Promise<TransactionRepositoryModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.transactions (id, destination_account_id, value, type, tax, total_value)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *;
            `;
      const values = [
        newDeposit.id,
        newDeposit.destinationAccountId,
        newDeposit.value,
        newDeposit.type,
        newDeposit.tax,
        newDeposit.totalValue,
      ];

      const queryResponse = await client.query(query, values);

      if (!queryResponse.rows[0]) {
        throw new InternalError();
      }

      const response: TransactionRepositoryModel = {
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

  async newWithdraw(
    newWithdraw: TransactionModel,
  ): Promise<TransactionRepositoryModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.transactions (id, origin_account_id, value, type, tax, total_value)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *;
                `;
      const values = [
        newWithdraw.id,
        newWithdraw.originAccountId,
        newWithdraw.value,
        newWithdraw.type,
        newWithdraw.tax,
        newWithdraw.totalValue,
      ];
      const queryResponse = await client.query(query, values);
      console.log('After query');
      if (!queryResponse.rows[0]) {
        throw new InternalError();
      }

      const response: TransactionRepositoryModel = {
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
