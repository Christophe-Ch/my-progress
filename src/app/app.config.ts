import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "my-progress-da34b", "appId": "1:563359593576:web:3412d228e749a9219bb7dd", "storageBucket": "my-progress-da34b.appspot.com", "locationId": "europe-west", "apiKey": "AIzaSyDZL_Jg4LQQCYhtcjbUsoJnAvGRLvgRZ3Q", "authDomain": "my-progress-da34b.firebaseapp.com", "messagingSenderId": "563359593576" }))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage())), provideAnimations()]
};
