import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  // ✔ Guarda o actualiza un usuario
  async saveUser(user: any): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);

    const data: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user'
    };

    await setDoc(ref, data, { merge: true });
  }

  // ✔ Obtiene usuario desde Firestore
  async getUser(uid: string): Promise<AppUser | null> {
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as AppUser) : null;
  }

  // ✔ Actualiza el rol del usuario
  async setRole(uid: string, role: string): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    await setDoc(ref, { role }, { merge: true });
  }
}
