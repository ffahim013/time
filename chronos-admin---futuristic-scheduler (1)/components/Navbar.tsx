
import React from 'react';
import { User, ThemeType } from '../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onLogout: () => void;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onAdminClick, onLogout, theme, onThemeChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[90] p-6">
      <div className="max-w-7xl mx-auto glass-panel px-8 py-4 rounded-[32px] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
             <span className="mono font-bold text-white">CH</span>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-bold tracking-tight leading-none uppercase">Chronos<span className="text-cyan-500">.</span></div>
            <div className="mono text-[8px] opacity-40 uppercase tracking-[0.4em] mt-1">Admin_Panel_v2.0</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full">
            {(['cyber', 'nebula', 'minimal'] as ThemeType[]).map(t => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${theme === t ? 'bg-white/10 text-cyan-400' : 'opacity-30 hover:opacity-100'}`}
              >
                <div className={`w-2 h-2 rounded-full ${t === 'cyber' ? 'bg-cyan-500' : t === 'nebula' ? 'bg-purple-500' : 'bg-slate-900'}`}></div>
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10"></div>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs font-bold">{user.username}</div>
                <div className="mono text-[9px] opacity-40 uppercase">{user.role}</div>
              </div>
              {user.role === 'admin' && (
                <button 
                  onClick={onAdminClick}
                  className="bg-white text-slate-950 px-5 py-2 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-all shadow-lg active:scale-95"
                >
                  Admin Hub
                </button>
              )}
              <button onClick={onLogout} className="opacity-30 hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="mono text-xs font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Access_Systems
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
