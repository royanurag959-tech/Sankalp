import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../api';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  lang: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHindi = lang === 'hi';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError(isHindi ? 'कृपया ईमेल और पासवर्ड दर्ज करें' : 'Please fill in both email and password');
      return;
    }
    if (!isLogin && !consent) {
      setError(isHindi ? 'कृपया गोपनीयता और सहमति की शर्तों को स्वीकार करें' : 'Please accept the privacy and consent policy');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.register({
          email,
          password,
          full_name: fullName,
          preferred_language: lang
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.guestDemoLogin();
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Guest demo access failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-teal-500/30">
              <Sparkles className="w-4 h-4 text-teal-200" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-200">
              {isHindi ? 'सुरक्षित एवं गोपनीय प्रवेश' : 'Confidential & Safe'}
            </span>
          </div>

          <h3 className="text-xl font-black">
            {isLogin 
              ? (isHindi ? 'संकल्प में आपका स्वागत है' : 'Welcome to Sankalp')
              : (isHindi ? 'नया खाता बनाएं' : 'Create Your Sanctuary')}
          </h3>
          <p className="text-xs text-teal-100 mt-1">
            {isHindi 
              ? 'आपकी रिकवरी और डेटा पूरी तरह निजी और सुरक्षित है।'
              : 'Your personal recovery path is 100% confidential and secure.'}
          </p>
        </div>

        <div className="p-6">
          {/* 1-Click Guest Demo Button for Hackathon Judges */}
          <div className="mb-5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {isHindi ? 'हैकथॉन जज / तुरंत डेमो एक्सेस' : 'Hackathon Judge / Fast Demo Access'}
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  {isHindi 
                    ? 'बिना पंजीकरण के सभी सुविधाओं का 1-क्लिक में परीक्षण करें।'
                    : 'Instantly test all features with a single click (no form filling required).'}
                </p>
              </div>
            </div>
            <button
              onClick={handleGuestDemo}
              disabled={loading}
              className="mt-2.5 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? '1-क्लिक से डेमो शुरू करें' : 'Explore as Demo User (Aarav)'}</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center mb-4">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase font-medium">
              {isHindi ? 'या अपना खाता उपयोग करें' : 'or use personal account'}
            </span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-200 mb-4">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-2 text-center text-xs font-bold transition border-b-2 ${
                isLogin ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {isHindi ? 'लॉगिन' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-2 text-center text-xs font-bold transition border-b-2 ${
                !isLogin ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {isHindi ? 'साइन अप (नया खाता)' : 'Sign Up'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'आपका नाम (या उपनाम)' : 'Full Name or Preferred Alias'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isHindi ? 'उदा. राहुल या मित्र' : 'e.g. Aarav or Friend'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'पासवर्ड (कम से कम 6 अक्षर)' : 'Password (min. 6 characters)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="consentCheck" className="text-[11px] text-slate-600 leading-tight">
                  {isHindi
                    ? 'मैं समझता/समझती हूँ कि संकल्प एक सहायक साथी है और कोई चिकित्सीय निदान नहीं करता। मेरा डेटा गोपनीय रहेगा।'
                    : 'I understand Sankalp is an AI-powered companion and not a clinical diagnosis tool. I consent to confidential recovery tracking.'}
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-teal-600/30 transition disabled:opacity-50"
            >
              {loading 
                ? (isHindi ? 'कृपया प्रतीक्षा करें...' : 'Processing...') 
                : (isLogin ? (isHindi ? 'लॉगिन करें' : 'Sign In') : (isHindi ? 'खाता बनाएं' : 'Create Account'))}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>{isHindi ? 'DPDP अधिनियम और राष्ट्रीय गोपनीयता मानकों के अनुरूप' : 'Built for Nasha Mukt Bharat with strict data privacy'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
