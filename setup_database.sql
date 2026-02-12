-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  x_user_id text unique,
  encrypted_tokens text,
  role text check (role in ('creator', 'advertiser')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings table
create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.users(id) not null,
  price_per_day numeric not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rentals table
create table if not exists public.rentals (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) not null,
  advertiser_id uuid references public.users(id) not null,
  total_days integer not null,
  remaining_days integer not null,
  total_amount numeric not null,
  banner_url text,
  active boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  rental_id uuid references public.rentals(id) not null,
  tx_hash text unique not null,
  amount numeric not null,
  status text check (status in ('pending', 'confirmed', 'failed')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Verification Logs table
create table if not exists public.verification_logs (
  id uuid primary key default uuid_generate_v4(),
  rental_id uuid references public.rentals(id) not null,
  verified boolean not null,
  hash_distance integer,
  checked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.rentals enable row level security;
alter table public.payments enable row level security;
alter table public.verification_logs enable row level security;

-- Policies
drop policy if exists "Public read listings" on public.listings;
create policy "Public read listings" on public.listings for select using (true);

drop policy if exists "Service role full access users" on public.users;
create policy "Service role full access users" on public.users for all using (true);

drop policy if exists "Service role full access rentals" on public.rentals;
create policy "Service role full access rentals" on public.rentals for all using (true);

drop policy if exists "Service role full access payments" on public.payments;
create policy "Service role full access payments" on public.payments for all using (true);
