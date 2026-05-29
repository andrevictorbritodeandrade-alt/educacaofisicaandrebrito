import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfessorLoginViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ProfessorLoginView: React.FC<ProfessorLoginViewProps> = ({ onBack, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1989') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/10 p-10 rounded-[2.5rem] border border-white/20 backdrop-blur-xl shadow-2xl relative"
      >
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Acesso Professor</h2>
          <p className="text-white/60 mt-2 text-sm">Insira o PIN de segurança para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite o PIN"
              className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} text-white text-center text-2xl tracking-[0.5em] font-mono rounded-2xl px-6 py-5 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner backdrop-blur-sm placeholder:text-white/20 placeholder:tracking-normal`}
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center mt-3 font-bold uppercase tracking-wider"
              >
                PIN INCORRETO
              </motion.p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-colors shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            Acessar Sistema
          </button>
        </form>
      </motion.div>
    </div>
  );
};
