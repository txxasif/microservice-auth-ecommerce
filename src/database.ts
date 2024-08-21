import { winstonLogger } from '@txxasif/shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { initializeDb } from '@auth/db/db';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export async function databaseConnection(): Promise<void> {
  try {
    await initializeDb();
    log.info('AuthService Mysql database connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
