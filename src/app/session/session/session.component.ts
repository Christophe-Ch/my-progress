import { Component, inject, OnInit } from '@angular/core';
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
import { ProfileService } from '../../profile/profile.service';
import { Exercise, Session, Set } from '../../data-management/session/session';
import { SessionService } from '../session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SessionDeleteDialogComponent } from '../session-delete-dialog/session-delete-dialog.component';

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
    MatProgressSpinnerModule,
    MatMenuModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
})
export class SessionComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private sessionService = inject(SessionService);
  private matSnackBar = inject(MatSnackBar);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  public session?: Session;
  public formGroup?: FormGroup;
  public exercisesFormArray?: FormArray;

  public filteredOptions!: Observable<string[]>;

  public async ngOnInit(): Promise<void> {
    if (this.activatedRoute.snapshot.paramMap.has('sessionId')) {
      try {
        this.session = await this.sessionService.getSession(
          this.activatedRoute.snapshot.paramMap.get('sessionId')!
        );
        this.createSessionFromModel(this.session);
      } catch {
        this.router.navigateByUrl('/new-session');
      }
    } else {
      this.createSession();
    }
  }

  public get exercises(): FormGroup[] {
    return this.exercisesFormArray!.controls as FormGroup[];
  }

  public addExercise(): void {
    this.exercisesFormArray!.push(this.createExercise());
  }

  public removeExercise(index: number): void {
    this.exercisesFormArray!.removeAt(index);
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

  public sets(exercise: FormGroup): FormGroup[] {
    const sets = exercise.controls['sets'] as FormArray;
    return sets.controls as FormGroup[];
  }

  public onSubmit(): void {
    if (!this.profileService.currentProfile || this.formGroup!.invalid) {
      return;
    }

    try {
      if (this.session !== undefined) {
        this.saveSession();
      } else {
        this.saveNewSession();
      }
    } catch {
      this.matSnackBar.open(
        'An error has occurred, please try again later.',
        '❌'
      );
    }
  }

  public deleteSession(): void {
    this.dialog
      .open(SessionDeleteDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result && this.session !== undefined) {
          this.sessionService.deleteSession(this.session);
          this.matSnackBar.open('Session deleted !', '🔥');
          this.router.navigateByUrl('/sessions');
        }
      });
  }

  public onExerciseInputFocus(exerciseFormGroup: FormGroup): void {
    this.filteredOptions = exerciseFormGroup.controls[
      'exercise'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (this.profileService.currentProfile === null) {
          return [];
        }

        return this.profileService.currentProfile.exercises.filter((exercise) =>
          exercise.toLowerCase().includes(value?.toLowerCase() ?? '')
        );
      })
    );
  }

  private async saveSession(): Promise<void> {
    this.session!.title = this.formGroup!.value.title;
    this.session!.date = this.formGroup!.value.date;
    this.session!.exercises = this.formGroup!.value.exercises;
    if (await this.sessionService.saveSession(this.session!)) {
      this.matSnackBar.open('Session saved !', '💪');
    } else {
      this.matSnackBar.open(
        'An error has occurred, please try again later.',
        '❌'
      );
    }
  }

  private async saveNewSession(): Promise<void> {
    const sessionId = await this.sessionService.createSession({
      ...this.formGroup!.value,
      profileId: this.profileService.currentProfile!.uid,
    });
    this.matSnackBar.open('Session created !', '💪');
    this.router.navigateByUrl(`sessions/${sessionId}`);
  }

  private createSession(): void {
    this.exercisesFormArray = this.formBuilder.array([]);

    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      date: [Date.now(), Validators.required],
      exercises: this.exercisesFormArray,
    });
  }

  private createSessionFromModel(session: Session): void {
    this.exercisesFormArray = this.formBuilder.array(
      session.exercises.map((session) => this.createExerciseFromModel(session))
    );

    this.formGroup = this.formBuilder.group({
      title: [session.title, Validators.required],
      date: [session.date, Validators.required],
      exercises: this.exercisesFormArray,
    });
  }

  private createExercise(): FormGroup {
    return this.formBuilder.group({
      exercise: ['', Validators.required],
      sets: this.formBuilder.array([this.createSet()]),
    });
  }

  private createExerciseFromModel(exercise: Exercise): FormGroup {
    return this.formBuilder.group({
      exercise: [exercise.exercise, Validators.required],
      sets: this.formBuilder.array([
        ...exercise.sets.map((set) => this.createSetFromModel(set)),
      ]),
    });
  }

  private createSet(toCopy?: FormGroup): FormGroup {
    return this.formBuilder.group({
      repetitions: [toCopy?.value.repetitions ?? 0, Validators.required],
      weight: [toCopy?.value.weight ?? 0, Validators.required],
    });
  }

  private createSetFromModel(set: Set): FormGroup {
    return this.formBuilder.group({
      repetitions: [set.repetitions, Validators.required],
      weight: [set.weight, Validators.required],
    });
  }
}
