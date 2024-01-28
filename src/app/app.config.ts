import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  connectStorageEmulator,
  getStorage,
  provideStorage,
} from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(
      provideAuth(() => {
        const auth = getAuth();
        if (isDevMode()) {
          connectAuthEmulator(auth, 'http://192.168.1.73:9099', {
            disableWarnings: true,
          });
        }
        return auth;
      })
    ),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, '192.168.1.73', 8080);
        return firestore;
      })
    ),
    importProvidersFrom(
      provideStorage(() => {
        const storage = getStorage();
        connectStorageEmulator(storage, '192.168.1.73', 5001);
        return storage;
      })
    ),
    provideAnimations(),
  ],
};
