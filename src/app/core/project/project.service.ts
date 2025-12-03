import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private firestore: Firestore) {}

  private collectionRef() {
    return collection(this.firestore, 'projects');
  }

  async addProject(project: Project): Promise<void> {
    project.createdAt = Date.now();
    await addDoc(this.collectionRef(), project as any);
  }

  async getProjectsByProgrammer(programmerId: string): Promise<Project[]> {
    const q = query(this.collectionRef(), where('programmerId', '==', programmerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Project)
    }));
  }

  async deleteProject(id: string): Promise<void> {
    const ref = doc(this.firestore, 'projects', id);
    await deleteDoc(ref);
  }
}
