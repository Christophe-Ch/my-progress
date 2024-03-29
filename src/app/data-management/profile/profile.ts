import { BaseModel } from '../base-model';

export interface Profile extends BaseModel {
  firstName: string;
  lastName: string;
  exercises: string[];
  uid: string;
}
