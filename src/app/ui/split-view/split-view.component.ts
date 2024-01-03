import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-split-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './split-view.component.html',
  styleUrl: './split-view.component.scss',
})
export class SplitViewComponent {
  public route = inject(ActivatedRoute);
}
