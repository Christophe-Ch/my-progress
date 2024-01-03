import { Injectable, inject } from '@angular/core';
import { ProfileDataService } from '../data-management/profile/profile-data.service';
import { Profile } from '../data-management/profile/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly dataService = inject(ProfileDataService);

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
}
