import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const expectedMethods = ["GET", "POST"];
  const dbClient = await database.getNewClient();

  if (!expectedMethods.includes(request.method)) {
    return response.status(405).end();
  }

  const defaultMigrationsOprions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    dryRun: request.method === "GET",
    migrationsTable: "pgmigrations",
    verbose: true,
  };

  const migrations = await migrationRunner({ ...defaultMigrationsOprions });

  await dbClient.end();

  return migrations.length === 0
    ? response.status(201).json(migrations)
    : response.status(200).json(migrations);
}
