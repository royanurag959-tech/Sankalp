import React from 'react';
import { Home, Heart, MessageSquareHeart, Compass, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, lang }) => {
  const isHindi = lang === 'hi';

  const items = [
    { id: 'dashboard', label: isHindi ? 'होम' : 'Home', icon: Home },
    { id: 'assessment', label: isHindi ? 'जांच' : 'Assess', icon: Heart },
    { id: 'chat', label: isHindi ? 'साथी' : 'AI Sathi', icon: MessageSquareHeart },
    { id: 'directory', label: isHindi ? 'हेल्पलाइन' : 'Helplines', icon: Compass },
    { id: 'profile', label: isHindi ? 'प्रोफ़ाइल' : 'Profile', icon: User },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-700 scale-105'
                  : 'text-slate-700 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-teal-50' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-teal-800' : 'font-semibold text-slate-700'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
