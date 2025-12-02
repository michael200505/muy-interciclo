import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    //  Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    //  Proveedor de Auth (Google, etc)
    provideAuth(() => getAuth())
  ]
};
