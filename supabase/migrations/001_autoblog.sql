create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content jsonb not null default '{"sections": []}'::jsonb,
  category text not null default 'Estratégia',
  kind text not null default 'evergreen' check (kind in ('evergreen', 'platform-update')),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  keyword text,
  source_url text,
  source_collected_at timestamptz,
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_source_url_is_https check (source_url is null or source_url like 'https://%')
);

create table if not exists public.autoblog_signals (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  title text not null,
  url text not null unique,
  keyword text,
  published_at timestamptz,
  collected_at timestamptz not null default now(),
  score numeric not null default 0,
  raw_excerpt text,
  metadata jsonb not null default '{}'::jsonb,
  constraint autoblog_signals_url_is_https check (url like 'https://%')
);

create table if not exists public.autoblog_runs (
  id uuid primary key default gen_random_uuid(),
  run_date date not null unique,
  status text not null check (status in ('running', 'completed', 'failed')),
  source_count integer not null default 0,
  draft_count integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.autoblog_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  source text not null,
  score numeric not null default 0,
  observed_on date not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (keyword, source, observed_on)
);

create index if not exists blog_posts_public_order_idx
  on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_schedule_idx
  on public.blog_posts (status, scheduled_for);
create index if not exists autoblog_signals_collected_idx
  on public.autoblog_signals (collected_at desc);
create index if not exists autoblog_keywords_observed_idx
  on public.autoblog_keywords (observed_on desc, score desc);

alter table public.blog_posts enable row level security;
alter table public.autoblog_signals enable row level security;
alter table public.autoblog_runs enable row level security;
alter table public.autoblog_keywords enable row level security;

drop policy if exists "public can read published blog posts" on public.blog_posts;
create policy "public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );
