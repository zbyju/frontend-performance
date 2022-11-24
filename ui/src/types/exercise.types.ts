export interface Exercise {
  title: string;
  desc: string;
  slug: string;
  url: string;
}

export interface ExerciseWithStatus extends Exercise {
  status?: ExerciseStatus;
}

export enum ExerciseStatus {
  Completed = "Completed",
  Untouched = "Untouched",
  Touched = "Touched",
  Pending = "Pending",
  Loading = "Loading",
}
