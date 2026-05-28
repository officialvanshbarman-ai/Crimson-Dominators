create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  id text primary key default 'main',
  website_title text not null default 'Crimson Dominators',
  website_subtitle text not null default 'United by loyalty. Driven by ambition. Built to dominate.',
  about_text text not null default 'Crimson Dominators is a school brotherhood built on respect, unity, discipline, friendship, and ambition.',
  mission_text text not null default 'We stand for loyalty, respect, personal growth, helping people, and no drama, only unity.',
  members_count integer not null default 42 check (members_count >= 0),
  people_helped_count integer not null default 120 check (people_helped_count >= 0),
  events_done_count integer not null default 8 check (events_done_count >= 0),
  active_supporters_count integer not null default 25 check (active_supporters_count >= 0),
  updated_at timestamptz not null default now(),
  constraint one_site_settings_row check (id = 'main')
);

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  alt_text text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.join_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_sort_order_idx
on public.gallery_images (sort_order);

create index if not exists join_submissions_created_at_idx
on public.join_submissions (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.gallery_images enable row level security;
alter table public.join_submissions enable row level security;

-- The Next.js server uses SUPABASE_SERVICE_ROLE_KEY for reads and writes.
-- Do not add anonymous policies unless you intentionally want direct public access.
