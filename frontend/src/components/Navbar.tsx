import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Heart, 
  Activity, 
  BookOpen, 
  Users, 
  Compass, 
  MessageSquareHeart,
  Globe
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  lang: string;
  setLang: (lang: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onLogout,
  lang,
  setLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHindi = lang === 'hi';

  const navItems = [
    { id: 'dashboard', label: isHindi ? 'डैशबोर्ड' : 'Dashboard', icon: Activity },
    { id: 'assessment', label: isHindi ? 'स्व-मूल्यांकन' : 'Self-Assessment', icon: Heart },
    { id: 'chat', label: isHindi ? 'संकल्प साथी' : 'AI Companion', icon: MessageSquareHeart },
    { id: 'tracker', label: isHindi ? 'रिकवरी ट्रैकर' : 'Tracker', icon: Activity },
    { id: 'wellness', label: isHindi ? 'कल्याण टूल्स' : 'Wellness Tools', icon: Sparkles },
    { id: 'directory', label: isHindi ? 'हेल्पलाइन डायरेक्टरी' : 'Helplines', icon: Compass },
    { id: 'parents', label: isHindi ? 'अभिभावक गाइड' : 'For Parents', icon: Users },
    { id: 'resources', label: isHindi ? 'संसाधन' : 'Resources', icon: BookOpen },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => handleNavClick(user ? 'dashboard' : 'landing')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  Sankalp
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  {isHindi ? 'संकल्प' : 'NMBA'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-700 hidden sm:block">
                {isHindi ? 'आज का सहयोग, कल का सवेरा' : 'Help Today, A Better Tomorrow'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher & Auth Actions */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition border ${
                    currentTab === 'profile'
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span className="max-w-[100px] truncate">{user.full_name || 'My Profile'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm hover:shadow-teal-600/20 transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{isHindi ? 'लॉगिन / शामिल हों' : 'Sign In / Join'}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider px-3 py-1">
            {isHindi ? 'नेविगेशन' : 'Navigation Menu'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          {user && (
            <button
              onClick={() => handleNavClick('profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>{isHindi ? 'प्रोफ़ाइल और सेटिंग्स' : 'Profile & Privacy Settings'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
