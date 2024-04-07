import { Injectable, inject } from '@angular/core';
import { SessionDataService } from '../data-management/session/session-data.service';
import { Session } from '../data-management/session/session';
import { Timestamp, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private dataService = inject(SessionDataService);

  public async createSession(session: Session): Promise<string> {
    const sessionId = await this.dataService.addDoc('/sessions', session);
    return sessionId;
  }

  public async saveSession(session: Session): Promise<boolean> {
    try {
      await this.dataService.setDoc(session);
      return true;
    } catch {
      return false;
    }
  }

  public async getSession(sessionId: string): Promise<Session> {
    const session = await this.dataService.getDoc(`/sessions/${sessionId}`);
    session.date = (session.date as unknown as Timestamp).toDate();
    return session;
  }

  public async getSessionsForProfile(profileId: string): Promise<Session[]> {
    const sessions = await this.dataService.queryDocs(
      '/sessions',
      false,
      where('profileId', '==', profileId)
    );
    sessions.forEach(
      (session) =>
        (session.date = (session.date as unknown as Timestamp).toDate())
    );
    return sessions;
  }

  public async deleteSession(session: Session): Promise<void> {
    await this.dataService.deleteDoc(session);
  }
}
