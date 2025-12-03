import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyDEORrK4WjtCI0kXx3dhwPBnRgjWTwF-qY",
      authDomain: "muy-interciclo.firebaseapp.com",
      projectId: "muy-interciclo",
      storageBucket: "muy-interciclo.appspot.com",
      messagingSenderId: "927146434970",
      appId: "1:927146434970:web:2c266b19ceca46a8779a23",
      measurementId: "G-JF4E2Y735R"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
