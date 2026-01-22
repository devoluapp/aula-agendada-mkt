-- TABELA DE PERFIS
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  full_name text not null,
  email text unique not null,
  phone text,
  role text default 'user' check (role in ('user', 'admin'))
);

-- TABELA DE CURSOS
create table courses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  title text not null,
  description text,
  hotmart_link text,
  button_text text default 'Acessar Oferta',
  is_published boolean default false
);

-- TABELA DE AULAS
create table lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text,
  order_index int default 0
);

-- TABELA DE AGENDAMENTOS
create table schedules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  scheduled_at timestamp with time zone not null,
  status text default 'scheduled' check (status in ('scheduled', 'watched', 'partial')),
  created_at timestamp with time zone default now()
);

-- TABELA DE TEMPLATES DE E-MAIL
create table email_templates (
  id uuid default gen_random_uuid() primary key,
  type text unique not null, 
  subject text not null,
  body text not null,
  created_at timestamp with time zone default now()
);

-- RLS (POLITICAS DE SEGURANÇA)
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table schedules enable row level security;
alter table email_templates enable row level security;

-- POLÍTICAS SIMPLIFICADAS PARA ADMINS E USUÁRIOS
create policy "Admins can manage everything" on courses for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Users can view published courses" on courses for select using (is_published = true);

create policy "Admins can manage lessons" on lessons for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Users can view lessons of their courses" on lessons for select using (
  exists (select 1 from profiles where id = auth.uid())
);

-- TRIGGERS PARA AUTO-CREATE PROFILE
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
