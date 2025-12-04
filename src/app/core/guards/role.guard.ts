import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../user/user.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const userService = inject(UserService);
  const router = inject(Router);

  const user = auth.currentUser;

  if (!user) {
    console.warn("No hay usuario autenticado → Redirigiendo a login");
    return router.parseUrl('/login');
  }

  const dbUser = await userService.getUser(user.uid);
  const requiredRole = route.data?.['role'];

  console.log("Guard → Usuario:", dbUser);
  console.log("Guard → Rol requerido:", requiredRole);

  if (!dbUser || !requiredRole || dbUser.role !== requiredRole) {
    console.warn("Acceso denegado → Redirigiendo a denied");
    return router.parseUrl('/denied');
  }

  return true;
};
