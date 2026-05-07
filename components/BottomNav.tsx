import React from 'react';

interface BottomNavProps {
  currentView: string;
  setView: (view: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-4 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      <button 
        onClick={() => setView('schedule')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
          currentView === 'schedule' ? 'text-blue-600' : 'text-slate-400'
        }`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-tighter">Horários</span>
      </button>

      <button 
        onClick={() => setView('classes')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all rounded-xl ${
          currentView === 'classes' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
        }`}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-tighter">Escolas & Chamada</span>
      </button>
    </div>
  );
};
