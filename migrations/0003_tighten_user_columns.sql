-- 0003 - give "User" the constraints its code already assumes.
--
-- email_verified, role and created_at were all nullable. Nothing writes NULL
-- to them today, which is exactly what makes it worth closing: a nullable
-- boolean read as `if (user.email_verified)` treats NULL as "not verified" and
-- a nullable role read as `role === 'admin'` treats NULL as "not admin", so the
-- day a NULL does appear it fails quietly and in the safe-looking direction.
--
-- created_at also moves to timestamptz, which every other table in this schema
-- already uses. `timestamp without time zone` stores whatever wall clock the
-- server happened to be on, so the same row means different instants depending
-- on where it was written.

-- Nothing should match; here so the migration is safe on a database that has
-- drifted, rather than failing halfway through the ALTERs below.
UPDATE public."User" SET email_verified = false WHERE email_verified IS NULL;
UPDATE public."User" SET role = 'student' WHERE role IS NULL;
UPDATE public."User" SET created_at = now() WHERE created_at IS NULL;

ALTER TABLE public."User"
    ALTER COLUMN email_verified SET DEFAULT false,
    ALTER COLUMN email_verified SET NOT NULL,
    ALTER COLUMN role SET DEFAULT 'student',
    ALTER COLUMN role SET NOT NULL;

-- The existing values were written by now() on a UTC server (the application
-- has only ever run in UTC containers), so they are read back as UTC. If this
-- is ever applied to a database that ran on local time, change the zone here
-- before running it - afterwards the information needed to correct it is gone.
ALTER TABLE public."User"
    ALTER COLUMN created_at TYPE timestamp with time zone
        USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN created_at SET NOT NULL;
