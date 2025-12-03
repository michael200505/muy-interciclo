import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  async saveUser(user: any): Promise<void> {
    console.log("Intentando guardar usuario en Firestore...");

    const ref = doc(this.firestore, 'users', user.uid);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user'
    };

    console.log("Datos enviados:", data);

    await setDoc(ref, data, { merge: true });

    console.log("Usuario guardado correctamente.");
  }

  async getUser(uid: string) {
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  async setRole(uid: string, role: string) {
    await setDoc(doc(this.firestore, 'users', uid), { role }, { merge: true });
  }
}
