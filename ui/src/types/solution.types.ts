export type SolutionPostResult = Passed | Failed | Error | Loading | Ready;
export type Passed = {
  kind: "passed";
};
export type Failed = {
  kind: "failed";
};
export type Error = {
  kind: "error";
  error: any;
};
export type Loading = {
  kind: "loading";
};
export type Ready = {
  kind: "ready";
};

export interface ApiSolution {
  id: number;
  slug: string;
  token: string;
  result: string;
  solution: string;
  created_at: string;
}
