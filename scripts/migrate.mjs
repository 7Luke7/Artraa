#!/usr/bin/env node
/**
 * The migration runner.
 *
 * Deliberately small and dependency-free: it uses `pg`, which the application
 * already depends on, so standing a database up needs nothing installed that
 * running the application does not already need.
 *
 *   npm run migrate            apply everything pending
 *   npm run migrate -- status  list applied and pending, and flag drift
 *   npm run migrate -- baseline
 *                              record 0001 as applied without running it, for
 *                              a database that already has the schema
 *
 * Every migration runs inside a transaction together with the row that records
 * it, so a failure leaves neither a half-applied schema nor a lie about what
 * has been applied. Postgres transacts DDL, which is what makes that possible.
 */
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations")

const LEDGER = `
  CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version     text PRIMARY KEY,
    name        text NOT NULL,
    checksum    text NOT NULL,
    applied_at  timestamptz NOT NULL DEFAULT now()
  )
`

const fail = (message) => {
    console.error(`\n  ${message}\n`)
    process.exit(1)
}

/** Files named <version>_<name>.sql, in version order. */
async function migrations() {
    let entries
    try {
        entries = await readdir(DIR)
    } catch {
        fail(`No migrations directory at ${DIR}`)
    }

    const found = entries.filter((f) => f.endsWith(".sql")).sort()

    return Promise.all(found.map(async (file) => {
        const sql = await readFile(join(DIR, file), "utf8")
        const [version, ...rest] = file.replace(/\.sql$/, "").split("_")
        return {
            file,
            version,
            name: rest.join("_") || version,
            sql,
            checksum: createHash("sha256").update(sql).digest("hex").slice(0, 16)
        }
    }))
}

async function applied(client) {
    await client.query(LEDGER)
    const { rows } = await client.query(
        "SELECT version, name, checksum, applied_at FROM public.schema_migrations")
    return new Map(rows.map((r) => [r.version, r]))
}

async function status(client, all) {
    const done = await applied(client)

    for (const m of all) {
        const record = done.get(m.version)
        if (!record) {
            console.log(`  pending  ${m.file}`)
        } else if (record.checksum !== m.checksum) {
            // The file changed after it was applied, so the database and the
            // repository no longer describe the same schema. Reported rather
            // than corrected: the fix is a new migration, never an edit.
            console.log(`  CHANGED  ${m.file}  <- edited since it was applied`)
        } else {
            console.log(`  applied  ${m.file}  ${record.applied_at.toISOString().slice(0, 19)}Z`)
        }
    }

    const orphans = [...done.keys()].filter((v) => !all.some((m) => m.version === v))
    for (const version of orphans) {
        console.log(`  MISSING  ${version}  <- applied, but no file for it`)
    }
}

async function up(client, all) {
    const done = await applied(client)
    const pending = all.filter((m) => !done.has(m.version))

    if (!pending.length) {
        console.log("  Nothing to apply.")
        return
    }

    for (const m of pending) {
        process.stdout.write(`  applying ${m.file} ... `)
        try {
            await client.query("BEGIN")
            await client.query(m.sql)
            await client.query(
                `INSERT INTO public.schema_migrations (version, name, checksum)
                 VALUES ($1, $2, $3)`,
                [m.version, m.name, m.checksum])
            await client.query("COMMIT")
            console.log("ok")
        } catch (error) {
            await client.query("ROLLBACK")
            console.log("failed")
            fail(`${m.file} was rolled back and nothing was recorded:\n  ${error.message}`)
        }
    }
}

/**
 * Marks the baseline as applied without running it.
 *
 * For a database that already carries the schema this directory starts from -
 * running 0001 there would fail on the first CREATE TABLE and tell you nothing
 * you did not know.
 */
async function baseline(client, all) {
    const done = await applied(client)
    const first = all[0]

    if (!first) fail("No migrations to baseline from.")
    if (done.has(first.version)) {
        console.log(`  ${first.file} is already recorded as applied.`)
        return
    }

    await client.query(
        `INSERT INTO public.schema_migrations (version, name, checksum)
         VALUES ($1, $2, $3)`,
        [first.version, first.name, first.checksum])
    console.log(`  Recorded ${first.file} as applied without running it.`)
}

const COMMANDS = { up, status, baseline }

async function main() {
    const command = process.argv[2] || "up"
    const run = COMMANDS[command]
    if (!run) fail(`Unknown command '${command}'. Use one of: ${Object.keys(COMMANDS).join(", ")}`)

    if (!process.env.DATABASE_URL) {
        fail("DATABASE_URL is not set.\n" +
             "  e.g. DATABASE_URL=postgres://artra:<password>@127.0.0.1:5432/artra")
    }

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()
    try {
        await run(client, await migrations())
    } finally {
        await client.end()
    }
}

main().catch((error) => fail(error.stack || error.message))
