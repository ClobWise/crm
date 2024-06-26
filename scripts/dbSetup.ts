import { pathToFileURL } from 'node:url';

import postgres from 'postgres';

import { initialize } from '@webf/auth/context';

import { parseEnv, run } from '../src/migrate.js';
import { initDbRepo } from '../src/db/client.js';


export function makePGClient(useDb: boolean) {
  // Parse environment variables
  const dbEnv = parseEnv();

  // Connect to database
  const sql = postgres({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    username: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: useDb ? dbEnv.DB_NAME : undefined,
  });

  return { sql, dbEnv };
}

export async function setupCleanDb() {
  // Parse environment variables and connect to database
  const { dbEnv, sql } = makePGClient(false);

  // Create a new database
  await sql`CREATE DATABASE ${sql(dbEnv.DB_NAME)}`;

  // Run migrations
  await run();

  // Disconnect from database
  await sql.end();

  // Connect to the new database
  const pgClient = makePGClient(true).sql;

  const db = initDbRepo({ pgClient });

  // Initialize the system with first API Key.
  const response = await initialize(db);

  if (response) {
    console.log('Generated API Key', response.apiKey);
  } else {
    console.warn('Failed to generate API Key', response);
  }

  // Disconnect from database
  await pgClient.end();
}

export async function teardownDb() {
  // Parse environment variables and connect to database
  const { dbEnv, sql } = makePGClient(false);

  // Drop database
  await sql`DROP DATABASE ${sql(dbEnv.DB_NAME)}`;

  // Disconnect from database
  await sql.end();
}


// Run this file directly when invoked from the command line.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === '--teardown') {
    teardownDb();
  } else {
    setupCleanDb();
  }
}
