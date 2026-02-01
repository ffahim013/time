
import React, { useState } from 'react';
import { Schedule } from '../types';

interface AdminPanelProps {
  schedules: Schedule[];
  onSave: (schedules: Schedule[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ schedules, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Schedule['category']>('work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !time) return;

    const newItem: Schedule = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      time,
      description,
      category,
      timestamp: Date.now()
    };

    onSave([...schedules, newItem]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative glass-panel w-full max-w-2xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Temporal Injection</h2>
              <p className="text-sm opacity-40 mono mt-1">MODIFYING ACTIVE TIMELINE_DATA</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="mono text-[10px] uppercase tracking-widest opacity-40 ml-1">Event Label</label>
              <input 
                autoFocus
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 focus:bg-white/[0.08] transition-all text-xl font-semibold"
                placeholder="What is happening?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="mono text-[10px] uppercase tracking-widest opacity-40 ml-1">Time Marker</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all text-white scheme-dark"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="mono text-[10px] uppercase tracking-widest opacity-40 ml-1">Category Class</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all text-white"
                >
                  <option value="work">System (Work)</option>
                  <option value="personal">Core (Personal)</option>
                  <option value="urgent">Critical (Urgent)</option>
                  <option value="break">Standby (Break)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="mono text-[10px] uppercase tracking-widest opacity-40 ml-1">Detailed Log</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all resize-none h-32"
                placeholder="Log event details..."
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-lg uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-[0.98]"
            >
              Commit to Timeline
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
