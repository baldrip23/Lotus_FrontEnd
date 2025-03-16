/*
  # Create user_profiles table with consistent column naming

  1. New Tables
    - `user_profiles` table with standardized column names
    - All timestamps using snake_case
    - Foreign key reference to auth.users

  2. Security
    - Enable RLS
    - Policies for user data access
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Drop existing table if it exists
DROP TABLE IF EXISTS user_profiles;

-- Create the table with consistent naming
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  age integer NOT NULL,
  current_sf_resident boolean NOT NULL,
  household_size integer NOT NULL,
  annual_household_income numeric NOT NULL,
  monthly_household_income numeric NOT NULL,
  has_past_due_rent boolean NOT NULL,
  cannot_afford_move_in_costs boolean NOT NULL,
  if_applying_for_back_rent_financial_hardship_within_12_months boolean NOT NULL,
  qualify_as_individual_or_family boolean NOT NULL,
  head_of_household_minimum_age_or_emancipated boolean NOT NULL,
  annual_income_within_established_limits boolean NOT NULL,
  pass_criminal_background_check boolean NOT NULL,
  ssn_documentation_provided_or_certified boolean NOT NULL,
  hud_citizenship_or_immigration_requirement_met boolean NOT NULL,
  no_meth_production_conviction boolean NOT NULL,
  not_subject_to_sex_offender_registration boolean NOT NULL,
  no_outstanding_rent_debt boolean NOT NULL,
  household_income_below_50_ami boolean NOT NULL,
  assistance_exception_if_receiving_assistance boolean NOT NULL,
  non_discrimination_policy boolean NOT NULL,
  photo_id boolean NOT NULL,
  proof_of_total_household_income boolean NOT NULL,
  rental_agreement_or_address_proof boolean NOT NULL,
  proof_of_rent_amount boolean NOT NULL,
  tenant_ledger boolean NOT NULL,
  landlord_contact_info boolean NOT NULL,
  w9_form boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = userid);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = userid);