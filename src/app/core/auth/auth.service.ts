import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  provider = new GoogleAuthProvider();

  constructor(private auth: Auth) {
    this.provider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  //  Fuerza a Firebase a mostrar siempre la selección de cuenta
  async loginWithGoogle() {
    await signOut(this.auth); // Muy importante
    return await signInWithPopup(this.auth, this.provider);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
