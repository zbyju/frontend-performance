import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { fetchSolutions, solutions } from "../stores/solutionStore";
import { userToken } from "../stores/token";
import Solution from "./Solution";

export default function SolutionList({ slug }) {
  const $solutions = useStore(solutions);
  const $userToken = useStore(userToken);
  useEffect(() => {
    let interval;
    if ($solutions === undefined && $userToken) {
      fetchSolutions(slug, $userToken);
    } else if ($solutions !== undefined) {
      interval = setInterval(() => {
        if ($solutions.findIndex((s) => s.result === "PENDING") !== -1) {
          fetchSolutions(slug, $userToken);
        } else {
          clearInterval(interval);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [$solutions, $userToken]);

  if ($solutions === undefined) {
    return (
      <div className="solution-list">
        <p>Loading solutions...</p>
      </div>
    );
  }

  if ($solutions.length === 0) {
    return (
      <div className="solution-list">
        <p>No solutions found.</p>
      </div>
    );
  }

  return (
    <div className="solution-list">
      {$solutions.map((s) => (
        <Solution key={s.id} solution={s} />
      ))}
    </div>
  );
}
