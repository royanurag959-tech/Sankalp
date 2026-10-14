import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  PhoneCall, 
  ShieldCheck, 
  Info, 
  Globe, 
  Trash2,
  HeartHandshake
} from 'lucide-react';
import { api } from '../api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isCrisis?: boolean;
  crisisBanner?: any;
  mode?: string;
  disclaimer?: string;
  timestamp: string;
}

interface ChatViewProps {
  onNavigate: (tab: string) => void;
  lang: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ onNavigate, lang }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLang, setChatLang] = useState<'en' | 'hi' | 'hinglish'>(lang === 'hi' ? 'hi' : 'en');
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHindi = chatLang === 'hi';

  const defaultGreeting: Message = {
    id: 'msg_welcome',
    role: 'assistant',
    content: chatLang === 'hi'
      ? 'नमस्ते! मैं "संकल्प साथी" हूँ — आपका संवेदनशील एवं गोपनीय रिकवरी साथी। मैं यहाँ आपकी बात सुनने, तनाव व तलब (cravings) को प्रबंधित करने और सही रास्ते पर चलने में मदद करने के लिए हूँ। आज आप कैसा महसूस कर रहे हैं?'
      : 'Hello! I am "Sankalp Sathi", your empathetic and confidential AI recovery companion. I am here to listen without judgment, share evidence-based coping strategies for cravings, and walk beside you in your recovery journey. How are you feeling today?',
    mode: 'demo',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  useEffect(() => {
    setMessages([defaultGreeting]);
  }, [chatLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(sessionId, text, chatLang);
      const botMsg: Message = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: res.reply,
        isCrisis: res.is_crisis,
        crisisBanner: res.crisis_banner,
        mode: res.mode,
        disclaimer: res.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const errorMsg: Message = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: isHindi 
          ? 'माफ़ कीजिये, संदेश भेजने में अस्थायी रुकावट आई। कृपया दोबारा प्रयास करें।'
          : 'I encountered a brief connection issue. Please feel free to try sending your message again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = isHindi ? [
    'मुझे बहुत तेज़ तलब (craving) हो रही है, क्या करूँ?',
    'गलती से चूक (relapse) हो गई, बहुत अपराधबोध है',
    'शांति पाने के लिए 4-7-8 श्वास तकनीक समझाएं',
    'परिवार को अपनी आदत के बारे में कैसे बताऊं?'
  ] : [
    'I am fighting a strong craving right now, help me ride it out',
    'I experienced a slip/setback and feel terrible guilt',
    'Guide me through a calming breathing exercise',
    'How do I find certified de-addiction centers in India?'
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] min-h-[550px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-teal-500/30 border border-teal-300/40 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-teal-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {isHindi ? 'संकल्प साथी (Sankalp Sathi)' : 'Sankalp Sathi AI'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-white/10 text-teal-200 border border-white/10">
                {isHindi ? '24/7 सहयोगी' : 'Peer Companion'}
              </span>
            </div>
            <p className="text-[11px] text-teal-200 font-normal">
              {isHindi ? 'गोपनीय, गैर-न्यायिक और सहानुभूतिपूर्ण' : 'Confidential • Non-judgmental • Trauma-informed'}
            </p>
          </div>
        </div>

        {/* Language selector & reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setChatLang('en')}
              className={`px-2 py-1 rounded-md transition ${chatLang === 'en' ? 'bg-white text-teal-900' : 'text-teal-100 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setChatLang('hi')}
              className={`px-2 py-1 rounded-md transition ${chatLang === 'hi' ? 'bg-white text-teal-900' : 'text-teal-100 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => setMessages([defaultGreeting])}
            className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Disclaimers Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {isHindi
              ? 'संकल्प साथी एक एआई साथी है, कोई डॉक्टर या मनोचिकित्सक नहीं। आपातकाल में 14416 या 112 डायल करें।'
              : 'AI Peer Companion. Not a licensed doctor or clinic. For crisis, call Tele-MANAS (14416) or 112.'}
          </span>
        </div>

        <button
          onClick={() => onNavigate('directory')}
          className="text-teal-700 font-bold hover:underline shrink-0 flex items-center gap-1 text-[11px]"
        >
          <PhoneCall className="w-3 h-3" />
          <span>{isHindi ? 'मानव काउंसलर' : 'Human Counselor'}</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-xs shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Crisis Emergency Banner inside Chat */}
                {msg.isCrisis && msg.crisisBanner && (
                  <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-rose-800 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{msg.crisisBanner.title}</span>
                    </div>
                    <p className="text-[11px] text-rose-900 leading-tight">
                      {msg.crisisBanner.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {msg.crisisBanner.helplines.map((h: any, idx: number) => (
                        <a
                          key={idx}
                          href={`tel:${h.number}`}
                          className="flex items-center justify-between p-2 bg-white rounded-lg border border-rose-200 hover:border-rose-400 text-xs transition"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{h.name}</span>
                            <span className="text-[10px] text-slate-500">{h.desc}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-rose-600 text-white font-black rounded text-xs ml-2">
                            {h.number}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clearly labeled Demo Mode badge */}
                {!isUser && msg.mode && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      {msg.mode === 'gemini_live' ? 'Live Gemini Engine' : 'Sankalp Contextual Engine (Safe Demo Mode)'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>

              {isUser && (
                <span className="text-[10px] text-slate-400 pr-1">{msg.timestamp}</span>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-3.5 bg-white rounded-2xl border border-slate-200 max-w-[200px] shadow-xs">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-teal-700 animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-slate-400 ml-1">
              {isHindi ? 'साथी विचार कर रहा है...' : 'Thinking empathetically...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-full text-xs text-slate-600 hover:text-teal-800 whitespace-nowrap transition shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isHindi
                ? 'अपनी भावनाएं, तनाव या सवाल साझा करें...'
                : 'Share your thoughts, cravings, or ask for guidance...'
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 sm:px-5 sm:py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{isHindi ? 'भेजें' : 'Send'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
