import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { ChessGame } from './components/ChessGame';
import { Profile } from './components/Profile';
import { BackgroundSlider } from './components/BackgroundSlider';
import { DashboardView } from './components/DashboardView';
import { StatisticsView } from './components/StatisticsView';
import { ClassesView } from './components/ClassesView';
import { TournamentsView } from './components/TournamentsView';
import { EmentaView } from './components/EmentaView';
import { PlanoDeCursoView } from './components/PlanoDeCursoView';
import { CentralDasAulasView } from './components/CentralDasAulasView';
import { ExercisesView } from './components/ExercisesView';
import { NotationView } from './components/NotationView';
import { ScheduleView } from './components/ScheduleView';
import { GalleryView } from './components/GalleryView';
import { LessonContentView } from './components/LessonContentView';
import { BibliotecaEscolarView } from './components/BibliotecaEscolarView';
import { SlideViewer } from './components/SlideViewer';
import { RegisterActivitiesView } from './components/RegisterActivitiesView';
import { AssignmentsView } from './components/AssignmentsView';
import { WeatherWidget } from './components/WeatherWidget'; // Import Widget
import { BottomNav } from './components/BottomNav';
import { ViewState, ClassDataMap, ClassData, GalleryData } from './types';
import { mockUserProfile, initialClassData } from './constants';
import { initFirebase, subscribeToClasses, saveClassesToFirestore, subscribeToGallery, saveGalleryToFirestore } from './services/firebaseService';

// --- Global Footer Component ---
const GlobalFooter = () => (
  <footer className="w-full py-6 text-center relative z-50 shrink-0 mt-auto bg-black/30 backdrop-blur-md border-t border-white/10">
    <div className="container mx-auto px-4 flex flex-col items-center gap-1">
        <p className="text-[10px] md:text-xs font-bold text-white drop-shadow-md">
          Desenvolvido por: André Victor Brito de Andrade • CREF 039443 G/RJ
        </p>
      <p className="text-[10px] md:text-xs font-medium text-slate-300">
        Contato: andrevictorbritodeandrade@gmail.com
      </p>
      <p className="text-[10px] md:text-xs font-medium text-slate-400">
        versão: 1.0
      </p>
    </div>
  </footer>
);

