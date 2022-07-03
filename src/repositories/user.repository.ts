import PostgresDB from '.';
import { InternalError } from '../errors';
import UserModel from '../models/user.model';

export class UserRepository extends PostgresDB {
  public async create(newUser: UserModel): Promise<UserModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.users (id, name, birthdate, cpf, email)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING name, birthdate, cpf, email;
            `;

      const queryResponse = await client.query(query, [
        newUser.id,
        newUser.name,
        newUser.birthdate,
        newUser.cpf,
        newUser.email,
      ]);
      const response: UserModel = queryResponse.rows[0];

      return response;
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findByCpf(cpf: number): Promise<UserModel> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT * FROM mybank.users WHERE cpf = $1;
            `;
      const queryResponse = await client.query(query, [cpf]);
      const response: UserModel = queryResponse.rows[0];
      return response;
    } catch (e) {
      throw new InternalError();
    }
  }
}
