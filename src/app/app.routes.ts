import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  canActivate,
} from '@angular/fire/auth-guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionComponent } from './session/session/session.component';
import { SessionsListComponent } from './session/sessions-list/sessions-list.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('/auth/login');
const redirectToHome = () => redirectLoggedInTo('/dashboard');

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent, // TODO edit with HomeComponent
    ...canActivate(redirectToHome),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    ...canActivate(redirectUnauthorizedToLogin),
  },
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
  {
    path: 'new-session',
    component: SessionComponent,
    title: 'Session',
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'sessions',
    component: SessionsListComponent,
    title: 'My sessions',
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'sessions/:sessionId',
    component: SessionComponent,
    title: 'Session',
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