// --- Sync Status Indicator ---
const SyncStatusIndicator = ({ status }: { status: 'synced' | 'saving' | 'error' }) => {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 bg-blue-600/20 px-2 py-1 rounded-full border border-blue-500/30">
        <svg className="animate-spin h-3 w-3 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Salvando...</span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-1.5 bg-red-600/20 px-2 py-1 rounded-full border border-red-500/30">
        <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider">Erro ao Salvar</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 bg-green-600/20 px-2 py-1 rounded-full border border-green-500/30 transition-all duration-500">
      <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-[10px] font-bold text-green-200 uppercase tracking-wider">Sincronizado</span>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setView] = useState<ViewState>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'statistics', 'classes', 'tournaments', 'play', 'ementa', 'plano', 'central-aulas', 'exercises', 'notation', 'profile'].includes(hash)) {
      return hash as ViewState;
    }
    return (localStorage.getItem('app_currentView') as ViewState) || 'home';
  });
  
  // Shared State
  const [classData, setClassData] = useState<ClassDataMap>(() => {
    const stored = localStorage.getItem('app_classData');
    return stored ? JSON.parse(stored) : initialClassData;
  });
  const [galleryData, setGalleryData] = useState<GalleryData>(() => {
    const stored = localStorage.getItem('app_galleryData');
    return stored ? JSON.parse(stored) : { images: [] };
  });

  // Persistence Refs
  const isRemoteClassUpdate = useRef(false);
  const hasLoadedClasses = useRef(false);
  const isRemoteGalleryUpdate = useRef(false);
  const hasLoadedGallery = useRef(false);

  // Sync Status State
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');

  // Helper to save classes explicitly
  const handleSaveClasses = async (newData: ClassDataMap) => {
    setSyncStatus('saving');
    try {
      await saveClassesToFirestore(newData);
      setSyncStatus('synced');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSyncStatus('error');
    }
  };

  // Helper to save gallery explicitly
  const handleSaveGallery = async (newData: GalleryData) => {
    setSyncStatus('saving');
    try {
      await saveGalleryToFirestore(newData);
      setSyncStatus('synced');
    } catch (error) {
      console.error("Erro ao salvar galeria:", error);
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    localStorage.setItem('app_classData', JSON.stringify(classData));
    if (hasLoadedClasses.current) {
      if (isRemoteClassUpdate.current) {
        isRemoteClassUpdate.current = false;
      } else {
        handleSaveClasses(classData);
      }
    }
  }, [classData]);

  useEffect(() => {
    localStorage.setItem('app_galleryData', JSON.stringify(galleryData));
    if (hasLoadedGallery.current) {
      if (isRemoteGalleryUpdate.current) {
        isRemoteGalleryUpdate.current = false;
      } else {
        handleSaveGallery(galleryData);
      }
    }
  }, [galleryData]);

  // State for Navigation within Classes
  const [selectedGrade, setSelectedGrade] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('grade') || localStorage.getItem('app_selectedGrade');
  });
  const [selectedClassId, setSelectedClassId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('classId') || localStorage.getItem('app_selectedClassId');
  });

  useEffect(() => {
    localStorage.setItem('app_currentView', currentView);
    window.location.hash = currentView;
    // Expose setView to window for external access (like from ClassesView)
    (window as any).setView = setView;
  }, [currentView]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedGrade) {
      localStorage.setItem('app_selectedGrade', selectedGrade);
      url.searchParams.set('grade', selectedGrade);
    } else {
      localStorage.removeItem('app_selectedGrade');
      url.searchParams.delete('grade');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedGrade]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedClassId) {
      localStorage.setItem('app_selectedClassId', selectedClassId);
      url.searchParams.set('classId', selectedClassId);
    } else {
      localStorage.removeItem('app_selectedClassId');
      url.searchParams.delete('classId');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedClassId]);

  useEffect(() => {
    // Inicializa Firebase ao carregar o app
    const success = initFirebase();
    if(success) {
      // Subscribe to classes
      const unsubClasses = subscribeToClasses((firebaseClasses) => {
        if (Object.keys(firebaseClasses).length > 0) {
          isRemoteClassUpdate.current = true;
          
          let migratedClasses = { ...firebaseClasses };
          let needsSave = false;

          // REMOVE old classes that are not in the new plan
          if (initialClassData && Object.keys(initialClassData).length > 0) {
            Object.keys(migratedClasses).forEach(key => {
              if (!initialClassData[key]) {
                delete migratedClasses[key];
                needsSave = true;
              }
            });
          }

          // Migration: Update schedules, days and student rosters (preserving attendance)
          Object.keys(initialClassData).forEach(id => {
            if (migratedClasses[id]) {
              let classChanged = false;
              
              // Update schedule/days/school if missing or different
              if (migratedClasses[id].schedule !== initialClassData[id].schedule) {
                migratedClasses[id].schedule = initialClassData[id].schedule;
                classChanged = true;
              }
              if (JSON.stringify(migratedClasses[id].days) !== JSON.stringify(initialClassData[id].days)) {
                migratedClasses[id].days = initialClassData[id].days;
                classChanged = true;
              }
              if (migratedClasses[id].school !== initialClassData[id].school) {
                migratedClasses[id].school = initialClassData[id].school;
                classChanged = true;
              }

              // Merge students: keep existing, add new if missing (by name)
              if (initialClassData[id].students) {
                const existingStudentNames = migratedClasses[id].students.map(s => s.name);
                initialClassData[id].students.forEach(newStudent => {
                  if (!existingStudentNames.includes(newStudent.name)) {
                    migratedClasses[id].students.push(newStudent);
                    classChanged = true;
                  }
                });
              }

              if (classChanged) needsSave = true;
            } else {
              // Add missing class from initial data
              migratedClasses[id] = initialClassData[id];
              needsSave = true;
            }
          });
          
          if (needsSave) {
            saveClassesToFirestore(migratedClasses);
          }
          setClassData(migratedClasses);
        } else if (!hasLoadedClasses.current) {
          // Se vazio no servidor, salva o inicial ou o que tem no local storage
          const stored = localStorage.getItem('app_classData');
          let dataToSave = stored ? JSON.parse(stored) : initialClassData;
          
          let needsSave = false;
          // Add missing classes from initialData
          Object.keys(initialClassData).forEach(id => {
            if (!dataToSave[id]) {
              dataToSave[id] = initialClassData[id];
              needsSave = true;
            }
          });
          
          saveClassesToFirestore(dataToSave);
          setClassData(dataToSave);
        }
        hasLoadedClasses.current = true;
      });

      // Subscribe to gallery
      const unsubGallery = subscribeToGallery((firebaseGallery) => {
        if (firebaseGallery && firebaseGallery.images) {
          isRemoteGalleryUpdate.current = true;
          setGalleryData(firebaseGallery);
        } else if (!hasLoadedGallery.current) {
          const stored = localStorage.getItem('app_galleryData');
          if (stored) {
            const dataToSave = JSON.parse(stored);
            saveGalleryToFirestore(dataToSave);
            setGalleryData(dataToSave);
          }
        }
        hasLoadedGallery.current = true;
      });

      return () => {
        unsubClasses();
        unsubGallery();
      };
    }
  }, []);

  // Hardware Back Button Handling
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent default back behavior if we can handle it internally
      if (selectedClassId) {
        setSelectedClassId(null);
        window.history.pushState({ app: 'classes_grade' }, '', window.location.pathname);
      } else if (selectedGrade) {
        setSelectedGrade(null);
        window.history.pushState({ app: 'classes_home' }, '', window.location.pathname);
      } else if (currentView !== 'home') {
        setView('home');
        window.history.pushState({ app: 'home' }, '', window.location.pathname);
      } else {
        // If at home, push state again to prevent exiting the app
        window.history.pushState({ app: 'home' }, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView, selectedGrade, selectedClassId]);

  const goBack = () => {
    if (selectedClassId) {
        setSelectedClassId(null);
    } else if (selectedGrade) {
        setSelectedGrade(null);
    } else {
        setView('home');
    }
  };

  const setViewWithHistory = (v: ViewState) => {
    resetClassesNav(); 
    setView(v);
  };

  const resetClassesNav = () => {
    setSelectedGrade(null);
    setSelectedClassId(null);
  };

  const renderView = () => {
    switch(currentView) {
      case 'home': return <DashboardView setView={setViewWithHistory} />;
      case 'statistics': return <StatisticsView classData={classData} onBack={goBack} />;
      case 'classes': return (
        <ClassesView 
          classData={classData} 
          setClassData={setClassData} 
          onBack={goBack}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          onSave={handleSaveClasses}
        />
      );
      case 'tournaments': return <TournamentsView onBack={goBack} />;
      case 'play': return <ChessGame onBack={goBack} />;
      case 'ementa': return <EmentaView onBack={goBack} />;
      case 'plano': return <PlanoDeCursoView onBack={goBack} />;
      case 'central-aulas': return <CentralDasAulasView onBack={goBack} />;
      case 'exercises': return <ExercisesView onBack={goBack} />;
      case 'notation': return <NotationView onBack={goBack} />;
      case 'lesson-content': return <LessonContentView onBack={goBack} />;
      case 'schedule': return <ScheduleView onBack={goBack} />;
      case 'gallery': return (
        <GalleryView 
          onBack={goBack} 
          data={galleryData} 
          setData={setGalleryData} 
        />
      );
      case 'biblioteca': return <BibliotecaEscolarView onBack={goBack} />;
      case 'profile': return (
        <Profile 
          user={mockUserProfile} 
          onBack={goBack} 
          classData={classData}
          setClassData={setClassData}
        />
      );
          case 'assignments': return <AssignmentsView classData={classData} onBack={goBack} />;
      case 'register-activities': return <RegisterActivitiesView classData={classData} onBack={goBack} />;
    }
  };

  const getTitle = () => {
     switch(currentView) {
      case 'home': return 'Início';
      case 'statistics': return 'Estatísticas';
      case 'classes': 
        if (selectedClassId && classData[selectedClassId]) return classData[selectedClassId].name.toUpperCase();
        if (selectedGrade) return `${selectedGrade}º ANO`;
        return 'Turmas';
      case 'tournaments': return 'Torneios';
      case 'play': return 'Jogar Xadrez';
      case 'ementa': return 'Ementa Escolar';
      case 'plano': return 'Plano de Curso';
      case 'central-aulas': return 'Central das Aulas';
      case 'exercises': return 'Exercícios Táticos';
      case 'notation': return 'Notação Algébrica';
      case 'schedule': return 'Quadro de Horários';
      case 'gallery': return 'Galeria';
      case 'biblioteca': return 'Biblioteca Escolar';
      case 'assignments': return 'Trabalhos';
      case 'register-activities': return 'Registro de Atividades';
      case 'profile': return 'Perfil';
      default: return 'Painel';
    }
  };

  // Slide Viewer State
  const [slideViewerOpen, setSlideViewerOpen] = useState<{ type: 'corpo-midia' | 'altinha-futvolei' } | null>(null);

  useEffect(() => {
    (window as any).openSlideViewer = (type: 'corpo-midia' | 'altinha-futvolei') => setSlideViewerOpen({ type });
  }, []);

  // ... (existing code for App)

  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      {/* Slide Viewer Global Overlay */}
      {slideViewerOpen && (
        <SlideViewer slideType={slideViewerOpen.type} onClose={() => setSlideViewerOpen(null)} />
      )}

      {/* Global Background */}
      <BackgroundSlider />
      
      {/* Wrapper for Content + Footer */}
      <div className="flex-1 flex flex-col z-10">
        
          <div className="flex-1 flex flex-col">
             
             {/* Sidebar */}
             <Sidebar 
               isOpen={isSidebarOpen} 
               onClose={() => setSidebarOpen(false)} 
               currentView={currentView}
               setView={(v) => { resetClassesNav(); setView(v); }}
             />

             {/* Header */}
             <header className="bg-[#1a233b] border-b border-white/10 h-16 flex items-center px-4 sticky top-0 z-30 shadow-2xl shrink-0 transition-all duration-300 text-white">
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="p-2 rounded-xl hover:bg-white/10 text-white focus:outline-none transition-all active:scale-90 mr-3"
               >
                 <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               </button>
               
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-inner hidden md:flex">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                 </div>
                 <div className="flex flex-col justify-center">
                   <h1 className="text-lg md:text-xl font-bold leading-tight line-clamp-1">Prof. André Brito</h1>
                   <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-widest truncate">
                     {currentView === 'home' ? 'Controle de Aulas de Ed. Física' : getTitle()}
                   </p>
                 </div>
               </div>
               
               <div className="ml-auto flex items-center gap-4">
                  <SyncStatusIndicator status={syncStatus} />
                  <WeatherWidget />
               </div>
             </header>

             {/* Main Content Area (Naturally Scrollable) */}
             <main className="flex-1 p-3 md:p-6 pb-20 md:pb-6">
               <div className="max-w-7xl mx-auto pb-6">
                  {renderView()}
               </div>
             </main>

             <BottomNav 
               currentView={currentView} 
               setView={setViewWithHistory} 
             />
             
          </div>
      </div>

      {/* Global Footer (Always visible) */}
      {!slideViewerOpen && <GlobalFooter />}
    </div>
  );
};

export default App;