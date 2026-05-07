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
          Imprimir Plano / PDF
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

          {/* ENSINO FUNDAMENTAL */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100 print:bg-transparent">
              <BookOpen className="text-indigo-600 w-8 h-8" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Ensino Fundamental – Anos Finais (6º e 8º / AP)</h3>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4">Objetivo Geral: Ampliar o repertório motor e cultural, com ênfase na cultura corporal afro-brasileira e dos povos originários.</p>
            
            <div className="space-y-6">
              <div className="pl-6 border-l-4 border-indigo-200 space-y-3">
                <h4 className="font-black text-indigo-700 text-lg uppercase tracking-tighter">🔹 1º Trimestre (08/05 a 18/05)</h4>
                <p className="text-sm font-medium">Diagnóstico e acolhimento. Avaliação Diagnóstica através de jogos de invasão e combinados de convivência.</p>
              </div>

              <div className="pl-6 border-l-4 border-indigo-200 space-y-4">
                <h4 className="font-black text-indigo-700 text-lg uppercase tracking-tighter">🔹 2º Trimestre (19/05 a 04/09)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">1. Lutas e Oposição</p>
                    <p className="text-xs">Capoeira, Huka-Huka, Luta Marajoara, Briga de Galo, Cabo de Guerra Humano.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">2. Jogos e Estratégia</p>
                    <p className="text-xs">Lençolbol, Pega Corrente, Shisima, Mancala, Bandeirinha, Carimba.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl md:col-span-2">
                    <p className="font-bold text-xs uppercase mb-2">3. Atletismo e Circo</p>
                    <p className="text-xs">Corridas, Revezamento, Salto, Arremesso de Pelota, Malabares, Perna de Pau, Peteca.</p>
                  </div>
                </div>
              </div>

              <div className="pl-6 border-l-4 border-indigo-200 space-y-4">
                <h4 className="font-black text-indigo-700 text-lg uppercase tracking-tighter">🔹 3º Trimestre (08/09 a 23/12)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">1. Danças de Matriz Africana e Originária</p>
                    <p className="text-xs">Jongo, Maculelê, Maracatu Rural, Hip Hop, Funk, Frevo.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">2. Brincadeiras Populares</p>
                    <p className="text-xs">Elástico, Cinco Marias, Amarelinha, Corda, Construção de Brinquedos.</p>
                  </div>
                </div>
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                  <p className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-2 text-center">Resgate da Cultura Africana e Originária (Novembro Negro)</p>
                  <p className="text-sm text-center">Brincadeiras como Terra e Mar (Quiz África/POVOS), Ampe, Pega-Penta Senegalês. Culminância: Sarau Afro.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ENSINO MÉDIO */}
          <section className="space-y-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 print:bg-transparent">
              <Target className="text-emerald-600 w-8 h-8" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Ensino Médio / EJANEM (1ª Série)</h3>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4">Objetivo Geral: Analisar criticamente as práticas corporais em saúde, trabalho, racismo e autonomia.</p>

            <div className="space-y-6">
              <div className="pl-6 border-l-4 border-emerald-200 space-y-3">
                <h4 className="font-black text-emerald-700 text-lg uppercase tracking-tighter">🔹 1º Trimestre (Diagnóstico)</h4>
                <p className="text-sm font-medium">Roda de conversa, Diário Corporal: "O que meu corpo significa para mim?". Queimado com regras reconstrutivas.</p>
              </div>

              <div className="pl-6 border-l-4 border-emerald-200 space-y-4">
                <h4 className="font-black text-emerald-700 text-lg uppercase tracking-tighter">🔹 2º Trimestre</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/30 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">1. Esporte e Mídia</p>
                    <p className="text-xs">Racismo no esporte, papel da imprensa, esporte comunitário e mapeamento de lazer.</p>
                  </div>
                  <div className="bg-emerald-50/30 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">2. Primeiros Socorros</p>
                    <p className="text-xs">SAMU, Heimlich, Desmaio, Convulsão, Fraturas, Queimaduras (Simulações).</p>
                  </div>
                  <div className="bg-emerald-50/30 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">3. Saúde do Trabalhador</p>
                    <p className="text-xs">LER/DORT, Postura, Ginástica Laboral, Automassagem e Relaxamento.</p>
                  </div>
                  <div className="bg-emerald-50/30 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">4. Lutas</p>
                    <p className="text-xs">Luta Marajoara, Huka-Huka, Capoeira (Adaptações Adultos).</p>
                  </div>
                </div>
              </div>

              <div className="pl-6 border-l-4 border-emerald-200 space-y-4">
                <h4 className="font-black text-emerald-700 text-lg uppercase tracking-tighter">🔹 3º Trimestre</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/30 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">1. Projeto de Vida Ativa</p>
                    <p className="text-xs">Treino com peso corporal, mapa afetivo do bairro, socialização de planos.</p>
                  </div>
                  <div className="bg-emerald-50/30 p-4 rounded-xl">
                    <p className="font-bold text-xs uppercase mb-2">2. Danças de Matriz Afro e Originária</p>
                    <p className="text-xs">Jongo, Dança dos Orixás, Ijexá, Ciranda, Samba de Roda, Toré.</p>
                  </div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <p className="font-black text-emerald-900 text-xs uppercase tracking-widest mb-2 text-center text-indigo-700">Mês da Consciência Negra (Novembro)</p>
                  <p className="text-sm text-center">Luiz Gama e várzea, Anemia Falciforme, Feijoada Imaterial. Sarau Afro de Encerramento.</p>
                </div>
              </div>
            </div>
          </section>

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
