import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private provider = new GoogleAuthProvider();

  /**
   * Login con Google dentro del contexto AngularFire
   */
  async loginWithGoogle() {
    console.log("✨ Iniciando login con Google...");

    const result = await signInWithPopup(this.auth, this.provider);

    console.log("✅ Login correcto!", result);

    return result;
  }

  /**
   * Observa al usuario autenticado en tiempo real
   */
  get currentUser$() {
    return user(this.auth);
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    await signOut(this.auth);
  }
}
