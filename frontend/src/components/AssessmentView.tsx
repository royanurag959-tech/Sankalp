import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  MessageSquareHeart, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { api } from '../api';
import { Question, AssessmentResponse } from '../types';

interface AssessmentViewProps {
  onNavigate: (tab: string) => void;
  lang: string;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onNavigate, lang }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { optionIndex: number; text: string; score: number }>>({});
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isHindi = lang === 'hi';

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await api.getAssessmentQuestions();
        setQuestions(res.questions);
      } catch (err) {
        console.error('Failed to load assessment questions', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleSelectOption = (questionId: number, optionIndex: number, text: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { optionIndex, text, score }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = questions.map(q => {
      const selected = answers[q.id];
      return {
        question_id: q.id,
        question_text: q.question,
        selected_option_index: selected ? selected.optionIndex : 0,
        selected_option_text: selected ? selected.text : 'None',
        score: selected ? selected.score : 0,
      };
    });

    try {
      setSubmitting(true);
      const res = await api.submitAssessment(formattedAnswers);
      setResult(res);
    } catch (err) {
      console.error('Error submitting assessment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          {isHindi ? 'प्रश्नावली लोड हो रही है...' : 'Loading confidential assessment...'}
        </p>
      </div>
    );
  }

  // Result View
  if (result) {
    const getBadgeColor = (level: string) => {
      switch (level) {
        case 'Low':
          return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        case 'Mild':
          return 'bg-amber-100 text-amber-800 border-amber-300';
        case 'Moderate':
          return 'bg-orange-100 text-orange-800 border-orange-300';
        case 'High':
          return 'bg-rose-100 text-rose-800 border-rose-300';
        default:
          return 'bg-teal-100 text-teal-800 border-teal-300';
      }
    };

    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
        
        {/* Header result banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {isHindi ? 'आपका स्व-मूल्यांकन परिणाम' : 'Confidential Assessment Summary'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'सहानुभूतिपूर्ण, गैर-न्यायिक मार्गदर्शन' : 'Educational feedback & supportive steps'}
                </p>
              </div>
            </div>

            <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${getBadgeColor(result.risk_level)}`}>
              {result.risk_level} {isHindi ? 'स्तर' : 'Risk Profile'}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-slate-900">
              {result.risk_title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {result.risk_description}
            </p>
          </div>

          {result.immediate_action && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {isHindi ? 'अनुशंसित अगला कदम:' : 'Recommended Immediate Action:'}
                </span>
                <span>{result.immediate_action}</span>
              </div>
            </div>
          )}

          {/* Recommendations list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'व्यक्तिगत शैक्षिक सुझाव (Recommendations)' : 'Personalized Recovery Guidance'}
            </h4>
            <div className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Helplines Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 space-y-3">
            <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-teal-700" />
              {isHindi ? 'सत्यापित मानवीय सहायता हेल्पलाइन' : 'Verified Human Support Helplines'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.helplines.map((h, i) => (
                <a
                  key={i}
                  href={`tel:${h.number.replace(/\D/g, '')}`}
                  className="bg-white p-3 rounded-xl border border-teal-200/80 hover:border-teal-400 hover:shadow-xs transition flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{h.name}</p>
                    <p className="text-[11px] text-slate-500">{h.hours}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold">
                    {h.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {result.disclaimer}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('chat')}
              className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>{isHindi ? 'संकल्प साथी से इस बारे में बात करें' : 'Discuss with Sankalp Sathi AI'}</span>
            </button>

            <button
              onClick={() => onNavigate('directory')}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              {isHindi ? 'निकटतम केंद्र खोजें' : 'Browse Local Centers'}
            </button>

            <button
              onClick={handleRestart}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs transition"
              title="Retake questionnaire"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Questionnaire View
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isHindi ? '100% गोपनीय व सुरक्षित' : 'Completely Confidential & Non-Judgmental'}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          {isHindi ? 'संकल्प स्व-मूल्यांकन' : 'Sankalp Self-Assessment'}
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {isHindi
            ? 'अपनी आदतों और जीवनशैली को समझने के लिए 8 सरल प्रश्नों का उत्तर दें। यह कोई मेडिकल जांच नहीं है।'
            : 'Answer 8 simple questions to reflect on your habits and health. Zero blame, zero medical labeling.'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>{isHindi ? `प्रश्न ${currentIndex + 1} / ${questions.length}` : `Question ${currentIndex + 1} of ${questions.length}`}</span>
          <span>{progressPercent}% {isHindi ? 'पूर्ण' : 'Completed'}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
            {currentQuestion.category}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {isHindi ? currentQuestion.question_hi : currentQuestion.question}
          </h3>
          <p className="text-xs text-slate-400">
            {isHindi ? currentQuestion.question : currentQuestion.question_hi}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = currentAnswer?.optionIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.id, idx, opt.text, opt.score)}
                className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 text-teal-900 shadow-xs ring-2 ring-teal-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{opt.text}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                  isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'पिछला' : 'Previous'}</span>
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || currentAnswer === undefined}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>{isHindi ? 'विश्लेषण जारी...' : 'Analyzing...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isHindi ? 'परिणाम देखें' : 'View Results'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={currentAnswer === undefined}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isHindi ? 'अगला प्रश्न' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Safety Note */}
      <div className="text-center text-[11px] text-slate-700 max-w-sm mx-auto">
        {isHindi
          ? 'आपका डेटा डिवाइस पर सुरक्षित है। हम कभी किसी को आपकी पहचान या उत्तर साझा नहीं करते।'
          : 'Your privacy is honored. We never share answers or personal identity with anyone.'}
      </div>

    </div>
  );
};
