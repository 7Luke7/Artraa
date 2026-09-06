# Migrations

The schema lives here. Before this directory existed it lived only in the
end-to-end test repository, which meant the application could not stand up its
own database from nothing and any change had to be remembered in two places.

```bash
npm run migrate               # apply everything pending
npm run migrate -- status     # what is applied, what is pending, what has drifted
npm run migrate -- baseline   # record 0001 as applied without running it
```

`DATABASE_URL` selects the database, exactly as it does for the application.

## On an existing database

`0001_baseline.sql` is the schema as it stood when this directory was created,
so a database that already has it must be told the baseline is done rather than
be asked to create everything a second time:

```bash
npm run migrate -- baseline   # records 0001, runs nothing
npm run migrate               # applies 0002 onward
```

A new database needs neither step — `npm run migrate` runs 0001 like any other.

## Adding one

Create `NNNN_short_name.sql` with the next number. The runner applies files in
filename order, so numbers must not be reused.

Each file runs inside a transaction together with the row that records it.
Postgres transacts DDL, so a migration that fails leaves the schema untouched
and the ledger unchanged — there is no half-applied state to clean up.

**Never edit a migration that has been applied.** The runner stores a checksum
and `status` reports the file as `CHANGED`; the database and the repository
have diverged at that point and only a new migration can bring them back
together.

## Where it is applied

- **Locally and in production** — `npm run migrate`.
- **In the E2E stack** — automatically. `artra-e2e` stages this directory into
  its Postgres container and applies it on first start, so every test run
  exercises the same migrations a deployment would, and a migration that breaks
  fails the suite rather than a release.
