import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Eye, 
  BookMarked, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square,
  Quote,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api';
import { JournalEntry } from '../types';

interface WellnessViewProps {
  lang: string;
}

export const WellnessView: React.FC<WellnessViewProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'affirmations' | 'journal'>('breathing');
  
  // Breathing Coach State
  const [selectedExercise, setSelectedExercise] = useState<'box' | 'relax478' | 'calm'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // Grounding Tool State
  const [groundingChecks, setGroundingChecks] = useState<Record<string, boolean>>({});

  // Journal State
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState('Hopeful');
  const [savingJournal, setSavingJournal] = useState(false);

  // Affirmations
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const isHindi = lang === 'hi';

  const affirmationsList = [
    {
      en: "I am stronger than any temporary craving. This wave will pass.",
      hi: "मैं किसी भी अस्थायी तलब से अधिक शक्तिशाली हूँ। यह लहर शांत हो जाएगी।"
    },
    {
      en: "Every healthy choice I make today is an investment in my tomorrow.",
      hi: "आज मेरा हर स्वस्थ निर्णय मेरे आने वाले कल की नींव है।"
    },
    {
      en: "I forgive myself for past mistakes and choose peace, clarity, and courage right now.",
      hi: "मैं अपने अतीत को क्षमा करता हूँ और वर्तमान में शांति, स्पष्टता और साहस चुनता हूँ।"
    },
    {
      en: "Healing is not about perfection, it is about staying true to my Sankalp.",
      hi: "सच्चा सुधार पूर्णता में नहीं, बल्कि अपने संकल्प के प्रति सच्चे रहने में है।"
    },
    {
      en: "Seeking help is a badge of profound bravery, never weakness.",
      hi: "सहायता मांगना कमजोरी नहीं, बल्कि गहन आंतरिक साहस का प्रमाण है।"
    }
  ];

  const exerciseConfigs = {
    box: {
      name: isHindi ? 'Box Breathing (4-4-4-4)' : 'Box Breathing (4-4-4-4)',
      desc: isHindi ? 'तंत्रिका तंत्र को शांत करने और तीव्र तनाव को तुरंत नियंत्रित करने का तरीका।' : 'Regulates the nervous system and rapidly curbs fight-or-flight adrenaline.',
      sequence: [
        { label: 'Inhale', label_hi: 'श्वास लें (Inhale)', duration: 4 },
        { label: 'Hold', label_hi: 'श्वास रोकें (Hold)', duration: 4 },
        { label: 'Exhale', label_hi: 'श्वास छोड़ें (Exhale)', duration: 4 },
        { label: 'Pause', label_hi: 'शांत रहें (Pause)', duration: 4 },
      ]
    },
    relax478: {
      name: isHindi ? '4-7-8 गहरी शांति तकनीक' : '4-7-8 Deep Relaxation',
      desc: isHindi ? 'डॉ. एंड्रयू वील द्वारा विकसित तकनीक जो हृदय गति को संतुलित करती है।' : 'Natural nervous system tranquilizer to soothe rapid heart rate and urges.',
      sequence: [
        { label: 'Inhale', label_hi: 'श्वास लें (Inhale)', duration: 4 },
        { label: 'Hold', label_hi: 'रोकें (Hold)', duration: 7 },
        { label: 'Exhale', label_hi: 'धीरे छोड़ें (Exhale)', duration: 8 },
      ]
    },
    calm: {
      name: isHindi ? 'संतुलित श्वास (5-5)' : 'Calming Resonant (5-5)',
      desc: isHindi ? 'अशांति और उलझन को दूर करने के लिए संतुलित 5 सेकंड श्वास तकनीक।' : 'Smooth, balanced breathing that brings heart rate variability into coherence.',
      sequence: [
        { label: 'Inhale', label_hi: 'श्वास लें (Inhale)', duration: 5 },
        { label: 'Exhale', label_hi: 'श्वास छोड़ें (Exhale)', duration: 5 },
      ]
    }
  };

  // Breathing Coach Timer Engine
  useEffect(() => {
    let timer: any = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft(prev => {
          if (prev <= 1) {
            // Advance to next step in sequence
            const seq = exerciseConfigs[selectedExercise].sequence;
            const currentStepIdx = seq.findIndex(s => s.label === phase);
            const nextIdx = (currentStepIdx + 1) % seq.length;
            if (nextIdx === 0) {
              setCycleCount(c => c + 1);
            }
            setPhase(seq[nextIdx].label as any);
            return seq[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, phase, selectedExercise]);

  const handleStartBreathing = () => {
    const seq = exerciseConfigs[selectedExercise].sequence;
    setPhase(seq[0].label as any);
    setPhaseSecondsLeft(seq[0].duration);
    setIsBreathingActive(true);
  };

  const handleResetBreathing = () => {
    setIsBreathingActive(false);
    const seq = exerciseConfigs[selectedExercise].sequence;
    setPhase(seq[0].label as any);
    setPhaseSecondsLeft(seq[0].duration);
    setCycleCount(0);
  };

  // Load Journals
  useEffect(() => {
    const loadJournals = async () => {
      try {
        const res = await api.getJournals();
        setJournals(res);
      } catch (err) {
        console.error('Failed to load journals', err);
      }
    };
    loadJournals();
  }, []);

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle.trim() || !journalContent.trim()) return;

    try {
      setSavingJournal(true);
      const newEntry = await api.createJournal(journalTitle.trim(), journalContent.trim(), journalMood);
      setJournals(prev => [newEntry, ...prev]);
      setJournalTitle('');
      setJournalContent('');
    } catch (err) {
      console.error('Failed to save journal', err);
    } finally {
      setSavingJournal(false);
    }
  };

  const handleDeleteJournal = async (id: number) => {
    try {
      await api.deleteJournal(id);
      setJournals(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      console.error('Failed to delete journal', err);
    }
  };

  const toggleGrounding = (key: string) => {
    setGroundingChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groundingSteps = [
    { id: 'see', count: 5, label: isHindi ? '5 चीजें जो आप अभी देख सकते हैं (उदा. कुर्सी, खिड़की, फोन)' : '5 Things you can SEE around you right now' },
    { id: 'touch', count: 4, label: isHindi ? '4 चीजें जिन्हें आप छू सकते हैं (उदा. मेज की सतह, अपने कपड़े)' : '4 Things you can physically TOUCH or feel' },
    { id: 'hear', count: 3, label: isHindi ? '3 आवाजें जो आप सुन सकते हैं (उदा. पंखे की सरसराहट, चिड़ियों की चहक)' : '3 Sounds you can HEAR in the distance' },
    { id: 'smell', count: 2, label: isHindi ? '2 गंध जो आप सूंघ सकते हैं (उदा. ताजी हवा, चाय, साबुन)' : '2 Things you can SMELL' },
    { id: 'say', count: 1, label: isHindi ? '1 सकारात्मक बात जो आप खुद से कह सकते हैं: "मैं सुरक्षित हूँ"' : '1 Positive truth: "I am safe and in control of this moment"' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isHindi ? 'मानसिक शांति व संतुलन' : 'Mental Wellness Sanctuary'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {isHindi ? 'कल्याण टूल्स एवं शांति अभ्यास' : 'Evidence-Based Wellness Tools'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {isHindi
            ? 'जब भी मन में अशांति या तलब उठे, वैज्ञानिक श्वास तकनीकों और ग्राउंडिंग से खुद को स्थिर करें।'
            : 'Interactive breathing coach, grounding exercises, and private reflections to soothe urges in minutes.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          {[
            { id: 'breathing', label: isHindi ? 'श्वास कोच' : 'Breathing Coach', icon: Wind },
            { id: 'grounding', label: isHindi ? '5-4-3-2-1 ग्राउंडिंग' : '5-4-3-2-1 Grounding', icon: Eye },
            { id: 'affirmations', label: isHindi ? 'प्रेरक विचार' : 'Affirmations', icon: Quote },
            { id: 'journal', label: isHindi ? 'निजी डायरी' : 'Private Journal', icon: BookMarked },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                  isSel
                    ? 'bg-white text-teal-800 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Interactive Breathing Coach */}
      {activeTab === 'breathing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8 animate-in fade-in duration-200">
          
          {/* Technique Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {(['box', 'relax478', 'calm'] as const).map((key) => {
              const cfg = exerciseConfigs[key];
              const isSel = selectedExercise === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedExercise(key);
                    setIsBreathingActive(false);
                    setCycleCount(0);
                    const seq = cfg.sequence;
                    setPhase(seq[0].label as any);
                    setPhaseSecondsLeft(seq[0].duration);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                    isSel
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cfg.name}
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-500 max-w-md mx-auto">
            {exerciseConfigs[selectedExercise].desc}
          </p>

          {/* Animated Visual Breathing Circle */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div 
                className={`absolute inset-0 rounded-full bg-teal-100/60 transition-transform duration-1000 ${
                  isBreathingActive && phase === 'Inhale' ? 'scale-110 opacity-80' : 'scale-90 opacity-40'
                }`}
              />

              {/* Core animated circle */}
              <div 
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-white flex flex-col items-center justify-center shadow-xl shadow-teal-500/20 transition-all duration-1000 transform ${
                  isBreathingActive && phase === 'Inhale' 
                    ? 'scale-110' 
                    : isBreathingActive && phase === 'Exhale'
                    ? 'scale-85'
                    : 'scale-100'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-black mb-1">
                  {phaseSecondsLeft}
                </span>
                <span className="text-sm font-bold tracking-widest uppercase text-teal-100">
                  {phase}
                </span>
                <span className="text-[10px] text-teal-200 mt-2 font-medium">
                  {isHindi ? `चक्र: ${cycleCount}` : `Cycles: ${cycleCount}`}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isBreathingActive ? (
              <button
                onClick={handleStartBreathing}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isHindi ? 'अभ्यास शुरू करें' : 'Start Breathing Coach'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsBreathingActive(false)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>{isHindi ? 'विराम (Pause)' : 'Pause'}</span>
              </button>
            )}

            <button
              onClick={handleResetBreathing}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Tab 2: 5-4-3-2-1 Sensory Grounding Tool */}
      {activeTab === 'grounding' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {isHindi ? '5-4-3-2-1 इंद्रिय संतुलन अभ्यास (Grounding for Urges)' : '5-4-3-2-1 Sensory Urge Surfing'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'जब भी तलब का तीव्र वेग महसूस हो, अपने मस्तिष्क को वर्तमान भौतिक दुनिया में लाएं। नीचे दिए गए प्रत्येक चरण को पूरा करें:'
                : 'Whenever an urge peaks, anchor your focus into current physical reality by completing each sensory step:'}
            </p>
          </div>

          <div className="space-y-3">
            {groundingSteps.map((step) => {
              const isDone = !!groundingChecks[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleGrounding(step.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {step.count}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold ${isDone ? 'line-through opacity-70' : ''}`}>
                      {step.label}
                    </span>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
            <span>
              {Object.values(groundingChecks).filter(Boolean).length} / 5 {isHindi ? 'चरण पूर्ण' : 'steps completed'}
            </span>
            <button
              onClick={() => setGroundingChecks({})}
              className="text-teal-700 font-bold hover:underline"
            >
              {isHindi ? 'रीसेट करें' : 'Reset steps'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Affirmations */}
      {activeTab === 'affirmations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6 text-center animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Quote className="w-6 h-6" />
          </div>

          <div className="space-y-4 max-w-xl mx-auto py-4">
            <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed italic">
              “{isHindi ? affirmationsList[affirmationIndex].hi : affirmationsList[affirmationIndex].en}”
            </p>
            <p className="text-xs text-slate-400">
              {isHindi ? affirmationsList[affirmationIndex].en : affirmationsList[affirmationIndex].hi}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setAffirmationIndex((affirmationIndex - 1 + affirmationsList.length) % affirmationsList.length)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              {isHindi ? 'पिछला' : 'Previous'}
            </button>
            <span className="text-xs text-slate-400 font-medium">
              {affirmationIndex + 1} / {affirmationsList.length}
            </span>
            <button
              onClick={() => setAffirmationIndex((affirmationIndex + 1) % affirmationsList.length)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
            >
              {isHindi ? 'अगला विचार' : 'Next Affirmation'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Private Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* New Entry Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-teal-600" />
                <span>{isHindi ? 'निजी एवं गोपनीय डायरी' : 'Private Encrypted-at-Rest Journal'}</span>
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isHindi ? '100% निजी' : '100% Private'}
              </span>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder={isHindi ? 'शीर्षक: आज की सीख या विचार...' : 'Title: Today\'s milestone or feeling...'}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-semibold"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder={isHindi ? 'अपनी भावनाएं बिना किसी संकोच के लिखें...' : 'Write freely about your day, challenges, victories, or feelings...'}
                  className="w-full p-4 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">{isHindi ? 'मूड टैग:' : 'Mood tag:'}</span>
                  {['Hopeful', 'Reflective', 'Peaceful', 'Challenged'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setJournalMood(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                        journalMood === tag ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={savingJournal || !journalTitle.trim() || !journalContent.trim()}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{savingJournal ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'डायरी सहेजें' : 'Save Entry')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Past Entries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              {isHindi ? 'पिछली प्रविष्टियां' : 'Saved Journal Entries'}
            </h4>

            {journals.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                {isHindi ? 'अभी कोई डायरी प्रविष्टि नहीं है। ऊपर से लिखना शुरू करें।' : 'No journal reflections saved yet. Start writing your thoughts above.'}
              </div>
            ) : (
              journals.map((j) => (
                <div
                  key={j.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{j.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">
                          {new Date(j.created_at).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          {j.mood_tag}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteJournal(j.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {j.content}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
