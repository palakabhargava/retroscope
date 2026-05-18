
-- Enum + roles
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  avatar_seed text not null default 'reel-wanderer',
  bio text default '',
  favorite_genres text[] not null default '{}',
  plan text not null default 'free-reel',
  trial_started_at timestamptz not null default now(),
  dna_type text default 'Midnight Thriller Fan',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

-- Watchlist
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, movie_id)
);

-- Watch history (vintage tickets)
create table public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id text not null,
  watched_at timestamptz not null default now(),
  progress_pct int not null default 0
);

-- Complaints
create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  body text not null,
  status text not null default 'open',
  admin_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.watchlist enable row level security;
alter table public.watch_history enable row level security;
alter table public.complaints enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Own profile readable" on public.profiles for select using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));
create policy "Own profile updatable" on public.profiles for update using (auth.uid() = id);
create policy "Own profile insertable" on public.profiles for insert with check (auth.uid() = id);

-- user_roles policies (read-only to user; admins manage)
create policy "Own roles readable" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins read all roles" on public.user_roles for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Watchlist policies
create policy "Own watchlist read" on public.watchlist for select using (auth.uid() = user_id);
create policy "Own watchlist write" on public.watchlist for insert with check (auth.uid() = user_id);
create policy "Own watchlist delete" on public.watchlist for delete using (auth.uid() = user_id);

-- Watch history policies
create policy "Own history read" on public.watch_history for select using (auth.uid() = user_id);
create policy "Own history insert" on public.watch_history for insert with check (auth.uid() = user_id);
create policy "Own history delete" on public.watch_history for delete using (auth.uid() = user_id);

-- Complaints policies
create policy "Own complaints read" on public.complaints for select using (auth.uid() = user_id);
create policy "Admins read all complaints" on public.complaints for select using (public.has_role(auth.uid(), 'admin'));
create policy "Own complaints insert" on public.complaints for insert with check (auth.uid() = user_id);
create policy "Admins update complaints" on public.complaints for update using (public.has_role(auth.uid(), 'admin'));

-- Notifications policies
create policy "Own notifications read" on public.notifications for select using (auth.uid() = user_id);
create policy "Own notifications update" on public.notifications for update using (auth.uid() = user_id);
create policy "Admins broadcast notifications" on public.notifications for insert with check (public.has_role(auth.uid(), 'admin') or auth.uid() = user_id);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$ begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger complaints_touch before update on public.complaints for each row execute function public.touch_updated_at();

-- Signup trigger -> create profile + user role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
