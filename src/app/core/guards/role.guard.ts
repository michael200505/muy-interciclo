import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UserService } from '../user/user.service';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(Auth);
  private userService = inject(UserService);
  private router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const expectedRoles = route.data['roles'] as UserRole[];

    const firebaseUser = await new Promise<any>((resolve) => {
      onAuthStateChanged(this.auth, (user) => resolve(user));
    });

    if (!firebaseUser) return this.router.parseUrl('/login');

    const appUser = await this.userService.getUser(firebaseUser.uid);
    if (!appUser) return this.router.parseUrl('/login');

    // ✅ Si no tiene el rol esperado, mejor mandarlo a HOME (no a '/')
    if (!expectedRoles.includes(appUser.role)) {
      return this.router.parseUrl('/home'); // ✅ en tu app esto sí existe
      // (si prefieres, crea /denied y manda ahí)
    }

    return true;
  }
}
