
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Timeline } from './components/Timeline';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { StatsPanel } from './components/StatsPanel';
import { Schedule, User, ThemeType } from './types';
import { GoogleGenAI } from '@google/genai';

const DATABASE_URL = "https://timeline-f6c84-default-rtdb.firebaseio.com/schedules.json";

const App: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeType>('cyber');
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ quote: string, productivity: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setSyncing(true);
      const response = await fetch(DATABASE_URL);
      if (!response.ok) throw new Error("Connection Error");
      
      const data = await response.json();
      if (data) {
        const scheduleArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key 
        }));
        setSchedules(scheduleArray);
        setError(null);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      console.error("Uplink failed:", err);
      setError("ডেটা সিঙ্ক হচ্ছে না");
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 5000);
    return () => clearInterval(interval);
  }, [fetchSchedules]);

  useEffect(() => {
    const user = localStorage.getItem('chronos_v2_user');
    if (user) setCurrentUser(JSON.parse(user));
    const t = localStorage.getItem('chronos_v2_theme') as ThemeType;
    if (t) setTheme(t);
  }, []);

  const saveSchedules = useCallback(async (newSchedules: Schedule[]) => {
    try {
      setSyncing(true);
      const response = await fetch(DATABASE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedules.reduce((acc, s) => ({ ...acc, [s.id]: s }), {}))
      });
      if (!response.ok) throw new Error("Data Sync Failed");
      setSchedules(newSchedules);
    } catch (err) {
      console.error("Save failed:", err);
      alert("ডেটা সংরক্ষণ করা যায়নি। সংযোগ চেক করুন।");
    } finally {
      setSyncing(false);
    }
  }, []);

  const handleUpdateTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('chronos_v2_theme', newTheme);
  };

  const currentTask = useMemo(() => {
    const nowStr = currentTime.toTimeString().slice(0, 5);
    return [...schedules]
      .sort((a,b) => a.time.localeCompare(b.time))
      .find(s => s.time >= nowStr) || schedules[0];
  }, [currentTime, schedules]);

  const runAI = async () => {
    if (schedules.length === 0 || !process.env.API_KEY) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this daily schedule and provide a futuristic motivation in Bengali: ${JSON.stringify(schedules)}. Return strictly in JSON format: {"quote": "your motivational quote in Bengali", "productivity": number 0-100}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      setAiAnalysis(JSON.parse(response.text));
    } catch (e) {
      console.warn("AI Sync Inactive.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(runAI, 5000);
    return () => clearTimeout(timer);
  }, [schedules.length]);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${theme === 'minimal' ? 'bg-slate-50 text-slate-900' : 'text-slate-100'}`}>
      <Navbar 
        user={currentUser} 
        onLoginClick={() => setShowLogin(true)} 
        onAdminClick={() => setShowAdmin(true)}
        onLogout={() => { setCurrentUser(null); localStorage.removeItem('chronos_v2_user'); }}
        theme={theme}
        onThemeChange={handleUpdateTheme}
      />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
          <div className="glass-panel rounded-[2.5rem] p-8 border-t border-cyan-500/20 cyber-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${syncing ? 'bg-amber-400 animate-pulse' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`}></div>
                <h2 className="mono text-[11px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
                  {syncing ? 'সিংক্রোনাইজিং...' : 'সিস্টেম অনলাইন'}
                </h2>
              </div>
              {error && <span className="text-[10px] text-red-500 mono animate-pulse">! সংযোগ ত্রুটি</span>}
            </div>
            
            <div className="space-y-5">
              <p className="text-2xl font-light italic leading-tight text-white/90">
                "{aiAnalysis?.quote || "আপনার দৈনন্দিন সময়রেখা বিশ্লেষণ করা হচ্ছে..."}"
              </p>
              <div className="h-[1px] bg-white/10 w-full"></div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] mono opacity-40 uppercase text-white">উৎপাদনশীলতা লেভেল</span>
                <span className="text-sm font-bold text-cyan-400">{aiAnalysis?.productivity || 0}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-1000" style={{ width: `${aiAnalysis?.productivity || 0}%` }}></div>
              </div>
            </div>
          </div>

          <StatsPanel schedules={schedules} currentTask={currentTask} />
          
          <div className="glass-panel rounded-[2rem] p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="mono text-[10px] opacity-40 uppercase tracking-widest text-white">গ্লোবাল নোড</h3>
               <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">প্রস্তুত</span>
             </div>
             <div className="space-y-3 bg-black/40 p-4 rounded-3xl border border-white/5">
                <StatusItem label="সোর্স" status="Firebase DB" color="text-white" />
                <StatusItem label="ক্লাউড" status="Netlify Edge" color="text-blue-400" />
                <StatusItem label="নিরাপত্তা" status="AES-256" color="text-green-400" />
             </div>
          </div>
        </aside>

        <main className="lg:col-span-8 order-1 lg:order-2">
          <header className="mb-16 relative">
            <h1 className="text-[12rem] font-black text-white/[0.02] absolute -top-24 -left-12 pointer-events-none select-none">সময়</h1>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-white">
              ক্রোনো<span className="text-cyan-500">স</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-px w-12 bg-cyan-500/50"></div>
               <span className="mono text-[11px] opacity-40 uppercase tracking-[0.4em] text-white">দৈনন্দিন সময়রেখা ডিসপ্লে</span>
            </div>
          </header>

          <Timeline 
            schedules={schedules} 
            theme={theme} 
            isAdmin={currentUser?.role === 'admin'}
            onDelete={(id) => saveSchedules(schedules.filter(s => s.id !== id))}
          />
        </main>
      </div>

      {showLogin && (
        <Login 
          onLogin={(u) => { setCurrentUser(u); localStorage.setItem('chronos_v2_user', JSON.stringify(u)); setShowLogin(false); }} 
          onClose={() => setShowLogin(false)} 
        />
      )}
      
      {showAdmin && (
        <AdminPanel 
          schedules={schedules} 
          onSave={saveSchedules} 
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
};

const StatusItem = ({ label, status, color }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] mono opacity-30 text-white">{label}</span>
    <span className={`text-[10px] font-bold uppercase ${color}`}>{status}</span>
  </div>
);

export default App;
