import React, { useState } from 'react';
import { ArrowLeft, Save, BookOpen, ClipboardList } from 'lucide-react';
import { ClassDataMap, ClassData } from '../types';

interface RegisterActivitiesViewProps {
  classData: ClassDataMap;
  onBack: () => void;
}

export const RegisterActivitiesView: React.FC<RegisterActivitiesViewProps> = ({ classData, onBack }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('AP 101');
  const [activityDescription, setActivityDescription] = useState('');
  const [attendance, setAttendance] = useState('');

  const handleSave = () => {
    alert(`Atividade salva para ${selectedClassId}: ${activityDescription}\nPresença registrada: ${attendance}`);
  };

  return (
    <div className="p-6 font-sans">
      <button onClick={onBack} className="text-white mb-6 flex items-center hover:text-orange-400 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar ao Painel
      </button>

      <h1 className="text-3xl font-extrabold text-white mb-8 uppercase tracking-tighter">Registro de Atividades e Presença</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Classes List / Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Escolha a Turma</h2>
            <div className="space-y-4">
                {(Object.values(classData) as ClassData[]).map(cls => (
                    <button 
                        key={cls.id}
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`w-full p-4 rounded-xl text-left border-2 flex items-center gap-4 ${selectedClassId === cls.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                        <BookOpen className={`w-6 h-6 ${selectedClassId === cls.id ? 'text-blue-500' : 'text-slate-400'}`} />
                        <div>
                            <p className="font-bold">{cls.name}</p>
                            <p className="text-xs text-slate-500">{cls.school}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Activity/Attendance Input */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Registrar para: {selectedClassId}</h2>
            <textarea 
                className="w-full h-32 p-4 border rounded-xl mb-4"
                placeholder="Descreva a atividade de hoje..."
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
            />
            <textarea 
                className="w-full h-32 p-4 border rounded-xl mb-4"
                placeholder="Liste os alunos presentes..."
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
            />
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                <Save className="w-5 h-5" /> Salvar Atividade e Presença
            </button>
        </div>
      </div>
    </div>
  );
};
