import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/user/user.service';
import { PageContainerComponent } from "../../ui/container/container";

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

  login() {
    this.authService.loginWithGoogle()
      .then(async (cred) => {
        console.log("Usuario autenticado:", cred.user);
        await this.userService.saveUser(cred.user);
      })
      .catch((err) => console.error("Error en login:", err));
  }
}
