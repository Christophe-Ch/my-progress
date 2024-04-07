import { Timestamp } from 'firebase-admin/firestore';

export interface Statistics {
  profileId: string;
  exercises: ExerciseStatistics[];
}

export interface ExerciseStatistics {
  exercise: string;
  statistics: ExerciseSessionStatistics[];
}

export interface ExerciseSessionStatistics {
  sessionId: string;
  date: Timestamp;
  maxRepetitions: number;
  maxWeight: number;
  maxRepetitionsWeight: number;
}
