import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from '@angular/fire/firestore';
import { ProgrammerProfile } from '../models/programmer.model';

@Injectable({
  providedIn: 'root'
})
export class ProgrammerService {

  constructor(private firestore: Firestore) {}

  private collectionRef() {
    return collection(this.firestore, 'programmers');
  }

  async saveProgrammer(profile: ProgrammerProfile): Promise<void> {
    const ref = doc(this.firestore, 'programmers', profile.uid);
    await setDoc(ref, profile, { merge: true });
  }

  async getProgrammer(uid: string): Promise<ProgrammerProfile | null> {
    const ref = doc(this.firestore, 'programmers', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ProgrammerProfile) : null;
  }

  async getAllProgrammers(): Promise<ProgrammerProfile[]> {
    const snap = await getDocs(this.collectionRef());
    return snap.docs.map(d => d.data() as ProgrammerProfile);
  }
}
