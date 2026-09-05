-- PropConnect Vendor Portal — run this once in Supabase Dashboard -> SQL Editor.
-- Creates the two tables the vendor portal reads/writes, plus row-level
-- security so each vendor can only ever touch their own store's rows while
-- everyone (including signed-out visitors) can read the catalog publicly.

create table if not exists vendor_stores (
  id text primary key,
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  location text,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  hours text,
  description text,
  delivery_areas text,
  lat double precision,
  lng double precision,
  logo text,
  photos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vendor_props (
  id text primary key,
  store_id text not null references vendor_stores(id) on delete cascade,
  name text not null,
  category text not null,
  sub_category text,
  keywords text,
  tags text,
  description text,
  material text,
  style text,
  era text,
  finish text,
  color text,
  condition text,
  h text,
  w text,
  d text,
  seat text,
  weight text,
  price numeric not null default 0,
  deposit numeric not null default 0,
  replacement_value numeric,
  min_days integer default 1,
  max_days integer default 30,
  qty integer not null default 1,
  available boolean not null default true,
  status text not null default 'available',
  img text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vendor_props_store_id_idx on vendor_props (store_id);

alter table vendor_stores enable row level security;
alter table vendor_props enable row level security;

drop policy if exists "public read vendor_stores" on vendor_stores;
create policy "public read vendor_stores" on vendor_stores
  for select using (true);

drop policy if exists "owner manage vendor_stores" on vendor_stores;
create policy "owner manage vendor_stores" on vendor_stores
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "public read vendor_props" on vendor_props;
create policy "public read vendor_props" on vendor_props
  for select using (true);

drop policy if exists "owner manage vendor_props" on vendor_props;
create policy "owner manage vendor_props" on vendor_props
  for all
  using (store_id in (select id from vendor_stores where owner_id = auth.uid()))
  with check (store_id in (select id from vendor_stores where owner_id = auth.uid()));
