import React, { useState, useEffect } from 'react';
import { ClassData, ClassDataMap, Student } from '../types';
import { PrintPreviewModal } from './PrintPreviewModal';
import { ClassDiaryTable } from './ClassDiaryTable';
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
  syncStatus: 'synced' | 'saving' | 'error';
}

export const ClassesView: React.FC<ClassesViewProps> = ({ 
  classData, 
  setClassData, 
  onBack,
  selectedGrade,
  setSelectedGrade,
  selectedClassId,
  setSelectedClassId,
  onSave,
  syncStatus
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
      <div className="bg-neutral-950 min-h-[500px] p-6 rounded-2xl shadow-2xl border border-white/5 animate-fade-in text-white font-sans max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/5 rounded-2xl mb-6 border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h2 className="text-4xl font-black mb-3 tracking-tighter">DIÁRIO DE CLASSE</h2>
          <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">Selecione a Unidade Escolar</p>
        </div>

        <button 
          onClick={onBack}
          className="mb-10 w-full sm:w-auto px-6 h-12 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-xs font-black uppercase rounded-xl hover:bg-white/10 transition-all active:scale-95 group shadow-lg"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Sair do Controle
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {finalSchools.length > 0 ? finalSchools.map(school => {
            const schoolClasses = getClassesBySchool(school);
            return (
              <button
                key={school}
                onClick={() => setSelectedGrade(school)}
                className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-600 hover:border-blue-500 transition-all text-left relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-2.682.565 1 1 0 00-.639.913V17a1 1 0 01-2 0v-.427a1 1 0 00-.639-.913z" /></svg>
                </div>
                <div className="relative z-10">
                  <p className="text-blue-400 group-hover:text-white text-[10px] font-black mb-1 uppercase tracking-widest">Unidade Escolar</p>
                  <h3 className="text-2xl font-black group-hover:translate-x-1 transition-transform tracking-tight">{school}</h3>
                  <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-slate-500 group-hover:text-white/70 uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    {schoolClasses.length} Turmas de Ed. Física
                  </div>
                </div>
              </button>
            );
          }) : (
            <div className="col-span-full py-20 text-center text-slate-500 uppercase tracking-[0.4em] text-xs font-black opacity-30">
              Nenhuma escola carregada
            </div>
          )}
        </div>
      </div>
    );
  }

  // NÍVEL 2: SELEÇÃO DE TURMA
  if (!selectedClassId) {
    const classes = getClassesBySchool(selectedGrade);
    return (
      <div className="bg-neutral-950 min-h-[500px] p-6 rounded-2xl shadow-2xl border border-white/5 animate-fade-in text-white font-sans max-w-5xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <button 
            onClick={() => setSelectedGrade(null)}
            className="px-6 h-12 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-xs font-black uppercase rounded-xl hover:bg-white/10 transition-all active:scale-95 group shadow-lg"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar
          </button>
          
          <div className="flex flex-col sm:text-right">
             <h2 className="text-3xl font-black tracking-tighter text-blue-500">{selectedGrade}</h2>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Selecione a Turma para Chamada</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all text-left relative group overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col relative z-10">
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">Realizar Chamada</span>
                <h3 className="text-4xl font-black group-hover:translate-x-2 transition-transform tracking-tighter">
                  {cls.name.startsWith('Turma') ? cls.name.replace('Turma ', '') : cls.name}
                </h3>
                
                <div className="mt-8 flex flex-wrap gap-2">
                   {cls.days?.map(d => (
                     <span key={d} className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 rounded text-[9px] font-black text-blue-400 uppercase">{d}</span>
                   ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 border-t border-white/5 pt-4">
                  <span>{cls.students.length} ALUNOS</span>
                  <span className="text-white/60 font-mono text-[10px]">{cls.schedule || '--:--'}</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 opacity-0 group-hover:opacity-5 group-hover:right-4 transition-all">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // NÍVEL 3: LISTA DE CHAMADA
  const currentClass = classData[selectedClassId];
  const sortedStudents = currentClass.students;
  const isCorrectDay = currentClass.days ? currentClass.days.includes(dayOfWeek) : true;

  return (
    <>
    <div className="bg-neutral-950 min-h-screen rounded-xl shadow-2xl overflow-hidden animate-fade-in relative pb-10 text-white font-sans">
      
      {/* Header View - Toolbar Dark Studio Style */}
      <div className="p-4 border-b border-white/5 flex flex-wrap justify-between items-center bg-neutral-950 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedClassId(null)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all shadow-lg active:scale-90"
          >
            <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Data da Chamada</p>
               {syncStatus === 'saving' ? (
                 <span className="flex items-center text-[9px] font-black text-amber-500 animate-pulse bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                   <svg className="animate-spin h-2.5 w-2.5 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   SINCRONIZANDO...
                 </span>
               ) : syncStatus === 'error' ? (
                 <span className="flex items-center text-[9px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                   ERRO AO SINCRONIZAR
                 </span>
               ) : (
                 <span className="flex items-center text-[9px] font-black text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                   <svg className="w-2.5 h-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                   CONECTADO
                 </span>
               )}
             </div>
             <input 
               type="date" 
               value={selectedDate}
               onChange={(e) => setSelectedDate(e.target.value)}
               className="text-lg font-black text-white bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
             />
          </div>

          <div className="hidden md:flex flex-col border-l border-white/10 pl-6">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Horário</p>
            <p className="text-sm font-bold text-white/90">{currentClass.schedule || 'Não definido'}</p>
          </div>

          <div className="hidden md:flex flex-col border-l border-white/10 pl-6">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Dia de Aula</p>
            <p className={`text-sm font-black uppercase tracking-tight ${isCorrectDay ? 'text-green-500' : 'text-red-500'}`}>
               {dayOfWeek}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap">
           <button
             onClick={() => (window as any).setView('schedule')}
             className="px-3 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white text-xs font-black uppercase rounded-xl hover:bg-white/10 transition-all active:scale-95"
           >
             <svg className="w-4 h-4 mr-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Quadro
           </button>

           <button
             id="save-cloud-btn"
             onClick={handleManualSave}
             disabled={syncStatus === 'saving'}
             className="px-4 h-10 flex items-center justify-center bg-red-600 text-white text-xs font-black uppercase rounded-xl shadow-lg hover:bg-red-700 transition-all transform active:scale-95 disabled:opacity-50"
           >
              {syncStatus === 'saving' ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Salvar
                </>
              )}
           </button>

           <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setShowPrintModal(true)}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Imprimir"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('CUIDADO: Restaurar apagará todas as presenças. Continuar?')) {
                    setClassData(prev => ({ ...prev, [selectedClassId!]: initialClassData[selectedClassId!] }));
                  }
                }}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                title="Sincronizar/Restaurar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              
              <button 
                onClick={() => { setNewStudentName(''); setShowAddModal(true); }}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                title="Adicionar Aluno"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </button>

              <button 
                onClick={() => document.getElementById('ai-scan-input')?.click()}
                disabled={isScanning}
                className={`w-8 h-8 flex items-center justify-center text-white/50 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-all ${isScanning ? 'animate-pulse' : ''}`}
                title="Injetar Lista (IA)"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </button>
           </div>
        </div>
      </div>

      {/* --- TABELA DE CHAMADA ESTILO DIÁRIO DE CLASSE (BLACK MODE) --- */}
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xl font-black text-white/90">Diário de Classe</h3>
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Turma {currentClass.name}
            </span>
        </div>
        
        <ClassDiaryTable 
            students={sortedStudents}
            dateStr={dateStr}
            onAttendance={handleAttendance}
            onEdit={(student) => { setNewStudentName(student.name); setShowEditModal(student); }}
            onMove={setShowMoveModal}
            onDelete={setShowDeleteConfirm}
            isCorrectDay={isCorrectDay}
        />
      </div>
      
      {/* Hidden input for AI Scan */}
      <input 
        type="file" 
        accept="image/*,application/pdf"
        onChange={handleAIScan}
        id="ai-scan-input"
        className="hidden"
      />
      
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
      
      {/* Footer do Diário */}
      <div className="px-6 py-4 border-t border-white/5 bg-neutral-950 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
         <span>Escola: {selectedGrade}</span>
         <span>Total de Alunos: {sortedStudents.length}</span>
      </div>
    </>
  );
};