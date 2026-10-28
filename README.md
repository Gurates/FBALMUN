fbalmun

## Song requests

The navigation's **Choose Your Song** button opens a song suggestion form.
To enable shared submissions:

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the local environment (and the hosting environment when deploying). Use a publishable/anon key, never a service-role key.
2. Run `setup_song_requests.sql` in that project's Supabase SQL Editor.
3. Restart Vite after changing environment variables. Requests appear in Supabase Table Editor under `public.song_requests`.

Guests can insert suggestions but cannot read, edit, or delete requests. The form reports success only after a successful database response; connection errors preserve the entered song for retrying.
