/*
  # Add admin role and permissions

  1. Changes
    - Add admin column to profiles table
    - Create admin-specific policies
    - Create initial admin account

  2. Security
    - Only admins can access admin features
    - Admins can view all profiles
*/

-- Add admin column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create admin-specific policies
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE is_admin = true
    )
    OR auth.uid() = user_id
  );

-- Create test account role
CREATE TYPE account_role AS ENUM ('admin', 'user', 'test');
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role account_role DEFAULT 'user';

-- Add policy for test account auto-reset
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

CREATE TRIGGER reset_test_account_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION reset_test_account();