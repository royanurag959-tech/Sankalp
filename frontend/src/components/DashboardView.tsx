import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquareHeart, 
  Activity, 
  Sparkles, 
  Compass, 
  Users, 
  Flame, 
  ArrowRight, 
  PlusCircle, 
  PhoneCall, 
  Quote
} from 'lucide-react';
import { UserProfile, TrackerStats } from '../types';
import { api } from '../api';

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  lang: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onNavigate, lang }) => {
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const isHindi = lang === 'hi';

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.getTrackerStats();
        setStats(res);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const streakDays = stats?.current_streak_days || 1;

  const motivationalQuote = isHindi ? {
    quote: "“हर नया दिन आपके संकल्प को दोबारा साबित करने का एक सुनहरा अवसर है।”",
    author: "नशा मुक्त भारत — आज का सहयोग, कल का सवेरा"
  } : {
    quote: "“Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.”",
    author: "Sankalp Recovery Principle — Step by Step"
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Welcome Banner */}
      <section className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 text-xs font-bold uppercase tracking-wider">
                {isHindi ? 'नमस्ते' : 'Welcome'}
              </span>
              <span className="text-xs text-teal-200 font-medium">
                {new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black">
              {isHindi ? `स्वागत है, ${user.full_name || 'साथी'}!` : `Namaste, ${user.full_name || 'Friend'}!`}
            </h1>
            
            <p className="text-xs sm:text-sm text-teal-100 font-normal leading-relaxed">
              {isHindi
                ? 'आपका संकल्प आज भी मजबूत है। हर पल जब आप अपने स्वास्थ्य को चुनते हैं, वह आपकी सबसे बड़ी जीत है।'
                : 'Every conscious, healthy choice you make today paves the path to lasting peace and freedom.'}
            </p>
          </div>

          {/* Current Streak Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <Flame className="w-6 h-6 fill-current text-slate-950" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {streakDays} <span className="text-sm font-semibold text-amber-300">{isHindi ? 'दिन' : 'Days'}</span>
              </div>
              <p className="text-[11px] font-medium text-teal-200 uppercase tracking-wider">
                {isHindi ? 'सचेत रिकवरी संकल्प' : 'Conscious Streak'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/15 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('assessment')}
            className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>{isHindi ? 'स्व-मूल्यांकन शुरू करें' : 'Start Self-Assessment'}</span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <MessageSquareHeart className="w-4 h-4 text-teal-200" />
            <span>{isHindi ? 'संकल्प साथी से बात करें' : 'Talk to Support'}</span>
          </button>

          <button
            onClick={() => onNavigate('tracker')}
            className="px-4 py-2 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 rounded-xl text-xs font-bold border border-emerald-400/30 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isHindi ? 'आज का चेक-इन दर्ज करें' : 'Log Today\'s Check-in'}</span>
          </button>
        </div>
      </section>

      {/* Daily Motivational Message */}
      <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
          <Quote className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {isHindi ? 'आज का प्रेरक विचार' : 'Daily Motivational Inspiration'}
          </p>
          <p className="text-sm font-semibold text-slate-800 italic">
            {motivationalQuote.quote}
          </p>
          <p className="text-xs text-slate-700">
            — {motivationalQuote.author}
          </p>
        </div>
      </section>

      {/* Dashboard 4-Grid Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: My Progress */}
        <div 
          onClick={() => onNavigate('tracker')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'मेरी प्रगति (My Progress)' : 'My Progress & Goals'}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isHindi
                ? 'दैनिक मूड, तलब (craving) स्तर रिकॉर्ड करें और बिना किसी अपराधबोध के साप्ताहिक चार्ट देखें।'
                : 'Track daily moods, urges, and trigger habits with zero-guilt visual analytics.'}
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-teal-700 border-t border-slate-100 mt-4">
            <span>{stats?.total_checkins || 0} {isHindi ? 'चेक-इन दर्ज' : 'check-ins recorded'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Wellness Tools */}
        <div 
          onClick={() => onNavigate('wellness')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'कल्याण टूल्स (Wellness)' : 'Mental Wellness Tools'}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isHindi
                ? '4-7-8 शांत श्वास तकनीक, 5-4-3-2-1 ग्राउंडिंग और निजी डायरी से तनाव नियंत्रित करें।'
                : 'Interactive 4-7-8 breathing coach, sensory grounding for urges, and private reflections.'}
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-700 border-t border-slate-100 mt-4">
            <span>{isHindi ? 'श्वास व ध्यान प्रारंभ करें' : 'Open Guided Exercises'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Support Community & Helplines */}
        <div 
          onClick={() => onNavigate('directory')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'सपोर्ट कम्युनिटी व हेल्पलाइन' : 'Verified Directory'}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isHindi
                ? 'टेली-मानस (14416), नशा मुक्ति (14446) और निकटतम मान्यता प्राप्त आईआरसीए केंद्र खोजें।'
                : 'Official de-addiction helplines, IRCA centers across India, and certified professionals.'}
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-700 border-t border-slate-100 mt-4">
            <span>{isHindi ? 'डायरेक्टरी देखें' : 'Search Centers'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Parent & Family Mode */}
        <div 
          onClick={() => onNavigate('parents')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'अभिभावक व परिवार' : 'Family & Guardians'}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isHindi
                ? 'बिना कलंक या दोषारोपण के परिवारजनों का समर्थन करने के व्यावहारिक दिशा-निर्देश व सीमाएं।'
                : 'Communication strategies, warning sign guides, and non-confrontational support advice.'}
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-purple-700 border-t border-slate-100 mt-4">
            <span>{isHindi ? 'पारिवारिक गाइड' : 'Open Family Sanctuary'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </section>

      {/* Emergency Assistance Quick Dial Bar */}
      <section className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-5 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-950">
              {isHindi ? 'आपातकालीन सहायता की आवश्यकता है?' : 'Immediate Human Support Needed?'}
            </h4>
            <p className="text-xs text-rose-800">
              {isHindi 
                ? 'टेली-मानस (14416) और नशा मुक्ति (14446) 24 घंटे पूरी तरह नि:शुल्क और गोपनीय हैं।'
                : 'Free, confidential psychological crisis and de-addiction counsel available 24/7.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:14416"
            className="flex-1 sm:flex-none text-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
          >
            Call Tele-MANAS: 14416
          </a>
          <a
            href="tel:14446"
            className="flex-1 sm:flex-none text-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-xs transition"
          >
            Call Nasha Mukti: 14446
          </a>
        </div>
      </section>

    </div>
  );
};
