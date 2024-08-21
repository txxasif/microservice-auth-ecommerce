import { createAuthUser } from '@auth/services/auth.service';
import { Response, Request } from 'express';

export const createAuthUserController = async (req: Request, res: Response) => {
  const body = req.body;
  await createAuthUser(body);
  res.send('create auth user');
};
