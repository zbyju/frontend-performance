import { ApiSolution } from "../types/solution.types";
import moment from "moment";

interface Props {
  solution: ApiSolution;
}

export default function Solution({ solution }: Props) {
  const date = moment(solution.created_at).format("DD.MM.YYYY");
  const time = moment(solution.created_at).format("HH:mm:ss");
  return (
    <div className={"solution " + solution.result}>
      <textarea readOnly defaultValue={solution.solution}></textarea>
      <div className="solution-side">
        <div className="solution-result">{solution.result}</div>
        <div className="solution-timestamp">
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </div>
    </div>
  );
}
