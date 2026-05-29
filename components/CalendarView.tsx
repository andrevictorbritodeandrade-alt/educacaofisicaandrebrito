import React from 'react';
import { InteractiveCalendar } from './InteractiveCalendar';

interface CalendarViewProps {
  onBack: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      {/* Header with Standard Unified Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button 
          onClick={onBack}
          className="self-start px-5 py-2.5 bg-white hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          VOLTAR AO PAINEL
        </button>
        <div className="text-left md:text-right">
          <h2 className="text-2xl md:text-3xl font-black text-slate-850 uppercase tracking-tighter leading-none mb-1">
            CALENDÁRIO ESCOLAR 2026
          </h2>
          <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Ensino Regular • SEEDUC RJ</p>
        </div>
      </div>

      {/* Main Calendar Panel */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white/10 animate-slide-up ring-1 ring-white/20 p-4 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xl">Estrutura Visual e Grade</h3>
            <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-0.5">Resolução SEEDUC Nº 6392/2025 • Total: 206 Dias Letivos</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-lime-50 px-3 py-1 rounded-lg border border-lime-100">
              <div className="w-3 h-3 bg-lime-400 rounded-sm shadow-[0_0_8px_rgba(163,230,53,0.4)]"></div>
              <span className="text-[10px] font-bold text-lime-700 uppercase">Recesso</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <span className="text-[10px] font-bold text-red-600 uppercase">Feriado</span>
            </div>
          </div>
        </div>
        
        <InteractiveCalendar />

        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-blue-800 font-black text-xs uppercase tracking-tight">Dica de Navegação</p>
            <p className="text-blue-600 text-xs font-semibold">Passe o mouse ou toque nas siglas (I, T, PP, PEM, etc.) para ver a descrição completa do evento.</p>
          </div>
        </div>
      </div>

      {/* Dictionary and Trimesters Section */}
      <div className="bg-[#f4ece0] p-6 md:p-10 rounded-[3rem] border border-slate-300 text-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 text-6xl opacity-5">📋</div>
        <h4 className="font-black uppercase tracking-[0.2em] text-xs mb-10 text-emerald-800 border-b border-slate-300 pb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-emerald-700 rounded-full"></span>
          Dicionário de Legendas (SEEDUC RJ)
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Início do Período', color: 'bg-blue-600 text-white', icon: 'I', desc: '05/02' },
            { label: 'Término do Período', color: 'bg-black text-white', icon: 'T', desc: '22/12' },
            { label: 'Planejamento Pedagógico', color: 'bg-purple-600 text-white', icon: 'PP' },
            { label: 'Recesso Escolar', color: 'bg-lime-400 text-lime-950 shadow-[0_0_15px_rgba(163,230,53,0.3)]', icon: 'R' },
            { label: 'Feriado Nacional/Estadual', color: 'bg-red-600 text-white', icon: 'F' },
            { label: 'Dia do Mestre', color: 'bg-emerald-950 text-white', icon: 'DM', desc: '15/10' },
            { label: 'Censo Escolar', color: 'bg-amber-955 text-white', icon: 'C', desc: '28/05' },
            { label: 'Avaliação Diagnóstica', color: 'bg-indigo-950 text-white', icon: 'AVALI' },
            { label: 'Avalia RJ', color: 'bg-red-950 text-white', icon: 'AVALIA RJ' },
            { label: 'Simulado ENEM RJ', color: 'bg-amber-800 text-white', icon: 'ENEM' },
            { label: 'Educação em Movimento', color: 'bg-yellow-400 text-yellow-905', icon: 'PEM' },
            { label: 'Reunião de Responsáveis', color: 'bg-emerald-400 text-emerald-955', icon: 'SRR' },
            { label: 'Valorização das Mulheres', color: 'bg-pink-400 text-pink-955', icon: 'SVM' },
            { label: 'Combate ao Bullying', color: 'bg-violet-400 text-violet-905', icon: 'PVE' },
            { label: 'Educação Paralímpica', color: 'bg-blue-950 text-white', icon: 'SEP' },
            { label: 'Semana Cultural', color: 'bg-sky-400 text-sky-905', icon: 'SCI' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-250 hover:bg-slate-50 transition-colors shadow-sm group">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center font-black text-sm shadow shrink-0 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{item.label}</p>
                {item.desc && <p className="text-[9px] text-emerald-800 font-bold opacity-80 italic">{item.desc}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-350">
          <div className="bg-white p-6 rounded-3xl border border-slate-250 shadow-sm">
            <p className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-2">1º Trimestre</p>
            <p className="text-slate-800 font-black text-lg tracking-tighter">05/02 a 18/05</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">66 Dias Letivos</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-250 shadow-sm">
            <p className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-2">2º Trimestre</p>
            <p className="text-slate-800 font-black text-lg tracking-tighter">19/05 a 04/09</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">67 Dias Letivos</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-250 shadow-sm">
            <p className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-2">3º Trimestre</p>
            <p className="text-slate-800 font-black text-lg tracking-tighter">08/09 a 22/12</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">73 Dias Letivos</p>
          </div>
        </div>
      </div>
    </div>
  );
};
