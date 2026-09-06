-- 0004 - make "Luka@Gmail.com" and "luka@gmail.com" the same account.
--
-- User.email was UNIQUE over the raw string, and nothing in the application
-- folded case before writing or looking up. So the two addresses above were
-- two accounts: the duplicate check on registration missed, a second row was
-- created for the same person, and the next sign-in found whichever row
-- matched the case they happened to type. Google made it worse - it always
-- returns the address lower-cased, so it could never match a mixed-case row
-- and created yet another account.
--
-- The application side is fixed in FormDataValidator.normalizeEmail. This is
-- the half that makes it impossible to reintroduce.

-- Fold the existing rows. Two rows that differ only in case cannot both
-- survive, and merging user accounts is not a decision a migration gets to
-- make on its own - so stop and name them instead of picking one.
DO $$
DECLARE dupes text;
BEGIN
    SELECT string_agg(folded, ', ') INTO dupes
    FROM (
        SELECT lower(btrim(email)) AS folded
        FROM public."User"
        GROUP BY 1
        HAVING count(*) > 1
    ) d;

    IF dupes IS NOT NULL THEN
        RAISE EXCEPTION
            'These addresses exist more than once once case is folded: %. '
            'Merge or remove the duplicate accounts by hand, then re-run.', dupes;
    END IF;
END $$;

UPDATE public."User"
SET email = lower(btrim(email))
WHERE email <> lower(btrim(email));

-- The functional index is strictly stronger than the plain one it replaces:
-- with every stored address already folded the two accept the same rows, but
-- only this one keeps rejecting a differently-cased duplicate.
ALTER TABLE public."User" DROP CONSTRAINT IF EXISTS "User_email_key";
CREATE UNIQUE INDEX IF NOT EXISTS user_email_lower_key
    ON public."User" (lower(email));
