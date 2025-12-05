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
import { Asesoria } from '../models/asesoria.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoriasService {

  constructor(private firestore: Firestore) {}

  private col() {
    return collection(this.firestore, 'asesorias');
  }

  async create(asesoria: Asesoria) {
    await addDoc(this.col(), asesoria);
  }

  async getByProgrammer(uid: string): Promise<Asesoria[]> {
    const q = query(this.col(), where('programmerId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() as Asesoria }));
  }

  async update(id: string, data: Partial<Asesoria>) {
    const ref = doc(this.firestore, 'asesorias', id);
    await setDoc(ref, data, { merge: true });
  }
}
