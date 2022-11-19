import { useStore } from "@nanostores/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { userToken } from "../stores/token";
import { Exercise } from "../types/exercise.types";
import { ApiSolution } from "../types/solution.types";

interface Props {
  exercise: Exercise;
}
export default function ExerciseCard({ exercise }: Props) {
  const [solutions, setSolutions] = useState<ApiSolution[] | undefined>(
    undefined
  );
  const $token = useStore(userToken);
  const status =
    solutions === undefined
      ? ["Loading solutions...", "loading"]
      : solutions.length <= 0
      ? ["Untouched", "untouched"]
      : solutions.some((s) => s.result === "PASSED")
      ? ["Completed", "completed"]
      : solutions.some((s) => s.result === "FAILED")
      ? ["Touched", "touched"]
      : solutions.some((s) => s.result === "PENDING")
      ? ["Pending", "pending"]
      : ["Untouched", "untouched"];

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/solution/slug/" + exercise.slug, {
        headers: {
          Authorization: $token,
        },
      })
      .then((res) => {
        setSolutions(res.data.solutions);
      });
  }, []);
  return (
    <li className="link-card">
      <a href={exercise.url}>
        <h2>
          {exercise.title}
          <span>&rarr;</span>
        </h2>
        <p className={status[1]}>{status[0]}</p>
      </a>
    </li>
  );
}
