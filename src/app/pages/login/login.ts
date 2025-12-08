import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';

import { UserService } from '../../core/user/user.service';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  animations: [
    trigger('pageIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('520ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('cardIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px) scale(.985)' }),
        animate('560ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private userService = inject(UserService);

  loading = false;
  errorMsg = '';

  async login() {
    if (this.loading) return;

    this.loading = true;
    this.errorMsg = '';

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
    } catch (error: any) {
      console.error('Error login:', error);

      // Mensaje amigable
      const code = error?.code || '';
      if (code.includes('auth/popup-closed-by-user')) {
        this.errorMsg = 'Cerraste el popup antes de terminar el login.';
      } else if (code.includes('auth/cancelled-popup-request')) {
        this.errorMsg = 'Solicitud cancelada. Intenta de nuevo.';
      } else {
        this.errorMsg = 'No se pudo iniciar sesión. Intenta nuevamente.';
      }

      return null; // ⚠ esto resuelve TS7030
    } finally {
      this.loading = false;
    }
  }
}
