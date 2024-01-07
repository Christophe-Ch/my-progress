export interface Session {
  title: string;
  date: Date;
  exercises: Exercise[];
  profileId: string;
}

export interface Exercise {
  exercise: string;
  sets: Set[];
}

export interface Set {
  repetitions: number;
  weight: number;
}
