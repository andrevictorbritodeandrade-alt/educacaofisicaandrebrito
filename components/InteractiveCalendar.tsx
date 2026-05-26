import React, { useState } from 'react';

interface DayInfo {
  type: string;
  label?: string;
  color: string;
  sigla?: string;
}

const months = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
];

const legendConfig: Record<string, { bg: string; text: string }> = {
  'I': { bg: '#2563eb', text: 'white' }, // Blue 600
  'T': { bg: '#000000', text: 'white' }, // Black
  'PP': { bg: '#9333ea', text: 'white' }, // Purple 600
  'R': { bg: '#a3e635', text: '#0f172a' }, // Lime 400
  'F': { bg: '#dc2626', text: 'white' }, // Red 600
  'DM': { bg: '#065f46', text: 'white' }, // Emerald 900
  'C': { bg: '#78350f', text: 'white' }, // Amber 900
  'AVALI': { bg: '#312e81', text: 'white' }, // Indigo 900
  'AVALIA': { bg: '#7f1d1d', text: 'white' }, // Red 900
  'ENEM': { bg: '#92400e', text: 'white' }, // Amber 800
  'PEM': { bg: '#facc15', text: '#854d0e' }, // Yellow 400
  'SRR': { bg: '#34d399', text: '#064e3b' }, // Emerald 400
  'SVM': { bg: '#f472b6', text: '#831843' }, // Pink 400
  'PVE': { bg: '#a78bfa', text: '#4c1d95' }, // Violet 400
  'SEP': { bg: '#1e3a8a', text: 'white' }, // Blue 900
  'SCI': { bg: '#38bdf8', text: '#0c4a6e' }, // Sky 400
  'COC': { bg: '#f1f5f9', text: '#0f172a' }, // Slate 100
  'S': { bg: '#f1f5f9', text: '#94a3b8' }, // Slate 100
  'D': { bg: '#e2e8f0', text: '#64748b' }, // Slate 200
};

