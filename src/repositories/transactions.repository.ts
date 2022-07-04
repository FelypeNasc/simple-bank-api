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

  async newTransfer(
    newTransfer: TransactionModel,
  ): Promise<TransactionRepositoryModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.transactions (id, origin_account_id, destination_account_id, value, type, tax, total_value)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *;
                `;
      const values = [
        newTransfer.id,
        newTransfer.originAccountId,
        newTransfer.destinationAccountId,
        newTransfer.value,
        newTransfer.type,
        newTransfer.tax,
        newTransfer.totalValue,
      ];
      const queryResponse = await client.query(query, values);
      const response = queryResponse.rows[0];

      if (!response) {
        throw new InternalError();
      }

      const transaction: TransactionRepositoryModel = {
        id: response.id,
        originAccountId: response.origin_account_id,
        destinationAccountId: response.destination_account_id,
        value: response.value,
        type: response.type,
        tax: response.tax,
        totalValue: response.total_value,
        createdAt: response.created_at,
      };

      return transaction;
    } catch (e) {
      throw new InternalError();
    }
  }

  async getStatement(accountId: string): Promise<TransactionRepositoryModel[]> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT * FROM mybank.transactions
                WHERE origin_account_id = $1
                OR destination_account_id = $1
                ORDER BY created_at DESC;
            `;
      const values = [accountId];
      const queryResponse = await client.query(query, values);
      if (!queryResponse.rows[0]) {
        throw new InternalError();
      }

      const response: TransactionRepositoryModel[] = queryResponse.rows.map(
        (row: any) => {
          return {
            id: row.id,
            originAccountId: row.origin_account_id,
            destinationAccountId: row.destination_account_id,
            value: row.value,
            type: row.type,
            tax: row.tax,
            totalValue: row.total_value,
            createdAt: row.created_at,
          };
        },
      );

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
