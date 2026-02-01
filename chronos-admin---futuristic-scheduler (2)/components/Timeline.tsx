
import React from 'react';
import { Schedule, ThemeType } from '../types';

interface TimelineProps {
  schedules: Schedule[];
  theme: ThemeType;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ schedules, theme, isAdmin, onDelete }) => {
  const sorted = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

  if (schedules.length === 0) {
    return (
      <div className="glass-panel rounded-[2rem] p-20 text-center border-dashed border-white/10 group">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 opacity-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mono text-sm opacity-40 uppercase tracking-[0.3em] text-white">কোনো শিডিউল পাওয়া যায়নি</h3>
        <p className="text-xs opacity-20 mt-2 font-light text-white">সিস্টেমে কোনো তথ্য রেকর্ড করা নেই।</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-12">
      {sorted.map((item) => (
        <div key={item.id} className="group relative flex gap-8 items-start">
          <div className="flex flex-col items-center pt-2 w-16 shrink-0">
            <div className="mono text-[11px] font-black text-cyan-400 mb-3 tracking-tighter">{item.time}</div>
            <div className="w-[2px] h-full bg-gradient-to-b from-cyan-500/40 via-cyan-500/5 to-transparent"></div>
          </div>

          <div className="flex-1">
            <div className="glass-panel group-hover:bg-white/[0.04] transition-all duration-700 rounded-[2rem] p-8 cyber-border group-hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className={`mono text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border inline-block ${getCatStyle(item.category)}`}>
                    {getCatName(item.category)}
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                {isAdmin && (
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              <p className="text-slate-400 text-base leading-relaxed font-light">
                {item.description}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                <div className="w-1.5 h-1.5 rotate-45 border border-cyan-500/40"></div>
                <div className="w-1.5 h-1.5 rotate-45 bg-cyan-500"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getCatName = (c: string) => {
  if (c === 'urgent') return 'জরুরি';
  if (c === 'work') return 'কাজ';
  if (c === 'break') return 'বিরতি';
  return 'ব্যক্তিগত';
};

const getCatStyle = (c: string) => {
  if (c === 'urgent') return 'text-red-400 border-red-500/20 bg-red-500/5';
  if (c === 'work') return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
  if (c === 'break') return 'text-green-400 border-green-500/20 bg-green-500/5';
  return 'text-slate-400 border-white/10 bg-white/5';
};
