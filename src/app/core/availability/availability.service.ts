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
  deleteDoc,
  getDoc,
} from '@angular/fire/firestore';

export type SlotStatus = 'available' | 'booked' | 'disabled';

export interface AvailabilitySlot {
  id?: string;
  programmerId: string;
  date: string;      // YYYY-MM-DD
  hour: string;      // HH:mm
  status: SlotStatus;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  constructor(private firestore: Firestore) {}

  private col() {
    return collection(this.firestore, 'availability');
  }

  async addSlot(programmerId: string, date: string, hour: string): Promise<void> {
    await addDoc(this.col(), {
      programmerId,
      date,
      hour,
      status: 'available',
      createdAt: Date.now(),
    } as AvailabilitySlot);
  }

  async getSlots(programmerId: string, date?: string): Promise<AvailabilitySlot[]> {
    const base = [where('programmerId', '==', programmerId)];
    const q = date
      ? query(this.col(), ...base, where('date', '==', date))
      : query(this.col(), ...base);

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as AvailabilitySlot) }));
  }

  async markBooked(slotId: string): Promise<void> {
    const ref = doc(this.firestore, 'availability', slotId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    await setDoc(ref, { status: 'booked' }, { merge: true });
  }

  async deleteSlot(slotId: string): Promise<void> {
    const ref = doc(this.firestore, 'availability', slotId);
    await deleteDoc(ref);
  }
}
