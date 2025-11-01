// ...existing code...
import pg from "pg";
const { Pool: PgPool } = pg;
import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const DATABASE_URL = process.env.DATABASE_URL;
const parsed = new URL(DATABASE_URL);

// choose local pg for hosts like localhost / 127.0.0.1, use Neon for others
const isLocalHost = ["localhost", "127.0.0.1"].includes(parsed.hostname);

export let pool: any;
export let db: any;

if (isLocalHost) {
  // Local Postgres (pg)
  pool = new PgPool({ connectionString: DATABASE_URL });
  db = drizzleNodePg(pool);
} else {
  // Neon (serverless) — keep WebSocket constructor set
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
}