export const InteractiveCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Função para determinar o tipo do dia baseado no mês e dia (1-indexed)
  const getDayEvents = (mIdx: number, d: number): DayInfo[] => {
    const events: DayInfo[] = [];
    
    // Datas SEEDUC Específicas / Recessos / Feriados / Projetos
    // JAN
    if (mIdx === 0 && d === 1) events.push({ type: 'F', sigla: 'F', color: '', label: 'Confraternização Universal' });
    if (mIdx === 0 && ((d >= 5 && d <= 9) || (d >= 12 && d <= 16) || (d >= 19 && d <= 23) || (d >= 26 && d <= 30))) events.push({ type: 'PEM', sigla: 'PEM', color: '', label: 'Projeto Educação em Movimento' });
    
    // FEV
    if (mIdx === 1 && (d >= 2 && d <= 4)) events.push({ type: 'PP', sigla: 'PP', color: '', label: 'Planejamento Pedagógico' });
    if (mIdx === 1 && d === 5) events.push({ type: 'I', sigla: 'I', color: '', label: 'Início do Período Letivo' });
    if (mIdx === 1 && (d >= 25 && d <= 27)) events.push({ type: 'AVALIA', sigla: 'AVALIA RJ', color: '', label: 'Avalia RJ' });

    // MAR 
    if (mIdx === 2 && d === 15) events.push({ type: 'F', sigla: 'F', color: '', label: 'Carnaval' });
    if (mIdx === 2 && (d >= 2 && d <= 6)) events.push({ type: 'SRR', sigla: 'SRR', color: '', label: 'Semana de Reunião de Responsáveis' });
    if (mIdx === 2 && (d >= 9 && d <= 13)) events.push({ type: 'SVM', sigla: 'SVM', color: '', label: 'Semana de Valorização das Mulheres' });

    // ABR
    if (mIdx === 3 && d === 2) events.push({ type: 'F', sigla: 'F', color: '', label: 'Paixão de Cristo' });
    if (mIdx === 3 && d === 21) events.push({ type: 'F', sigla: 'F', color: '', label: 'Tiradentes' });
    if (mIdx === 3 && (d >= 6 && d <= 10)) events.push({ type: 'PVE', sigla: 'PVE', color: '', label: 'Semana de Combate ao Bullying' });
    if (mIdx === 3 && (d >= 13 && d <= 17)) events.push({ type: 'ENEM', sigla: 'ENEM RJ', color: '', label: 'Simulado ENEM RJ' });

    // MAI
    if (mIdx === 4 && d === 1) events.push({ type: 'F', sigla: 'F', color: '', label: 'Dia do Trabalho' });
    if (mIdx === 4 && (d >= 19 && d <= 21)) events.push({ type: 'COC', sigla: 'COC', color: '', label: 'Conselho de Classe (1º)' });
    if (mIdx === 4 && d === 28) events.push({ type: 'C', sigla: 'C', color: '', label: 'Censo Escolar' });

    // JUN
    if (mIdx === 5 && (d >= 1 && d <= 3)) events.push({ type: 'ENEM', sigla: 'ENEM RJ', color: '', label: 'Simulado ENEM RJ' });

    // JUL
    if (mIdx === 6 && (d >= 13 && d <= 26)) events.push({ type: 'R', sigla: 'R', color: '', label: 'Recesso' });
    if (mIdx === 6 && (d >= 13 && d <= 24)) events.push({ type: 'PEM', sigla: 'PEM', color: '', label: 'Projeto Educação em Movimento' });
    
    // AGO
    if (mIdx === 7 && (d >= 10 && d <= 15)) events.push({ type: 'SRR', sigla: 'SRR', color: '', label: 'Reunião de Responsáveis' });
    if (mIdx === 7 && (d >= 17 && d <= 19)) events.push({ type: 'ENEM', sigla: 'ENEM RJ', color: '', label: 'Simulado ENEM RJ' });

    // SET
    if (mIdx === 8 && d === 7) events.push({ type: 'F', sigla: 'F', color: '', label: 'Independência' });
    if (mIdx === 8 && (d >= 8 && d <= 10)) events.push({ type: 'COC', sigla: 'COC', color: '', label: 'Conselho de Classe (2º)' });
    if (mIdx === 8 && (d >= 21 && d <= 25)) events.push({ type: 'SEP', sigla: 'SEP', color: '', label: 'Semana Educação Paralímpica' });
    if (mIdx === 8 && (d >= 28 && d <= 30)) events.push({ type: 'ENEM', sigla: 'ENEM RJ', color: '', label: 'Simulado ENEM RJ' });

    // OUT
    if (mIdx === 9 && (d >= 1 && d <= 3)) events.push({ type: 'ENEM', sigla: 'ENEM RJ', color: '', label: 'Simulado ENEM RJ' });
    if (mIdx === 9 && d === 12) events.push({ type: 'F', sigla: 'F', color: '', label: 'Nossa Sra Aparecida' });
    if (mIdx === 9 && d === 15) events.push({ type: 'DM', sigla: 'DM', color: '', label: 'Dia do Mestre' });
    if (mIdx === 9 && (d >= 19 && d <= 23)) events.push({ type: 'SCI', sigla: 'SCI', color: '', label: 'Semana Cultural' });
    if (mIdx === 9 && (d >= 26 && d <= 30)) events.push({ type: 'AVALIA', sigla: 'AVALIA RJ', color: '', label: 'Avalia RJ' });

    // NOV
    if (mIdx === 10 && d === 2) events.push({ type: 'F', sigla: 'F', color: '', label: 'Finados' });
    if (mIdx === 10 && d === 15) events.push({ type: 'F', sigla: 'F', color: '', label: 'Proclamação da República' });
    if (mIdx === 10 && d === 20) events.push({ type: 'F', sigla: 'F', color: '', label: 'Consciência Negra' });

    // DEZ
    if (mIdx === 11 && (d >= 9 && d <= 11)) events.push({ type: 'COC', sigla: 'COC', color: '', label: 'Conselho de Classe (3º)' });
    if (mIdx === 11 && d === 22) events.push({ type: 'T', sigla: 'T', color: '', label: 'Término do Período Letivo' });
    if (mIdx === 11 && d === 25) events.push({ type: 'F', sigla: 'F', color: '', label: 'Natal' });
    if (mIdx === 11 && (d >= 12 && d <= 21)) events.push({ type: 'R', sigla: 'R', color: '', label: 'Recesso' });
    if (mIdx === 11 && (d >= 23 && d <= 31)) events.push({ type: 'R', sigla: 'R', color: '', label: 'Recesso' });

    // Domingos e Sábados (se não houver evento especial já marcado)
    if (events.length === 0) {
      const date = new Date(2026, mIdx, d);
      if (date.getMonth() === mIdx) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0) events.push({ type: 'D', sigla: 'D', color: '', label: 'Domingo' });
        if (dayOfWeek === 6) events.push({ type: 'S', sigla: 'S', color: '', label: 'Sábado' });
      }
    }

    return events;
  };

  const daysInMonth = (mIdx: number) => new Date(2026, mIdx + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth(selectedMonth) }, (_, i) => i + 1);
  const startDayOfWeek = new Date(2026, selectedMonth, 1).getDay();

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
           <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Calendário 2026</h2>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Resolução SEEDUC Nº 6392/2025</p>
        </div>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-slate-100 border-none rounded-lg p-2 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-slate-400 p-1">{day}</div>
        ))}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const events = getDayEvents(selectedMonth, day);
          const today = new Date();
          const isToday = today.getFullYear() === 2026 && 
                          today.getMonth() === selectedMonth && 
                          today.getDate() === day;

          const style: React.CSSProperties = {};
          let textColor = '#1e293b'; 

          if (events.length > 1) {
            const colors = events.map(e => legendConfig[e.type]?.bg || '#f8fafc');
            style.background = `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`;
            textColor = legendConfig[events[0].type]?.text || textColor;
          } else if (events.length === 1) {
            style.backgroundColor = legendConfig[events[0].type]?.bg || '#f8fafc';
            textColor = legendConfig[events[0].type]?.text || textColor;
          } else {
            style.backgroundColor = '#f8fafc';
          }

          return (
            <div 
              key={day}
              style={style}
              className={`p-2 rounded-lg text-center text-xs font-bold relative transition-all duration-200 min-h-[50px] flex flex-col justify-between ${isToday ? 'ring-2 ring-blue-500 ring-offset-1 z-10 scale-110 shadow-lg' : ''}`}
              title={events.map(e => e.label).join(' / ')}
            >
              <div style={{ color: textColor }}>{day}</div>
              
              <div className="flex flex-wrap justify-center items-center gap-0.5 leading-none">
                {events.map((e, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-[7px] opacity-50 px-0.5">/</span>}
                    <span 
                      className="text-[7px] font-black uppercase"
                      style={{ color: legendConfig[e.type]?.text || textColor }}
                    >
                      {e.sigla}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              
              {isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

