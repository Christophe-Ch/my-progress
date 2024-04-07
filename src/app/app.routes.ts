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

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('/login');
const redirectToHome = () => redirectLoggedInTo('');

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard',
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In',
    ...canActivate(redirectToHome),
  },
  {
    path: 'signup',
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
