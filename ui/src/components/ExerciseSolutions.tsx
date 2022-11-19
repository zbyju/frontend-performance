import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { resetSolutions } from "../stores/solutionStore";
import { userToken } from "../stores/token";
import { Exercise } from "../types/exercise.types";
import SolutionList from "./SolutionList";
import SolutionSubmit from "./SolutionSubmit";

interface Props {
  exercise: Exercise;
}

export default function ExerciseSolutions({ exercise }: Props) {
  useEffect(() => {
    resetSolutions();
  }, []);
  return (
    <>
      <SolutionSubmit exercise={exercise} />
      <SolutionList slug={exercise.slug} />
    </>
  );
}
