import React from 'react';

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
  // Simplificação: Função para determinar o tipo do dia baseado no mês e dia (1-indexed)
  const getDayType = (mIdx: number, d: number): DayInfo | null => {
    const month = months[mIdx];
    
    // Placeholder logic based on the image description
    // In a production app, this would be a full object mapping or JSON
    
    // Feriados Fixos (Exemplo)
    if (mIdx === 0 && d === 1) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Confraternização Universal' };
    if (mIdx === 4 && d === 1) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Dia do Trabalho' };
    if (mIdx === 8 && d === 7) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Independência do Brasil' };
    if (mIdx === 9 && d === 12) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Nossa Sra Aparecida' };
    if (mIdx === 10 && d === 2) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Finados' };
    if (mIdx === 10 && d === 15) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Proclamação da República' };
    if (mIdx === 10 && d === 20) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Zumbi/Consciência Negra' };
    if (mIdx === 11 && d === 25) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Natal' };

    // Datas SEEDUC Específicas
    if (mIdx === 1 && d === 5) return { type: 'I', sigla: 'I', color: legendColors['I'], label: 'Início do Período Letivo' };
    if (mIdx === 11 && d === 22) return { type: 'T', sigla: 'T', color: legendColors['T'], label: 'Término do Período Letivo' };
    
    // Planejamento (PP)
    if (mIdx === 1 && (d >= 2 && d <= 4)) return { type: 'PP', sigla: 'PP', color: legendColors['PP'], label: 'Planejamento Pedagógico' };

    // Projeto PEM
    if (mIdx === 0 && ((d >= 5 && d <= 9) || (d >= 12 && d <= 16) || (d >= 19 && d <= 23) || (d >= 26 && d <= 30))) 
      return { type: 'PEM', sigla: 'PEM', color: legendColors['PEM'], label: 'Projeto Educação em Movimento' };
    
    // Recesso Janeiro (Dias que não são PEM ou Feriado)
    if (mIdx === 0 && d >= 2 && d <= 31) {
       const date = new Date(2026, 0, d);
       if (date.getDay() !== 0 && date.getDay() !== 6) {
          return { type: 'R', sigla: 'R', color: legendColors['R'], label: 'Recesso Escolar' };
       }
    }

    // SVM - Valorização das Mulheres (9-13 Março)
    if (mIdx === 2 && d >= 9 && d <= 13) return { type: 'SVM', sigla: 'SVM', color: legendColors['SVM'], label: 'Semana de Valorização das Mulheres' };

    // PVE/CBL - Bullying (6-10 Abril)
    if (mIdx === 3 && d >= 6 && d <= 10) return { type: 'PVE', sigla: 'PVE', color: legendColors['PVE'], label: 'Semana de Combate ao Bullying' };

    // Recesso Julho (Férias)
    if (mIdx === 6 && d >= 13 && d <= 26) {
       const date = new Date(2026, 6, d);
       if (date.getDay() !== 0 && date.getDay() !== 6) {
          return { type: 'R', sigla: 'R', color: legendColors['R'], label: 'Recesso Escolar (Férias)' };
       }
    }

    // SEP - Paralímpica (21-25 Setembro)
    if (mIdx === 8 && d >= 21 && d <= 25) return { type: 'SEP', sigla: 'SEP', color: legendColors['SEP'], label: 'Semana Estadual da Educação Paralímpica' };

    // SCI / SRR (19-23 Outubro)
    if (mIdx === 9 && d >= 19 && d <= 23) return { type: 'SCI', sigla: 'SCI', color: legendColors['SCI'], label: 'Semana Cultural Interescolar / SRR' };

    // Recesso Dezembro (Após o término)
    if (mIdx === 11 && d > 22) {
       const date = new Date(2026, 11, d);
       if (date.getDay() !== 0 && date.getDay() !== 6) {
          return { type: 'R', sigla: 'R', color: legendColors['R'], label: 'Recesso Escolar' };
       }
    }

    // COC (Conselhos)
    if (mIdx === 4 && d >= 19 && d <= 21) return { type: 'COC', sigla: 'COC', color: legendColors['COC'], label: 'Conselho de Classe (1º Trimestre)' };
    if (mIdx === 8 && d >= 8 && d <= 10) return { type: 'COC', sigla: 'COC', color: legendColors['COC'], label: 'Conselho de Classe (2º Trimestre)' };
    if (mIdx === 11 && d >= 9 && d <= 11) return { type: 'COC', sigla: 'COC', color: legendColors['COC'], label: 'Conselho de Classe (3º Trimestre)' };

    // Feriados Médios (Carnaval/etc - Ver imagem)
    if (mIdx === 1 && d === 17) return { type: 'F', sigla: 'F', color: legendColors['F'], label: 'Carnaval' };
    if (mIdx === 1 && (d === 16 || d === 18)) return { type: 'R', sigla: 'R', color: legendColors['R'], label: 'Recesso' };
    
    // Censo 28/05
    if (mIdx === 4 && d === 28) return { type: 'C', sigla: 'C', color: legendColors['C'], label: 'Dia Nacional do Censo Escolar' };

    // Dia do Mestre 15/10
    if (mIdx === 9 && d === 15) return { type: 'DM', sigla: 'DM', color: legendColors['DM'], label: 'Dia do Mestre' };

    // Domingos e Sábados (Aproximado para 2026)
    const date = new Date(2026, mIdx, d);
    if (date.getMonth() !== mIdx) return null; // Dia inválido para o mês
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return { type: 'D', sigla: 'D', color: legendColors['D'] };
    if (dayOfWeek === 6) return { type: 'S', sigla: 'S', color: legendColors['S'] };

    return null;
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[1200px] bg-white p-4 rounded-xl shadow-lg border border-slate-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-200 p-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase w-12 sticky left-0 z-10">Mês</th>
              {Array.from({ length: 31 }).map((_, i) => (
                <th key={i} className="border border-slate-200 p-1 bg-slate-50 text-[10px] font-black text-slate-800 w-8">
                  {i + 1}
                </th>
              ))}
              <th className="border border-slate-200 p-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase w-12">Dias</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month, mIdx) => {
              let workDays = 0;
              return (
                <tr key={month} className="group hover:bg-slate-50 transition-colors">
                  <td className="border border-slate-200 p-2 bg-slate-50 font-black text-slate-900 text-xs text-center sticky left-0 z-10 group-hover:bg-white transition-colors">
                    {month}
                  </td>
                  {Array.from({ length: 31 }).map((_, dIdx) => {
                    const day = dIdx + 1;
                    const dayInfo = getDayType(mIdx, day);
                    const isValidDay = new Date(2026, mIdx, day).getMonth() === mIdx;
                    
                    if (isValidDay && dayInfo && !['S', 'D', 'F', 'R'].includes(dayInfo.type)) workDays++;

                    return (
                      <td 
                        key={dIdx} 
                        className={`border border-slate-200 p-0 h-8 text-center relative ${!isValidDay ? 'bg-slate-50/50' : ''}`}
                        title={dayInfo?.label || ''}
                      >
                        {isValidDay && dayInfo && (
                          <div className={`w-full h-full flex items-center justify-center text-[9px] font-black uppercase tracking-tighter ${dayInfo.color}`}>
                            {dayInfo.sigla}
                          </div>
                        )}
                        {!dayInfo && isValidDay && (
                          <div className="w-full h-full bg-white"></div>
                        )}
                      </td>
                    );
                  })}
                  <td className="border border-slate-200 p-1 text-center font-black text-[10px] text-slate-500">
                    {mIdx === 0 ? '' : workDays > 0 ? workDays : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
