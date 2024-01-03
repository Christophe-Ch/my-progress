import { Component, inject } from '@angular/core';
import { SplitViewComponent } from '../../ui/split-view/split-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(Auth);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  public hidePassword = true;
  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.invalid) {
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        this.formGroup.value.email,
        this.formGroup.value.password
      );

      this.snackBar.open(`Welcome back !`, '🤙', {
        duration: 5000,
      });
      this.router.navigateByUrl('/');
    } catch {
      this.snackBar.open('Please check your credentials.', '🤔', {
        duration: 5000,
      });
    }
  }
}
