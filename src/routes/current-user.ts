import { getAuthUserController } from '@auth/controller/signup';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/currentuser/:id', getAuthUserController);
  return router;
}
