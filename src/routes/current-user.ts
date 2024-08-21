import { getAuthUserController } from '@auth/controller/auth.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/currentuser/:id', getAuthUserController);
  return router;
}
