import { useStore } from "@nanostores/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { userToken } from "../stores/token";
import {
  Exercise,
  ExerciseStatus,
  ExerciseWithStatus,
} from "../types/exercise.types";
import ExerciseList from "./ExerciseList";

interface Props {
  exercises: Exercise[];
}
export default function ExerciseLists({ exercises }: Props) {
  const $token = useStore(userToken);
  const [exercisesWithStatus, setExercisesWithStatus] = useState<
    ExerciseWithStatus[] | undefined
  >(undefined);

  useEffect(() => {
    const fetch = async () => {
      const result = await Promise.all(
        exercises.map(async (e) => {
          const res = await axios.get(
            "http://localhost:4000/api/solution/slug/" + e.slug,
            {
              headers: {
                Authorization: $token,
              },
            }
          );
          const solutions = res.data.solutions;
          const status =
            solutions === undefined
              ? ExerciseStatus.Loading
              : solutions.length <= 0
              ? ExerciseStatus.Untouched
              : solutions.some((s) => s.result === "PASSED")
              ? ExerciseStatus.Completed
              : solutions.some((s) => s.result === "FAILED")
              ? ExerciseStatus.Touched
              : solutions.some((s) => s.result === "PENDING")
              ? ExerciseStatus.Pending
              : ExerciseStatus.Untouched;
          return { ...e, status };
        })
      );
      setExercisesWithStatus(result);
    };
    fetch();
  }, []);

  const threeExercises =
    exercisesWithStatus !== undefined
      ? exercisesWithStatus
          .filter(
            (e) =>
              e.status === ExerciseStatus.Pending ||
              e.status === ExerciseStatus.Touched ||
              e.status === ExerciseStatus.Loading ||
              e.status === ExerciseStatus.Untouched
          )
          .slice(0, 3)
      : undefined;
  const completedExercises =
    exercisesWithStatus !== undefined
      ? exercisesWithStatus.filter((e) => e.status === ExerciseStatus.Completed)
      : undefined;

  return (
    <div className="exercise-list">
      <ExerciseList title="Todo" exercises={threeExercises} />
      <ExerciseList title="Completed" exercises={completedExercises} />
      <ExerciseList title="All" exercises={exercisesWithStatus} />
    </div>
  );
}
