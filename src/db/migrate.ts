import path from 'path';

import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, connection, initializeDb } from '@auth/db/db';

async function runMigrations() {
  await initializeDb(); // Ensure the DB is initialized before running migrations
  await migrate(db, { migrationsFolder: path.resolve('drizzle') });
  await connection.end();
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
