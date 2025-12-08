import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
  writeBatch
} from '@angular/fire/firestore';

export type NotificationTargetRole = 'user' | 'programmer' | 'admin';

export interface AppNotification {
  id?: string;

  toUid: string;
  roleTarget: NotificationTargetRole;

  title: string;
  message: string;

  read: boolean;
  createdAt: number;

  asesoriaId?: string;
  programmerId?: string;
  userId?: string;
  date?: string;
  hour?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private firestore: Firestore) {}

  private col() {
    return collection(this.firestore, 'notifications');
  }

  async send(n: Omit<AppNotification, 'id'>): Promise<void> {
    await addDoc(this.col(), n);
  }

  async getByUser(toUid: string): Promise<AppNotification[]> {
    const q = query(
      this.col(),
      where('toUid', '==', toUid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as AppNotification) }));
  }

  async countUnread(toUid: string): Promise<number> {
    const q = query(
      this.col(),
      where('toUid', '==', toUid),
      where('read', '==', false)
    );
    const snap = await getDocs(q);
    return snap.size;
  }

  async markRead(id: string): Promise<void> {
    const ref = doc(this.firestore, 'notifications', id);
    await setDoc(ref, { read: true }, { merge: true });
  }

  async markAllRead(toUid: string): Promise<void> {
    const q = query(
      this.col(),
      where('toUid', '==', toUid),
      where('read', '==', false)
    );
    const snap = await getDocs(q);

    const batch = writeBatch(this.firestore);
    snap.docs.forEach(d => {
      batch.set(
        doc(this.firestore, 'notifications', d.id),
        { read: true },
        { merge: true }
      );
    });

    await batch.commit();
  }
}
