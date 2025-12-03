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

  login() {
    console.log("Iniciando login...");

    this.authService.loginWithGoogle()
      .then(async cred => {
        console.log("Login OK:", cred.user);

        try {
          await this.userService.saveUser(cred.user);
          console.log("Usuario guardado correctamente ✔");
        } catch (err) {
          console.error("Error al guardar usuario:", err);
        }

        this.router.navigate(['/']);
      })
      .catch(err => console.error("Error en login:", err));
  }
}
