// db.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@auth/db/schema/index';

let connection: mysql.Connection;
let db: ReturnType<typeof drizzle>;

export async function initializeDb() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'asif',
    password: 'asif',
    database: 'asif',
    multipleStatements: true
  });

  db = drizzle(connection, { schema: schema, mode: 'default' });
}

export { connection, db };
