import React from 'react';
import { FileText, Printer, ChevronLeft } from 'lucide-react';

interface EmentaViewProps {
  onBack: () => void;
}

export const EmentaView: React.FC<EmentaViewProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-4xl mx-auto">
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
          className="px-8 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:bg-emerald-500 flex items-center active:scale-95 transform hover:-translate-y-1"
        >
          <Printer className="w-5 h-5 mr-3" />
          Imprimir / PDF
        </button>
      </header>

      {/* Document Content */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-white/20 relative overflow-hidden print:shadow-none print:border-none print:p-0 print:rounded-none">
        {/* Background watermark - Hidden in print */}
        <div className="absolute top-0 right-0 p-12 text-9xl opacity-5 select-none pointer-events-none print:hidden">
          📄
        </div>

        {/* Official Document Style */}
        <div className="space-y-10 relative z-10 text-slate-800 font-serif leading-relaxed">
          
          <div className="text-center border-b-2 border-slate-900 pb-10 mb-12">
             <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center text-4xl shadow-inner border border-slate-200">
               🏛️
             </div>
             <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-slate-900">Ementa da Disciplina</h1>
             <h2 className="text-2xl font-bold uppercase tracking-tight text-indigo-700 mb-6">Educação Física</h2>
             <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span>Professor: André Brito</span>
                <span>Rede: SEEDUC-RJ</span>
                <span>Ano: 2026</span>
             </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-xl font-black uppercase border-l-4 border-indigo-600 pl-4 text-slate-900">1. Ementa</h3>
            <p className="text-justify font-medium">
              A Educação Física, inserida na área de Linguagens e suas Tecnologias, compreende o movimento humano como fenômeno cultural, político e histórico. A disciplina promove o acesso crítico e vivencial às práticas corporais sistematizadas — jogos, esportes, lutas, danças, ginásticas e práticas corporais de aventura — problematizando as relações de poder, os estereótipos e as desigualdades que atravessam o corpo. Em consonância com a Lei nº 10.639/03, a ementa incorpora de forma transversal e intencional a cultura corporal de matriz africana, afro-brasileira e dos povos originários, reconhecendo o chão da escola pública como território de resistência e produção de conhecimento. O planejamento valoriza a realidade periférica: espaços reduzidos, poucos materiais, turmas numerosas e a urgência de uma educação antirracista. A disciplina se constrói na articulação entre o saber-fazer (vivência), o saber-sobre (análise crítica) e o saber-ser (autonomia e cidadania).
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-black uppercase border-l-4 border-indigo-600 pl-4 text-slate-900">2. Objetivos Gerais</h3>
            <ul className="list-disc pl-6 space-y-3 font-medium">
              <li>Ampliar o repertório motor e cultural dos estudantes, promovendo o acesso qualificado às práticas corporais.</li>
              <li>Analisar criticamente os padrões de corpo, saúde e beleza difundidos pela mídia, contrapondo-os à realidade periférica.</li>
              <li>Reconhecer as lutas, danças e jogos de matriz africana, afro-brasileira e dos povos originários como patrimônio imaterial do povo brasileiro, combatendo o racismo estrutural e religioso.</li>
              <li>Desenvolver a capacidade de cooperação, respeito às regras e resolução pacífica de conflitos.</li>
              <li>Refletir sobre as relações entre lazer, trabalho e saúde, com especial atenção às juventudes trabalhadoras.</li>
              <li>Estimular a autonomia na criação e na gestão de práticas corporais nos territórios de vida dos estudantes.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black uppercase border-l-4 border-indigo-600 pl-4 text-slate-900">3. Conteúdos Programáticos por Segmento</h3>
            
            <div className="space-y-4 pl-4 border-l-2 border-slate-100">
              <h4 className="font-black text-indigo-700 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Ensino Fundamental (6º ao 9º ano / AP)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 1 | Lutas e Jogos:</p>
                  <p className="text-xs text-slate-600 italic">Capoeira, Huka-Huka (Povos Originários), Luta Marajoara, Jogos de Oposição.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 2 | Jogos e Estratégia:</p>
                  <p className="text-xs text-slate-600 italic">Mancala, Shisima, Yoté, Construção de Brinquedos.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 3 | Danças:</p>
                  <p className="text-xs text-slate-600 italic">Jongo, Maculelê, Maracatu Rural, Hip Hop, Funk, Passinho.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 4 | Atletismo e Circo:</p>
                  <p className="text-xs text-slate-600 italic">Corridas Adaptadas, Malabares, Perna de Pau.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pl-4 border-l-2 border-slate-100">
              <h4 className="font-black text-emerald-700 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Ensino Médio
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 1 | Corpo e Saúde:</p>
                  <p className="text-xs text-slate-600 italic">Racismo estético, Saúde do Trabalhador, LER/DORT.</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 2 | Esporte e Mídia:</p>
                  <p className="text-xs text-slate-600 italic">Racismo no Esporte, Semana Paralímpica, Direito à Cidade.</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 3 | Primeiros Socorros:</p>
                  <p className="text-xs text-slate-600 italic">SAMU, Engasgo, Convulsão, Práticas de Socorro.</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">Bloco 4 | Projeto de Vida:</p>
                  <p className="text-xs text-slate-600 italic">Plano de Vida Ativa, Sarau Afro, Culturas Ancestrais (Toré).</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase border-l-4 border-indigo-600 pl-4 text-slate-900">4. Metodologia</h3>
              <p className="text-sm font-medium text-justify">
                As aulas privilegiam a vivência prática com reflexão crítica, organizadas em três momentos: mobilização, desenvolvimento e fechamento. As atividades são adaptadas à infraestrutura disponível e utilizam materiais recicláveis. O professor atua como mediador, estimulando a construção coletiva de regras.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase border-l-4 border-indigo-600 pl-4 text-slate-900">5. Avaliação</h3>
              <p className="text-sm font-medium text-justify">
                A avaliação é processual, formativa e participativa: observação, rodas de conversa, diário corporal, apresentações práticas e projetos temáticos.
              </p>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h3 className="text-lg font-black uppercase border-l-4 border-slate-400 pl-4 text-slate-500">6. Referências Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
              <p>BNCC (MEC, 2018)</p>
              <p>DCERJ (SEEDUC-RJ, 2019)</p>
              <p>Lei nº 10.639/03</p>
              <p>Metodologia do Ensino da Ed. Física (1992)</p>
              <p>Pele Negra, Máscaras Brancas (Fanon, 2008)</p>
              <p>Rediscutindo a Mestiçagem (Munanga, 2004)</p>
              <p>Jogos Africanos (Souza/Vieira, 2019)</p>
              <p>Da Cultura do Corpo (Daolio, 1995)</p>
              <p>A queda do céu (Kopenawa/Albert, 2015)</p>
            </div>
          </section>

          <div className="mt-20 pt-10 border-t border-slate-200 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>Gerado em: {new Date().toLocaleDateString('pt-BR')}</span>
             <span className="text-slate-900">Documento Oficial • Professor André Brito</span>
          </div>
        </div>

        {/* Printable Footer */}
        <div className="hidden print:block fixed bottom-0 left-0 right-0 p-8 text-center text-[8px] uppercase tracking-widest border-t border-slate-100 text-slate-300">
          Planejamento Anual 2026 • Disciplina: Educação Física • Rede SEEDUC-RJ
        </div>
      </div>
      
      <style>{`
        @media print {
          body { 
            background: white !important;
            color: black !important;
          }
          .animate-fade-in { 
            animation: none !important;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
};
