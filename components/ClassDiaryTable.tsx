import React from 'react';
import { Student } from '../types';
import { Pencil, ArrowLeftRight, Trash2 } from 'lucide-react';

interface ClassDiaryTableProps {
  students: Student[];
  dateStr: string;
  onAttendance: (studentId: number, status: 'P' | 'F') => void;
  onEdit: (student: Student) => void;
  onMove: (student: Student) => void;
  onDelete: (student: Student) => void;
  isCorrectDay: boolean;
}

export const ClassDiaryTable: React.FC<ClassDiaryTableProps> = ({
  students,
  dateStr,
  onAttendance,
  onEdit,
  onMove,
  onDelete,
  isCorrectDay
}) => {
  
  const getStats = (student: Student) => {
    const attendanceEntries = Object.values(student.attendance).filter(v => v !== null);
    const totalAulas = attendanceEntries.length;
    
    if (totalAulas === 0) return { pCount: 0, pPercent: '0%', fCount: 0, fPercent: '0%' };
    
    const pCount = attendanceEntries.filter(v => v === 'P').length;
    const fCount = attendanceEntries.filter(v => v === 'F').length;
    
    return {
      pCount,
      fCount,
      pPercent: `${((pCount / totalAulas) * 100).toFixed(1)}%`,
      fPercent: `${((fCount / totalAulas) * 100).toFixed(1)}%`
    };
  };

  return (
    <div className="overflow-x-auto bg-black text-white p-2 sm:p-4 rounded-xl border border-slate-800">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
            <th className="py-4 px-2 font-bold w-12 text-center">Nº</th>
            <th className="py-4 px-4 font-bold">Nome do Aluno</th>
            <th className="py-4 px-4 font-bold text-center">Chamada</th>
            <th className="py-4 px-4 font-bold text-center">Total P</th>
            <th className="py-4 px-4 font-bold text-center">% P</th>
            <th className="py-4 px-4 font-bold text-center">Total F</th>
            <th className="py-4 px-4 font-bold text-center">% F</th>
            <th className="py-4 px-4 font-bold text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {students.map((student, index) => {
            const status = student.attendance[dateStr];
            const stats = getStats(student);
            
            return (
              <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-2 text-center text-slate-500 font-mono text-sm">
                  {index + 1}
                </td>
                <td className="py-4 px-4 font-medium text-white group-hover:text-blue-400 transition-colors">
                  {student.name}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      disabled={!isCorrectDay}
                      onClick={() => onAttendance(student.id, 'P')}
                      className={`w-10 h-10 rounded-lg font-black flex items-center justify-center transition-all ${
                        status === 'P'
                        ? 'border-2 border-green-500 bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                        : 'border border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-500'
                      } ${!isCorrectDay ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      P
                    </button>
                    <button
                      disabled={!isCorrectDay}
                      onClick={() => onAttendance(student.id, 'F')}
                      className={`w-10 h-10 rounded-lg font-black flex items-center justify-center transition-all ${
                        status === 'F'
                        ? 'border-2 border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'border border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-500'
                      } ${!isCorrectDay ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      F
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-bold text-green-500">
                  {stats.pCount}
                </td>
                <td className="py-4 px-4 text-center font-mono text-sm text-green-500/80">
                  {stats.pPercent}
                </td>
                <td className="py-4 px-4 text-center font-bold text-red-500">
                  {stats.fCount}
                </td>
                <td className="py-4 px-4 text-center font-mono text-sm text-red-500/80">
                  {stats.fPercent}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-500">
                    <button 
                      onClick={() => onEdit(student)}
                      className="p-1.5 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => onMove(student)}
                      className="p-1.5 hover:text-orange-400 hover:bg-orange-400/10 rounded transition-colors"
                    >
                      <ArrowLeftRight size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(student)}
                      className="p-1.5 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {students.length === 0 && (
        <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-black">
          Nenhum aluno nesta turma
        </div>
      )}
    </div>
  );
};
