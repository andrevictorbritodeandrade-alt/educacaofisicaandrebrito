import React, { useState } from 'react';
import { ViewState } from '../types';
import { ConfigModal } from './ConfigModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, setView }) => {
  const [isConfigOpen, setConfigOpen] = useState(false);

  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'home', 
      label: 'Início', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    { 
      id: 'classes', 
      label: 'Frequências', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    {
      id: 'schedule',
      label: 'Grade de Horários',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      id: 'statistics', 
      label: 'Estatísticas', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    { 
      id: 'plano', 
      label: 'Plano de Curso', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    },
    { 
      id: 'ementa', 
      label: 'Ementa', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    { 
      id: 'decolonial', 
      label: 'Gestão do Professor', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14h-2v-2h2zm0-4h-2V7h2z" /></svg>
    },
    { 
      id: 'calendar', 
      label: 'Calendário Escolar', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'daily-activities', 
      label: 'Registro Diário', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    },
  ];

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#f4ece0] text-slate-900 shadow-[10px_0_40px_rgba(0,0,0,0.1)] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-r border-slate-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-300 h-20">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🏃</span>
             </div>
             <span className="text-lg font-black tracking-tighter uppercase whitespace-nowrap text-slate-800">Educação Física</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-300/50 text-slate-500 hover:text-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                onClose();
              }}
              className={`flex items-center w-full px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-sky-500 text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-slate-300/50 hover:text-slate-900'
              }`}
            >
              <div className={`${currentView === item.id ? 'text-white' : 'text-sky-500 group-hover:scale-110 transition-transform'}`}>
                {item.icon}
              </div>
              <span className={`ml-4 font-black uppercase text-[11px] tracking-widest ${currentView === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-300">
          <button 
            onClick={() => setConfigOpen(true)}
            className="flex items-center w-full px-5 py-3 bg-slate-300/50 hover:bg-slate-300 text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-400"
          >
            <svg className="w-5 h-5 text-sky-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
             Configurar Nuvem
          </button>
          <div className="mt-6 flex flex-col items-center gap-1">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Powered by André Brito</p>
             <div className="flex gap-1.5 grayscale opacity-30">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
               <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
               <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
             </div>
          </div>
        </div>
      </aside>
      
      <ConfigModal isOpen={isConfigOpen} onClose={() => setConfigOpen(false)} />
    </>
  );
};

export default Sidebar;