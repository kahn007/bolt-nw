/*
  # Fix Function Search Path Security Issue

  ## Overview
  This migration fixes the security vulnerability in the update_updated_at_column function
  by setting an explicit, immutable search_path.

  ## Changes
  1. Drop the existing function
  2. Recreate it with a secure, immutable search_path (pg_catalog, public)
  3. This prevents potential SQL injection attacks via search_path manipulation

  ## Security Notes
  - Setting search_path to 'pg_catalog, public' ensures the function only looks in trusted schemas
  - This is a PostgreSQL security best practice for SECURITY DEFINER functions
  - Prevents malicious users from creating objects in other schemas to hijack function behavior
*/

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger since CASCADE dropped it
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();