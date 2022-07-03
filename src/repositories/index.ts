import { Pool } from 'pg';
import config from '../config';

export default class PostgresDB {
  protected pool: Pool;

  public constructor() {
    let port;

    if (config.pg.port) {
      port = parseInt(config.pg.port);
    }

    this.pool = new Pool({
      host: config.pg.host,
      user: config.pg.user,
      password: config.pg.password,
      database: config.pg.database,
      port: port,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
}
