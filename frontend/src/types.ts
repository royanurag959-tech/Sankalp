export interface UserProfile {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  preferred_language: string;
  consent_given: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  question_hi: string;
  options: QuestionOption[];
}

export interface AssessmentResponse {
  id?: number;
  total_score: number;
  risk_level: 'Low' | 'Mild' | 'Moderate' | 'High';
  risk_title: string;
  risk_description: string;
  recommendations: string[];
  immediate_action?: string;
  helplines: { name: string; number: string; hours: string }[];
  disclaimer: string;
  created_at?: string;
}

export interface Checkin {
  id: number;
  checkin_date: string;
  mood: number;
  craving_intensity: number;
  triggers: string[];
  activities_completed: string[];
  notes?: string;
  created_at: string;
}

export interface TrackerStats {
  total_checkins: number;
  current_streak_days: number;
  encouragement_message: string;
  milestones: {
    id: string;
    name: string;
    unlocked: boolean;
    desc: string;
  }[];
  chart_data: {
    date: string;
    mood: number;
    craving: number;
  }[];
}

export interface DirectoryResource {
  id: number;
  name: string;
  category: string;
  phone: string;
  alternate_phone?: string;
  address?: string;
  state: string;
  city: string;
  operational_hours: string;
  languages: string[];
  website?: string;
  source_url?: string;
  verified_status: string;
  verification_date?: string;
  notes?: string;
}

export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood_tag: string;
  created_at: string;
}

export interface TinyFishFetchResult {
  url: string;
  status: string;
  extracted_title?: string;
  extracted_contacts: string[];
  markdown_snippet?: string;
  retrieved_at: string;
  needs_human_verification: boolean;
  verified_status: string;
  source_type: string;
  note?: string;
}

export interface TinyFishStatus {
  status: string;
  mode: string;
  message: string;
  endpoint: string;
  has_api_key: boolean;
}
