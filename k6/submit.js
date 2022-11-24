import http from "k6/http";

const USER_REUSE_CHANCE = 0.4;

// This chance gets mitigated by the number of exercises
// The more exercises the less likely it is that the same combination of slug + solution gets picked
const SOLUTION_REUSE_CHANCE = 0.5;

const slugs = [
  "average-of-positives",
  "budget-check",
  "mystery-function",
  "sum-of-negative-numbers",
  "sum-of-three-values",
  "sum-with-formula",
  "team",
  "video-and-playlist",
];
const users = ["user1"];
const solutions = ["solution1"];

function randomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomString(minLen, maxLen) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const length = Math.floor(Math.random() * (maxLen - minLen)) + minLen;
  let string = "";
  for (let i = 0; i < length; ++i) {
    string += randomValue(chars);
  }
  return string;
}

export function setup() {}

function generateSolution() {
  const r = Math.random();
  if (r < SOLUTION_REUSE_CHANCE) {
    return randomValue(solutions);
  }
  const solution = generateRandomString(4, 100);
  if (solutions.length < 10000) {
    solutions.push(solution);
  }
  return solution;
}

function generateUserId() {
  const r = Math.random();
  if (r < USER_REUSE_CHANCE) {
    return randomValue(users);
  }
  const userId = generateRandomString(10, 20);
  if (users.length < 1000) {
    users.push(userId);
  }
  return userId;
}

export default function () {
  const payload = JSON.stringify({
    slug: randomValue(slugs),
    solution: generateSolution(),
  });
  const userId = generateUserId();
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: userId,
    },
  };
  http.post("http://host.docker.internal:4000/api/solution", payload, params);
}

export function teardown() {}
