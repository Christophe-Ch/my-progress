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
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';

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
          connectAuthEmulator(auth, 'http://localhost:9099', {
            disableWarnings: true,
          });
        }
        return auth;
      })
    ),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        return firestore;
      })
    ),
    importProvidersFrom(
      provideStorage(() => {
        const storage = getStorage();
        connectStorageEmulator(storage, 'localhost', 5001);
        return storage;
      })
    ),
    provideAnimations(),
  ],
};
