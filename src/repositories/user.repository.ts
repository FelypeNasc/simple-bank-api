import PostgresDB from '.';
import { InternalError } from '../errors';
import UserModel from '../models/user.model';

export class UserRepository extends PostgresDB {
  public async create(newUser: UserModel): Promise<object> {
    try {
      const client = await this.pool.connect();
      const query = `
                INSERT INTO mybank.users (id, name, birthdate, cpf, email)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING name, birthdate, cpf, email;
            `;
      const response = await client.query(query, [
        newUser.id,
        newUser.name,
        newUser.birthdate,
        newUser.cpf,
        newUser.email,
      ]);
      return response.rows[0];
    } catch (e) {
      throw new InternalError();
    }
  }

  public async findByCpf(cpf: string): Promise<object> {
    try {
      const client = await this.pool.connect();
      const query = `
                SELECT * FROM mybank.users WHERE cpf = $1;
            `;
      const response = await client.query(query, [cpf]);
      return response.rows[0];
    } catch (e) {
      throw new InternalError();
    }
  }
}
