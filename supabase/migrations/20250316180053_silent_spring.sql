/*
  # Fix timestamp column names and handle existing policies

  1. Changes
    - Add IF NOT EXISTS checks for policies
    - Maintain camelCase column names
    - Keep all table structure and security settings

  2. Security
    - Safely handle existing RLS policies
    - Maintain data access controls
*/

DO $$ BEGIN
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON user_profiles
      FOR SELECT
      USING (auth.uid() = userId::text::uuid);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles
      FOR INSERT
      WITH CHECK (auth.uid() = userId::text::uuid);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      USING (auth.uid() = userId::text::uuid);
  END IF;
END $$;