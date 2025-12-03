import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  async saveUser(user: any): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);

    const userData: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user' // usuario externo por defecto
    };

    await setDoc(ref, userData, { merge: true });
  }

  async setRole(uid: string, role: UserRole): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    await setDoc(ref, { role }, { merge: true });
  }

  async getUser(uid: string): Promise<AppUser | null> {
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as AppUser) : null;
  }
}
