import axios from "axios";
import { atom } from "nanostores";
import { ApiSolution } from "../types/solution.types";

export const solutions = atom<ApiSolution[] | undefined>(undefined);

export function addSolution(solution: ApiSolution) {
  solutions.set([solution, ...solutions.get()]);
}

export function resetSolutions() {
  solutions.set(undefined);
}

export async function fetchSolutions(slug: string, userToken: string) {
  const res = await axios.get(
    "http://localhost:4000/api/solution/slug/" + slug,
    {
      headers: {
        Authorization: userToken,
      },
    }
  );
  solutions.set(res.data.solutions);
}
