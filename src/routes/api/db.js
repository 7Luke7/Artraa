'use server'
/**
 * Postgres connection pool.
 *
 * Configured entirely from DATABASE_URL so the same build runs against a
 * developer's local database, the containerised E2E stack and production
 * without a code change - and so no credential is ever committed.
 *
 *   DATABASE_URL=postgres://user:password@host:5432/database
 */
import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env, e.g. " +
    "DATABASE_URL=postgres://artra:<password>@127.0.0.1:5432/courses"
  )
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                        // maximum clients in the pool
  idleTimeoutMillis: 30000,       // how long a client may sit idle
  connectionTimeoutMillis: 5000,  // how long to wait for a connection
  allowExitOnIdle: true           // let the process exit when the pool is idle
})

pool.on('error', (err) => {
  console.error('Database connection error:', err)
})
