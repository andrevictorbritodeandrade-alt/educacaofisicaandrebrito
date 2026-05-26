import React from 'react';
import { FileText, Printer, ChevronLeft, BookOpen, Target, Layers } from 'lucide-react';

interface PlanoDeCursoViewProps {
  onBack: () => void;
}

export const PlanoDeCursoView: React.FC<PlanoDeCursoViewProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto">
      {/* Header - Not visible in print */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 print:hidden">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white font-bold transition-all shadow-lg hover:bg-white/20 flex items-center active:scale-95 border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Menu Anterior
        </button>
        <button 
          onClick={handlePrint}
          className="px-8 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:bg-indigo-500 flex items-center active:scale-95 transform hover:-translate-y-1"
        >
          <Printer className="w-5 h-5 mr-3" />
          Imprimir / PDF
        </button>
      </header>

      {/* Document Content */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-white/20 relative overflow-hidden print:shadow-none print:border-none print:p-0 print:rounded-none">
        <div className="space-y-12 relative z-10 text-slate-800 font-serif leading-relaxed">
          
          <div className="text-center border-b-2 border-slate-900 pb-10 mb-12">
             <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-slate-900">Plano de Curso Trimestral</h1>
             <h2 className="text-2xl font-bold uppercase tracking-tight text-indigo-700 mb-6 font-sans">Educação Física</h2>
             <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-slate-500 uppercase tracking-widest font-sans">
                <span>Professor: André Brito</span>
                <span>Rede: SEEDUC-RJ</span>
                <span>Ano Letivo: 2026</span>
             </div>
          </div>

          {[
            { title: '8º Ano & AP', color: 'indigo' },
            { title: 'ILGCH', color: 'purple' }
          ].map((turma) => (
            <section key={turma.title} className="space-y-8 pt-8 border-t border-slate-100">
                <div className={`flex items-center gap-4 bg-${turma.color}-50 p-4 rounded-2xl border border-${turma.color}-100 print:bg-transparent`}>
                    <BookOpen className={`text-${turma.color}-600 w-8 h-8`} />
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{turma.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {/* 2º Trimestre */}
                  <div className="pl-6 border-l-4 border-indigo-200 space-y-4">
                    <h4 className="font-black text-indigo-700 text-lg uppercase tracking-tighter">🔹 2º Trimestre (19/05 a 04/09)</h4>
                    {/* Exemplo de card de aula no novo formato estruturado */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-xs">Aula Prova (18/08)</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-xs">Aula Segunda Chamada (25/08)</p>
                       </div>
                       <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700">
                          <p className="font-bold text-xs">Recuperação (01/09)</p>
                       </div>
                    </div>
                  </div>

                  {/* 3º Trimestre */}
                  <div className="pl-6 border-l-4 border-indigo-200 space-y-4">
                    <h4 className="font-black text-indigo-700 text-lg uppercase tracking-tighter">🔹 3º Trimestre (08/09 a 23/12)</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-xs">Aula Prova (18/11)</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-xs">Aula Segunda Chamada (25/11)</p>
                       </div>
                       <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700">
                          <p className="font-bold text-xs">Recuperação (02/12)</p>
                       </div>
                    </div>
                  </div>
                </div>
            </section>
          ))}

          <footer className="mt-20 pt-10 border-t border-slate-200 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>Documento Gerado: {new Date().toLocaleDateString('pt-BR')}</span>
             <span className="text-emerald-900">Plano Oficial de Curso • 2026</span>
          </footer>
        </div>
      </div>
      <style>{`
        @media print {
          body { background: white !important; }
          .animate-fade-in { animation: none !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
};
