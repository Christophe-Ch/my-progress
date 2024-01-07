import { Injectable, inject } from '@angular/core';
import { SessionDataService } from '../data-management/session/session-data.service';
import { Session } from '../data-management/session/session';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionDataService = inject(SessionDataService);

  public async createSession(session: Session): Promise<Session> {
    await this.sessionDataService.addDoc('/sessions', session);
    return session;
  }
}
