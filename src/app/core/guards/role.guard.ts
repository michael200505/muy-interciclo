import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../user/user.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const userService = inject(UserService);
  const router = inject(Router);

  const user = auth.currentUser;

  if (!user) {
    return router.parseUrl('/login');
  }

  const dbUser = await userService.getUser(user.uid);
  const requiredRole = route.data?.['role'] as UserRole;

  if (!dbUser || !requiredRole || dbUser.role !== requiredRole) {
    return router.parseUrl('/denied');
  }

  return true;
};
