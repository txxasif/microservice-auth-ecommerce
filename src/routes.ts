import { Application } from 'express';
import { healthRoutes } from '@auth/routes/health';
import { authRoutes } from '@auth/routes/auth';
import { currentUserRoutes } from '@auth/routes/current-user';

const BASE_PATH = '/api/v1/auth';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  app.use(BASE_PATH, authRoutes());
  app.use(BASE_PATH, currentUserRoutes());
}
