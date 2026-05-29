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
    <div className="overflow-x-auto bg-[#fdfaf6] text-slate-800 p-2 sm:p-4 rounded-xl border border-slate-300">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-300 text-slate-600 text-xs uppercase tracking-wider">
            <th className="py-4 px-2 font-black w-12 text-center uppercase-text">Nº</th>
            <th className="py-4 px-4 font-black uppercase-text">Nome do Aluno</th>
            <th className="py-4 px-4 font-black text-center uppercase-text">Chamada</th>
            <th className="py-4 px-4 font-black text-center uppercase-text">Total P</th>
            <th className="py-4 px-4 font-black text-center uppercase-text">% P</th>
            <th className="py-4 px-4 font-black text-center uppercase-text">Total F</th>
            <th className="py-4 px-4 font-black text-center uppercase-text">% F</th>
            <th className="py-4 px-4 font-black text-right uppercase-text">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {students.map((student, index) => {
            const status = student.attendance[dateStr];
            const stats = getStats(student);
            
            return (
              <tr key={student.id} className="hover:bg-slate-200/50 transition-colors group">
                <td className="py-4 px-2 text-center text-slate-500 font-bold text-sm">
                  {index + 1}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  {student.name}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      disabled={!isCorrectDay}
                      onClick={() => onAttendance(student.id, 'P')}
                      className={`w-10 h-10 rounded-lg font-black flex items-center justify-center transition-all ${
                        status === 'P'
                        ? 'border-2 border-green-600 bg-green-500/10 text-green-700 shadow-sm'
                        : 'border border-slate-400 bg-white text-slate-500 hover:border-sky-500'
                      } ${!isCorrectDay ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      P
                    </button>
                    <button
                      disabled={!isCorrectDay}
                      onClick={() => onAttendance(student.id, 'F')}
                      className={`w-10 h-10 rounded-lg font-black flex items-center justify-center transition-all ${
                        status === 'F'
                        ? 'border-2 border-red-600 bg-red-500/10 text-red-700 shadow-sm'
                        : 'border border-slate-400 bg-white text-slate-500 hover:border-sky-500'
                      } ${!isCorrectDay ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      F
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-black text-green-700">
                  {stats.pCount}
                </td>
                <td className="py-4 px-4 text-center font-bold text-sm text-green-700">
                  {stats.pPercent}
                </td>
                <td className="py-4 px-4 text-center font-black text-red-700">
                  {stats.fCount}
                </td>
                <td className="py-4 px-4 text-center font-bold text-sm text-red-700">
                  {stats.fPercent}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-500">
                    <button 
                      onClick={() => onEdit(student)}
                      className="p-1.5 hover:text-sky-600 hover:bg-sky-200 rounded transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => onMove(student)}
                      className="p-1.5 hover:text-orange-500 hover:bg-orange-200 rounded transition-colors"
                    >
                      <ArrowLeftRight size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(student)}
                      className="p-1.5 hover:text-red-600 hover:bg-red-200 rounded transition-colors"
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
