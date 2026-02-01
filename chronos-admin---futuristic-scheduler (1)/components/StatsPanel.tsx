
import React from 'react';
import { Schedule } from '../types';

interface StatsPanelProps {
  schedules: Schedule[];
  currentTask?: Schedule;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ schedules, currentTask }) => {
  const counts = schedules.reduce((acc: any, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="glass-panel rounded-[2rem] p-8 space-y-8">
      <div>
        <h3 className="mono text-[10px] opacity-40 uppercase tracking-[0.3em] mb-5">Active Vector</h3>
        {currentTask ? (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative p-5 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-cyan-400 mono font-bold">UPLINK_ON</span>
                <span className="text-[10px] mono opacity-30">{currentTask.time}</span>
              </div>
              <div className="text-xl font-bold truncate text-white">{currentTask.title}</div>
              <p className="text-[10px] opacity-40 mt-3 uppercase mono">Task class: {currentTask.category}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-[10px] mono opacity-30 text-center uppercase tracking-widest">
            Idle State
          </div>
        )}
      </div>

      <div>
        <h3 className="mono text-[10px] opacity-40 uppercase tracking-[0.3em] mb-5">Metric Data</h3>
        <div className="space-y-5">
          {Object.entries(counts).map(([cat, count]: [any, any]) => (
            <div key={cat} className="group">
              <div className="flex justify-between text-[11px] mono uppercase mb-2">
                <span className="opacity-60">{cat}</span>
                <span className="text-cyan-400 font-bold">{count}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-in-out" 
                  style={{ width: `${(count / schedules.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
             <div className="text-center py-4 border-2 border-dashed border-white/5 rounded-2xl">
               <span className="text-[10px] mono opacity-20 uppercase">Awaiting Data</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
