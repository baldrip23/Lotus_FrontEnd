import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  userid: string;
  full_name: string;
  date_of_birth: string;
  age: number;
  current_sf_resident: boolean;
  household_size: number;
  annual_household_income: number;
  monthly_household_income: number;
  has_past_due_rent: boolean;
  cannot_afford_move_in_costs: boolean;
  if_applying_for_back_rent_financial_hardship_within_12_months: boolean;
  qualify_as_individual_or_family: boolean;
  head_of_household_minimum_age_or_emancipated: boolean;
  annual_income_within_established_limits: boolean;
  pass_criminal_background_check: boolean;
  ssn_documentation_provided_or_certified: boolean;
  hud_citizenship_or_immigration_requirement_met: boolean;
  no_meth_production_conviction: boolean;
  not_subject_to_sex_offender_registration: boolean;
  no_outstanding_rent_debt: boolean;
  household_income_below_50_ami: boolean;
  assistance_exception_if_receiving_assistance: boolean;
  non_discrimination_policy: boolean;
  photo_id: boolean;
  proof_of_total_household_income: boolean;
  rental_agreement_or_address_proof: boolean;
  proof_of_rent_amount: boolean;
  tenant_ledger: boolean;
  landlord_contact_info: boolean;
  w9_form: boolean;
  created_at: string;
  updated_at: string;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userid = profile.userid || uuidv4();
    const now = new Date().toISOString();
    
    const profileToSave = {
      ...profile,
      userid,
      created_at: now,
      updated_at: now
    };

    // Save to localStorage only
    localStorage.setItem('userProfile', JSON.stringify(profileToSave));
    localStorage.setItem('currentUserId', userid);

  } catch (error) {
    console.error('Error saving profile:', error);
    throw new Error('Failed to save user profile');
  }
}

export async function sendProfileToApi(profile: UserProfile): Promise<void> {
  try {
    const response = await fetch('https://api.legal-aid.com/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      throw new Error('Failed to send profile to API');
    }

    const data = await response.json();
    console.log('Profile sent to API successfully:', data);

  } catch (error) {
    console.error('Error sending profile to API:', error);
    throw error;
  }
}

export async function getUserProfile(userid: string): Promise<UserProfile | null> {
  try {
    const profileStr = localStorage.getItem('userProfile');
    if (!profileStr) return null;
    
    const profile = JSON.parse(profileStr);
    if (profile.userid !== userid) return null;
    
    return profile;
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return null;
    return getUserProfile(currentUserId);
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
}

export async function updateUserProfile(userid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const currentProfile = await getUserProfile(userid);
    if (!currentProfile) throw new Error('Profile not found');

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update user profile');
  }
}