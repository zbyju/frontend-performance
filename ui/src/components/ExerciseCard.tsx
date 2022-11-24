import { useStore } from "@nanostores/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { userToken } from "../stores/token";
import {
  Exercise,
  ExerciseStatus,
  ExerciseWithStatus,
} from "../types/exercise.types";
import { ApiSolution } from "../types/solution.types";
import ExerciseList from "./ExerciseList";

interface Props {
  exercise: ExerciseWithStatus | undefined;
}
export default function ExerciseCard({ exercise }: Props) {
  function statusToText(status: ExerciseStatus | undefined): string {
    switch (status) {
      case undefined:
      case ExerciseStatus.Loading:
        return "Loading";
      case ExerciseStatus.Untouched:
        return "Untouched";
      case ExerciseStatus.Touched:
        return "Touched";
      case ExerciseStatus.Pending:
        return "Pending";
      case ExerciseStatus.Completed:
        return "Completed";
    }
  }
  return (
    <li className="link-card">
      <a href={exercise.url}>
        <h2>
          {exercise.title}
          <span>&rarr;</span>
        </h2>
        <p className={exercise.status.toLowerCase()}>
          {statusToText(exercise.status)}
        </p>
      </a>
    </li>
  );
}
