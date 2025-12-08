import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Project } from '../models/project.model';
import { getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private firestore: Firestore) {}

  private col() {
    return collection(this.firestore, 'projects');
  }

  // ✔ Método que usa el FORM: createProject()
  async createProject(project: Project): Promise<void> {
    project.createdAt = Date.now();
    await addDoc(this.col(), project);
  }

  // (tu método original, ya no es necesario pero lo dejo por compatibilidad)
  async addProject(project: Project): Promise<void> {
    return this.createProject(project);
  }

 async getProjectsByUser(uid: string): Promise<Project[]> {
  const q = query(this.col(), where('uid', '==', uid));
  const snap = await getDocs(q);

  return snap.docs.map(d => {
    const data = d.data() as Project;
    return {
      ...data,
      id: d.id,         // ✅ al final
    };
  });
}


  async updateProject(id: string, data: Partial<Project>): Promise<void> {
    const ref = doc(this.firestore, 'projects', id);
    await setDoc(ref, data, { merge: true });
  }

  async deleteProject(id: string): Promise<void> {
    const ref = doc(this.firestore, 'projects', id);
    await deleteDoc(ref);
  }
 async getProjectById(id: string): Promise<Project | null> {
  const ref = doc(this.firestore, 'projects', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data() as Project;
  return { ...data, id: snap.id }; // ✅ id al final
}

}
