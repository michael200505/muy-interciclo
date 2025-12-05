import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from '@angular/fire/firestore';
import { ProgrammerProfile } from '../models/programmer.model';

@Injectable({
  providedIn: 'root'
})
export class ProgrammerService {

  constructor(private firestore: Firestore) { }

  private colRef() {
    return collection(this.firestore, 'programmers');
  }

  /**
   * Crea o actualiza un programador (usa uid como id del documento).
   */
  async saveProgrammer(profile: ProgrammerProfile): Promise<void> {
    const ref = doc(this.firestore, 'programmers', profile.uid);
    await setDoc(ref, profile, { merge: true });
  }

  /**
   * Obtiene un programador por UID.
   */
  async getProgrammer(uid: string): Promise<ProgrammerProfile | null> {
    const ref = doc(this.firestore, 'programmers', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ProgrammerProfile) : null;
  }

  /**
   * Lista todos los programadores.
   */
  async getAllProgrammers(): Promise<ProgrammerProfile[]> {
    const snap = await getDocs(this.colRef());
    return snap.docs.map(d => d.data() as ProgrammerProfile);
  }

  /**
   * Actualiza parcialmente un programador.
   */
  async updateProgrammer(uid: string, data: Partial<ProgrammerProfile>): Promise<void> {
    const ref = doc(this.firestore, 'programmers', uid);
    await setDoc(ref, data, { merge: true });
  }

  /**
   * Elimina un programador.
   */
  async deleteProgrammer(uid: string): Promise<void> {
    const ref = doc(this.firestore, 'programmers', uid);
    await deleteDoc(ref);
  }
}
