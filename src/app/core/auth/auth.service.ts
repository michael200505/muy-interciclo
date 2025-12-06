import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { UserService } from '../user/user.service';
import { AppUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private userService = inject(UserService);

  currentAppUser: AppUser | null = null;

  async loginWithGoogle(): Promise<AppUser> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    const firebaseUser = cred.user;

    const appUser = await this.userService.ensureUser({
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL
    });

    this.currentAppUser = appUser;
    return appUser;
  }

  async logout(): Promise<void> {
    this.currentAppUser = null;
    await signOut(this.auth);
  }

  getFirebaseUser(): User | null {
    return this.auth.currentUser;
  }
}
