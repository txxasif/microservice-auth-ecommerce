import { config } from '@auth/config';
import { db } from '@auth/db/db';
import { auths } from '@auth/db/schema';
import { IAuthDocumentNew } from '@auth/types/types';
import { winstonLogger } from '@txxasif/shared';
import { Logger } from 'winston';
import { eq } from 'drizzle-orm';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');
export async function createAuthUser(data: IAuthDocumentNew): Promise<{ message: string } | undefined> {
  try {
    await db.insert(auths).values(data);
    return { message: 'done' };
  } catch (error) {
    log.error(error);
  }
}
export async function getAuthUserById(authId: number): Promise<any | undefined> {
  try {
    const user = await db.select({}).from(auths).where(eq(auths.id, authId));
    console.log(user);
    return user[0];
  } catch (error) {
    log.error(error);
  }
}
