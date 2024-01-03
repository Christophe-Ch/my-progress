import { Injectable } from '@angular/core';
import { BaseDataService } from '../base-data.service';
import { Profile } from './profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileDataService extends BaseDataService<Profile> {}
