export interface Exercise {
  exercise: string;
  sets: Set[];
}

export interface Set {
  repetitions: number;
  weight: number;
}
