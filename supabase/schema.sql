-- Rose Group — Espace Client
-- Schéma Supabase : tables + Row Level Security
-- Chaque client authentifié (via magic link) ne voit que ses propres données.

create extension if not exists "uuid-ossp";

-- 1. Clients : un enregistrement par entreprise cliente, lié à un utilisateur auth
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

-- 2. Interventions : historique des passages sur site
create table if not exists interventions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  site_name text not null,
  service_type text not null,
  status text not null default 'planifiee'
    check (status in ('planifiee', 'en_cours', 'terminee', 'annulee')),
  scheduled_at timestamptz not null,
  completed_at timestamptz,
  agent_name text,
  notes text,
  created_at timestamptz not null default now()
);

-- 3. Demandes : réclamations, devis, interventions supplémentaires
create table if not exists demandes (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  type text not null default 'autre'
    check (type in ('intervention_supplementaire', 'reclamation', 'devis', 'autre')),
  subject text not null,
  message text not null,
  status text not null default 'nouvelle'
    check (status in ('nouvelle', 'en_traitement', 'resolue', 'refusee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Notifications
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  title text not null,
  body text not null,
  read boolean not null default false,
  link_to text,
  created_at timestamptz not null default now()
);

-- Row Level Security : chaque client ne voit/modifie que ses propres lignes
alter table clients enable row level security;
alter table interventions enable row level security;
alter table demandes enable row level security;
alter table notifications enable row level security;

create policy "Clients : lecture de son propre profil"
  on clients for select
  using (auth.uid() = user_id);

create policy "Interventions : lecture de ses propres interventions"
  on interventions for select
  using (client_id in (select id from clients where user_id = auth.uid()));

create policy "Demandes : lecture de ses propres demandes"
  on demandes for select
  using (client_id in (select id from clients where user_id = auth.uid()));

create policy "Demandes : création de ses propres demandes"
  on demandes for insert
  with check (client_id in (select id from clients where user_id = auth.uid()));

create policy "Notifications : lecture de ses propres notifications"
  on notifications for select
  using (client_id in (select id from clients where user_id = auth.uid()));

create policy "Notifications : marquer comme lu"
  on notifications for update
  using (client_id in (select id from clients where user_id = auth.uid()))
  with check (client_id in (select id from clients where user_id = auth.uid()));

-- Index utiles
create index if not exists idx_interventions_client on interventions(client_id, scheduled_at desc);
create index if not exists idx_demandes_client on demandes(client_id, created_at desc);
create index if not exists idx_notifications_client on notifications(client_id, created_at desc);
