import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  login() {
    this.authService.loginWithGoogle()
      .then((user: any) => {
        console.log("Usuario autenticado:", user);
      })
      .catch((err: any) => {
        console.error("Error:", err);
      });
  }
}
