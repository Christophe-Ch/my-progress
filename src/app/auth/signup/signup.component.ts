import { Component, inject } from '@angular/core';
import { SplitViewComponent } from '../../ui/split-view/split-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

function passwordMatchingValidator(other: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dontMatch = control.value !== other.value;
    return dontMatch ? { passwordsDontMatch: true } : null;
  };
}

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly auth = inject(Auth);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  public hidePassword = true;
  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      retypePassword: ['', [Validators.required]],
    });
    this.formGroup.controls['retypePassword'].addValidators(
      passwordMatchingValidator(this.formGroup.controls['password'])
    );
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.invalid) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.formGroup.value.email,
        this.formGroup.value.password
      );

      this.snackBar.open(`Welcome to MyProgress !`, '🤙', {
        duration: 5000,
      });
      this.router.navigateByUrl('/profile');
    } catch (error) {
      alert(error);
      this.snackBar.open('Sign-up failed.', '🤔', {
        duration: 5000,
      });
    }
  }
}
