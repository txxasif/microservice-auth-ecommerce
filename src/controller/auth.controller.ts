import { createAuthUser, getAuthUserById } from '@auth/services/auth.service';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

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
