import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const expectedMethods = ["GET", "POST"];

  if (!expectedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` })
      .end();
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOprions = {
      dbClient: dbClient,
      dir: join("infra", "migrations"),
      direction: "up",
      dryRun: request.method === "GET",
      migrationsTable: "pgmigrations",
      verbose: true,
    };

    const migrations = await migrationRunner({ ...defaultMigrationsOprions });

    return migrations.length === 0
      ? response.status(201).json(migrations)
      : response.status(200).json(migrations);
  } catch (e) {
    throw e;
  } finally {
    await dbClient.end();
  }
}
