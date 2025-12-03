import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  /**
   * Inicia sesión con Google usando Firebase Auth
   */
  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Cierra la sesión
   */
  logout(): Promise<void> {
    return this.auth.signOut();
  }
}
