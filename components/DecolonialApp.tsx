import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Presentation, ChevronLeft, ChevronRight, Home, 
  Info, Printer, LayoutGrid, Calendar, Activity, Shield, 
  Zap, Search, CheckCircle2 
} from 'lucide-react';
import { PE_PLAN } from '../data/planosPE';
import { PlanoAnualPE } from './PlanoAnualPE';
import { ALTINHA_FUTVOLEI_SLIDES, SLIDES_3TRI } from '../data/corpoMidiaSlides';

// ================= DADOS DO CRONOGRAMA =================
const cronograma = PE_PLAN['ilgch'] || [];

// ================= DADOS DOS SLIDES DA AULA =================
interface Slide {
  tipo: string;
  titulo?: string;
  subtitulo?: string;
  topicos?: string[];
  dicaProfessor: string;
  imagemDeFundo?: string;
  texto?: string;
  subtexto?: string;
}

const slidesData: Record<string, Slide[]> = {
  // AULAS 3º TRIMESTRE
  '04/09': SLIDES_3TRI['Gênero, Sociedade e Esporte'].map(s => ({...s, tipo: s.type || 'texto'})),
  '11/09': SLIDES_3TRI['O Apagamento Invisível'].map(s => ({...s, tipo: s.type || 'texto'})),
  '18/09': SLIDES_3TRI['Divisão Sexista do Corpo'].map(s => ({...s, tipo: s.type || 'texto'})),
  '02/10': SLIDES_3TRI['Hipersexualização e Espetáculo'].map(s => ({...s, tipo: s.type || 'texto'})),
  '09/10': SLIDES_3TRI['Equidade Salarial no Esporte'].map(s => ({...s, tipo: s.type || 'texto'})),
  '16/10': SLIDES_3TRI['As Pioneiras Olímpicas'].map(s => ({...s, tipo: s.type || 'texto'})),
  '06/11': SLIDES_3TRI['Debate Integrador'].map(s => ({...s, tipo: s.type || 'texto'})),
  '13/11': SLIDES_3TRI['Síntese Final'].map(s => ({...s, tipo: s.type || 'texto'})),

  // AULA 1: INTRO / CULTURA CORPORAL
  '22/05': [
    {
      tipo: 'capa',
      titulo: 'Decolonização de Corpos e Espaços',
      subtitulo: 'A Cultura Corporal muito além da quadra.',
      dicaProfessor: 'Deixe esse slide no telão enquanto os alunos entram. Fundo escuro, letras claras.',
      imagemDeFundo: '[Imagem de um mapa urbano mesclado com texturas de pele]'
    },
    {
      tipo: 'texto_simples',
      titulo: 'ILGCH: Itinerário de Linguagens e Ciências Humanas',
      topicos: [
        'ILGCH: Itinerário de Linguagens e Ciências Humanas',
        'Cultura Corporal: Tudo o que move e expressa o humano',
        'Todo corpo é um Marcador, todo corpo é um Mapa',
        'Corpos falam: no andar, no vestir, no expressar',
        'Descobrindo culturas, locais e etnias através dos corpos',
        'Corpos múltiplos: pretos, brancos, amarelos...'
      ],
      dicaProfessor: 'Dica: Explique que o corpo é o primeiro território que ocupamos. Desenhe um mapa mental no quadro ligando: Corpo, Cultura, Território e Identidade.'
    },
    {
      tipo: 'destaque_centro',
      texto: 'A MÍDIA CRIA O PADRÃO.',
      dicaProfessor: 'Gatilho: Pergunte para a turma se eles se sentem representados nas propagandas de perfume ou roupas.'
    },
    {
      tipo: 'texto_simples',
      titulo: 'Explorando o Iceberg: O que sustenta o padrão?',
      topicos: [
        'Ponta (Visível): Redes Sociais, Padrões, Filtros',
        'Base (Oculta): Racismo Estrutural, Apagamento histórico',
        'Gatilho: Como a publicidade lucra com nossa insegurança?',
        'Link: A estética como ferramenta de controle do consumo',
        'Debate: Quem define o belo?'
      ],
      dicaProfessor: 'O padrão de beleza eurocêntrico só existe porque invisibiliza o corpo negro como sujeito. Questione o lucro dessa indústria.'
    },
    {
      tipo: 'texto_simples',
      titulo: 'Gatilhos para Debate (Mapa Mental)',
      topicos: [
          'Violência Simbólica nas Redes',
          'História contada pelo "Dominador"',
          'Nossa resistência: Corpos que ocupam',
          'Afinal, somos o que postamos?'
      ],
      dicaProfessor: 'Use estes tópicos para desenhar o mapa mental final no quadro.'
    },
    {
       tipo: 'destaque_centro',
       texto: '"O currículo não é militância. É lei federal."',
       subtexto: 'Lei 10.639/03',
       dicaProfessor: 'Escudo legal. Mostre que a aula cumpre uma determinação federal sobre História Afro-Brasileira.'
    }
  ],
  // AULA 2: O RACISMO INVISÍVEL
  '29/05': [
     {
      tipo: 'capa',
      titulo: 'O Racismo Invisível',
      subtitulo: 'O apagamento estético na mídia.',
      dicaProfessor: 'Aula de leitura de artigo.',
      imagemDeFundo: '[Imagem de revistas rasgadas]'
    },
    {
      tipo: 'texto_simples',
      titulo: 'Dinâmica de Hoje',
      topicos: [
        'Leitura Acadêmica Coletiva',
        'Debate: Branquitude como "Universal"',
        'Filtros de embelezamento',
        'Produção em sala'
      ],
      dicaProfessor: 'Explicar a dinâmica de "seminário" da aula.'
    }
  ]
};

