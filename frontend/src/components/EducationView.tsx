import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  ShieldAlert, 
  ChevronRight,
  RotateCw
} from 'lucide-react';
import { api } from '../api';

interface EducationViewProps {
  lang: string;
}

export const EducationView: React.FC<EducationViewProps> = ({ lang }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [myths, setMyths] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  const isHindi = lang === 'hi';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [arts, myts] = await Promise.all([
          api.getArticles(),
          api.getMythsFacts()
        ]);
        setArticles(arts.articles || []);
        setMyths(myts.myths_facts || []);
      } catch (err) {
        console.error('Failed to load education resources', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isHindi ? 'ज्ञान व जागरूकता पुस्तकालय' : 'Awareness & Science Library'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {isHindi ? 'सत्य जानें, कलंक तोड़ें' : 'Evidence-Based Recovery & Awareness'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {isHindi
            ? 'वैज्ञानिक तथ्यों, भ्रांति-निवारण (Myth vs Fact) और युवाओं के लिए कैंपस सुरक्षा दिशा-निर्देश।'
            : 'Explore the neurobiology of addiction, stages of change, and interactive myth-busting cards.'}
        </p>
      </div>

      {/* Myth vs Fact Interactive Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{isHindi ? 'भ्रांति बनाम सच (Myth vs Fact)' : 'Myth vs Fact Interactive Cards'}</span>
          </h3>
          <span className="text-xs text-slate-400">
            {isHindi ? 'कार्ड पर क्लिक करके सच जानें' : 'Click any card to reveal scientific fact'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myths.map((item) => {
            const isFlipped = !!flippedCards[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleFlip(item.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer min-h-[170px] flex flex-col justify-between select-none ${
                  isFlipped
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                      isFlipped ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isFlipped ? (isHindi ? 'वैज्ञानिक सच (FACT)' : 'SCIENTIFIC FACT') : (isHindi ? 'भ्रांति (MYTH)' : 'COMMON MYTH')}
                    </span>
                    <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    {isFlipped 
                      ? (isHindi ? item.fact_hi : item.fact)
                      : (isHindi ? item.myth_hi : item.myth)}
                  </p>
                </div>

                <div className="pt-3 text-[10px] font-bold text-slate-400 flex items-center justify-between">
                  <span>{isFlipped ? 'Click to see myth' : 'Click to flip card'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Articles */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>{isHindi ? 'शैक्षिक लेख व मार्गदर्शन' : 'In-Depth Educational Guides'}</span>
        </h3>

        <div className="space-y-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {art.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  {art.read_time} • {art.target_audience}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {isHindi ? art.title_hi : art.title}
              </h4>

              <p className="text-xs text-slate-500 font-medium">
                {art.summary}
              </p>

              <div className="bg-slate-50/80 p-4 rounded-2xl text-xs text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                {art.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nasha Mukt Bharat Mission Statement */}
      <div className="p-6 rounded-3xl bg-teal-900 text-white space-y-2 border border-teal-500/30">
        <div className="flex items-center gap-2 text-xs uppercase font-bold text-teal-300">
          <GraduationCap className="w-4 h-4" />
          <span>{isHindi ? 'राष्ट्रीय दृष्टिकोण' : 'National Vision'}</span>
        </div>
        <h4 className="text-base font-bold">
          {isHindi ? 'नशा मुक्त भारत अभियान (NMBA)' : 'Nasha Mukt Bharat Abhiyaan (NMBA)'}
        </h4>
        <p className="text-xs text-teal-100/90 leading-relaxed">
          {isHindi
            ? 'भारत सरकार के सामाजिक न्याय और अधिकारिता मंत्रालय का मुख्य लक्ष्य युवा पीढ़ी को नशा मुक्त, सशक्त और स्वस्थ बनाना है। 372 संवेदनशील जिलों में जागरूकता, परामर्श और निःशुल्क चिकित्सा पुनर्वास उपलब्ध कराया जा रहा है।'
            : 'Flagship initiative by the Ministry of Social Justice and Empowerment, Government of India, addressing substance use vulnerability across 372 priority districts through community sensitization, youth workshops, and integrated de-addiction infrastructure.'}
        </p>
      </div>

    </div>
  );
};
