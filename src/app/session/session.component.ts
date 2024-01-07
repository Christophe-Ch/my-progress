import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileService } from '../profile/profile.service';
import { Session } from '../data-management/session/session';
import { SessionService } from './session.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
})
export class SessionComponent {
  private formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private sessionService = inject(SessionService);
  private matSnackBar = inject(MatSnackBar);

  public formGroup: FormGroup;
  public exercisesFormArray: FormArray;

  constructor() {
    this.exercisesFormArray = this.formBuilder.array([]);

    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      date: [Date.now(), Validators.required],
      exercises: this.exercisesFormArray,
    });
  }

  public addExercise(): void {
    this.exercisesFormArray.push(
      this.formBuilder.group({
        exercise: ['', Validators.required],
        sets: this.formBuilder.array([this.createSet()]),
      })
    );
  }

  public removeExercise(index: number): void {
    this.exercisesFormArray.removeAt(index);
  }

  public addSet(exercise: FormGroup, index: number): void {
    const sets = exercise.controls['sets'] as FormArray;
    sets.insert(index + 1, this.createSet());
  }

  public duplicateSet(exercise: FormGroup, index: number) {
    const sets = exercise.controls['sets'] as FormArray;
    sets.insert(index + 1, this.createSet(sets.controls[index] as FormGroup));
  }

  public removeSet(exercise: FormGroup, index: number) {
    const sets = exercise.controls['sets'] as FormArray;
    sets.removeAt(index);
    if (sets.length == 0) {
      this.addSet(exercise, 0);
    }
  }

  public get exercises(): FormGroup[] {
    return this.exercisesFormArray.controls as FormGroup[];
  }

  public sets(exercise: FormGroup): FormGroup[] {
    const sets = exercise.controls['sets'] as FormArray;
    return sets.controls as FormGroup[];
  }

  public async onSubmit(): Promise<void> {
    if (!this.profileService.currentProfile || this.formGroup.invalid) {
      return;
    }

    try {
      await this.sessionService.createSession({
        ...this.formGroup.value,
        profileId: this.profileService.currentProfile.uid,
      } as Session);
      this.matSnackBar.open('Session created !', '💪');
    } catch {
      this.matSnackBar.open(
        'An error has occurred, please try again later.',
        '❌'
      );
    }
  }

  private createSet(toCopy?: FormGroup): FormGroup {
    return this.formBuilder.group({
      repetitions: [toCopy?.value.repetitions ?? 0, Validators.required],
      weight: [toCopy?.value.weight ?? 0, Validators.required],
    });
  }
}