// ================= COMPONENTE EXPORTADO =================
interface DecolonialAppProps {
  onBack: () => void;
}

export const DecolonialApp: React.FC<DecolonialAppProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedAulaData, setSelectedAulaData] = useState<string | null>(null);
  const [planningSubView, setPlanningSubView] = useState<null | '8ano' | 'ap' | 'ap_sexta' | 'gestao'>(null);
  const [selectedAulaPlan, setSelectedAulaPlan] = useState<any>(null);

  // --- TELA DE MENU ---
  const renderMenu = () => (
    <div className="relative min-h-[calc(100vh-100px)] -mx-3 md:-mx-6 -mt-3 md:-mt-6 overflow-hidden flex flex-col font-sans">
      {/* Premium Atmospheric Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.5]"
        style={{ backgroundImage: "url('/src/assets/images/gestao_bg_premium_1779985655734.png')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
      </div>

      {/* Glass Dock / Status Bar at top */}
      <div className="relative z-20 flex justify-center mt-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full flex items-center gap-6 shadow-2xl">
          <div className="flex gap-4 border-r border-white/10 pr-6 mr-1">
            <Activity size={14} className="text-white/40" />
            <Shield size={14} className="text-white/40" />
            <Zap size={14} className="text-emerald-500 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 pb-24">
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-white/70 hover:text-white font-bold transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 shadow-2xl text-xs backdrop-blur-md uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Painel Principal
        </button>

        <div className="max-w-7xl w-full text-center mb-10 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-emerald-500 uppercase"
            style={{ textShadow: '-2px -2px 0 #fff, 0 -2px 0 #fff, 2px -2px 0 #fff, 2px 0 0 #fff, 2px 2px 0 #fff, 0 2px 0 #fff, -2px 2px 0 #fff, -2px 0 0 #fff, 0 0 10px rgba(255,255,255,0.4)' }}
          >
            Gestão do Professor
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs md:text-sm text-white/50 font-black uppercase tracking-[0.5em]"
          >
            Prof. André Brito
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
          {[
            {
              id: 'planejamento',
              title: 'PLANEJAMENTO',
              subtitle: 'Cronograma oficial e resumos.',
              image: '/src/assets/images/planejamento_card_premium_1779985671332.png',
              action: () => setCurrentView('planejamento'),
              delay: 0.3
            },
            {
              id: 'plano_anual',
              title: 'PLANO ANUAL',
              subtitle: 'Gestão completa das aulas de PE.',
              image: '/src/assets/images/plano_anual_card_premium_1779985689437.png',
              action: () => setCurrentView('plano_anual_pe'),
              delay: 0.4
            },
            {
              id: 'aulas',
              title: 'AULAS (Datashow)',
              subtitle: 'Slides para apresentação.',
              image: '/src/assets/images/aulas_datashow_card_premium_1779985704354.png',
              action: () => setCurrentView('repositorio_aulas'),
              delay: 0.5
            }
          ].map((card) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.6 }}
              onClick={card.action}
              className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-emerald-500/10"
            >
              {/* Card Illustration */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 p-1.5 rounded-full">
                  <CheckCircle2 size={16} className="text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-none tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest group-hover:text-white/70 transition-colors">
                  {card.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlanejamentoMenu = () => (
    <div className="p-8 md:p-12 font-sans bg-white/70 backdrop-blur-md rounded-3xl min-h-[500px] border border-slate-300 flex flex-col items-center justify-center">
      <button onClick={() => { setCurrentView('menu'); setPlanningSubView(null); }} className="mb-8 self-start flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
        <ChevronLeft size={20} /> Voltar ao Menu Decolonial
      </button>

      <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-12 uppercase tracking-tighter">Escolha a Turma</h2>
      
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
        {[
          { id: '8ano', label: '801 - 802 - 803', sub: 'Cordelia Paiva - 2ª feiras' },
          { id: 'ap', label: 'AP 101', sub: 'CIEP 198 - 2ª feiras' },
          { id: 'ap_sexta', label: 'AP 101 e 301', sub: 'CIEP 320 - 6ª feiras' },
          { id: 'gestao', label: 'ILGCH 1001 - 1003 - 1007', sub: 'CIEP 476 - 6ª feiras' }
        ].map((turma, idx) => (
          <button 
            key={idx}
            onClick={() => setPlanningSubView(turma.id as any)}
            className="p-8 bg-white hover:bg-slate-100 transition-all text-slate-800 rounded-2xl border border-slate-300 hover:border-emerald-500 shadow-sm flex flex-col items-center gap-2 group"
          >
            <span className="font-black text-xl group-hover:text-emerald-600 transition-colors uppercase tracking-tighter">{turma.label}</span>
            <span className="text-sm font-bold text-slate-500">{turma.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // --- RENDER AULA CARD (COMPARTILHADO) ---
  const renderCard = (aula: any, index: number, corHeader: string, corBadge: string, turmaContext: string = 'ilgch') => {
    // Para classes (8ano/ejanem), usamos os fields do PE_PLAN, para ILGCH usamos os do cronograma.
    const isPassar = aula.trabalho === 'passar';
    const isRecolher = aula.trabalho === 'recolher';
    const isConcluido = aula.status === 'eja_concluido' || aula.status === 'concluido';
    const hasDestaque = aula.destaque;
    
    let baseCardClasses = `flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 relative cursor-pointer group `;
    
    if (hasDestaque) baseCardClasses += ` ring-4 ring-amber-400 ring-offset-2 z-10 scale-[1.02] shadow-xl`;
    else if (isPassar) baseCardClasses += ` ring-4 ring-amber-300 ring-offset-1`;
    else if (isRecolher) baseCardClasses += ` ring-4 ring-emerald-400 ring-offset-1`;

    return (
      <div key={index} onClick={() => setSelectedAulaPlan(aula)} className={baseCardClasses} title="Clique para ver o roteiro da aula">
        
        <div className={`px-4 py-3 flex justify-between items-center ${corHeader} text-white`}>
          <span className="font-extrabold tracking-wide">Aula {index + 1}</span>
          <span className="flex items-center gap-1 font-bold bg-white/20 px-2 py-1 rounded-md text-sm backdrop-blur-sm shadow-sm">
            📅 {aula.data}
          </span>
        </div>
        
        <div className="px-4 pt-3 pb-1">
          <span className={`inline-block px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${corBadge}`}>
            {aula.modulo || 'Aula '}
          </span>
        </div>

        <hr className="mx-4 mt-2 mb-3 border-slate-100" />
        
        <div className="px-4 pb-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">{aula.titulo}</h3>
          <p className="text-sm text-slate-600 flex-grow leading-relaxed line-clamp-3">{aula.desc}</p>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center gap-1">
            <span className="bg-blue-50 px-2 py-1 rounded w-full text-center">👆 Ver roteiro e Dinâmica</span>
          </div>
        </div>

        {aula.trabalho && (
          <div className={`p-3 font-bold text-sm flex items-center gap-2 justify-center
            ${isPassar ? 'bg-amber-100 text-amber-900 border-t border-amber-200' : 'bg-emerald-100 text-emerald-900 border-t border-emerald-200'}`}
          >
            {isPassar ? '⚠️ PASSAR TRABALHO (3pts)' : '📥 RECOLHER TRABALHO'}
          </div>
        )}
      </div>
    );
  };


  const renderAulaModal = () => {
    if (!selectedAulaPlan) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={() => setSelectedAulaPlan(null)}>
        <div 
          className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{ maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          <div className={`px-6 py-4 flex justify-between items-center ${selectedAulaPlan.tri === '2º Tri' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
            <div>
              <h3 className="text-xl font-extrabold">{selectedAulaPlan.titulo}</h3>
              <p className="text-sm opacity-90">{selectedAulaPlan.tri} • Aula {selectedAulaPlan.data}</p>
            </div>
            <button 
              onClick={() => setSelectedAulaPlan(null)} 
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-colors"
              aria-label="Fechar"
            >
              &times;
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-grow bg-slate-50">
            <div className="inline-block px-3 py-1 mb-4 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
              {selectedAulaPlan.modulo}
            </div>
            
            {selectedAulaPlan.status === 'eja_concluido' && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
                <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                  ✅ Status da Semana:
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  O planejamento agora é aplicar a estrutura de mídia e padrões para as turmas regulares.
                </p>
              </div>
            )}

            <div className="text-slate-700 text-[15px] leading-relaxed space-y-4">
              {selectedAulaPlan.resumo.split('\n').map((paragraph: string, idx: number) => {
                if (!paragraph.trim()) return null;
                
                const isAmparoLegal = paragraph.includes('📜 **Amparo Legal');
                const isDinamica = paragraph.includes('🗣️ **O que falar/Dinâmica');
                const isDinamicaAlt = paragraph.includes('🗣️ **Dinâmica');
                const isObjetivo = paragraph.includes('🎯 **Objetivo da Aula');
                const isLembrete = paragraph.includes('⚠️ **LEMBRETE');
                const isTrabalho = paragraph.includes('⚠️ **TRABALHO');
                const isRecolher = paragraph.includes('📥 **TRABALHO');
                const isReflexão = paragraph.includes('📜 **Reflexão');
                
                const formattedText = paragraph.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-slate-900">{part}</strong> : part
                );

                if (isAmparoLegal || isReflexão) {
                  return (
                    <div key={idx} className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm text-amber-900">
                      {formattedText}
                    </div>
                  );
                }

                if (isDinamica || isDinamicaAlt || isObjetivo) {
                   return (
                      <div key={idx} className={`mt-4 p-4 border rounded-lg shadow-sm ${isObjetivo ? 'bg-slate-100 border-slate-200 text-slate-900 font-medium' : 'bg-blue-50/50 border-blue-100 text-slate-800'}`}>
                         {formattedText}
                      </div>
                   );
                }

                if (isLembrete || isTrabalho || isRecolher) {
                   return (
                      <div key={idx} className={`mt-4 p-4 border rounded-lg shadow-sm ${isRecolher ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900 font-bold'}`}>
                         {formattedText}
                      </div>
                   );
                }

                return <p key={idx}>{formattedText}</p>;
              })}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
            <button 
              onClick={() => setSelectedAulaPlan(null)} 
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors shadow-sm"
            >
              Entendido, fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlanejamentoClasses = (turma: '8ano' | 'ap' | 'ap_sexta') => {
    const planos = PE_PLAN[turma] || [];
    const tri1 = planos.filter(aula => aula.tri === '1º Tri');
    const tri2 = planos.filter(aula => aula.tri === '2º Tri');
    const tri3 = planos.filter(aula => aula.tri === '3º Tri');
    
    let title = 'Planejamento: 8º Ano';
    if (turma === 'ap') title = 'Planejamento: AP (Segundas)';
    if (turma === 'ap_sexta') title = 'Planejamento: AP (Sextas)';

    return (
      <div className="p-4 md:p-8 font-sans text-slate-800 relative bg-slate-50 rounded-2xl shadow-2xl">
        <button onClick={() => setPlanningSubView(null)} className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
           <ChevronLeft size={20} /> Voltar para Seleção de Turma
        </button>
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{title}</h2>
        {turma === '8ano' && (
          <div className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl shadow-sm border border-amber-100">
            <p className="text-sm font-black text-amber-900 mb-1 uppercase tracking-widest flex items-center gap-2">
              <Info size={16} /> ADAPTAÇÃO DE ESPAÇO FÍSICO
            </p>
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              As aulas do 8º ano foram adaptadas para o formato teórico/dentro de sala por falta de espaço físico na escola. 
              O deslocamento para a quadra da praça pública próxima não será realizado com turmas superiores a 30 alunos sem acompanhamento extra, 
              visando a segurança dos estudantes e a responsabilidade docente em via pública.
            </p>
          </div>
        )}
        <p className="text-slate-500 mb-12 font-medium">Cronograma de Educação Física e Cultura Corporal</p>
        
        <div className={`space-y-12 ${selectedAulaPlan ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}>
          {tri1.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-3 bg-blue-500 rounded-full shadow-lg"></div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">1º Trimestre (Final)</h2>
                <div className="flex-grow border-t-2 border-slate-200 border-dashed ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tri1.map((aula, idx) => renderCard(aula, idx, 'bg-blue-500', 'bg-blue-50 text-blue-800 border border-blue-200', turma))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-3 bg-blue-600 rounded-full shadow-lg"></div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">2º Trimestre</h2>
              <div className="flex-grow border-t-2 border-slate-200 border-dashed ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tri2.map((aula, idx) => renderCard(aula, idx + (tri1.length), 'bg-blue-600', 'bg-blue-50 text-blue-800 border border-blue-200', turma))}
            </div>
          </section>
          
          <div className="relative py-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300"></div></div>
            <span className="relative px-6 bg-slate-50 text-slate-400 text-sm font-black uppercase tracking-[0.3em]">Mudança de Trimestre</span>
          </div>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-3 bg-green-600 rounded-full shadow-lg"></div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">3º Trimestre</h2>
              <div className="flex-grow border-t-2 border-slate-200 border-dashed ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tri3.map((aula, idx) => renderCard(aula, idx, 'bg-green-600', 'bg-green-50 text-green-800 border border-green-200', turma))}
            </div>
          </section>
        </div>
      </div>
    );
  };


  const renderPlanejamento = () => {
    return (
      <div className="relative">
        {renderAulaModal()}
        {!planningSubView && renderPlanejamentoMenu()}
        {planningSubView === 'gestao' && renderPlanejamentoGestao()}
        {(planningSubView === '8ano' || planningSubView === 'ap' || planningSubView === 'ap_sexta') && renderPlanejamentoClasses(planningSubView)}
      </div>
    );
  };


  // --- TELA DE PLANEJAMENTO ---
  const renderPlanejamentoGestao = () => {
    const tri2 = cronograma.filter(aula => aula.tri === '2º Tri');
    const tri3 = cronograma.filter(aula => aula.tri === '3º Tri');

    return (
      <div className="p-4 md:p-8 font-sans text-slate-800 relative bg-slate-50 rounded-2xl shadow-2xl">
        <button onClick={() => setPlanningSubView(null)} className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <ChevronLeft size={20} /> Voltar para Seleção de Turma
        </button>

        {/* Conteúdo do Planejamento */}
        <div className={`max-w-7xl mx-auto space-y-8 ${selectedAulaPlan ? 'blur-sm pointer-events-none' : ''} transition-all duration-200`}>
          
          <header className="bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-2 flex items-center gap-3">
               <span className="text-xl">⚖️</span>
               <p className="text-xs md:text-sm font-semibold tracking-wide">
                 Currículo estruturado em cumprimento às <span className="text-amber-400 font-bold">Leis Federais 10.639/03 e 11.645/08</span>.
               </p>
            </div>

            <div className="p-6 md:p-8 relative">
              <div className="relative z-10">
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                  Decolonização de Corpos, Identidades, Mídias e Espaços
                </h1>
                <p className="text-base md:text-lg text-slate-600 mb-4 font-medium">
                  Professor <strong className="text-blue-600 font-bold">André Brito</strong> • Turma 1001 (Aulas às Sextas)
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded border border-slate-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> 
                  Disciplina SEEDUC: Gestão do Professor (Itinerário de Linguagens e Ciências Humanas)
                </div>
              </div>
            </div>
          </header>

          <section>
            <div className="flex items-center gap-3 mb-6 mt-8">
              <div className="h-8 w-3 bg-blue-600 rounded-full shadow-sm"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">2º Trimestre</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tri2.map((aula, idx) => renderCard(aula, idx, 'bg-blue-600', 'bg-blue-50 text-blue-800 border border-blue-200', 'ilgch'))}
            </div>
          </section>

          <div className="flex items-center my-12 opacity-50">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="mx-4 text-slate-400 text-xs font-black uppercase tracking-widest">Avanço de Trimestre</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-3 bg-green-600 rounded-full shadow-sm"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">3º Trimestre</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tri3.map((aula, idx) => renderCard(aula, idx, 'bg-green-600', 'bg-green-50 text-green-800 border border-green-200', 'ilgch'))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- TELA SELEÇÃO AULAS ---
  const renderAulasMenu = () => (
    <div className="p-8 md:p-12 font-sans bg-white/70 backdrop-blur-md rounded-3xl min-h-[500px] border border-slate-300 flex flex-col items-center justify-center">
      <button onClick={() => setCurrentView('menu')} className="mb-8 self-start flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
        <ChevronLeft size={20} /> Voltar ao Menu Decolonial
      </button>

      <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-12 uppercase tracking-tighter">Escolha a Turma</h2>
      
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
        {[
          { id: '8ano', label: '801 - 802 - 803', sub: 'Cordelia Paiva - 2ª feiras' },
          { id: 'ap', label: 'AP 101', sub: 'CIEP 198 - 2ª feiras' },
          { id: 'ap_sexta', label: 'AP 101 e 301', sub: 'CIEP 320 - 6ª feiras' },
          { id: 'gestao', label: 'ILGCH 1001 - 1003 - 1007', sub: 'CIEP 476 - 6ª feiras' }
        ].map((turma, idx) => (
          <button 
            key={idx}
            onClick={() => { setPlanningSubView(turma.id as any); setCurrentView('repositorio_aulas_lista'); }}
            className="p-8 bg-white hover:bg-slate-100 transition-all text-slate-800 rounded-2xl border border-slate-300 hover:border-blue-500 shadow-sm flex flex-col items-center gap-2 group"
          >
            <span className="font-black text-xl group-hover:text-blue-600 transition-colors uppercase tracking-tighter">{turma.label}</span>
            <span className="text-sm font-bold text-slate-500">{turma.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // --- TELA REPOSITÓRIO DE AULAS (Menu de Slides) ---
  const renderRepositorioAulas = () => (
    <div className="p-6 md:p-12 font-sans bg-white/70 backdrop-blur-md rounded-2xl border border-slate-300 shadow-xl">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => { setCurrentView('planejamento'); setPlanningSubView(null); }} className="mb-8 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
          <ChevronLeft size={20} /> Voltar para Seleção de Turma
        </button>

        <header className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-4 uppercase">
            <LayoutGrid className="text-blue-600" size={36} /> Aulas Prontas ({planningSubView})
          </h2>
          <p className="text-slate-600 mt-2">Escolha a aula de hoje para abrir os slides.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aula Altinha e Futevolei adicionada para todas as turmas */}
          <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-blue-600 text-white font-bold text-sm flex justify-between uppercase">
                  <span>Aula Extra</span>
              </div>
              <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase">Altinha & Futevôlei</h3>
                  <p className="text-slate-600 text-sm">Da Roda para a Rede</p>
              </div>
              <div className="p-4 bg-[#f4ece0] border-t border-slate-200">
                  <button 
                      onClick={() => { 
                        setSelectedAulaData('altinha-futvolei'); 
                        setCurrentView('player'); 
                      }}
                      className="w-full py-3 bg-sky-600 text-white hover:bg-sky-700 font-black rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                      <Presentation size={18} /> Projetar Slides
                  </button>
              </div>
          </div>
          
          {cronograma.map((aula) => {
            const temSlides = slidesData[aula.data] !== undefined;
            
            return (
              <div key={aula.data} className={`bg-white rounded-2xl border border-slate-300 overflow-hidden flex flex-col ${temSlides ? 'hover:shadow-md transition-all' : 'opacity-60'}`}>
                <div className={`p-3 ${temSlides ? 'bg-blue-600' : 'bg-slate-305'} text-white font-bold text-sm flex justify-between uppercase`}>
                  <span>{aula.tri}</span>
                  <span>{aula.data}</span>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase">{aula.titulo}</h3>
                  <p className="text-slate-600 text-sm">{aula.modulo}</p>
                </div>
                <div className="p-4 bg-[#f4ece0] border-t border-slate-200">
                  {temSlides ? (
                    <button 
                      onClick={() => { setSelectedAulaData(aula.data); setCurrentView('player'); }}
                      className="w-full py-3 bg-sky-600 text-white hover:bg-sky-700 font-black rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Presentation size={18} /> Projetar Slides
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 bg-slate-200 text-slate-500 font-bold rounded-lg cursor-not-allowed text-sm uppercase">
                      Ainda não criado
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

  // --- TELA PLAYER DE SLIDES (Estilo Datashow de Alto Contraste) ---
  const SlidePlayer = () => {
    const slides = selectedAulaData === 'altinha-futvolei' ? ALTINHA_FUTVOLEI_SLIDES : (selectedAulaData ? (slidesData as any)[selectedAulaData] : null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDica, setShowDica] = useState(false);

    // Navegação Teclado
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') setCurrentView('repositorio_aulas');
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (!slides) return null;

    const nextSlide = () => { setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1)); setShowDica(false); };
    const prevSlide = () => { setCurrentIndex((prev) => Math.max(prev - 1, 0)); setShowDica(false); };
    const handlePrint = () => { window.print(); };

    const slideAtual: any = slides[currentIndex];

    // Renderização dos Tipos de Slide Visual Limpo
    const renderSlideContent = () => {
      // Map legacy "tipo" to "type" from data
      const slideType = slideAtual.type || slideAtual.tipo;

      switch (slideType) {
        case 'capa':
        case 'hero':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 md:p-12 bg-slate-950 min-h-[450px]">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase leading-tight">
                {slideAtual.title || slideAtual.titulo}
              </h1>
              <p className="text-xl md:text-4xl font-medium text-amber-400">
                {slideAtual.subtitle || slideAtual.subtitulo}
              </p>
            </div>
          );
        
        case 'texto':
        case 'texto_simples':
        case 'list':
          return (
            <div className="w-full h-full flex flex-col justify-center p-6 md:p-16 bg-[#0B1120] min-h-[450px]">
              <h2 className="text-3xl md:text-5xl font-black text-emerald-400 mb-8 border-l-8 border-emerald-500 pl-4">
                {slideAtual.title || slideAtual.titulo}
              </h2>
              {slideAtual.content && (
                <p className="text-2xl md:text-3xl font-bold text-slate-200 mb-6">{slideAtual.content}</p>
              )}
              <ul className="space-y-6 max-w-5xl">
                {(slideAtual.points || slideAtual.topicos)?.map((topico: string, idx: number) => (
                  <li key={idx} className="text-xl md:text-3xl font-bold text-slate-200 flex items-start gap-4 leading-tight">
                    <span className="text-white mt-1">»</span> {topico}
                  </li>
                ))}
              </ul>
            </div>
          );

        case 'destaque_centro':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center bg-[#0B1120] min-h-[450px]">
               <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase max-w-6xl">
                 {slideAtual.texto || slideAtual.content}
               </h2>
               {(slideAtual.subtexto || slideAtual.subtitle) && (
                 <p className="mt-8 text-2xl md:text-4xl text-emerald-400 font-bold border-b-4 border-emerald-400 pb-2">
                   {slideAtual.subtexto || slideAtual.subtitle}
                 </p>
               )}
            </div>
          );

        default:
          return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center bg-[#0B1120] min-h-[450px]">
              <h2 className="text-3xl md:text-5xl font-black text-emerald-400 mb-8">
                {slideAtual.title || slideAtual.titulo}
              </h2>
              <p className="text-xl md:text-3xl font-bold text-slate-200">
                {slideAtual.content || slideAtual.texto}
              </p>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col font-sans">
        
        {/* CSS para Impressão */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}} />

        {/* Header do Player */}
        <div className="h-16 flex justify-between items-center px-6 absolute top-0 w-full z-50 bg-black/50 backdrop-blur no-print">
          <div className="flex gap-4">
            <button onClick={() => setCurrentView('repositorio_aulas_lista')} className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-bold text-sm">
              Voltar
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold text-sm">
              <Printer size={16} /> Salvar PDF
            </button>
          </div>
          <div className="text-white font-bold tracking-widest text-xs bg-black/50 px-3 py-1 rounded">
            {currentIndex + 1} / {slides.length}
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-grow w-full h-full relative" id="print-area">
          {renderSlideContent()}
        </div>

        {/* Controles Base e Dica */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-[9999] no-print">
          <div className="max-w-xl">
            <button 
              onClick={() => setShowDica(!showDica)}
              className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/85 px-4 py-2 rounded-lg font-bold text-xs mb-2 backdrop-blur border border-slate-700 shadow-md"
            >
              <Info size={14} /> {showDica ? 'Esconder Dica' : 'Ver Dica de Fala'}
            </button>
            {showDica && (
              <div className="bg-slate-900 border-2 border-emerald-500 p-5 rounded-xl shadow-2xl max-h-[160px] overflow-y-auto">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">Seu Roteiro:</span>
                <p className="text-white text-base md:text-lg font-medium leading-snug">{slideAtual.dicaProfessor}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={prevSlide} disabled={currentIndex === 0} className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 text-white rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-slate-700 border border-slate-600">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} disabled={currentIndex === slides.length - 1} className="w-12 h-12 md:w-16 md:h-16 bg-white text-slate-900 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-slate-200">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

      </div>
    );
  };

  // ROTEADOR
  return (
    <div className="w-full">
      {currentView === 'menu' && renderMenu()}
      {currentView === 'planejamento' && renderPlanejamento()}
      {currentView === 'plano_anual_pe' && <PlanoAnualPE onBack={() => setCurrentView('menu')} />}
      {currentView === 'repositorio_aulas' && renderAulasMenu()}
      {currentView === 'repositorio_aulas_lista' && renderRepositorioAulas()}
      {currentView === 'player' && <SlidePlayer />}
    </div>
  );
};
