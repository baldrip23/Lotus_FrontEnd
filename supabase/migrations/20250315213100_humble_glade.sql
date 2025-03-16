/*
  # Create Initial Users

  1. New Users
    - Admin user with direct access to AI chatbot
    - Test user with auto-resetting data

  2. Changes
    - Insert admin user into auth.users
    - Insert test user into auth.users
    - Create corresponding profiles
*/

-- Create admin account
DO $$ 
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'ad9ebe75-58f0-4e62-9ccc-2234c7a62abc'::uuid,
    'authenticated',
    'authenticated',
    'admin@legal-aid.com',
    crypt('Admin123!@#', gen_salt('bf')),
    now(),
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '12345678-58f0-4e62-9ccc-2234c7a62def'::uuid,
    'authenticated',
    'authenticated',
    'test@legal-aid.com',
    crypt('Test123!@#', gen_salt('bf')),
    now(),
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
END $$;

-- Create admin profile
INSERT INTO public.profiles (
  user_id,
  first_name,
  last_name,
  phone,
  address,
  budget,
  is_admin,
  role
) VALUES (
  'ad9ebe75-58f0-4e62-9ccc-2234c7a62abc'::uuid,
  'Admin',
  'User',
  '555-0000',
  '123 Admin St',
  0,
  true,
  'admin'
) ON CONFLICT (user_id) DO NOTHING;

-- Create test profile
INSERT INTO public.profiles (
  user_id,
  first_name,
  last_name,
  phone,
  address,
  budget,
  is_admin,
  role
) VALUES (
  '12345678-58f0-4e62-9ccc-2234c7a62def'::uuid,
  'Test',
  'User',
  '555-0000',
  '123 Test St',
  1000,
  false,
  'test'
) ON CONFLICT (user_id) DO NOTHING;