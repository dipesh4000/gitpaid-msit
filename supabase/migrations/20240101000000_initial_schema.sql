
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  x_user_id text unique,
  encrypted_tokens text, -- AES-256-GCM encrypted OAuth tokens
  role text check (role in ('creator', 'advertiser')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings table
create table public.listings (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.users(id) not null,
  price_per_day numeric not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rentals table
create table public.rentals (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) not null,
  advertiser_id uuid references public.users(id) not null,
  total_days integer not null,
  remaining_days integer not null,
  total_amount numeric not null,
  active boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments table
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  rental_id uuid references public.rentals(id) not null,
  tx_hash text unique not null,
  amount numeric not null,
  status text check (status in ('pending', 'confirmed', 'failed')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Verification Logs table
create table public.verification_logs (
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

-- Basic policies (adjust as needed for frontend access, but we are mainly backend driven here)
-- For now, we'll allow service role full access and public read access where appropriate
create policy "Public read listings" on public.listings for select using (true);
