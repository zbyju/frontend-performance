import http from "k6/http";

export function setup() {}

export default function () {
  http.get("http://host.docker.internal:3000/");
}

export function teardown() {}
