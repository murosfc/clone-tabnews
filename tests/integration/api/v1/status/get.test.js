const endpoint = "http://localhost:3000";

test("GET to api/v1/status should return 200", async () => {
  const response = await fetch(`${endpoint}/api/v1/status`);
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parseUpdatedAt).toEqual(responseBody.updated_at);

  const postgresVersion = responseBody.dependencies.database.version;
  expect(postgresVersion).toEqual("16.0");

  const postgresMaxConnections =
    responseBody.dependencies.database.max_connections;
  expect(postgresMaxConnections).toEqual(100);

  const databaseOpenedConnections =
    responseBody.dependencies.database.opened_connections;
  expect(databaseOpenedConnections).toBeGreaterThanOrEqual(1);
});
