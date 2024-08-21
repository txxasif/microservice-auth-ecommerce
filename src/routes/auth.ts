import { createAuthUserController } from '@auth/controller/auth.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', createAuthUserController);
  // router.post('/signin', read);
  // router.put('/verify-email', update);
  // router.put('/verify-otp/:otp', updateOTP);
  // router.put('/forgot-password', forgotPassword);
  // router.put('/reset-password/:token', resetPassword);
  // router.put('/change-password', changePassword);

  return router;
}
