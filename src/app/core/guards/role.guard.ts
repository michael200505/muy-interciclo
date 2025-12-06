import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../user/user.service';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  private auth = inject(Auth);
  private userService = inject(UserService);
  private router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const expectedRoles = route.data['roles'] as UserRole[];

    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      return this.router.parseUrl('/login');
    }

    const appUser = await this.userService.getUser(firebaseUser.uid);
    if (!appUser) {
      return this.router.parseUrl('/login');
    }

    if (!expectedRoles.includes(appUser.role)) {
      // Sin permiso → redirigimos a inicio
      return this.router.parseUrl('/');
    }

    return true;
  }
}
