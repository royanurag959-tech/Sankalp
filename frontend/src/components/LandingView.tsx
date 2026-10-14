import React from 'react';
import { 
  Heart, 
  MessageSquareHeart, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Activity, 
  Users, 
  CheckCircle2
} from 'lucide-react';

interface LandingViewProps {
  onStartAssessment: () => void;
  onStartChat: () => void;
  onExploreDirectory: () => void;
  onOpenAuth: () => void;
  lang: string;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAssessment,
  onStartChat,
  onExploreDirectory,
  onOpenAuth,
  lang,
}) => {
  const isHindi = lang === 'hi';

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-teal-200 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHindi ? 'नशा मुक्त भारत अभियान — राष्ट्रव्यापी पहल' : 'Nasha Mukt Bharat — Help Today, A Better Tomorrow'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            {isHindi ? (
              <>
                संकल्प: नई शुरुआत का <span className="text-teal-300">आत्मविश्वास</span>
              </>
            ) : (
              <>
                Compassionate Support & <span className="text-teal-300">Recovery Companion</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl mx-auto font-normal">
            {isHindi
              ? 'बिना किसी पूर्वाग्रह या डर के — अपनी आदतों को समझें, 24x7 साथी से बात करें, व्यक्तिगत रिकवरी ट्रैक करें और भारत के सत्यापित नशा मुक्ति केंद्रों से जुड़ें।'
              : 'Empathetic, confidential, and culturally grounded AI support for Indian youth, individuals fighting substance use, and their families. Zero judgment, complete privacy.'}
          </p>

          {/* Core Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-400/25 transition-all flex items-center justify-center gap-2 text-sm group"
            >
              <Heart className="w-4 h-4 text-slate-950 fill-current" />
              <span>{isHindi ? 'गोपनीय स्व-मूल्यांकन शुरू करें' : 'Take Confidential Assessment'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onStartChat}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquareHeart className="w-4 h-4 text-teal-200" />
              <span>{isHindi ? 'संकल्प साथी से बात करें' : 'Talk with Sankalp Sathi AI'}</span>
            </button>

            <button
              onClick={onExploreDirectory}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-teal-200 font-semibold rounded-xl border border-teal-500/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>{isHindi ? 'सत्यापित डायरेक्टरी' : 'Find Helplines'}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-teal-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isHindi ? '100% गोपनीय एवं सुरक्षित' : '100% Confidential & Anonymous'}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              {isHindi ? 'राष्ट्रीय हेल्पलाइन 14446 / 14416 लिंक' : 'Tele-MANAS & 14446 Integrated'}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-300" />
              {isHindi ? 'परिवार व युवाओं के लिए समर्पित' : 'Family & Youth Centric'}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {isHindi ? 'हमारा दृष्टिकोण' : 'Our Comprehensive Approach'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isHindi ? 'केवल जानकारी नहीं, बल्कि एक सुरक्षित पुल' : 'More Than Information — A Bridge to Recovery'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700">
            {isHindi
              ? 'संकल्प व्यक्ति, एआई-निर्देशित मार्गदर्शन और वास्तविक मानवीय विशेषज्ञों के बीच एक सहानुभूतिपूर्ण सेतु है।'
              : 'Sankalp acts as a secure, stigma-free bridge connecting personal reflection with AI coaching and genuine human care.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Self-Assessment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isHindi ? 'उत्तरदायी स्व-मूल्यांकन' : 'Responsible Self-Assessment'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isHindi
                ? 'सरल, गैर-दोषारोपण प्रश्नावली जो आपकी आदतों और जीवन पर प्रभाव को समझने में मदद करती है, बिना किसी चिकित्सकीय लेबल के।'
                : 'A confidential, validated questionnaire that helps identify habit severity and urges without shame, blaming, or false medical claims.'}
            </p>
            <button
              onClick={onStartAssessment}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-2"
            >
              <span>{isHindi ? 'मूल्यांकन प्रारंभ करें' : 'Start Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: 24/7 AI Chatbot */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isHindi ? '24/7 संकल्प साथी (AI Companion)' : '24/7 Empathetic Companion'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isHindi
                ? 'हिंदी, अंग्रेजी और हिंग्लिश में बात करने वाला संवेदनशील साथी। तलब (cravings) प्रबंधन, सांस लेने के व्यायाम और सकारात्मक प्रेरणा।'
                : 'Culturally responsive AI speaking Hindi, English, and Hinglish. Equipped with strict crisis safety rules to immediately intervene in emergencies.'}
            </p>
            <button
              onClick={onStartChat}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-2"
            >
              <span>{isHindi ? 'साथी से जुड़ें' : 'Chat with Sathi'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Directory & Medical Referral */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isHindi ? 'सत्यापित हेल्पलाइन व केंद्र' : 'Verified Helplines & IRCA Centers'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isHindi
                ? 'टेली-मानस (14416), नशा मुक्ति (14446), एम्स, निमहंस और राज्य-वार आईआरसीए पुनर्वास केंद्रों की वास्तविक संपर्क जानकारी।'
                : 'Real-world, verified Indian public helplines, government-funded Integrated Rehabilitation Centres (IRCA), and psychiatric hospitals.'}
            </p>
            <button
              onClick={onExploreDirectory}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 pt-2"
            >
              <span>{isHindi ? 'केंद्र खोजें' : 'Browse Directory'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Nasha Mukt Bharat Pledge Card */}
      <section className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-teal-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>{isHindi ? 'नशा मुक्त भारत राष्ट्रीय संकल्प' : 'Nasha Mukt Bharat Abhiyaan Pledge'}</span>
          </div>
          <blockquote className="text-slate-800 font-medium text-sm sm:text-base italic border-l-4 border-teal-600 pl-4 py-1">
            {isHindi
              ? '“मैं यह संकल्प लेता/लेती हूँ कि मैं अपने देश, समाज और परिवार को नशा मुक्त बनाने में योगदान दूंगा। स्वयं स्वस्थ रहूँगा और दूसरों को सहारा प्रदान करूँगा।”'
              : '“I resolve to stand for a healthy, addiction-free nation. Today, I choose life, hope, and support for myself, my family, and my community.”'}
          </blockquote>
          <p className="text-xs text-slate-700">
            {isHindi 
              ? '— सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार की भावना के अनुरूप'
              : '— In resonance with Ministry of Social Justice and Empowerment, Government of India'}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{isHindi ? 'अपना व्यक्तिगत संकल्प दर्ज करें' : 'Take Your Personal Pledge'}</span>
          </button>
          <span className="text-[11px] text-center text-slate-700">
            {isHindi ? '100% नि:शुल्क एवं सुरक्षित खाता' : 'Free, Private & Confidential'}
          </span>
        </div>
      </section>
    </div>
  );
};
