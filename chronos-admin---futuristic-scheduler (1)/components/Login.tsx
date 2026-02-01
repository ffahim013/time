
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple logic as requested: admin/admin123 for admin, viewer/viewer123 for viewer
    if (username === 'admin' && password === 'admin123') {
      onLogin({ username: 'admin', role: 'admin' });
    } else if (username === 'user' && password === 'user123') {
      onLogin({ username: 'user', role: 'viewer' });
    } else {
      setError('Invalid temporal credentials. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg" onClick={onClose}></div>
      
      <div className="relative glass w-full max-w-md rounded-3xl overflow-hidden p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-futuristic font-bold tracking-tight mb-2">ACCESS HUB</h2>
          <p className="text-sm opacity-50">Authenticate to interact with the timeline.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Identity Code</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-all"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Cipher Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-all"
              placeholder="Password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-cyan-400 transition-all transform active:scale-95"
          >
            AUTHORIZE
          </button>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] text-center opacity-40 leading-relaxed uppercase tracking-tighter">
              Admin: admin / admin123 <br/>
              Viewer: user / user123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
