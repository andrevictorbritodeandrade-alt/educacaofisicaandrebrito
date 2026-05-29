import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { Profile } from './components/Profile';
import { BackgroundSlider } from './components/BackgroundSlider';
import { DashboardView } from './components/DashboardView';
import { StatisticsView } from './components/StatisticsView';
import { ClassesView } from './components/ClassesView';
import { EmentaView } from './components/EmentaView';
import { PlanoDeCursoView } from './components/PlanoDeCursoView';
import { ScheduleView } from './components/ScheduleView';
import { GalleryView } from './components/GalleryView';
import { DecolonialApp } from './components/DecolonialApp';
import { CalendarView } from './components/CalendarView';
import { WeatherWidget } from './components/WeatherWidget';
import { BottomNav } from './components/BottomNav';
import { DailyActivityLogView } from './components/DailyActivityLogView';
import { PortalView } from './components/PortalView';
import { ProfessorLoginView } from './components/ProfessorLoginView';
import { AlunosView } from './components/AlunosView';
import { ViewState, ClassDataMap, ClassData, GalleryData } from './types';
import { mockUserProfile, initialClassData } from './constants';
import { initFirebase, subscribeToClasses, saveClassesToFirestore, subscribeToGallery, saveGalleryToFirestore } from './services/firebaseService';
import { AiAssistant } from './components/AiAssistant';

// --- Global Footer Component ---
const GlobalFooter = () => (
  <footer className="w-full py-6 text-center relative z-50 shrink-0 mt-auto bg-[#fdfaf6]/80 backdrop-blur-md border-t border-slate-300">
    <div className="container mx-auto px-4 flex flex-col items-center gap-1">
        <p className="text-[10px] md:text-xs font-bold text-slate-800">
          Desenvolvido por: André Victor Brito de Andrade • CREF 039443 G/RJ
        </p>
      <p className="text-[10px] md:text-xs font-medium text-slate-600">
        Contato: andrevictorbritodeandrade@gmail.com
      </p>
      <p className="text-[10px] md:text-xs font-medium text-slate-500">
        versão: 1.1
      </p>
    </div>
  </footer>
);

