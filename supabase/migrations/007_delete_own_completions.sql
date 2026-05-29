-- Members must not delete prep progress from the client.
-- Admin self-reset runs server-side with the service role after an admin check.

drop policy if exists "Users can delete own completions" on public.prep_completions;
