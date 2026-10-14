import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Flame, 
  Award, 
  Trash2, 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  CheckCircle2, 
  X, 
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { api } from '../api';
import { Checkin, TrackerStats } from '../types';

interface TrackerViewProps {
  lang: string;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ lang }) => {
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [mood, setMood] = useState(3);
  const [craving, setCraving] = useState(2);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const isHindi = lang === 'hi';

  const triggerOptions = isHindi ? [
    'तनाव (Stress)',
    'थकान (Fatigue)',
    'अकेलापन (Loneliness)',
    'सामाजिक दबाव (Peer Pressure)',
    'ऊब (Boredom)',
    'चिड़चिड़ापन (Anger/Frustration)'
  ] : [
    'Work Stress',
    'Fatigue / Lack of Sleep',
    'Loneliness',
    'Social Party / Friends',
    'Boredom',
    'Anxiety or Restlessness'
  ];

  const activityOptions = isHindi ? [
    'गहरी सांस (4-7-8 Breathing)',
    'योग / कसरत (Exercise)',
    'दोस्त से बात की (Connected with Friend)',
    'खूब पानी पिया (Hydrated)',
    'जर्नल लिखा (Journaling)',
    'हेल्पलाइन से मार्गदर्शन लिया'
  ] : [
    '4-7-8 Breathing Practiced',
    'Walk / Physical Exercise',
    'Called a Trusted Friend',
    'Cold Water / Hydration',
    'Written in Journal',
    'Listened to Music / Meditated'
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, checkinsData] = await Promise.all([
        api.getTrackerStats(),
        api.getCheckins(),
      ]);
      setStats(statsData);
      setCheckins(checkinsData);
    } catch (err) {
      console.error('Failed to load tracker data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTrigger = (t: string) => {
    setSelectedTriggers(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleToggleActivity = (a: string) => {
    setSelectedActivities(prev => 
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const handleSaveCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const todayStr = new Date().toISOString().split('T')[0];
      await api.createCheckin({
        checkin_date: todayStr,
        mood,
        craving_intensity: craving,
        triggers: selectedTriggers,
        activities_completed: selectedActivities,
        notes: notes.trim() || undefined
      });
      setModalOpen(false);
      setNotes('');
      setSelectedTriggers([]);
      setSelectedActivities([]);
      await loadData();
    } catch (err) {
      console.error('Failed to save checkin', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCheckin = async (id: number) => {
    if (!window.confirm(isHindi ? 'क्या आप इस रिकॉर्ड को हटाना चाहते हैं?' : 'Delete this check-in entry?')) {
      return;
    }
    try {
      await api.deleteCheckin(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete checkin', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header with Streak & CTA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-700">
              {isHindi ? 'दैनिक रिकवरी ट्रैकर' : 'Daily Recovery Tracker'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isHindi ? 'अपनी शक्ति और संकल्प को मापें' : 'Track Your Strengths & Habits'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
            {isHindi
              ? 'दैनिक मनोदशा (Mood) और तलब (Craving) का रिकॉर्ड रखें। रिकवरी एक सीख है — बिना किसी अपराधबोध के आगे बढ़ें।'
              : 'Log daily moods, urges, and trigger habits. Healing is a compassionate process — no guilt, no pressure.'}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center shrink-0">
            <div className="flex items-center justify-center text-amber-600 mb-1">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats?.current_streak_days || 1}
            </div>
            <p className="text-[10px] uppercase font-bold text-amber-800">
              {isHindi ? 'दिन की लड़ी' : 'Days Streak'}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 md:flex-none py-3.5 px-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isHindi ? 'आज का चेक-इन' : 'Record Check-in'}</span>
          </button>
        </div>
      </div>

      {/* Zero Guilt Supportive Reminder */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
        <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
        <p className="leading-relaxed">
          <span className="font-bold block">
            {isHindi ? 'सहानुभूति संदेश (Zero Guilt Principle):' : 'The Sankalp Zero-Guilt Promise:'}
          </span>
          {stats?.encouragement_message || (isHindi 
            ? 'यदि कभी चूक भी हो जाए, तो भी आपकी अब तक की यात्रा व्यर्थ नहीं हुई। आज का दिन एक नई शुरुआत है।'
            : 'If you miss a day or encounter a bump, you have not failed. Recovery is about self-compassion and resilience.')}
        </p>
      </div>

      {/* Progress Chart (Recharts) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'प्रगति और तलब की प्रवृत्तियां (Mood & Craving Trends)' : '14-Day Mood & Craving Trends'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? 'मनोदशा (1-5) और तलब तीव्रता (0-10) का ग्राफ' : 'Visualizing your emotional resilience and calm'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-teal-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              {isHindi ? 'मूड (1-5)' : 'Mood (1-5)'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {isHindi ? 'तलब (0-10)' : 'Craving (0-10)'}
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          {stats?.chart_data && stats.chart_data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCraving" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMood)" name="Mood Rating" />
                <Area type="monotone" dataKey="craving" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCraving)" name="Craving Intensity" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-medium">
                {isHindi ? 'चार्ट देखने के लिए अपना पहला चेक-इन दर्ज करें।' : 'Record your first check-in above to visualize trends!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestone Achievements */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-600" />
          <span>{isHindi ? 'उपलब्धि मील के पत्थर (Milestones)' : 'Milestone Badges'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats?.milestones.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition ${
                m.unlocked
                  ? 'bg-gradient-to-b from-amber-50 to-teal-50 border-amber-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                m.unlocked ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-200 text-slate-400'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">{m.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checkin History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          {isHindi ? 'हालिया चेक-इन रिकॉर्ड्स' : 'Recent Check-in Logs'}
        </h3>

        {checkins.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {isHindi ? 'अभी कोई चेक-इन नहीं मिला।' : 'No check-in entries yet. Start by logging today!'}
          </p>
        ) : (
          <div className="space-y-3">
            {checkins.slice(0, 7).map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-800">
                      {c.checkin_date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {isHindi ? `मूड: ${c.mood}/5` : `Mood: ${c.mood}/5`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {isHindi ? `तलब: ${c.craving_intensity}/10` : `Craving: ${c.craving_intensity}/10`}
                    </span>
                  </div>

                  {c.notes && (
                    <p className="text-xs text-slate-600 italic">
                      “{c.notes}”
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {c.activities_completed.map((act, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCheckin(c.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Checkin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-teal-200" />
                <span>{isHindi ? 'दैनिक संकल्प चेक-इन' : 'Log Today\'s Recovery Check-in'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCheckin} className="p-6 space-y-5">
              
              {/* Mood 1 to 5 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isHindi ? '1. आज आपकी मनोदशा (Mood) कैसी है?' : '1. How is your overall mood today?'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { val: 1, label: isHindi ? 'उदास' : 'Low', icon: Frown, color: 'text-rose-500' },
                    { val: 2, label: isHindi ? 'बेचैन' : 'Uneasy', icon: Meh, color: 'text-amber-500' },
                    { val: 3, label: isHindi ? 'सामान्य' : 'Neutral', icon: Meh, color: 'text-slate-500' },
                    { val: 4, label: isHindi ? 'शांत' : 'Calm', icon: Smile, color: 'text-teal-500' },
                    { val: 5, label: isHindi ? 'उत्कृष्ट' : 'Great', icon: Smile, color: 'text-emerald-500' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = mood === item.val;
                    return (
                      <button
                        type="button"
                        key={item.val}
                        onClick={() => setMood(item.val)}
                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                          isSel ? 'border-teal-600 bg-teal-50 shadow-xs ring-2 ring-teal-500/20' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-[11px] font-bold text-slate-800">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Craving Slider (0 to 10) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isHindi ? '2. आज तलब (Craving) की तीव्रता कितनी रही?' : '2. Craving intensity today (0-10):'}
                  </label>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    craving >= 7 ? 'bg-rose-100 text-rose-800' : craving >= 4 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {craving} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={craving}
                  onChange={(e) => setCraving(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 ({isHindi ? 'बिलकुल नहीं' : 'None'})</span>
                  <span>5 ({isHindi ? 'मध्यम' : 'Moderate'})</span>
                  <span>10 ({isHindi ? 'अत्यधिक तीव्र' : 'Severe'})</span>
                </div>
              </div>

              {/* Triggers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isHindi ? '3. क्या किसी ट्रिगर का सामना हुआ?' : '3. Any emotional or social triggers today?'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {triggerOptions.map((trig, i) => {
                    const isSel = selectedTriggers.includes(trig);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleToggleTrigger(trig)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                          isSel ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {trig}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Healthy Activities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isHindi ? '4. आपने कौन सी सकारात्मक गतिविधियां कीं?' : '4. Healthy coping activities completed:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.map((act, i) => {
                    const isSel = selectedActivities.includes(act);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleToggleActivity(act)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                          isSel ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reflection note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? '5. अपनी भावना या आज का संकल्प लिखें (वैकल्पिक)' : '5. Personal reflection or gratitude note (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isHindi ? 'आज मैंने शांत रहने का निर्णय लिया...' : 'Today I stayed strong during evening fatigue...'}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'चेक-इन सहेजें' : 'Save Check-in')}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
