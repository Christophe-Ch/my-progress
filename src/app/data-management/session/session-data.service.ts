import { Injectable } from '@angular/core';
import { Session } from './session';
import { BaseDataService } from '../base-data.service';

@Injectable({
  providedIn: 'root',
})
export class SessionDataService extends BaseDataService<Session> {}
