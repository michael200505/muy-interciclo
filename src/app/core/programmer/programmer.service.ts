import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { ProgrammerProfile } from '../models/programmer.model';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProgrammerService {

  constructor(private firestore: Firestore) { }

  private colRef() {
    return collection(this.firestore, 'programmers');
  }

  async saveProgrammer(profile: ProgrammerProfile): Promise<void> {
    // Usamos uid como id de documento para facilitar
    const ref = doc(this.firestore, 'programmers', profile.uid);
    await setDoc(ref, profile, { merge: true });
  }

  async getProgrammer(uid: string): Promise<ProgrammerProfile | null> {
    const ref = doc(this.firestore, 'programmers', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ProgrammerProfile) : null;
  }

  async getAllProgrammers(): Promise<ProgrammerProfile[]> {
    const snap = await getDocs(this.colRef());
    return snap.docs.map(d => d.data() as ProgrammerProfile);
  }
}
