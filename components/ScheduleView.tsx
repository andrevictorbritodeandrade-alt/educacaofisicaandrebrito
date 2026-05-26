import React from 'react';
import { InteractiveCalendar } from './InteractiveCalendar';
import { LessonContentView } from './LessonContentView';
import { EmentaView } from './EmentaView';
import { PlanoDeCursoView } from './PlanoDeCursoView';

interface ScheduleViewProps {
  onBack: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = React.useState<'menu' | 'schedule' | 'lessons'>('menu');

  if (activeSection === 'menu') {
    return (
      <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold transition-all shadow-xl hover:bg-white/20 flex items-center active:scale-95"
          >
            <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-xl">Cronogramas</h1>
            <p className="text-blue-300 font-bold text-sm tracking-widest uppercase">Educação Física • 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Schedule Card */}
          <div 
            onClick={() => setActiveSection('schedule')}
            className="group relative overflow-hidden bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-10 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/15"
          >
             <div className="absolute top-0 right-0 p-10 text-8xl opacity-10 group-hover:scale-125 transition-transform duration-500">
               📅
             </div>
             <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/10 group-hover:bg-blue-500/40 transition-colors">
                  ⏰
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-3">
                     Horário de Turmas
                   </h3>
                   <p className="text-slate-300 font-medium text-sm leading-relaxed opacity-80">
                     Consulte os horários das aulas de Educação Física para todas as unidades escolares.
                   </p>
                </div>
                <div className="pt-4 flex items-center text-blue-400 font-black text-sm uppercase tracking-tighter group-hover:translate-x-2 transition-transform">
                  Ver Horários
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'lessons') {
    return (
      <LessonContentView onBack={() => setActiveSection('menu')} />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setActiveSection('menu')}
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white font-bold transition-all shadow-lg hover:bg-white/20 flex items-center active:scale-95 border border-white/10"
        >
          <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Menu Anterior
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter tracking-tight leading-none mb-1">Horário de Turmas</h2>
          <p className="text-blue-300 font-bold text-xs uppercase tracking-widest">Professor André Brito</p>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-8 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/95 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-slate-100 pb-6">
          <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
            <img 
              src="https://picsum.photos/seed/professor/200/200" 
              alt="Professor André"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Quadro de Horários - Ed. Física
            </h3>
            <p className="text-blue-600 font-bold">Professor André Brito</p>
            <div className="mt-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-blue-100 inline-block">
              "Tudo pronto para as aulas de Educação Física! Vamos nos movimentar!"
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="border border-slate-200 p-4">Horário</th>
                <th className="border border-slate-200 p-4">Segunda-feira</th>
                <th className="border border-slate-200 p-4">Sexta-feira</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '07:00 – 08:40', mon: { school: 'EE Cordelia Paiva', class: 'Turma 802' }, fri: { school: 'CIEP 320', class: 'AP 101' } },
                { time: '08:40 – 10:20', mon: { school: 'EE Cordelia Paiva', class: 'Turma 803' }, fri: { school: 'CIEP 476', class: 'Turma 1003' } },
                { time: '10:35 – 12:15', mon: { school: 'EE Cordelia Paiva', class: 'Turma 801' }, fri: { school: 'CIEP 476', class: 'Turma 1001' } },
                { time: '12:45 – 14:25', mon: null, fri: { school: 'CIEP 320', class: 'AP 301' } },
                { time: '13:35 – 15:15', mon: { school: 'CIEP 198', class: 'AP 101' }, fri: null },
                { time: '19:40 – 21:20', mon: null, fri: { school: 'CIEP 476', class: 'Turma 1007' } },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="border border-slate-200 p-4 font-bold text-center bg-slate-50 text-slate-700 whitespace-nowrap">{row.time}</td>
                  <td className="border border-slate-200 p-4 text-center">
                    {row.mon ? (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 shadow-sm">
                        <p className="text-blue-800 font-black text-sm">{row.mon.class}</p>
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mt-1">{row.mon.school}</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm flex items-center justify-center select-none">
                        <span className="text-amber-600 font-black tracking-widest text-sm uppercase">JANELA</span>
                      </div>
                    )}
                  </td>
                  <td className="border border-slate-200 p-4 text-center">
                    {row.fri ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 shadow-sm">
                        <p className="text-emerald-800 font-black text-sm">{row.fri.class}</p>
                        <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mt-1">{row.fri.school}</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm flex items-center justify-center select-none">
                        <span className="text-amber-600 font-black tracking-widest text-sm uppercase">JANELA</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-black text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-tight text-sm">
              <span className="text-2xl">⏰</span> Dias de Aula
            </h4>
            <p className="text-slate-600 font-bold">Segunda e Sexta-feira</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-black text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-tight text-sm">
              <span className="text-2xl">📅</span> Carga Horária
            </h4>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              Aulas distribuídas entre as escolas Cordelia Paiva, CIEP 198, CIEP 320 e CIEP 476.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
