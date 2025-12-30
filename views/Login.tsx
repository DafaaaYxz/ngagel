
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { dataService } from '../services/dataService';

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (dataService.getCurrentAdmin()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = dataService.login(username, password);
    if (admin) {
      navigate('/admin');
    } else {
      setError('Neural scan failed. Unauthorized access detected.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-5 rounded-[2.5rem] bg-zinc-900 border border-red-600/20 red-glow">
            <Shield className="text-red-600" size={48} />
          </div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase">Admin Authentication</h2>
          <p className="text-zinc-500 text-sm">Enter the encrypted vault to manage your legacies.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-[3rem] space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                required
                type="text" 
                placeholder="Username"
                className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-600 transition-colors"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                required
                type="password" 
                placeholder="Passcode"
                className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-600 transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-pulse">
              {error}
            </div>
          )}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group">
            INITIALIZE SESSION <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="absolute top-0 right-0 p-4">
             <div className="text-[8px] text-zinc-800 font-mono tracking-widest uppercase">Encryption Mode: AES-256</div>
          </div>
        </form>
        
        <p className="text-center text-zinc-600 text-[10px] uppercase tracking-widest">
          Secured by BraynOfficial Matrix Core v2.4
        </p>
      </div>
    </div>
  );
};

export default LoginView;
