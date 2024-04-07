import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Auth, User, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from './profile/profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly auth = inject(Auth);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  public readonly profileService = inject(ProfileService);
  public user: Observable<User | null>;

  constructor() {
    this.user = user(this.auth);
  }

  logout(): void {
    signOut(this.auth);
    this.router.navigateByUrl('/auth/login');
    this.snackBar.open('See you later !', '👋', { duration: 5000 });
  }
}
