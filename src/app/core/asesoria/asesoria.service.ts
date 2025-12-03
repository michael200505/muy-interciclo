import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Asesoria, AsesoriaStatus } from '../models/asesoria.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {

  constructor(private firestore: Firestore) {}

  private collectionRef() {
    return collection(this.firestore, 'asesorias');
  }

  async requestAsesoria(data: Asesoria): Promise<void> {
    data.createdAt = Date.now();
    data.status = 'pending';
    await addDoc(this.collectionRef(), data as any);
  }

  async getAsesoriasByProgrammer(programmerId: string): Promise<Asesoria[]> {
    const q = query(this.collectionRef(), where('programmerId', '==', programmerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Asesoria)
    }));
  }

  async updateAsesoriaStatus(
    id: string,
    status: AsesoriaStatus,
    responseMessage?: string
  ): Promise<void> {
    const ref = doc(this.firestore, 'asesorias', id);
    await updateDoc(ref, { status, responseMessage });
  }
}
