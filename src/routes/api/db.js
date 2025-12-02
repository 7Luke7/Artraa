"use server"

import {Pool} from "pg"
// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     require: true,
//   },
// });

export const pool = new Pool({
  user: 'artra',
  host: '127.0.0.1',
  database: 'courses',
  password: 'artra',
  port: 5432,
  max: 20,                    // Maximum number of clients in pool (default: 10)
  idleTimeoutMillis: 30000,   // How long a client can sit idle (default: 10000 = 10s)
  connectionTimeoutMillis: 5000, // How long to wait for connection (default: 0 = no timeout)
  allowExitOnIdle: true       // Allow process exit when pool is idle
})

pool.on('connect', (client) => {
  console.log('Client connected, total:', pool.totalCount)
})

pool.on('remove', (client) => {
  console.log('Client removed, total:', pool.totalCount)
})

pool.on('error', (err) => {
  console.error('Database connection error:', err)
})