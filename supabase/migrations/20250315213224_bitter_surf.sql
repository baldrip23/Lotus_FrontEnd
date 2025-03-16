/*
  # Add Admin and Test Account Support

  1. Changes
    - Add is_admin column to profiles (if not exists)
    - Add role enum type and column (if not exists)
    - Add test account auto-reset trigger (if not exists)

  2. Security
    - Skip creating duplicate policies
*/

-- Add admin column to profiles (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create test account role (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'account_role'
  ) THEN
    CREATE TYPE account_role AS ENUM ('admin', 'user', 'test');
  END IF;
END $$;

-- Add role column to profiles (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role account_role DEFAULT 'user';
  END IF;
END $$;

-- Create or replace test account reset function
CREATE OR REPLACE FUNCTION reset_test_account() RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'test' THEN
    -- Reset test account data to defaults
    NEW.first_name := 'Test';
    NEW.last_name := 'User';
    NEW.phone := '555-0000';
    NEW.address := '123 Test St';
    NEW.budget := 1000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to ensure it's up to date
DROP TRIGGER IF EXISTS reset_test_account_trigger ON profiles;
CREATE TRIGGER reset_test_account_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION reset_test_account();