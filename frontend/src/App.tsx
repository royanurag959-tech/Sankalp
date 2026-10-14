import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { EmergencyBanner } from './components/EmergencyBanner';
import { AuthModal } from './components/AuthModal';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { ChatView } from './components/ChatView';
import { TrackerView } from './components/TrackerView';
import { WellnessView } from './components/WellnessView';
import { DirectoryView } from './components/DirectoryView';
import { ParentGuideView } from './components/ParentGuideView';
import { EducationView } from './components/EducationView';
import { ProfileView } from './components/ProfileView';
import { UserProfile } from './types';
import { api } from './api';
import { Sparkles, HeartHandshake, ShieldCheck, PhoneCall } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Check initial user authentication session
  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          setCurrentTab('dashboard');
        } catch {
          api.setToken(null);
          setUser(null);
        }
      }
      setLoadingInitial(false);
    };
    initAuth();
  }, []);

  const handleLogout = () => {
    api.setToken(null);
    setUser(null);
    setCurrentTab('landing');
  };

  const handleAuthSuccess = (u: UserProfile) => {
    setUser(u);
    setCurrentTab('dashboard');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Sankalp • Nasha Mukt Bharat
        </p>
      </div>
    );
  }

  const isHindi = lang === 'hi';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-200 selection:text-teal-900 pb-16 lg:pb-0">
      
      {/* 24/7 Verified Emergency Banner */}
      <EmergencyBanner lang={lang} />

      {/* Main Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'landing' && (
          <LandingView
            onStartAssessment={() => setCurrentTab('assessment')}
            onStartChat={() => setCurrentTab('chat')}
            onExploreDirectory={() => setCurrentTab('directory')}
            onOpenAuth={() => setAuthModalOpen(true)}
            lang={lang}
          />
        )}

        {currentTab === 'dashboard' && (
          user ? (
            <DashboardView
              user={user}
              onNavigate={(tab) => setCurrentTab(tab)}
              lang={lang}
            />
          ) : (
            <LandingView
              onStartAssessment={() => setCurrentTab('assessment')}
              onStartChat={() => setCurrentTab('chat')}
              onExploreDirectory={() => setCurrentTab('directory')}
              onOpenAuth={() => setAuthModalOpen(true)}
              lang={lang}
            />
          )
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            onNavigate={(tab) => setCurrentTab(tab)}
            lang={lang}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            onNavigate={(tab) => setCurrentTab(tab)}
            lang={lang}
          />
        )}

        {currentTab === 'tracker' && (
          user ? (
            <TrackerView lang={lang} />
          ) : (
            <div className="max-w-md mx-auto text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {isHindi ? 'व्यक्तिगत ट्रैकर के लिए लॉगिन करें' : 'Sign in to access Recovery Tracker'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'अपनी दैनिक प्रगति, लड़ी और मनोदशा का सुरक्षित रिकॉर्ड रखने के लिए 1-क्लिक डेमो का उपयोग करें।'
                  : 'Track your personal recovery streak, moods, and urges with zero-guilt logging.'}
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-md transition"
              >
                {isHindi ? 'तुरंत लॉगिन / डेमो शुरू करें' : 'Open Login / 1-Click Demo'}
              </button>
            </div>
          )
        )}

        {currentTab === 'wellness' && (
          <WellnessView lang={lang} />
        )}

        {currentTab === 'directory' && (
          <DirectoryView lang={lang} />
        )}

        {currentTab === 'parents' && (
          <ParentGuideView
            lang={lang}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'resources' && (
          <EducationView lang={lang} />
        )}

        {currentTab === 'profile' && user && (
          <ProfileView
            user={user}
            setUser={setUser}
            lang={lang}
            setLang={setLang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black">
                S
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Sankalp (संकल्प)</p>
                <p className="text-[11px] text-slate-400">
                  {isHindi ? 'नशा मुक्त भारत — आज का सहयोग, कल का सवेरा' : 'Nasha Mukt Bharat — Help Today, A Better Tomorrow'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                Tele-MANAS: 14416
              </span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                Nasha Mukti: 14446
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Emergency: 112
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
            <p>
              Designed for National Hackathon Demonstration. Not a substitute for professional clinical diagnosis.
            </p>
            <p>
              Aligned with Ministry of Social Justice & Empowerment, Govt. of India.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        lang={lang}
      />

    </div>
  );
}

export default App;
