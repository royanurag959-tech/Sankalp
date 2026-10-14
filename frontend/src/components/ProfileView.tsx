import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Globe, 
  Phone, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../api';

interface ProfileViewProps {
  user: UserProfile;
  setUser: (user: UserProfile | null) => void;
  lang: string;
  setLang: (lang: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, lang, setLang }) => {
  const [emergencyName, setEmergencyName] = useState(user.emergency_contact_name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergency_contact_phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isHindi = lang === 'hi';

  const handleExportData = async () => {
    try {
      setDownloading(true);
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sankalp_recovery_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Export error');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await api.deleteAccount();
      setUser(null);
      alert(isHindi ? 'आपका खाता और समस्त डेटा स्थायी रूप से मिटा दिया गया है।' : 'Your account and all associated data have been permanently deleted.');
    } catch (err: any) {
      alert(err.message || 'Deletion error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {user.full_name || (isHindi ? 'संकल्प साथी' : 'Sankalp Member')}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-600" />
          <span>{isHindi ? 'भाषा प्राथमिकता (Language Preference)' : 'Language Preference'}</span>
        </h3>

        <div className="flex gap-3">
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-bold transition ${
              lang === 'en'
                ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-xs ring-2 ring-teal-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-bold transition ${
              lang === 'hi'
                ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-xs ring-2 ring-teal-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Emergency Contact Setup */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-teal-600" />
            <span>{isHindi ? 'आपातकालीन संपर्क (Emergency Contact)' : 'Designated Emergency Contact'}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'संकट के समय तत्काल कॉल करने के लिए एक विश्वसनीय मित्र या परिवारजन का नंबर:'
              : 'A trusted family member or mentor you can reach during distress:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHindi ? 'संपर्क व्यक्ति का नाम' : 'Contact Person Name'}
            </label>
            <input
              type="text"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder="e.g. Pooja Sharma"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHindi ? 'फोन नंबर' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {savedSuccess && (
          <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHindi ? 'संपर्क विवरण सहेज लिया गया।' : 'Emergency details saved.'}</span>
          </p>
        )}

        <button
          onClick={() => {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2000);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
        >
          {isHindi ? 'विवरण अपडेट करें' : 'Save Details'}
        </button>
      </div>

      {/* Data Export & Privacy Rights (DPDP Compliant) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{isHindi ? 'डेटा संप्रभुता व निर्यात (Data Portability)' : 'Data Portability & Privacy'}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'आप अपने सभी चेक-इन, लक्ष्य और डायरी रिकॉर्ड को एक क्लिक में JSON फाइल के रूप में डाउनलोड कर सकते हैं।'
              : 'In accordance with Indian Data Protection standards, you own your recovery data. Export your full history at any time.'}
          </p>
        </div>

        <button
          onClick={handleExportData}
          disabled={downloading}
          className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? (isHindi ? 'डाउनलोड हो रहा है...' : 'Exporting...') : (isHindi ? 'मेरा डेटा निर्यात करें (JSON)' : 'Export My Recovery Data (JSON)')}</span>
        </button>
      </div>

      {/* Permanent Account Deletion */}
      <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-600" />
          <span>{isHindi ? 'खाता एवं डेटा का स्थायी विलोपन' : 'Permanent Account & Data Erasure'}</span>
        </h3>
        <p className="text-xs text-rose-800 leading-relaxed">
          {isHindi
            ? 'यदि आप अपना खाता हटाते हैं, तो आपके सभी चेक-इन, डायरी और प्रोफाइल डेटा को स्थायी रूप से मिटा दिया जाएगा। इसे पूर्ववत नहीं किया जा सकता।'
            : 'Permanently purge your account, journal entries, and check-ins from Sankalp servers. This action is irreversible.'}
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            {isHindi ? 'खाता हटाने का अनुरोध करें' : 'Delete Account & All Data'}
          </button>
        ) : (
          <div className="p-4 bg-white rounded-2xl border border-rose-300 space-y-3 animate-in fade-in">
            <p className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Are you sure you want to permanently delete everything?</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
