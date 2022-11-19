import { useStore } from "@nanostores/react";
import axios from "axios";
import { useState } from "react";
import { addSolution } from "../stores/solutionStore";
import { userToken } from "../stores/token";
import { Exercise } from "../types/exercise.types";
import { SolutionPostResult } from "../types/solution.types";
import UserTokenDisplay from "./UserToken";

interface Props {
  exercise: Exercise;
}

export default function SolutionSubmit({ exercise }: Props) {
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState<SolutionPostResult>({ kind: "ready" });
  const $token = useStore(userToken);
  const handleSubmit = async () => {
    setResult({ kind: "loading" });
    try {
      const res = await axios.post(
        "http://localhost:4000/api/solution",
        {
          slug: exercise.slug,
          solution,
        },
        {
          headers: {
            Authorization: $token,
          },
        }
      );
      console.log(res);
      addSolution(res.data);
    } catch (err) {
      setResult({ kind: "error", error: err });
      setSolution("");
    }
  };

  return (
    <div className="submit-wrapper">
      <h3>Submit solution</h3>
      <UserTokenDisplay />
      <textarea
        className="submit-textarea"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
      />
      <div className="submit-footer">
        <button className="submit-button" onClick={handleSubmit}>
          Submit solution
        </button>
      </div>
    </div>
  );
}