// --- Sync Status Indicator ---
const SyncStatusIndicator = ({ status }: { status: 'synced' | 'saving' | 'error' }) => {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </div>
        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Salvando Dados</span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30">
        <span className="h-2 w-2 bg-red-500 rounded-full"></span>
        <span className="text-[9px] font-black text-red-200 uppercase tracking-widest">Erro de Sync</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
      <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
      <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Sincronizado</span>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'portal' | 'alunos' | 'professor_login' | 'professor'>(() => {
    return (localStorage.getItem('app_accessLevel') as any) || 'portal';
  });
  const [currentView, setView] = useState<ViewState>(() => {

    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'statistics', 'classes', 'ementa', 'plano', 'profile', 'decolonial'].includes(hash)) {
      return hash as ViewState;
    }
    return (localStorage.getItem('app_currentView') as ViewState) || 'home';
  });
  
  useEffect(() => {
    localStorage.setItem('app_accessLevel', accessLevel);
  }, [accessLevel]);

  // Shared State
  const [classData, setClassData] = useState<ClassDataMap>(() => {
    const stored = localStorage.getItem('app_classData');
    const base = stored ? JSON.parse(stored) : { ...initialClassData };
    
    // Ensure all initial daily activities are merged so the user has the pre-filled Cordelia Paiva activities immediately
    Object.keys(initialClassData).forEach(id => {
      if (!base[id]) {
        base[id] = initialClassData[id];
      } else {
        if (initialClassData[id].dailyActivities && initialClassData[id].dailyActivities!.length > 0) {
          if (!base[id].dailyActivities) {
            base[id].dailyActivities = [];
          }
          const existingIds = new Set(base[id].dailyActivities!.map((a: any) => a.id));
          initialClassData[id].dailyActivities!.forEach((act: any) => {
            if (!existingIds.has(act.id)) {
              base[id].dailyActivities!.push(act);
            }
          });
        }
      }
    });
    return base;
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
  const [isInitializing, setIsInitializing] = useState(true);

  // Helper to save classes explicitly with debounce-like behavior for rapid updates
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSaveClasses = async (newData: ClassDataMap) => {
    setSyncStatus('saving');
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveClassesToFirestore(newData);
        setSyncStatus('synced');
      } catch (error) {
        console.error("Erro ao salvar:", error);
        setSyncStatus('error');
      }
    }, 1500); // 1.5s delay to batch rapid attendance marking
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
        setIsInitializing(false);
        if (Object.keys(firebaseClasses).length > 0) {
          isRemoteClassUpdate.current = true;
          
          let migratedClasses = { ...firebaseClasses };
          let needsUpdateRemote = false;

          // Merge local initial structure with remote data to ensure all classes exist
          Object.keys(initialClassData).forEach(id => {
            if (!migratedClasses[id]) {
              migratedClasses[id] = initialClassData[id];
              needsUpdateRemote = true;
            } else {
              // Ensure critical fields (days, schedule) are up to date if missing
              if (!migratedClasses[id].days || migratedClasses[id].days.length === 0) {
                 migratedClasses[id].days = initialClassData[id].days;
                 needsUpdateRemote = true;
              }
              if (!migratedClasses[id].schedule) {
                 migratedClasses[id].schedule = initialClassData[id].schedule;
                 needsUpdateRemote = true;
              }
              if (!migratedClasses[id].school) {
                 migratedClasses[id].school = initialClassData[id].school;
                 needsUpdateRemote = true;
              }
              // Ensure default daily activities (like for Cordelia Paiva classes) are merged in
              if (initialClassData[id].dailyActivities && initialClassData[id].dailyActivities!.length > 0) {
                if (!migratedClasses[id].dailyActivities) {
                  migratedClasses[id].dailyActivities = [];
                }
                const existingIds = new Set(migratedClasses[id].dailyActivities!.map(a => a.id));
                initialClassData[id].dailyActivities!.forEach(act => {
                  if (!existingIds.has(act.id)) {
                    migratedClasses[id].dailyActivities!.push(act);
                    needsUpdateRemote = true;
                  }
                });
              }
            }
          });

            // Explicit cleanup for CIEP198_AP101 requested by user (removing mock names)
            if (migratedClasses["CIEP198_AP101"] && migratedClasses["CIEP198_AP101"].students) {
              const mockNamesList = ["Ana Silva", "Beatriz Costa", "Carlos Oliveira", "Davi Souza", "Eduardo Lima", "Fernanda Rocha", "Gabriel Alves", "Helena Dias", "Igor Martins", "Julia Pereira", "Kaique Santos", "Larissa Gomes", "Miguel Ferreira", "Nicole Ribeiro", "Otávio Castro"];
              const mockNamesSet = new Set(mockNamesList);
              const initialCount = migratedClasses["CIEP198_AP101"].students.length;
              
              migratedClasses["CIEP198_AP101"].students = migratedClasses["CIEP198_AP101"].students.filter(s => {
                const isMock = mockNamesSet.has(s.name) || /\s\d+$/.test(s.name);
                return !isMock;
              });

              if (migratedClasses["CIEP198_AP101"].students.length !== initialCount) {
                needsUpdateRemote = true;
              }
            }

            // REMOVE UNAUTHORIZED SCHOOLS (User request: Only 4 specific schools)
            const allowedSchools = ["CIEP 476", "CIEP 320", "EE Cordelia Paiva", "CIEP 198"];
            const initialClassCount = Object.keys(migratedClasses).length;
            migratedClasses = Object.fromEntries(
              Object.entries(migratedClasses).filter(([id, data]) => {
                return data.school && allowedSchools.includes(data.school);
              })
            );

            if (Object.keys(migratedClasses).length !== initialClassCount) {
              needsUpdateRemote = true;
            }

            if (Object.keys(migratedClasses).length !== initialClassCount) {
              needsUpdateRemote = true;
            }
          
            if (needsUpdateRemote) {
            saveClassesToFirestore(migratedClasses);
          }
          setClassData(migratedClasses);
        } else if (!hasLoadedClasses.current) {
          // If Firestore is empty, initialize with local/blueprint data
          const stored = localStorage.getItem('app_classData');
          let dataToSave = stored ? JSON.parse(stored) : initialClassData;
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
      case 'home': return <DashboardView setView={setViewWithHistory} classData={classData} />;
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
          syncStatus={syncStatus}
        />
      );
      case 'ementa': return <EmentaView onBack={goBack} />;
      case 'plano': return <PlanoDeCursoView onBack={goBack} />;
      case 'schedule': return <ScheduleView onBack={goBack} />;
      case 'gallery': return (
        <GalleryView 
          onBack={goBack} 
          data={galleryData} 
          setData={setGalleryData} 
        />
      );
      case 'profile': return (
        <Profile 
          user={mockUserProfile} 
          onBack={goBack} 
          classData={classData}
          setClassData={setClassData}
        />
      );
      case 'decolonial': return <DecolonialApp onBack={goBack} />;
      case 'calendar': return <CalendarView onBack={goBack} />;
      case 'daily-activities': return (
        <DailyActivityLogView 
          classData={classData} 
          onBack={goBack} 
          setClassData={setClassData}
          onSave={handleSaveClasses}
        />
      );
      default: return <DashboardView setView={setViewWithHistory} classData={classData} />;
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
      case 'ementa': return 'Ementa Escolar';
      case 'plano': return 'Plano de Curso';
      case 'schedule': return 'Quadro de Horários';
      case 'gallery': return 'Galeria';
      case 'profile': return 'Perfil';
      case 'decolonial': return 'Gestão do Professor';
      case 'calendar': return 'Calendário';
      case 'daily-activities': return 'Registro Diário';
      default: return 'Painel';
    }
  };

  // Slide Viewer State
  const [slideViewerOpen, setSlideViewerOpen] = useState<{ type: 'corpo-midia' | 'altinha-futvolei' } | null>(null);

  useEffect(() => {
    (window as any).openSlideViewer = (type: 'corpo-midia' | 'altinha-futvolei') => setSlideViewerOpen({ type });
  }, []);

  // ... (existing code for App)

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfaf6] text-slate-800 font-sans p-6 text-center">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-6 shadow-md"></div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Iniciando Sync de Dados</h1>
        <p className="text-slate-500 font-medium animate-pulse">Sincronizando com a Nuvem...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      {/* Slide Viewer Global Overlay - Placeholder for functionality */}
      {slideViewerOpen && (
        <div className="fixed inset-0 z-[100] bg-black">
           <button onClick={() => setSlideViewerOpen(null)} className="absolute top-4 right-4 text-white z-50">Fechar</button>
           <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
             Iniciando Slides: {slideViewerOpen.type}
           </div>
        </div>
      )}

      {/* Global Background */}
      <BackgroundSlider />
      
      {accessLevel === 'portal' && (
        <PortalView onSelectAccess={(level) => setAccessLevel(level)} />
      )}

      {accessLevel === 'alunos' && (
        <AlunosView 
          onBack={() => setAccessLevel('portal')} 
          classData={classData}
        />
      )}

      {accessLevel === 'professor_login' && (
        <ProfessorLoginView 
          onBack={() => setAccessLevel('portal')} 
          onSuccess={() => {
            setAccessLevel('professor');
            setView('home');
          }} 
        />
      )}

      {/* Wrapper for Content + Footer */}
      {accessLevel === 'professor' && (
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
             <header className="bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-4 sticky top-0 z-30 shadow-2xl shrink-0 transition-all duration-300 text-white">
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="p-2 mr-3 rounded-xl bg-white/5 hover:bg-white/10 text-white focus:outline-none transition-all active:scale-90 border border-white/10 shadow-lg"
               >
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               </button>
               
               <div className="flex items-center gap-3">
                 <div className="flex flex-col justify-center">
                   <h1 className="text-base md:text-lg font-black leading-tight tracking-tighter uppercase">{getTitle() === 'Início' ? 'PROF. ANDRÉ BRITO' : getTitle()}</h1>
                   <p className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] truncate">
                     {currentView === 'home' ? 'Controle de Aulas de Ed. Física' : 'MÓDULO DE GESTÃO'}
                   </p>
                 </div>
               </div>
               
               <div className="ml-auto flex items-center gap-2 md:gap-5">
                  <div className="hidden sm:block">
                    <SyncStatusIndicator status={syncStatus} />
                  </div>
                  <WeatherWidget />
               </div>
             </header>

             {/* Main Content Area (Naturally Scrollable) */}
             <main className="flex-1 p-3 md:p-6 pb-20 md:pb-6">
               <div className="w-full pb-6">
                  {currentView === 'home' ? (
                    <DashboardView setView={setViewWithHistory} classData={classData} />
                  ) : renderView()}
               </div>
             </main>

             <BottomNav 
               currentView={currentView} 
               setView={setViewWithHistory} 
             />
             
          </div>
      </div>
      )}

      {/* Global Footer (Always visible) */}
      {!slideViewerOpen && accessLevel === 'professor' && <GlobalFooter />}
    </div>
  );
};

export default App;