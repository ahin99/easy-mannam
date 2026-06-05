create extension if not exists "pgcrypto";

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  expected_count integer not null check (expected_count > 0 and expected_count <= 100),
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  constraint meetings_valid_date_range check (start_date <= end_date)
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meeting_id, name)
);

create table if not exists public.availabilities (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  available_date date not null,
  unique (participant_id, available_date)
);

create index if not exists meetings_code_idx on public.meetings(code);
create index if not exists participants_meeting_id_idx on public.participants(meeting_id);
create index if not exists availabilities_participant_id_idx on public.availabilities(participant_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists participants_set_updated_at on public.participants;

create trigger participants_set_updated_at
before update on public.participants
for each row
execute function public.set_updated_at();

alter table public.meetings enable row level security;
alter table public.participants enable row level security;
alter table public.availabilities enable row level security;
