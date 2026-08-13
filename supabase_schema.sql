-- ============================================================
-- ELIRA LUXE DEMI-FINE JEWELLERY — SUPABASE DATABASE SCHEMA SQL
-- Run this in your Supabase Dashboard -> SQL Editor
-- URL: https://homymzdujoeemdxxowut.supabase.co
-- ============================================================

-- 1. Create Store State JSON Sync Table
CREATE TABLE IF NOT EXISTS public.elira_store_state (
  id INT PRIMARY KEY DEFAULT 1,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and add public read/write access policies
ALTER TABLE public.elira_store_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to elira_store_state"
  ON public.elira_store_state FOR SELECT
  USING (true);

CREATE POLICY "Allow public write/update access to elira_store_state"
  ON public.elira_store_state FOR ALL
  USING (true);

-- 2. Optional Relational Tables (if desired)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  stock_status TEXT DEFAULT 'in_stock',
  stock_quantity INT DEFAULT 10,
  sizes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.unique_styles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  tagline TEXT,
  badge TEXT,
  image TEXT,
  innovations JSONB,
  suggested_products JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for optional relational tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unique_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public all on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public all on unique_styles" ON public.unique_styles FOR ALL USING (true);
