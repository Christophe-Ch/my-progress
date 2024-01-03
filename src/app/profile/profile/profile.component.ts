import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../data-management/profile/profile';
import { Auth, User, user, updateProfile } from '@angular/fire/auth';
import { filter, map, mergeMap, take, tap } from 'rxjs';
import { SplitViewComponent } from '../../ui/split-view/split-view.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SplitViewComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(Auth);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly formBuilder = inject(FormBuilder);
  private user: User | null = null;

  public profile?: Profile;
  public formGroup?: FormGroup;

  async ngOnInit(): Promise<void> {
    user(this.auth)
      .pipe(
        filter((user) => user !== null),
        tap((user) => {
          this.user = user;
        }),
        mergeMap(
          async (user) => await this.profileService.getProfile(user!.uid)
        ),
        filter((profile) => profile !== undefined),
        take(1)
      )
      .subscribe(async (profile) => {
        this.profile = profile;
        this.formGroup = this.formBuilder.group({
          firstName: [this.profile.firstName],
          lastName: [this.profile.lastName],
        });
      });
  }

  async onSubmit(): Promise<void> {
    if (
      !this.formGroup ||
      this.formGroup.invalid ||
      !this.profile ||
      !this.user
    )
      return;
    this.profile.firstName = this.formGroup.value.firstName;
    this.profile.lastName = this.formGroup.value.lastName;
    if (await this.profileService.saveProfile(this.profile)) {
      await updateProfile(this.user, {
        displayName: this.profile.firstName,
      });
      this.matSnackBar.open('Your profile has been saved !', '🥳');
    } else {
      this.matSnackBar.open(
        'An error has occurred, please try again later.',
        '❌'
      );
    }
  }
}
