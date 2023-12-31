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
  public hidePassword = true;
  public formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private readonly _auth: Auth,
    private readonly _snackBar: MatSnackBar,
    private readonly _router: Router
  ) {
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
        this._auth,
        this.formGroup.value.email,
        this.formGroup.value.password
      );

      this._snackBar.open(`Welcome back, ${result.user.displayName} !`, '🤙', {
        duration: 5000,
      });
      this._router.navigateByUrl('/');
    } catch {
      this._snackBar.open('Please check your credentials.', '🤔', {
        duration: 5000,
      });
    }
  }
}
