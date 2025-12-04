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
  constructor(private firestore: Firestore) {}

  /**
   * Guarda/actualiza el usuario en Firestore sin sobrescribir el rol existente.
   * - Si el usuario NO existe: role = 'user'
   * - Si el usuario YA existe: NO toca el role
   */
  async saveUser(user: any): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(ref);

    const baseData = {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? ''
    };

    if (snap.exists()) {
      // Ya existe: actualizar datos sin enviar "role"
      await setDoc(ref, baseData, { merge: true });
      return;
    }

    // No existe: crearlo con role por defecto
    await setDoc(ref, { ...baseData, role: 'user' }, { merge: true });
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
   * Actualiza el rol del usuario.
   */
  async setRole(uid: string, role: string): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    await setDoc(ref, { role }, { merge: true });
  }

  /**
   * Devuelve todos los usuarios registrados en Firestore.
   */
  async getAllUsers(): Promise<AppUser[]> {
    const colRef = collection(this.firestore, 'users');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data() as AppUser);
  }
}
