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

const legendColors: Record<string, string> = {
  'I': 'bg-blue-600 text-white',
  'T': 'bg-black text-white',
  'PP': 'bg-purple-600 text-white',
  'R': 'bg-slate-300 text-slate-800',
  'F': 'bg-red-600 text-white',
  'DM': 'bg-emerald-900 text-white',
  'C': 'bg-amber-900 text-white',
  'AVALI': 'bg-indigo-900 text-white',
  'AVALIA': 'bg-red-900 text-white',
  'ENEM': 'bg-amber-800 text-white',
  'PEM': 'bg-yellow-400 text-yellow-900',
  'SRR': 'bg-emerald-400 text-emerald-900',
  'SVM': 'bg-pink-400 text-pink-900',
  'PVE': 'bg-violet-400 text-violet-900',
  'SEP': 'bg-blue-900 text-white',
  'SCI': 'bg-sky-400 text-sky-900',
  'COC': 'bg-slate-100 text-slate-900 border border-slate-300',
  'S': 'bg-slate-100 text-slate-400',
  'D': 'bg-slate-200 text-slate-500',
  'DC': 'bg-slate-800 text-white', // Certificação
  'APEP': 'bg-orange-500 text-white', // Ações Pedagógicas
};

export const InteractiveCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Função para determinar o tipo do dia baseado no mês e dia (1-indexed)
  const getDayType = (mIdx: number, d: number): DayInfo | null => {
    // Datas SEEDUC Específicas / Recessos / Feriados / Projetos
    // JAN
    if (mIdx === 0 && d === 1) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Confraternização Universal' };
    if (mIdx === 0 && ((d >= 5 && d <= 9) || (d >= 12 && d <= 16) || (d >= 19 && d <= 23) || (d >= 26 && d <= 30))) return { type: 'PEM', sigla: 'PEM', color: legendColors['PEM'], label: 'Projeto Educação em Movimento' };
    
    // FEV
    if (mIdx === 1 && (d >= 2 && d <= 4)) return { type: 'PP', sigla: 'PP', color: legendColors['PP'], label: 'Planejamento Pedagógico' };
    if (mIdx === 1 && d === 5) return { type: 'I', sigla: 'I', color: legendColors['I'], label: 'Início do Período Letivo' };
    if (mIdx === 1 && (d >= 25 && d <= 27)) return { type: 'AVALIA', sigla: 'AVALIA RJ', color: legendColors['AVALIA'], label: 'Avalia RJ' };

    // MAR 
    if (mIdx === 2 && d === 15) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Carnaval' };
    if (mIdx === 2 && (d >= 2 && d <= 6)) return { type: 'SRR', sigla: 'SRR', color: legendColors['SRR'], label: 'Semana de Reunião de Responsáveis' };
    if (mIdx === 2 && (d >= 9 && d <= 13)) return { type: 'SVM', sigla: 'SVM', color: legendColors['SVM'], label: 'Semana de Valorização das Mulheres' };

    // ABR
    if (mIdx === 3 && d === 2) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Paixão de Cristo' };
    if (mIdx === 3 && d === 21) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Tiradentes' };
    if (mIdx === 3 && (d >= 6 && d <= 10)) return { type: 'PVE', sigla: 'PVE', color: legendColors['PVE'], label: 'Semana de Combate ao Bullying' };
    if (mIdx === 3 && (d >= 13 && d <= 17)) return { type: 'ENEM', sigla: 'ENEM RJ', color: legendColors['ENEM'], label: 'Simulado ENEM RJ' };

    // MAI
    if (mIdx === 4 && d === 1) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Dia do Trabalho' };
    if (mIdx === 4 && (d >= 19 && d <= 21)) return { type: 'COC', sigla: 'COC', color: legendColors['COC'], label: 'Conselho de Classe (1º)' };
    if (mIdx === 4 && d === 28) return { type: 'C', sigla: 'C', color: legendColors['C'], label: 'Censo Escolar' };

    // JUN
    if (mIdx === 5 && (d >= 1 && d <= 3)) return { type: 'ENEM', sigla: 'ENEM RJ', color: legendColors['ENEM'], label: 'Simulado ENEM RJ' };

    // JUL
    if (mIdx === 6 && (d >= 13 && d <= 24)) return { type: 'PEM', sigla: 'PEM', color: legendColors['PEM'], label: 'Projeto Educação em Movimento' };
    
    // AGO
    if (mIdx === 7 && (d >= 10 && d <= 15)) return { type: 'SRR', sigla: 'SRR', color: legendColors['SRR'], label: 'Reunião de Responsáveis' };
    if (mIdx === 7 && (d >= 17 && d <= 19)) return { type: 'ENEM', sigla: 'ENEM RJ', color: legendColors['ENEM'], label: 'Simulado ENEM RJ' };

    // SET
    if (mIdx === 8 && d === 7) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Independência' };
    if (mIdx === 8 && (d >= 8 && d <= 10)) return { type: 'COC', sigla: 'COC', color: legendColors['COC'], label: 'Conselho de Classe (2º)' };
    if (mIdx === 8 && (d >= 21 && d <= 25)) return { type: 'SEP', sigla: 'SEP', color: legendColors['SEP'], label: 'Semana Educação Paralímpica' };
    if (mIdx === 8 && (d >= 28 && d <= 30)) return { type: 'ENEM', sigla: 'ENEM RJ', color: legendColors['ENEM'], label: 'Simulado ENEM RJ' };

    // OUT
    if (mIdx === 9 && (d >= 1 && d <= 3)) return { type: 'ENEM', sigla: 'ENEM RJ', color: legendColors['ENEM'], label: 'Simulado ENEM RJ' };
    if (mIdx === 9 && d === 12) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Nossa Sra Aparecida' };
    if (mIdx === 9 && d === 15) return { type: 'DM', sigla: 'DM', color: legendColors['DM'], label: 'Dia do Mestre' };
    if (mIdx === 9 && (d >= 19 && d <= 23)) return { type: 'SCI', sigla: 'SCI', color: legendColors['SCI'], label: 'Semana Cultural' };
    if (mIdx === 9 && (d >= 26 && d <= 30)) return { type: 'AVALIA', sigla: 'AVALIA RJ', color: legendColors['AVALIA'], label: 'Avalia RJ' };

    // NOV
    if (mIdx === 10 && d === 2) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Finados' };
    if (mIdx === 10 && d === 15) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Proclamação da República' };
    if (mIdx === 10 && d === 20) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Consciência Negra' };

    // DEZ
    if (mIdx === 11 && (d >= 9 && d <= 11)) return { type: 'COC', sigla: 'COC', color: legendColors['COC'], label: 'Conselho de Classe (3º)' };
    if (mIdx === 11 && d === 22) return { type: 'T', sigla: 'T', color: legendColors['T'], label: 'Término do Período Letivo' };
    if (mIdx === 11 && d === 25) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Natal' };
    if (mIdx === 11 && (d >= 23 && d <= 31)) return { type: 'R', sigla: 'R', color: legendColors['R'], label: 'Recesso' };

    // Domingos e Sábados
    const date = new Date(2026, mIdx, d);
    if (date.getMonth() !== mIdx) return null; 
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return { type: 'D', sigla: 'D', color: legendColors['D'] };
    if (dayOfWeek === 6) return { type: 'S', sigla: 'S', color: legendColors['S'] };

    return null;
  };

  // Placeholder logic for daysInMonth
  const daysInMonth = (mIdx: number) => new Date(2026, mIdx + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth(selectedMonth) }, (_, i) => i + 1);

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-black text-slate-800">Calendário 2026</h2>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-slate-100 border-none rounded-lg p-2 text-sm font-bold text-slate-800"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-[10px] font-black text-slate-400 p-1">{day}</div>
        ))}
        {days.map((day) => {
          const dayInfo = getDayType(selectedMonth, day);
          return (
            <div 
              key={day}
              className={`p-2 rounded-lg text-center text-xs font-bold ${dayInfo?.color || 'bg-slate-50 text-slate-800'}`}
              title={dayInfo?.label || ''}
            >
              {day}
              {dayInfo?.sigla && <div className="text-[8px] font-black">{dayInfo.sigla}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
