-- Pre-generated reading audio (MP3) for each week — uploaded via npm run generate:audio

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reading-audio',
  'reading-audio',
  false,
  10485760,
  array['audio/mpeg', 'audio/mp3']
)
on conflict (id) do nothing;

create policy "Authenticated users can read reading audio"
on storage.objects for select
to authenticated
using (bucket_id = 'reading-audio');
