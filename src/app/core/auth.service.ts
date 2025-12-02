import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private injector = inject(Injector);

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    // ✔ Ejecutar Firebase dentro del contexto Angular
    return runInInjectionContext(this.injector, () => {
      return signInWithPopup(this.auth, provider);
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
