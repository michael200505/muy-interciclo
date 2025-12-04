import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
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

  async getUser(uid: string): Promise<AppUser | null> {
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as AppUser) : null;
  }

  async setRole(uid: string, role: string): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    await setDoc(ref, { role }, { merge: true });
  }

  async getAllUsers(): Promise<AppUser[]> {
    const colRef = collection(this.firestore, 'users');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data() as AppUser);
  }
}
