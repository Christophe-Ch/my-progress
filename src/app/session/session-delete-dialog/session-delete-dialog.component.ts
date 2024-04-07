import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-session-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './session-delete-dialog.component.html',
  styleUrl: './session-delete-dialog.component.scss',
})
export class SessionDeleteDialogComponent {}
