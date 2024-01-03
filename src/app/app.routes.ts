import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './profile/profile/profile.component';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  canActivate,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('/auth/login');
const redirectToHome = () => redirectLoggedInTo('/');

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Log In',
    ...canActivate(redirectToHome),
  },
  {
    path: 'auth/signup',
    component: SignupComponent,
    title: 'Sign Up',
    ...canActivate(redirectToHome),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Your profile',
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
