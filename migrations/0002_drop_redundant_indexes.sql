-- 0002 - drop indexes that duplicate one already present.
--
-- Every index below is either the same columns as an existing UNIQUE
-- constraint - which Postgres already backs with an index - or a leading
-- prefix of a wider index, which Postgres can use on its own. None of them can
-- be the only index serving a query, so nothing here can turn a lookup into a
-- sequential scan.
--
-- What they do cost: every INSERT, UPDATE and DELETE on these tables maintains
-- them, and every one of them sits in the buffer cache competing with an index
-- that is actually used.

-- Duplicates of a UNIQUE constraint's own index.
DROP INDEX IF EXISTS public.idx_user_email;              -- "User_email_key" (email)
DROP INDEX IF EXISTS public.idx_course_slug;             -- course_slug_key (slug)
DROP INDEX IF EXISTS public.idx_category_slug;           -- course_category_slug_key (slug)
DROP INDEX IF EXISTS public.idx_instructor_user;         -- instructor_profile_user_id_key (user_id)
DROP INDEX IF EXISTS public.idx_instructor_public_slug;  -- instructor_profile_public_slug_key (public_slug)

-- (user_id, public_slug), where user_id is already UNIQUE: at most one row per
-- user, so the second column can never narrow anything.
DROP INDEX IF EXISTS public.idx_instructor_user_public;

-- Leading prefixes of a wider index.
DROP INDEX IF EXISTS public.idx_notifications_user_id;      -- of idx_notifications_fetch (user_id, created_at DESC, id DESC)
DROP INDEX IF EXISTS public.idx_notifications_user_created; -- of idx_notifications_fetch
DROP INDEX IF EXISTS public.idx_purchase_user;              -- of idx_purchase_user_created (user_id, purchased_at DESC)
DROP INDEX IF EXISTS public.idx_review_course;              -- of idx_review_course_created (course_id, created_at DESC)
DROP INDEX IF EXISTS public.idx_lesson_course;              -- of idx_lesson_course_section (course_id, section_id, lesson_order)
DROP INDEX IF EXISTS public.idx_user_devices_user_id;       -- of unq_user_id_fingerprint_user_devices (user_id, device_fingerprint)

-- Deliberately kept, though they look similar:
--   idx_enrollment_user_course (user_id, course_id) - the UNIQUE is
--     (course_id, user_id), so neither serves the other's leading column.
--   idx_notifications_user_seen (user_id, seen) - second column differs.
--   idx_lesson_section (section_id, lesson_order) - different leading column.
--   idx_course_slug_unique - partial, and smaller than the full unique for the
--     published-course lookup that is the hot path.
