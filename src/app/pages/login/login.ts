import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/user/user.service';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [PageContainerComponent]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  async login() {
  console.log("Iniciando login...");
  this.authService.loginWithGoogle()
    .then(async cred => {
      console.log("Login OK:", cred.user);

      // Guardar sin perder rol existente
      await this.userService.saveUser(cred.user);

      // Recuperar el usuario con su rol REAL
      const dbUser = await this.userService.getUser(cred.user.uid);
      console.log("Usuario en BD:", dbUser);

      // REDIRECCIÓN SEGÚN ROL
      if (dbUser?.role === 'admin') {
        this.router.navigate(['/admin']);
      }
      else if (dbUser?.role === 'programmer') {
        this.router.navigate(['/programmer']);
      }
      else {
        this.router.navigate(['/']);
      }
    })
    .catch(err => console.error("Error en login:", err));
}
}