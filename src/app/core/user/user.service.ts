import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';

import { AppUser, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  private colRef() {
    return collection(this.firestore, 'users');
  }

  private docRef(uid: string) {
    return doc(this.firestore, 'users', uid);
  }

  // Crear/actualizar usuario base al loguearse
  async ensureUser(
    firebaseUser: { uid: string; displayName: string | null; email: string | null; photoURL: string | null },
    defaultRole: UserRole = 'user'
  ): Promise<AppUser> {
    const ref = this.docRef(firebaseUser.uid);
    const snap = await getDoc(ref);

    const now = Date.now();

    if (snap.exists()) {
      const data = snap.data() as AppUser;
      return {
        ...data,
        displayName: firebaseUser.displayName || data.displayName,
        email: firebaseUser.email || data.email,
        photoURL: firebaseUser.photoURL || data.photoURL
      };
    }

    const newUser: AppUser = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || 'Usuario sin nombre',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      role: defaultRole,
      createdAt: now
    };

    await setDoc(ref, newUser);
    return newUser;
  }

  async getUser(uid: string): Promise<AppUser | null> {
    const snap = await getDoc(this.docRef(uid));
    if (!snap.exists()) return null;
    return snap.data() as AppUser;
  }

  async getProgrammers(): Promise<AppUser[]> {
    const q = query(this.colRef(), where('role', '==', 'programmer'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AppUser);
  }

  async updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
    const ref = this.docRef(uid);
    await setDoc(ref, data, { merge: true });
  }

  async updateRole(uid: string, role: UserRole): Promise<void> {
    const ref = this.docRef(uid);
    await setDoc(ref, { role }, { merge: true });
  }
}
