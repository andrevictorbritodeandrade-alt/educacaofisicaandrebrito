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
import { ViewState, ClassDataMap, ClassData, GalleryData } from './types';
import { mockUserProfile, initialClassData } from './constants';
import { initFirebase, subscribeToClasses, saveClassesToFirestore, subscribeToGallery, saveGalleryToFirestore } from './services/firebaseService';
import { AiAssistant } from './components/AiAssistant';

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
        versão: 1.1
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
    if (hash && ['home', 'statistics', 'classes', 'ementa', 'plano', 'profile', 'decolonial'].includes(hash)) {
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

            // REMOVE EUCLIDES DA CUNHA (User request: "RETRE O COLEGIO EUCLIDES DA CUNHA, PQ PAREI DE DAR AULA LA!!!")
            const initialClassCount = Object.keys(migratedClasses).length;
            migratedClasses = Object.fromEntries(
              Object.entries(migratedClasses).filter(([id, data]) => {
                const isEuclides = data.school && data.school.toLowerCase().includes("euclides");
                return !isEuclides;
              })
            );

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans p-6 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Iniciando Sync de Dados</h1>
        <p className="text-slate-400 font-medium animate-pulse">Sincronizando com a Nuvem...</p>
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
             <header className="bg-neutral-950 border-b border-white/5 h-16 flex items-center px-4 sticky top-0 z-30 shadow-2xl shrink-0 transition-all duration-300 text-white">
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white focus:outline-none transition-all active:scale-90 mr-3 border border-white/10 shadow-lg"
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

      {/* Global Footer (Always visible) */}
      {!slideViewerOpen && <GlobalFooter />}
    </div>
  );
};

export default App;