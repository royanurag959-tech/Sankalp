import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HeartHandshake, 
  PhoneCall, 
  HelpCircle,
  Lock
} from 'lucide-react';
import { api } from '../api';

interface ParentGuideViewProps {
  lang: string;
  onNavigate: (tab: string) => void;
}

export const ParentGuideView: React.FC<ParentGuideViewProps> = ({ lang, onNavigate }) => {
  const [guidelines, setGuidelines] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isHindi = lang === 'hi';

  useEffect(() => {
    const loadGuidelines = async () => {
      try {
        const res = await api.getParentGuidelines();
        setGuidelines(res.parent_guidelines);
      } catch (err) {
        console.error('Failed to load parent guidelines', err);
      } finally {
        setLoading(false);
      }
    };
    loadGuidelines();
  }, []);

  const warningSigns = [
    {
      en: "Sudden withdrawal from family dinners, conversations, and long-standing hobbies",
      hi: "पारिवारिक बातचीत, भोजन और पसंदीदा शौक से अचानक दूरी बना लेना"
    },
    {
      en: "Extreme mood swings, uncharacteristic hostility, or extreme defensiveness when asked casual questions",
      hi: "अचानक अत्यधिक चिड़चिड़ापन, गुस्सा या सामान्य बातचीत पर भी अत्यधिक रक्षात्मक (defensive) रुख"
    },
    {
      en: "Unexplained financial demands, borrowing money repeatedly, or missing valuables",
      hi: "अकारण रुपयों की बार-बार मांग करना या घर से सामान का गायब होना"
    },
    {
      en: "Changes in sleep cycles (staying awake all night, sleeping all day) and sudden drop in academic or job performance",
      hi: "नींद के समय में भारी बदलाव (पूरी रात जागना, दिन में सोना) और पढ़ाई/काम में लगातार गिरावट"
    }
  ];

  const dos = [
    {
      en: "DO choose a calm, sober moment to talk — never start an emotionally charged confrontation while they are intoxicated or distressed.",
      hi: "हमेशा शांत और सामान्य समय पर बात करें — नशे या तीव्र उत्तेजना की स्थिति में कभी बहस न करें।"
    },
    {
      en: "DO use 'I' statements of love and care: 'I love you and I feel worried about your health' instead of 'You have ruined our family reputation.'",
      hi: "प्यार और चिंता व्यक्त करने वाले शब्दों का प्रयोग करें: 'मुझे तुम्हारी बहुत चिंता है' कहें, न कि 'तुमने खानदान का नाम खराब कर दिया'।"
    },
    {
      en: "DO listen with genuine empathy without constantly interrupting or lecturing.",
      hi: "उनकी बात को धैर्य से सुनें, बिना बीच में टोके या बिना भाषण दिए।"
    },
    {
      en: "DO encourage professional guidance together: offer to sit beside them while calling the National Helpline 14446.",
      hi: "पेशेवर मदद के लिए प्रोत्साहित करें: राष्ट्रीय नशा मुक्ति हेल्पलाइन 14446 पर साथ बैठकर बात करने का प्रस्ताव दें।"
    }
  ];

  const donts = [
    {
      en: "DON'T shame, guilt-trip, yell, or blame them in front of relatives or neighbors.",
      hi: "रिश्तेदारों या पड़ोसियों के सामने कभी उन्हें शर्मिंदा न करें या ताना न मारें।"
    },
    {
      en: "DON'T become an enabler by giving unconditional cash or repeatedly lying to employers/colleges to cover for their absences.",
      hi: "उनकी गैरहाजिरी छिपाने के लिए झूठ न बोलें और न ही बिना कारण नकद पैसे दें (इनेबलिंग से बचें)।"
    },
    {
      en: "DON'T spy, secretly go through their phone, or breach their fundamental trust.",
      hi: "छिपकर जासूसी न करें या बिना अनुमति फोन न खंगालें — इससे विश्वास टूटता है।"
    },
    {
      en: "DON'T neglect your own mental health: family members experience severe burnout and deserve counseling support too.",
      hi: "अपने मानसिक स्वास्थ्य को नज़रअंदाज़ न करें — परिवार के सदस्यों को भी परामर्श की उतनी ही आवश्यकता होती है।"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-purple-700">
              {isHindi ? 'अभिभावक एवं परिवार मार्गदर्शन' : 'Parent & Family Support Sanctuary'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isHindi ? 'सहानुभूति, समझ और सही दिशा' : 'Guiding Families with Empathy & Boundaries'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            {isHindi
              ? 'जब कोई अपना नशे की लत से जूझता है, तो पूरा परिवार प्रभावित होता है। बिना कलंक या दोषारोपण के सहारा देने के वैज्ञानिक उपाय।'
              : 'Addiction affects the entire family ecosystem. Learn how to provide constructive support while safeguarding healthy boundaries.'}
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <a
            href="tel:14446"
            className="w-full sm:w-auto px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-purple-200" />
            <span>{isHindi ? 'परिवार परामर्श: 14446' : 'Family Counsel: 14446'}</span>
          </a>
        </div>
      </div>

      {/* Strict Privacy Protection Guarantee Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-3 border border-teal-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isHindi ? 'संकल्प गोपनीयता प्रतिज्ञा (Zero-Surveillance Guarantee)' : 'Sankalp Privacy & Anti-Surveillance Pledge'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
          {isHindi
            ? 'संकल्प कभी भी किसी व्यक्ति के निजी मैसेज, लाइव लोकेशन या रिकवरी रिकॉर्ड की गुप्त निगरानी (surveillance) नहीं करता। रिकवरी का आधार विश्वास और पारस्परिक सहमति है, जासूसी नहीं।'
            : 'Sankalp strictly upholds the individual\'s privacy rights under Indian DPDP principles. We never conduct covert tracking, secret surveillance, or disclose personal journal logs to parents without explicit consent. Healing requires trust.'}
        </p>
      </div>

      {/* Warning Signs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>{isHindi ? 'प्रारंभिक चेतावनी संकेत (Early Warning Signs)' : 'Early Signs of Substance Vulnerability'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {isHindi 
            ? 'ये संकेत अकेले बीमारी का प्रमाण नहीं हैं, बल्कि यह दर्शाते हैं कि उन्हें आपके भावनात्मक सहारे की जरूरत है:'
            : 'These signs do not mean judgment or shame; they indicate a loved one in need of mindful support:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {warningSigns.map((sign, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{isHindi ? sign.hi : sign.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Dos and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOs */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{isHindi ? 'क्या करें (Recommended Dos)' : 'What TO DO (Constructive Support)'}</span>
          </div>

          <div className="space-y-3">
            {dos.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/70 text-xs text-emerald-950 leading-relaxed border border-emerald-100 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{isHindi ? item.hi : item.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DONTs */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>{isHindi ? 'क्या न करें (Common Traps to Avoid)' : 'What to AVOID (Enabling Traps)'}</span>
          </div>

          <div className="space-y-3">
            {donts.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/70 text-xs text-rose-950 leading-relaxed border border-rose-100 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>{isHindi ? item.hi : item.en}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Help for Parents CTA */}
      <div className="bg-gradient-to-r from-purple-50 via-teal-50 to-emerald-50 rounded-3xl p-6 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">
            {isHindi ? 'अभिभावक हेल्पलाइन व पारिवारिक परामर्श' : 'Connect with Parent & Family Counselors'}
          </h4>
          <p className="text-xs text-slate-600">
            {isHindi
              ? 'टेली-मानस (14416) पर परिवार के सदस्य भी मनोवैज्ञानिक मार्गदर्शन प्राप्त कर सकते हैं।'
              : 'Tele-MANAS (14416) also supports parents and spouses experiencing emotional stress.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('directory')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0"
        >
          {isHindi ? 'मान्यता प्राप्त केंद्र देखें' : 'View Accredited Centers'}
        </button>
      </div>

    </div>
  );
};
