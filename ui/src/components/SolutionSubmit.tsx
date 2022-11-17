import axios from "axios";
import { useState } from "react";
import { Exercise } from "../types/exercise.types";
import { SolutionPostResult } from "../types/solution.types";
import UserTokenDisplay from "./UserToken";

interface Props {
  exercise: Exercise;
}

export default function SolutionSubmit({ exercise }: Props) {
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState<SolutionPostResult>({ kind: "ready" });
  const [token, setToken] = useState<string>("");
  const handleSubmit = async () => {
    setResult({ kind: "loading" });
    try {
      const response = await axios.post(
        "http://localhost:4000/api/solution",
        {
          slug: exercise.slug,
          solution,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
    } catch (err) {
      setResult({ kind: "error", error: err });
      setSolution("");
    }
  };

  function getResultEl(result: SolutionPostResult) {
    switch (result.kind) {
      case "passed":
        return <div className="submit-result passed">Passed</div>;
      case "failed":
        return <div className="submit-result failed">Failed</div>;
      case "error":
        return <div className="submit-result error">Error</div>;
      case "loading":
        return <div className="submit-result loading">Loading</div>;
      case "ready":
        return <div className="submit-result ready">Ready</div>;
    }
  }

  const resultEl = getResultEl(result);
  return (
    <div className="submit-wrapper">
      <UserTokenDisplay onReceive={(token) => setToken(token)} />
      <textarea
        className="submit-textarea"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
      />
      <div className="submit-footer">
        <button className="submit-button" onClick={handleSubmit}>
          Submit solution
        </button>
        {resultEl}
      </div>
    </div>
  );
}
