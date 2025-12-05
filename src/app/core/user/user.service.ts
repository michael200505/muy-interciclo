import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from '@angular/fire/firestore';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  /**
   * Guarda el usuario en Firestore sin sobrescribir el rol existente.
   */
  async saveUser(user: any): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);

    // ¿Ya existe en Firestore?
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data() as AppUser) : null;

    // Si ya tenía rol, lo respetamos; si no, 'user'
    const role: UserRole = existing?.role ?? 'user';

    const data: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role
    };

    await setDoc(ref, data, { merge: true });
  }

  /**
   * Obtiene un usuario por UID.
   */
  async getUser(uid: string): Promise<AppUser | null> {
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as AppUser) : null;
  }

  /**
   * Cambia el rol del usuario.
   */
  async setRole(uid: string, role: UserRole): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    await setDoc(ref, { role }, { merge: true });
  }

  /**
   * Lista todos los usuarios.
   */
  async getAllUsers(): Promise<AppUser[]> {
    const colRef = collection(this.firestore, 'users');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data() as AppUser);
  }
}
