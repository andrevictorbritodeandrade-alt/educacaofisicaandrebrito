import React, { useState, useEffect } from 'react';
import { ClassData, ClassDataMap, Student } from '../types';
import { PrintPreviewModal } from './PrintPreviewModal';
import { saveClassesToFirestore } from '../services/firebaseService';
import { initialClassData } from '../constants';
import { scanStudentList } from '../services/geminiService';

interface ClassesViewProps {
  classData: ClassDataMap;
  setClassData: React.Dispatch<React.SetStateAction<ClassDataMap>>;
  onBack: () => void;
  // Props recebidas do App.tsx para controle de navegação
  selectedGrade: string | null;
  setSelectedGrade: (grade: string | null) => void;
  selectedClassId: string | null;
  setSelectedClassId: (id: string | null) => void;
  onSave: (data: ClassDataMap) => Promise<void>;
}

export const ClassesView: React.FC<ClassesViewProps> = ({ 
  classData, 
  setClassData, 
  onBack,
  selectedGrade,
  setSelectedGrade,
  selectedClassId,
  setSelectedClassId,
  onSave
}) => {
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Student | null>(null);
  const [showMoveModal, setShowMoveModal] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Student | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  // Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Input States
  const [newStudentName, setNewStudentName] = useState('');
  const [targetClassId, setTargetClassId] = useState('');
  
  // Date Logic
  const getTodayISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayOfWeek = (isoDate: string) => {
    if (!isoDate) return '';
    // Adicionando T12:00:00 para evitar problemas de fuso horário que podem mudar o dia
    const date = new Date(`${isoDate}T12:00:00`);
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  const dayOfWeek = getDayOfWeek(selectedDate);

  // Sincroniza com localStorage apenas para persistir durante a sessão se necessário, 
  // mas o estado inicial agora é sempre hoje ao montar o componente.
  useEffect(() => {
    localStorage.setItem('app_selectedDate', selectedDate);
  }, [selectedDate]);

  const getFormattedDate = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}`;
  };

  const dateStr = getFormattedDate(selectedDate);

  // --- CRUD ACTIONS ---

  // Helper para ordenar array de alunos
  const sortStudentsAlphabetically = (students: Student[]) => {
    return [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  };

  const sortClassAlphabetically = () => {
    if (!selectedClassId) return;
    // Agora apenas força a reordenação caso algo esteja fora de ordem, sem perguntar
    setClassData(prev => {
        const newData = { ...prev };
        newData[selectedClassId].students = sortStudentsAlphabetically(newData[selectedClassId].students);
        return newData;
    });
  };

  const handleAttendance = (studentId: number, status: 'P' | 'F') => {
    if (!selectedClassId) return;

    // Feedback visual de "Salvando..."
    setIsSaving(true);

    setClassData((prev) => {
      const newData = { ...prev };
      if (!newData[selectedClassId]) return prev;

      const studentIndex = newData[selectedClassId].students.findIndex(s => s.id === studentId);
      if (studentIndex >= 0) {
        const updatedStudents = [...newData[selectedClassId].students];
        const currentStudent = updatedStudents[studentIndex];
        
        // Lógica de Toggle: Se já estiver com o status clicado, remove (null). Se for diferente, aplica o novo.
        const currentStatus = currentStudent.attendance[dateStr];
        const newStatus = currentStatus === status ? null : status;

        const newAttendance = { ...currentStudent.attendance };

        if (newStatus === null) {
          delete newAttendance[dateStr]; // Remove a marcação se for toggle
        } else {
          newAttendance[dateStr] = newStatus; // Aplica nova marcação
        }

        updatedStudents[studentIndex] = {
          ...currentStudent,
          attendance: newAttendance
        };
        
        newData[selectedClassId] = {
          ...newData[selectedClassId],
          students: updatedStudents
        };
      }
      return newData;
    });

    // Pequeno delay para o feedback visual de salvamento
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await onSave(classData);
      // Feedback visual rápido
      const btn = document.getElementById('save-cloud-btn');
      if(btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Salvo!';
        setTimeout(() => { btn.innerHTML = originalText }, 2000);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao sincronizar com a nuvem.");
    } finally {
      setIsSaving(false);
    }
  };

  const addStudent = () => {
    if (!newStudentName.trim() || !selectedClassId) return;
    
    const newId = Date.now(); // Simple unique ID
    const newStudent: Student = {
      id: newId,
      name: newStudentName.trim(),
      attendance: {}
    };

    setClassData(prev => {
      const newData = { ...prev };
      // Adiciona e ordena imediatamente
      const updatedList = [...newData[selectedClassId].students, newStudent];
      newData[selectedClassId].students = sortStudentsAlphabetically(updatedList);
      
      // Salva imediatamente na nuvem
      
      return newData;
    });
    setNewStudentName('');
    setShowAddModal(false);
  };

  const updateStudentName = () => {
    if (!showEditModal || !selectedClassId || !newStudentName.trim()) return;

    setClassData(prev => {
      const newData = { ...prev };
      const students = newData[selectedClassId].students.map(s => 
        s.id === showEditModal.id ? { ...s, name: newStudentName.trim() } : s
      );
      // Reordena após editar o nome para manter a lista correta
      newData[selectedClassId].students = sortStudentsAlphabetically(students);
      
      return newData;
    });
    setShowEditModal(null);
    setNewStudentName('');
  };

  const deleteStudent = () => {
    if (!showDeleteConfirm || !selectedClassId) return;

    setClassData(prev => {
      const newData = { ...prev };
      newData[selectedClassId].students = newData[selectedClassId].students.filter(s => s.id !== showDeleteConfirm.id);
      
      return newData;
    });
    setShowDeleteConfirm(null);
  };

  const moveStudent = () => {
    if (!showMoveModal || !selectedClassId || !targetClassId) return;

    setClassData(prev => {
      const newData = { ...prev };
      
      const studentToMove = newData[selectedClassId].students.find(s => s.id === showMoveModal.id);
      if (!studentToMove) return prev;

      // Remove da turma atual
      newData[selectedClassId].students = newData[selectedClassId].students.filter(s => s.id !== showMoveModal.id);

      // Adiciona na nova turma e ORDENA a nova turma
      if (newData[targetClassId]) {
        const newTargetList = [...newData[targetClassId].students, studentToMove];
        newData[targetClassId].students = sortStudentsAlphabetically(newTargetList);
      }

      return newData;
    });
    setShowMoveModal(null);
    setTargetClassId('');
  };

  const handleAIScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClassId) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const names = await scanStudentList(base64, file.type);
        
        if (names.length > 0) {
          setClassData(prev => {
            const newData = { ...prev };
            const currentStudents = newData[selectedClassId].students;
            
            const newStudents: Student[] = names.map((name, i) => ({
              id: Date.now() + i,
              name: name.toUpperCase(),
              attendance: {}
            }));

            const combinedList = [...currentStudents, ...newStudents];
            // Remove duplicates by name
            const uniqueList = combinedList.filter((s, index, self) => 
              index === self.findIndex((t) => t.name === s.name)
            );

            newData[selectedClassId].students = sortStudentsAlphabetically(uniqueList);
            return newData;
          });
          alert(`${names.length} alunos identificados e adicionados!`);
        } else {
          alert("Nenhum nome pôde ser identificado na lista.");
        }
      };
    } catch (error) {
      console.error("Scan error:", error);
      alert("Erro ao processar imagem/PDF. Tente novamente.");
    } finally {
      setIsScanning(false);
      // Reset input
      e.target.value = '';
    }
  };

  const getClassesBySchool = (school: string): ClassData[] => {
    return (Object.values(classData) as ClassData[]).filter((c: ClassData) => c.school === school);
  };

  // Helper for stats
  const getStats = (student: Student) => {
    const totalDays = Object.keys(student.attendance).length;
    if (totalDays === 0) return { pCount: 0, pPercent: 0, fCount: 0, fPercent: 0 };
    
    const pCount = Object.values(student.attendance).filter(v => v === 'P').length;
    const fCount = Object.values(student.attendance).filter(v => v === 'F').length;
    
    return {
      pCount,
      fCount,
      pPercent: Math.round((pCount / totalDays) * 100),
      fPercent: Math.round((fCount / totalDays) * 100)
    };
  };

  const schools = Array.from(new Set(
    (Object.values(classData || {}) as ClassData[])
      .map(c => c.school)
      .filter(school => school && typeof school === 'string')
  )).sort();

  // Se schools estiver vazio e tivermos dados iniciais, tenta usá-los como falha
  const finalSchools = schools.length > 0 ? schools : Array.from(new Set(
    (Object.values(initialClassData) as ClassData[])
      .map(c => c.school)
  )).sort();

  // Validação de estado persistido: se a escola selecionada não existe mais nos dados, reseta.
  useEffect(() => {
    if (selectedGrade && !schools.includes(selectedGrade)) {
      setSelectedGrade(null);
    }
  }, [selectedGrade, schools, setSelectedGrade]);

  // Validação de turma selecionada: se a turma não existe nos dados, reseta.
  useEffect(() => {
    if (selectedClassId && !classData[selectedClassId]) {
      setSelectedClassId(null);
    }
  }, [selectedClassId, classData, setSelectedClassId]);

  // --- VIEWS ---

  // NÍVEL 1: SELEÇÃO DE ESCOLA
  if (!selectedGrade) {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
        {/* Header Profissional (Integrado na View se não houver global) */}
        <div className="bg-[#1a233b] text-white p-6 rounded-t-2xl flex items-center gap-4 shadow-xl border-b border-white/10">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-inner">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Prof. André Brito</h1>
            <p className="text-slate-400 text-sm">Controle de Aulas de Ed. Física</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-b-2xl shadow-xl min-h-[500px]">
          <h2 className="text-lg font-bold text-slate-700 text-center mb-8">Selecione a Escola para Chamada</h2>
          
          <div className="space-y-4">
            {finalSchools.length > 0 ? finalSchools.map((school) => {
              const schoolClasses = getClassesBySchool(school);
              return (
                <div 
                  key={school}
                  onClick={() => setSelectedGrade(school)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group shadow-sm active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold text-slate-800 leading-tight">{school}</h3>
                    <p className="text-slate-500 text-sm font-medium">{schoolClasses.length} turmas cadastradas</p>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-20 opacity-50">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhuma escola encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // NÍVEL 2: SELEÇÃO DE TURMA
  if (!selectedClassId) {
    const classes = getClassesBySchool(selectedGrade);
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-4">
        {/* Header similar ao Nível 1 */}
        <div className="bg-[#1a233b] text-white p-6 rounded-t-2xl flex items-center gap-4 shadow-xl border-b border-white/10">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-inner">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Prof. André Brito</h1>
            <p className="text-slate-400 text-sm">Controle de Aulas de Ed. Física</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-b-2xl shadow-xl min-h-[500px]">
          <button 
            onClick={() => setSelectedGrade(null)}
            className="mb-6 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para Escolas
          </button>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-8 border-l-8 border-l-blue-500 shadow-sm">
             <div className="flex items-center gap-3 mb-1">
               <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <h2 className="text-xl font-extrabold text-slate-800 uppercase">{selectedGrade}</h2>
             </div>
             <p className="text-slate-500 text-sm font-medium ml-8">Selecione uma turma para realizar a chamada.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map(cls => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md transition-all group"
              >
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">Turma {cls.name}</h3>
                  <div className="flex flex-col mt-1">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">{cls.students.length} alunos matriculados</p>
                    {cls.schedule && (
                      <p className="text-blue-600 text-xs font-bold mt-1">
                        🕒 {cls.schedule}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-500 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // NÍVEL 3: LISTA DE CHAMADA
  const currentClass = classData[selectedClassId];
  const sortedStudents = currentClass.students;

  return (
    <>
    <div className="glass-panel rounded-xl shadow-sm overflow-hidden animate-fade-in relative pb-4">
      
      {/* Header View - Toolbar Compacta */}
      <div className="p-3 border-b border-slate-200 flex flex-row justify-between items-center bg-slate-100">
        <div className="flex items-center">
          <button 
            onClick={() => setSelectedClassId(null)}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-slate-200 text-slate-700 transition border border-slate-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="ml-3 flex flex-col">
             <div className="flex items-center gap-2">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Data da Chamada</p>
               {isSaving ? (
                 <span className="flex items-center text-[9px] font-bold text-amber-600 animate-pulse">
                   <svg className="animate-spin h-2 w-2 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   SALVANDO...
                 </span>
               ) : (
                 <span className="flex items-center text-[9px] font-bold text-green-600">
                   <svg className="w-2 h-2 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   SALVO
                 </span>
               )}
             </div>
             <input 
               type="date" 
               value={selectedDate}
               onChange={(e) => setSelectedDate(e.target.value)}
               className="text-sm font-bold text-blue-600 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
             />
          </div>
          {currentClass.schedule && (
            <div className="ml-6 flex flex-col">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Horário</p>
              <p className="text-sm font-bold text-slate-700">{currentClass.schedule}</p>
            </div>
          )}
          {currentClass.days && (
            <div className={`ml-6 flex flex-col px-3 py-1 rounded-lg ${currentClass.days.includes(dayOfWeek) ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${currentClass.days.includes(dayOfWeek) ? 'text-green-600' : 'text-red-600'}`}>
                {currentClass.days.includes(dayOfWeek) ? '✓ Dia de Aula' : '⚠ Não é dia de aula'}
              </p>
              <p className="text-sm font-bold text-slate-700">{currentClass.days.join(', ')}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
           {/* Botão Quadro de Horários */}
           <button
             onClick={() => (window as any).setView('schedule')}
             className="px-3 py-2 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-600 transition"
             title="Quadro de Horários"
           >
             <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Quadro
           </button>
           {/* Botão Salvar na Nuvem */}
           <button
             id="save-cloud-btn"
             onClick={handleManualSave}
             disabled={isSaving}
             className="px-4 py-2 flex items-center justify-center bg-green-600 text-white text-xs font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-wait"
             title="Salvar na Nuvem"
           >
              {isSaving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Salvar
                </>
              )}
           </button>

           <button
             onClick={() => setShowPrintModal(true)}
             className="w-10 h-10 flex items-center justify-center bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-900 transition"
             title="Imprimir"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
           </button>

           <button
             onClick={() => {
               if (window.confirm('Tem certeza que deseja restaurar a lista original desta turma? Isso apagará as presenças e alunos adicionados manualmente.')) {
                 setClassData(prev => {
                   const newData = { ...prev };
                   newData[selectedClassId!] = initialClassData[selectedClassId!];
                   return newData;
                 });
               }
             }}
             className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition"
             title="Restaurar Lista Original"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           </button>
           
          <button 
            onClick={() => { setNewStudentName(''); setShowAddModal(true); }}
            className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            title="Adicionar Aluno"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>

          <div className="relative">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={handleAIScan}
                id="ai-scan-input"
                className="hidden"
                disabled={isScanning}
              />
              <button 
                onClick={() => document.getElementById('ai-scan-input')?.click()}
                disabled={isScanning}
                className={`w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition relative ${isScanning ? 'animate-pulse opacity-70' : ''}`}
                title="Escanear Lista (IA)"
              >
                {isScanning ? (
                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-[8px] font-black px-1 rounded text-slate-900 border border-white">IA</div>
              </button>
          </div>
        </div>
      </div>

      {/* --- LISTA DE ALUNOS (LAYOUT UNIFICADO E RESPONSIVO) --- */}
      <div className="space-y-3 p-3 bg-slate-50/50">
        {sortedStudents.map((student, index) => {
          const status = student.attendance[dateStr];
          const stats = getStats(student);
          const isCorrectDay = currentClass.days ? currentClass.days.includes(dayOfWeek) : true;
          
          return (
            <div key={student.id} className={`bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3 transition-opacity ${!isCorrectDay ? 'opacity-75 grayscale-[0.5]' : 'border-slate-200'}`}>
              {/* Row 1: Number, Name, Actions */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-black text-slate-500 bg-slate-100 rounded-lg">{index + 1}</span>
                    <h4 className="font-bold text-slate-800 text-base truncate leading-tight">{student.name}</h4>
                 </div>
                 
                 {!isCorrectDay && (
                   <span className="text-[9px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase tracking-tighter">Bloqueado</span>
                 )}
                 
                 <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button 
                      onClick={() => { setNewStudentName(student.name); setShowEditModal(student); }} 
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                     <button 
                       onClick={() => setShowMoveModal(student)} 
                       className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded transition"
                       title="Mover"
                     >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                     <button 
                       onClick={() => setShowDeleteConfirm(student)} 
                       className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                       title="Excluir"
                     >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 </div>
              </div>

              {/* Row 2: Attendance Grid (Presence/Absence) */}
              <div className="grid grid-cols-2 gap-3 h-12 relative">
                 {!isCorrectDay && (
                    <div className="absolute inset-0 z-10 cursor-not-allowed" title="Apenas segundas ou sextas conforme a turma" />
                 )}
                 {/* Botão Presença */}
                 <button
                   onClick={() => isCorrectDay && handleAttendance(student.id, 'P')}
                   disabled={!isCorrectDay}
                   className={`rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                     status === 'P'
                     ? 'bg-green-600 text-white shadow-green-500/30 ring-2 ring-green-600 ring-offset-1'
                     : 'bg-slate-50 text-slate-400 hover:bg-green-100 hover:text-green-600 border border-slate-200'
                   } ${!isCorrectDay ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                 >
                   {status === 'P' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                   Presença
                 </button>

                 {/* Botão Falta */}
                 <button
                   onClick={() => isCorrectDay && handleAttendance(student.id, 'F')}
                   disabled={!isCorrectDay}
                   className={`rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                     status === 'F'
                     ? 'bg-red-600 text-white shadow-red-500/30 ring-2 ring-red-600 ring-offset-1'
                     : 'bg-slate-50 text-slate-400 hover:bg-red-100 hover:text-red-600 border border-slate-200'
                   } ${!isCorrectDay ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                 >
                   {status === 'F' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                   Falta
                 </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* --- MODALS --- */}
      
      {/* Print Preview Modal */}
      <PrintPreviewModal 
        isOpen={showPrintModal} 
        onClose={() => setShowPrintModal(false)}
        classData={currentClass}
        dateStr={dateStr}
      />

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Adicionar Novo Aluno</h3>
            <input 
              autoFocus
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nome Completo"
              value={newStudentName}
              onChange={e => setNewStudentName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Cancelar</button>
              <button onClick={addStudent} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Editar Nome</h3>
            <input 
              autoFocus
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newStudentName}
              onChange={e => setNewStudentName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Cancelar</button>
              <button onClick={updateStudentName} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Move Student Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Mover Aluno</h3>
            <p className="text-sm text-slate-500 mb-4">Mover <b>{showMoveModal.name}</b> para qual turma?</p>
            
            <select 
              className="w-full p-3 border rounded-lg mb-4 bg-slate-50"
              value={targetClassId}
              onChange={e => setTargetClassId(e.target.value)}
            >
              <option value="">Selecione a turma...</option>
              {(Object.values(classData) as ClassData[])
                .filter(c => c.id !== selectedClassId) // Don't show current class
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowMoveModal(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Cancelar</button>
              <button 
                onClick={moveStudent} 
                disabled={!targetClassId}
                className="px-4 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 disabled:opacity-50"
              >
                Mover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Aluno?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Tem certeza que deseja remover <b>{showDeleteConfirm.name}</b>?<br/>
              Essa ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded font-bold">Cancelar</button>
              <button onClick={deleteStudent} className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
};