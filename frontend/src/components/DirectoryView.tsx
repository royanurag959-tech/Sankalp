import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  PhoneCall, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Plus, 
  Sparkles, 
  ExternalLink,
  Bot,
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from '../api';
import { DirectoryResource, TinyFishFetchResult, TinyFishStatus } from '../types';

interface DirectoryViewProps {
  lang: string;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ lang }) => {
  const [resources, setResources] = useState<DirectoryResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [loading, setLoading] = useState(true);

  // TinyFish Web Verification Inspector Modal
  const [tinyFishModalOpen, setTinyFishModalOpen] = useState(false);
  const [tinyFishStatus, setTinyFishStatus] = useState<TinyFishStatus | null>(null);
  const [portalUrl, setPortalUrl] = useState('https://nmba.dosje.gov.in');
  const [tinyFishResults, setTinyFishResults] = useState<TinyFishFetchResult[]>([]);
  const [tinyFishLoading, setTinyFishLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Community Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResCategory, setNewResCategory] = useState('Rehab Center');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResState, setNewResState] = useState('Delhi');
  const [newResCity, setNewResCity] = useState('');
  const [newResNotes, setNewResNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isHindi = lang === 'hi';

  const categories = isHindi ? [
    'All',
    'National Helpline',
    'Rehab Center',
    'Hospital',
    'Counseling',
    'Support Group'
  ] : [
    'All',
    'National Helpline',
    'Rehab Center',
    'Hospital',
    'Counseling',
    'Support Group'
  ];

  const states = [
    'All',
    'All India (National)',
    'Delhi / NCR',
    'Maharashtra',
    'Karnataka',
    'Punjab',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal'
  ];

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await api.getDirectoryResources({
        query: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        state: selectedState !== 'All' ? selectedState : undefined
      });
      setResources(res);
    } catch (err) {
      console.error('Failed to load resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [searchQuery, selectedCategory, selectedState]);

  useEffect(() => {
    const checkTinyFish = async () => {
      try {
        const s = await api.getTinyFishStatus();
        setTinyFishStatus(s);
      } catch (err) {
        console.error('TinyFish status error', err);
      }
    };
    checkTinyFish();
  }, []);

  const handleRunTinyFish = async () => {
    if (!portalUrl) return;
    try {
      setTinyFishLoading(true);
      setImportSuccess(null);
      const res = await api.fetchWithTinyFish([portalUrl]);
      setTinyFishResults(res);
    } catch (err: any) {
      alert(err.message || 'TinyFish extraction error');
    } finally {
      setTinyFishLoading(false);
    }
  };

  const handleImportTinyFishItem = async (item: TinyFishFetchResult) => {
    try {
      await api.importTinyFishResult(item, 'Rehab Center', 'All India (National)', 'Pan-India');
      setImportSuccess(item.extracted_title || 'Resource imported with Pending Human Review flag');
      await loadResources();
    } catch (err: any) {
      alert(err.message || 'Import error');
    }
  };

  const handleSubmitNewResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitResource({
        name: newResName,
        category: newResCategory,
        phone: newResPhone,
        state: newResState,
        city: newResCity || 'General',
        notes: newResNotes
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitModalOpen(false);
        setNewResName('');
        setNewResPhone('');
        setNewResCity('');
        setNewResNotes('');
      }, 1500);
      await loadResources();
    } catch (err: any) {
      alert(err.message || 'Submission error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <PhoneCall className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-700">
              {isHindi ? 'सत्यापित संपर्क डायरेक्टरी' : 'Verified Care & Helpline Directory'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isHindi ? 'मदद के हाथ हमेशा आपके पास' : 'Reliable Indian Support Services'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            {isHindi
              ? 'आधिकारिक सरकारी हेल्पलाइन (14416 / 14446), एम्स, निमहंस और प्रमाणित आईआरसीए पुनर्वास केंद्रों की वास्तविक संपर्क जानकारी।'
              : 'Authentic contact information for government toll-free helplines, apex hospitals, and licensed IRCA centers across India.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* TinyFish Inspector Button */}
          <button
            onClick={() => setTinyFishModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-teal-300 rounded-2xl text-xs font-bold border border-teal-500/30 shadow-xs transition flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-teal-400" />
            <span>{isHindi ? 'TinyFish वेब अन्वेषक' : 'TinyFish Web Verifier'}</span>
          </button>

          {/* Add Resource Button */}
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'केंद्र जोड़ें (समीक्षा हेतु)' : 'Suggest Resource'}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'शहर, राज्य या केंद्र का नाम खोजें (उदा. Delhi, AIIMS, Tele-MANAS)...' : 'Search by name, city, state, or service (e.g., Delhi, NIMHANS, 14416)...'}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* State Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? (isHindi ? 'सभी राज्य (All India)' : 'All States') : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            {isHindi ? 'श्रेणी:' : 'Category:'}
          </span>
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  isSel
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">
            {isHindi ? 'डायरेक्टरी लोड हो रही है...' : 'Fetching verified listings...'}
          </p>
        </div>
      ) : resources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
          <PhoneCall className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">
            {isHindi ? 'कोई मेल नहीं मिला' : 'No matching resources found'}
          </p>
          <p className="text-xs text-slate-400">
            {isHindi ? 'कृपया अन्य खोज शब्द या राज्य चुनें।' : 'Try clearing filters or search for national helplines.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resources.map((res) => {
            const isVerified = res.verified_status === 'Verified';
            return (
              <div
                key={res.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700">
                          {res.category}
                        </span>
                        {isVerified ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {isHindi ? 'सत्यापित' : 'Verified Source'}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {isHindi ? 'मानव समीक्षा प्रतीक्षारत' : 'Pending Human Review'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {res.name}
                      </h3>
                    </div>
                  </div>

                  {res.address && (
                    <p className="text-xs text-slate-500 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{res.address}, {res.city}, {res.state}</span>
                    </p>
                  )}

                  {res.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      {res.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-teal-600" />
                      {res.operational_hours}
                    </span>
                    {res.verification_date && (
                      <span className="text-[10px] text-slate-400">
                        {isHindi ? `सत्यापित तिथि: ${res.verification_date}` : `Verified: ${res.verification_date}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${res.phone.replace(/\D/g, '')}`}
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'कॉल करें:' : 'Call:'} {res.phone}</span>
                  </a>

                  {res.website && (
                    <a
                      href={res.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Visit official website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TinyFish Web Verification Inspector Modal */}
      {tinyFishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-teal-900 text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>TinyFish Web Extraction Engine</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/30 text-teal-200 font-mono">
                      {tinyFishStatus?.mode || 'simulated_adapter'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-teal-200">
                    Official API: {tinyFishStatus?.endpoint || 'https://api.fetch.tinyfish.ai'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTinyFishModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Compliance & Status Notice */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-600">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Compliance & Responsible Verification Standard</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  TinyFish crawls authorized public government portals to retrieve official helpline phone numbers.
                  To ensure patient safety, all extracted resources are marked <strong className="text-amber-800 font-bold">"Pending Human Review"</strong> before public directory publication.
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select or enter public de-addiction portal URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={portalUrl}
                    onChange={(e) => setPortalUrl(e.target.value)}
                    placeholder="https://nmba.dosje.gov.in"
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleRunTinyFish}
                    disabled={tinyFishLoading || !portalUrl}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
                  >
                    {tinyFishLoading ? 'Extracting...' : 'Fetch via TinyFish'}
                  </button>
                </div>

                {/* Pre-sets */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                  <span className="text-slate-400 font-medium">Quick Presets:</span>
                  {[
                    { label: 'NMBA Portal', url: 'https://nmba.dosje.gov.in' },
                    { label: 'Tele-MANAS', url: 'https://telemanas.mohfw.gov.in' },
                    { label: 'NIMHANS CAM', url: 'https://nimhans.ac.in' },
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPortalUrl(p.url)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {importSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Imported successfully into review queue!</span>
                </div>
              )}

              {/* Extraction Results */}
              {tinyFishResults.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Extracted Data Preview ({tinyFishResults.length})
                  </h4>

                  {tinyFishResults.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">{item.extracted_title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          {item.verified_status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 flex flex-wrap gap-2">
                        <span><strong>Phone Contacts:</strong> {item.extracted_contacts.join(', ') || '14446'}</span>
                        <span>•</span>
                        <span><strong>Retrieved:</strong> {item.retrieved_at}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                        "{item.markdown_snippet}"
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleImportTinyFishItem(item)}
                          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Import to Review Queue</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Community Submit Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-200" />
                <span>{isHindi ? 'नया केंद्र सुझाव' : 'Suggest a Support Service'}</span>
              </h3>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewResource} className="p-6 space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {isHindi
                    ? 'सभी प्रविष्टियां जनता को दिखाए जाने से पहले प्रशासक द्वारा सत्यापित की जाती हैं।'
                    : 'All submissions are reviewed by administrators before being marked as verified in the public directory.'}
                </span>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
                  {isHindi ? 'धन्यवाद! आपकी प्रविष्टि समीक्षा के लिए भेज दी गई है।' : 'Thank you! Submitted for human verification.'}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Center / Helpline Name</label>
                <input
                  type="text"
                  required
                  value={newResName}
                  onChange={(e) => setNewResName(e.target.value)}
                  placeholder="e.g. LifeCare De-Addiction Center"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newResCategory}
                    onChange={(e) => setNewResCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Rehab Center">Rehab Center</option>
                    <option value="Counseling">Counseling</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Support Group">Support Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newResPhone}
                    onChange={(e) => setNewResPhone(e.target.value)}
                    placeholder="e.g. 011-23456789"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <select
                    value={newResState}
                    onChange={(e) => setNewResState(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    {states.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newResCity}
                    onChange={(e) => setNewResCity(e.target.value)}
                    placeholder="e.g. Lucknow"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Services Provided</label>
                <textarea
                  rows={2}
                  value={newResNotes}
                  onChange={(e) => setNewResNotes(e.target.value)}
                  placeholder="e.g. Inpatient detox, family counseling..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Submit for Verification
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
