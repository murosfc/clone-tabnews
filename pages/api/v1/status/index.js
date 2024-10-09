import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersionResult = await database.query("SHOW server_version;");
  const postgresVersion = postgresVersionResult.rows[0].server_version;

  const postgresMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const postgresMaxConnection =
    postgresMaxConnectionsResult.rows[0].max_connections;

  const dataBaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dataBaseName],
  });
  const databaseOpenedConnections =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: parseInt(postgresMaxConnection),
        opened_connections: databaseOpenedConnections,
      },
    },
  });
}

export default status;
