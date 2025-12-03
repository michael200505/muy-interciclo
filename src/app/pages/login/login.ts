import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/user/user.service';
import { Router } from '@angular/router';

// 👇 ESTE ES EL IMPORT CORRECTO
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],

  // 👇 AQUI se debe agregar PageContainerComponent
  imports: [
    PageContainerComponent
  ]
})
export class LoginComponent {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  login() {
    this.authService.loginWithGoogle()
      .then(async cred => {
        await this.userService.saveUser(cred.user);
        this.router.navigate(['/']);
      })
      .catch(err => console.error(err));
  }
}
