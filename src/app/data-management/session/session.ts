import { BaseModel } from "../base-model";

export interface Session extends BaseModel {
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
