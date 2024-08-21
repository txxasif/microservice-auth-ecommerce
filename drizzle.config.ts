import { config } from '@auth/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'mysql', // 'postgresql' | 'mysql' | 'sqlite',
  dbCredentials: {
    url: config.MYSQL_DB!
  }
});
