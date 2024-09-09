import { config } from '@auth/config';
import { db } from '@auth/db/db';
import { auths } from '@auth/db/schema';
import { IAuthDocumentNew } from '@auth/types/types';
import { IAuthBuyerMessageDetails, winstonLogger, firstLetterUppercase, lowerCase, IAuthDocument } from '@txxasif/shared';
import { Logger } from 'winston';
import { eq, getTableColumns, or, and, gt } from 'drizzle-orm';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { omit } from 'lodash';
import { sign } from 'jsonwebtoken';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');
export async function createAuthUser(data: IAuthDocumentNew): Promise<IAuthDocument | undefined> {
  try {
    await db.insert(auths).values(data);
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
export async function getUserByUsernameOrEmail(username: string, email: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: password, ...rest } = getTableColumns(auths);
    const user = await db
      .select(rest)
      .from(auths)
      .where(or(eq(auths.username, firstLetterUppercase(username)), eq(auths.email, lowerCase(email))));
    return user[0];
  } catch (error) {
    log.error(error);
  }
}
export async function getUserByUsername(username: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: password, ...rest } = getTableColumns(auths);
    const user = await db
      .select(rest)
      .from(auths)
      .where(eq(auths.username, firstLetterUppercase(username)));
    return user[0];
  } catch (error) {
    log.error(error);
  }
}
export async function getUserByEmail(email: string): Promise<IAuthDocument | undefined> {
  try {
    const user = await db
      .select()
      .from(auths)
      .where(eq(auths.email, lowerCase(email)));
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
export async function updatePassword(authId: number, password: string): Promise<void> {
  try {
    await db.update(auths).set({ password, passwordResetToken: '', passwordResetExpires: new Date() }).where(eq(auths.id, authId));
  } catch (error) {
    log.error(error);
  }
}

export function signToken(id: number, email: string, username: string): string {
  return sign(
    {
      id,
      email,
      username
    },
    config.JWT_TOKEN!
  );
}
export async function updateUserOTP(
  authId: number,
  otp: string,
  otpExpiration: Date,
  browserName: string,
  deviceType: string
): Promise<void> {
  try {
    await db.update(auths).set({ otp, otpExpiration, browserName, deviceType }).where(eq(auths.id, authId));
  } catch (error) {
    log.error(error);
  }
}
export async function getAuthUserByVerificationToken(token: string): Promise<IAuthDocument | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = getTableColumns(auths);
    const user = await db.select(rest).from(auths).where(eq(auths.emailVerificationToken, token)).limit(1);
    return user[0];
  } catch (error) {
    log.error(error);
  }
}
export async function getAuthUserByPasswordToken(token: string): Promise<IAuthDocument | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = getTableColumns(auths);
    const user = await db
      .select(rest)
      .from(auths)
      .where(and(eq(auths.passwordResetToken, token), gt(auths.passwordResetExpires, new Date())))
      .limit(1); // Equivalent to findOne()

    return user[0];
  } catch (error) {
    log.error(error);
  }
}
