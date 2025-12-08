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
import { Asesoria, AsesoriaStatus } from '../models/asesoria.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {

  constructor(private firestore: Firestore) {}

  private col() {
    return collection(this.firestore, 'asesorias');
  }

  async requestAsesoria(
    data: Omit<Asesoria, 'id' | 'status' | 'createdAt'>
  ): Promise<void> {
    const newData: Asesoria = {
      ...data,
      status: 'pending',
      createdAt: Date.now()
    };
    await addDoc(this.col(), newData);
  }

  async getAsesoriasByRequest(programmerId: string): Promise<Asesoria[]> {
    const q = query(this.col(), where('programmerId', '==', programmerId));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Asesoria)
    }));
  }

  async getAsesoriasByUser(userId: string): Promise<Asesoria[]> {
    const q = query(this.col(), where('userId', '==', userId));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Asesoria)
    }));
  }

  async updateStatus(
    id: string,
    status: AsesoriaStatus,
    response?: string
  ): Promise<void> {
    const ref = doc(this.firestore, 'asesorias', id);
    const data: Partial<Asesoria> = { status };
    if (response !== undefined) data.response = response;
    await setDoc(ref, data, { merge: true });
  }
}
