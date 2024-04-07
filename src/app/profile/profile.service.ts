import { Injectable, inject } from '@angular/core';
import { ProfileDataService } from '../data-management/profile/profile-data.service';
import { Profile } from '../data-management/profile/profile';
import { BehaviorSubject, filter, mergeMap, take, timer } from 'rxjs';
import { Auth, User, user } from '@angular/fire/auth';
import { onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly dataService = inject(ProfileDataService);
  private _profile$ = new BehaviorSubject<Profile | null>(null);

  public currentProfile: Profile | null = null;
  public profile$ = this._profile$.asObservable();

  constructor(auth: Auth) {
    this.initCurrentProfileWatch();
    user(auth).subscribe((user) => {
      if (user === null) {
        this.currentProfile = null;
        this._profile$.next(null);
      } else {
        this.fetchCurrentProfile(user);
      }
    });
  }

  public async getProfile(userId: string): Promise<Profile> {
    return await this.dataService.getSingleDoc(`/users/${userId}/profile`);
  }

  public async saveProfile(profile: Profile): Promise<boolean> {
    try {
      this.dataService.setDoc(profile);
      return true;
    } catch {
      return false;
    }
  }

  private fetchCurrentProfile(user: User) {
    timer(0, 1000)
      .pipe(
        mergeMap(async () => await this.getProfile(user.uid)),
        filter((profile) => profile !== undefined),
        take(1)
      )
      .subscribe((profile) => {
        this.currentProfile = profile;
        this._profile$.next(profile);
      });
  }

  private initCurrentProfileWatch(): void {
    this._profile$.subscribe((profile) => {
      if (profile === null) {
        return;
      }

      const profileDoc = this.dataService.getDocRef(profile);
      if (profileDoc === undefined) {
        return;
      }

      onSnapshot(profileDoc, (snapshot) => {
        const snapshotData = snapshot.data();
        if (snapshotData === undefined || this.currentProfile === null) {
          return;
        }

        this.currentProfile.firstName = snapshotData['firstName'];
        this.currentProfile.lastName = snapshotData['lastName'];
        this.currentProfile.exercises = snapshotData['exercises'];
      });
    });
  }
}
