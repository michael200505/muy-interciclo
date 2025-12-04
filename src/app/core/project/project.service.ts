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

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private firestore: Firestore) {}

  private projectsCol() {
    return collection(this.firestore, 'projects');
  }

  async createProject(project: Project) {
    project.createdAt = Date.now();
    await addDoc(this.projectsCol(), project);
  }

  async getProjectsByUser(uid: string): Promise<Project[]> {
    const q = query(this.projectsCol(), where('uid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() as Project }));
  }

  async updateProject(id: string, data: Partial<Project>) {
    const ref = doc(this.firestore, 'projects', id);
    await setDoc(ref, data, { merge: true });
  }

  async deleteProject(id: string) {
    const ref = doc(this.firestore, 'projects', id);
    await deleteDoc(ref);
  }
}
