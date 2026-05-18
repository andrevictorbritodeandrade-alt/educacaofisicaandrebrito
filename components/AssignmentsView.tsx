import React from 'react';
import { ChevronLeft, ClipboardList } from 'lucide-react';
import { ClassDataMap, ClassData } from '../types';

interface AssignmentsViewProps {
  classData: ClassDataMap;
  onBack: () => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({ classData, onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Trabalhos e Atividades</h1>
      </header>

      <div className="grid gap-6">
        {Object.values(classData as any).map((cls) => {
          const classItem = cls as ClassData;
          return classItem.assignments && classItem.assignments.length > 0 && (
            <div key={classItem.id} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <ClipboardList className="text-indigo-600" />
                {classItem.name} - {classItem.school}
              </h2>
              <div className="space-y-4">
                {classItem.assignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900">{assignment.title}</h3>
                    <p className="text-sm text-slate-600">{assignment.description}</p>
                    <div className="mt-4 flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Data: {assignment.dueDate}</span>
                      <span>Valor: {assignment.totalPoints} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
