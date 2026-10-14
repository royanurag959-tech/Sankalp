import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, HeartHandshake } from 'lucide-react';

interface EmergencyBannerProps {
  lang: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ lang }) => {
  const [expanded, setExpanded] = useState(false);

  const isHindi = lang === 'hi';

  return (
    <aside aria-label="Crisis Support" className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white shadow-md relative z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="p-1 bg-white/20 rounded-full animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-100" />
            </span>
            <span>
              {isHindi 
                ? 'तत्काल सहायता चाहिए? 24x7 राष्ट्रीय हेल्पलाइन पर मुफ्त कॉल करें:'
                : 'Need immediate crisis support? Free 24/7 Verified National Helplines:'}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-4">
            <a
              href="tel:14416"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-rose-800 rounded-md font-bold hover:bg-rose-50 transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Tele-MANAS: 14416</span>
            </a>

            <a
              href="tel:14446"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-900 rounded-md font-bold hover:bg-amber-300 transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-900" />
              <span>Nasha Mukti: 14446</span>
            </a>

            <a
              href="tel:112"
              className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded font-semibold text-rose-50 transition"
            >
              <span>Emergency: 112</span>
            </a>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs underline text-rose-100 hover:text-white ml-1"
            >
              <span>{expanded ? (isHindi ? 'कम देखें' : 'Hide details') : (isHindi ? 'अधिक जानकारी' : 'Urgent tips')}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/20 text-xs sm:text-sm grid grid-cols-1 md:grid-cols-3 gap-3 pb-2 text-rose-50">
            <div className="bg-black/15 p-2.5 rounded-lg border border-white/10">
              <p className="font-semibold text-white flex items-center gap-1.5 mb-1">
                <HeartHandshake className="w-4 h-4 text-emerald-300" />
                {isHindi ? 'गोपनीय और गैर-न्यायिक' : '100% Confidential & Free'}
              </p>
              <p>
                {isHindi
                  ? 'टेली-मानस और 14446 पर प्रशिक्षित मनोवैज्ञानिक और परामर्शदाता बिना किसी पूर्वाग्रह के मार्गदर्शन करते हैं।'
                  : 'Calls to 14416 and 14446 connect directly with trained mental health & addiction counselors in 20+ Indian languages.'}
              </p>
            </div>

            <div className="bg-black/15 p-2.5 rounded-lg border border-white/10">
              <p className="font-semibold text-white flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                {isHindi ? 'गंभीर लक्षण (Emergency Withdrawal)' : 'Severe Physical Symptoms'}
              </p>
              <p>
                {isHindi
                  ? 'यदि कंपकंपी, दौरे (seizures) या सांस लेने में गंभीर तकलीफ हो, तो तुरंत 112 डायल करें या निकटतम अस्पताल जाएं।'
                  : 'If someone is experiencing tremors, seizures, unconsciousness, or extreme distress, call 112 or visit nearest emergency hospital immediately.'}
              </p>
            </div>

            <div className="bg-black/15 p-2.5 rounded-lg border border-white/10">
              <p className="font-semibold text-white mb-1">
                {isHindi ? 'संकल्प साथी की सीमाएं' : 'Sankalp AI Peer Role'}
              </p>
              <p>
                {isHindi
                  ? 'संकल्प एक सहायक डिजिटल साथी है, चिकित्सा आपात स्थिति में तुरंत वास्तविक डॉक्टर या काउंसलर से संपर्क करें।'
                  : 'Sankalp Companion provides peer support, coping tools, and navigation. Never delay professional care in crisis.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
