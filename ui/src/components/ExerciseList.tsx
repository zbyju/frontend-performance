import { useStore } from "@nanostores/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { userToken } from "../stores/token";
import {
  Exercise,
  ExerciseStatus,
  ExerciseWithStatus,
} from "../types/exercise.types";
import ExerciseCard from "./ExerciseCard";

interface Props {
  exercises: ExerciseWithStatus[] | undefined;
  title: string;
}
export default function ExerciseList({ exercises, title }: Props) {
  return (
    <div className="exercise-list">
      <h1>{title}</h1>
      {exercises === undefined ? (
        <p>Loading exercises</p>
      ) : exercises.length > 0 ? (
        exercises.map((e) => <ExerciseCard key={e.slug} exercise={e} />)
      ) : (
        <p>No exercises</p>
      )}
    </div>
  );
}
