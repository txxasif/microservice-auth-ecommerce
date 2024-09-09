import crypto from 'crypto';

import { StatusCodes } from 'http-status-codes';
import { signupSchema } from '@auth/schemes/signup';
import { createAuthUser, getAuthUserById, getUserByUsernameOrEmail, signToken } from '@auth/services/auth.service';
import { BadRequestError, IEmailMessageDetails, firstLetterUppercase, lowerCase, uploads } from '@txxasif/shared';
import { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { IAuthDocumentNew } from '@auth/types/types';
import { hashPassword } from '@auth/helper/helper';
export const createAuthUserController = async (req: Request, res: Response) => {
  const body = req.body;
  await createAuthUser(body);
  res.send('create auth user');
};

export const getAuthUserController = async (req: Request, res: Response) => {
  const authId = req.params.id;
  const user = await getAuthUserById(Number(authId));
  res.status(StatusCodes.OK).json({ message: 'Authenticated user', user });
};

export async function create(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
  }
  const { username, email, password, country, profilePicture, browserName, deviceType } = req.body;
  const checkIfUserExist: IAuthDocumentNew = (await getUserByUsernameOrEmail(username, email)) as IAuthDocumentNew;
  if (checkIfUserExist) {
    throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');
  }

  const profilePublicId = uuidV4();
  const uploadResult: UploadApiResponse = (await uploads(profilePicture, `${profilePublicId}`, true, true)) as UploadApiResponse;
  if (!uploadResult.public_id) {
    throw new BadRequestError('File upload error. Try again', 'SignUp create() method error');
  }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const securePassword = await hashPassword(password);
  const authData: IAuthDocumentNew = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password: securePassword,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters,
    browserName,
    deviceType
  };
  const result: IAuthDocumentNew = (await createAuthUser(authData)) as IAuthDocumentNew;
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service.'
  );
  const userJWT: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: result, token: userJWT });
}
