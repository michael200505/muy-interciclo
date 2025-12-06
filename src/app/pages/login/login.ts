import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

import { UserService } from '../../core/user/user.service';

import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private userService = inject(UserService);

  async login() {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(this.auth, provider);

      // Registrar / actualizar usuario en Firestore
      const dbUser = await this.userService.ensureUser({
        uid: cred.user.uid,
        displayName: cred.user.displayName,
        email: cred.user.email,
        photoURL: cred.user.photoURL,
      });

      console.log('Login OK:', dbUser);

      // 🔥 Redirección según rol
      if (dbUser.role === 'admin') {
        return this.router.navigate(['/admin']);
      }

      if (dbUser.role === 'programmer') {
        return this.router.navigate(['/programmer']);
      }

      // Usuario normal
      return this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error login:', error);
      return null; // ⚠ esto resuelve TS7030
    }

    // ⚠ return final requerido para evitar TS7030
    return null;
  }
}
