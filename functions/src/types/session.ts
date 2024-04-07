import { Timestamp } from 'firebase-admin/firestore';
import { Exercise } from './exercise';

export interface Session {
  profileId: string;
  title: string;
  date: Timestamp;
  exercises: Exercise[];
}
