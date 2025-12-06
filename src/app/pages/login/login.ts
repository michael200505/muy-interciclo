import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { UserService } from '../../core/user/user.service';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, PageContainerComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  private auth = inject(Auth);
  private router = inject(Router);
  private userService = inject(UserService);

  async login() {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(this.auth, provider);

      // Registro / actualización de usuario
      const dbUser = await this.userService.ensureUser({
        uid: cred.user.uid,
        displayName: cred.user.displayName,
        email: cred.user.email,
        photoURL: cred.user.photoURL
      });

      console.log('Login OK:', dbUser);

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error login:', error);
    }
  }
}
