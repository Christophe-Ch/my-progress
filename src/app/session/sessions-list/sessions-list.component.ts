import { Component, OnInit, inject } from '@angular/core';
import { SplitViewComponent } from '../../ui/split-view/split-view.component';
import { SessionService } from '../session.service';
import { Session } from '../../data-management/session/session';
import { ProfileService } from '../../profile/profile.service';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sessions-list',
  standalone: true,
  imports: [SplitViewComponent, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './sessions-list.component.html',
  styleUrl: './sessions-list.component.scss',
})
export class SessionsListComponent implements OnInit {
  private sessionService = inject(SessionService);
  private profileService = inject(ProfileService);

  public sessions: Session[] = [];

  public async ngOnInit(): Promise<void> {
    this.profileService.profile$
      .pipe(filter((profile) => profile !== null))
      .subscribe(async (profile) => {
        this.sessions = await this.sessionService.getSessionsForProfile(
          profile!.uid
        );
      });
  }
}
