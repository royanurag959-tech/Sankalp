import {
  AuthResponse,
  UserProfile,
  Question,
  AssessmentResponse,
  Checkin,
  TrackerStats,
  DirectoryResource,
  JournalEntry,
  TinyFishFetchResult,
  TinyFishStatus
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('sankalp_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('sankalp_token', token);
    } else {
      localStorage.removeItem('sankalp_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(payload: { email: string; password: string; full_name?: string; preferred_language?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async guestDemoLogin(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/guest-demo`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Guest demo login failed');
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async getMe(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  }

  async exportData(): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/export-data`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to export data');
    return res.json();
  }

  async deleteAccount(): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/delete-account`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete account');
    this.setToken(null);
    return res.json();
  }

  // Assessment
  async getAssessmentQuestions(): Promise<{ questions: Question[] }> {
    const res = await fetch(`${API_BASE}/assessment/questions`);
    if (!res.ok) throw new Error('Failed to load assessment questions');
    return res.json();
  }

  async submitAssessment(answers: any[]): Promise<AssessmentResponse> {
    const res = await fetch(`${API_BASE}/assessment/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  }

  async getAssessmentHistory(): Promise<AssessmentResponse[]> {
    const res = await fetch(`${API_BASE}/assessment/history`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  }

  // Chat
  async sendChatMessage(sessionId: string, message: string, language: string = 'en') {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ session_id: sessionId, message, language }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  }

  async getChatHistory(sessionId: string) {
    const res = await fetch(`${API_BASE}/chat/history/${sessionId}`);
    if (!res.ok) return { messages: [] };
    return res.json();
  }

  // Tracker
  async getCheckins(): Promise<Checkin[]> {
    const res = await fetch(`${API_BASE}/tracker/checkins`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  }

  async createCheckin(checkinData: {
    checkin_date: string;
    mood: number;
    craving_intensity: number;
    triggers: string[];
    activities_completed: string[];
    notes?: string;
  }): Promise<Checkin> {
    const res = await fetch(`${API_BASE}/tracker/checkin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(checkinData),
    });
    if (!res.ok) throw new Error('Failed to save daily check-in');
    return res.json();
  }

  async deleteCheckin(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/tracker/checkin/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete check-in');
  }

  async getTrackerStats(): Promise<TrackerStats> {
    const res = await fetch(`${API_BASE}/tracker/stats`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load tracker stats');
    return res.json();
  }

  // Wellness
  async getAffirmations(): Promise<{ affirmations: { en: string; hi: string }[] }> {
    const res = await fetch(`${API_BASE}/wellness/affirmations`);
    return res.json();
  }

  async getBreathingGuides(): Promise<any> {
    const res = await fetch(`${API_BASE}/wellness/breathing-guides`);
    return res.json();
  }

  async getJournals(): Promise<JournalEntry[]> {
    const res = await fetch(`${API_BASE}/wellness/journals`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  }

  async createJournal(title: string, content: string, mood_tag: string): Promise<JournalEntry> {
    const res = await fetch(`${API_BASE}/wellness/journals`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title, content, mood_tag }),
    });
    if (!res.ok) throw new Error('Failed to save journal entry');
    return res.json();
  }

  async deleteJournal(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/wellness/journals/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete journal entry');
  }

  // Directory
  async getDirectoryResources(params?: { query?: string; category?: string; state?: string; verified_only?: boolean }): Promise<DirectoryResource[]> {
    const url = new URL(`${API_BASE}/directory/resources`);
    if (params?.query) url.searchParams.append('query', params.query);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.state) url.searchParams.append('state', params.state);
    if (params?.verified_only) url.searchParams.append('verified_only', 'true');

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    return res.json();
  }

  async submitResource(data: any): Promise<DirectoryResource> {
    const res = await fetch(`${API_BASE}/directory/resources`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit resource');
    return res.json();
  }

  // TinyFish
  async getTinyFishStatus(): Promise<TinyFishStatus> {
    const res = await fetch(`${API_BASE}/tinyfish/status`);
    if (!res.ok) throw new Error('Failed to get TinyFish status');
    return res.json();
  }

  async fetchWithTinyFish(urls: string[], purpose?: string): Promise<TinyFishFetchResult[]> {
    const res = await fetch(`${API_BASE}/tinyfish/fetch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ urls, purpose }),
    });
    if (!res.ok) throw new Error('Failed to fetch via TinyFish');
    return res.json();
  }

  async importTinyFishResult(item: TinyFishFetchResult, category: string, state: string, city: string): Promise<DirectoryResource> {
    const url = new URL(`${API_BASE}/tinyfish/import-to-directory`);
    url.searchParams.append('category', category);
    url.searchParams.append('state', state);
    url.searchParams.append('city', city);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to import resource');
    return res.json();
  }

  // Resources
  async getArticles(): Promise<any> {
    const res = await fetch(`${API_BASE}/resources/articles`);
    return res.json();
  }

  async getMythsFacts(): Promise<any> {
    const res = await fetch(`${API_BASE}/resources/myths-facts`);
    return res.json();
  }

  async getParentGuidelines(): Promise<any> {
    const res = await fetch(`${API_BASE}/resources/parent-guidelines`);
    return res.json();
  }
}

export const api = new ApiClient();
