import React from 'react';
import { ViewState } from '../types';

interface DashboardViewProps {
  setView: (view: ViewState) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setView }) => {
  
  const menuCards = [
    {
      id: 'classes',
      title: 'FREQUÊNCIAS',
      description: 'Gestão de turmas e chamadas diárias.',
      icon: '🏫',
      bgGradient: 'from-blue-600 to-cyan-500',
      action: () => setView('classes')
    },
    {
      id: 'schedule',
      title: 'GRADE DE HORÁRIOS',
      description: 'Cronograma semanal das aulas.',
      icon: '📅',
      bgGradient: 'from-cyan-600 to-blue-700',
      action: () => setView('schedule')
    },
    {
      id: 'statistics',
      title: 'ESTATÍSTICAS',
      description: 'Métricas de assiduidade e progresso.',
      icon: '📊',
      bgGradient: 'from-purple-600 to-blue-600',
      action: () => setView('statistics')
    },
    {
      id: 'plano',
      title: 'PLANO DE CURSO',
      description: 'Cronograma trimestral dos conteúdos.',
      icon: '📊',
      bgGradient: 'from-blue-500 to-indigo-600',
      action: () => setView('plano')
    },
    {
      id: 'ementa',
      title: 'EMENTA',
      description: 'Fundamentos, objetivos e referências.',
      icon: '📄',
      bgGradient: 'from-emerald-500 to-teal-600',
      action: () => setView('ementa')
    },
    {
      id: 'decolonial',
      title: 'GESTÃO DO PROFESSOR',
      description: 'Decolonização de corpos, identidades e mídias.',
      icon: '✊🏾',
      bgGradient: 'from-emerald-600 to-teal-500',
      action: () => setView('decolonial')
    },
    {
      id: 'calendar',
      title: 'CALENDÁRIO ESCOLAR 2026',
      description: 'Calendário letivo oficial da Rede SEEDUC/RJ.',
      icon: '🗓️',
      bgGradient: 'from-amber-500 to-orange-600',
      action: () => setView('calendar')
    }
  ];

  return (
    <div className="animate-fade-in space-y-4 md:space-y-8 pb-20 mt-1 md:mt-2">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {menuCards.map((card) => (
          <div 
            key={card.id}
            onClick={card.action}
            className={`relative overflow-hidden rounded-xl p-5 md:p-8 cursor-pointer group shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/10 backdrop-blur-xl border border-white/20`}
          >
            {/* Background Gradient Blob - Subtle glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br ${card.bgGradient} rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
            
            <div className="relative z-10 flex items-center space-x-4 md:space-x-6">
              <div className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${card.bgGradient} flex items-center justify-center text-3xl md:text-5xl text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-4xl md:text-6xl font-black text-white mb-1 group-hover:text-amber-300 transition-colors drop-shadow-md">{card.title}</h3>
                <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed drop-shadow-sm">
                  {card.description}
                </p>
              </div>
              <div className="self-center flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Status Bar - Matching Glass Style */}
      <div className="mt-4 md:mt-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-lg md:rounded-xl flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-bold text-slate-200 space-y-2 md:space-y-0 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
          <span className="text-white tracking-wider">SISTEMA ATIVO</span>
        </div>
        <div className="text-slate-300">
          Sincronizado: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};