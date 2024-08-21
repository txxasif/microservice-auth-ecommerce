import { config } from '@auth/config';
import { db } from '@auth/db/db';
import { auths } from '@auth/db/schema';
import { IAuthDocumentNew } from '@auth/types/types';
import { IAuthBuyerMessageDetails, winstonLogger } from '@txxasif/shared';
import { Logger } from 'winston';
import { eq, getTableColumns } from 'drizzle-orm';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { omit } from 'lodash';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');
export async function createAuthUser(data: IAuthDocumentNew): Promise<IAuthDocumentNew | undefined> {
  try {
    const authData = {
      ...data,
      otpExpiration: data.otpExpiration ? new Date(data.otpExpiration) : null,
      passwordResetExpires: data.passwordResetExpires ? new Date(data.passwordResetExpires) : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date() // default to current date if not provided
    };
    await db.insert(auths).values(authData);
    const messageDetails: IAuthBuyerMessageDetails = {
      username: data.username!,
      email: data.email!,
      profilePicture: data.profilePicture!,
      country: data.country!,
      createdAt: data.createdAt!,
      type: 'auth'
    };
    await publishDirectMessage(
      authChannel,
      'jobber-buyer-update',
      'user-buyer',
      JSON.stringify(messageDetails),
      'Buyer details sent to buyer service.'
    );
    const userData: IAuthDocumentNew = omit(data, ['password']) as IAuthDocumentNew;
    return userData;
  } catch (error) {
    console.log(error);

    log.error(error);
  }
}
export async function getAuthUserById(authId: number) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = getTableColumns(auths);

    const user = await db.select(rest).from(auths).where(eq(auths.id, authId));
    return user[0];
  } catch (error) {
    log.error(error);
  }
}
export async function updateVerifyEmailField(authId: number, emailVerified: boolean, emailVerificationToken?: string): Promise<void> {
  try {
    await db.update(auths).set({ emailVerified: true }).where(eq(auths.id, authId));
    const updatedObj = emailVerificationToken ? { emailVerified, emailVerificationToken } : { emailVerified };
    await db.update(auths).set(updatedObj).where(eq(auths.id, authId));
  } catch (error) {
    log.error(error);
  }
}
export async function updatePasswordToken(authId: number, token: string, tokenExpiration: Date): Promise<void> {
  try {
    await db.update(auths).set({ passwordResetToken: token, passwordResetExpires: tokenExpiration }).where(eq(auths.id, authId));
  } catch (error) {
    log.error(error);
  }
}
