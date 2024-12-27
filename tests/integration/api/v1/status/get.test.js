import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServives();
  await database.query("drop schema public cascade; create schema public;");
});

const endpoint = "http://localhost:3000";

test("GET to api/v1/migrations should return 200", async () => {
  const response = await fetch(`${endpoint}/api/v1/migrations`);
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
