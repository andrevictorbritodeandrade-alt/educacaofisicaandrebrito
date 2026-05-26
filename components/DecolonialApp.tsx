import React, { useState, useEffect } from 'react';
import { BookOpen, Presentation, ChevronLeft, ChevronRight, Home, Info, Printer, LayoutGrid, Calendar } from 'lucide-react';
import { PE_PLAN } from '../data/planosPE';
import { PlanoAnualPE } from './PlanoAnualPE';
import { ALTINHA_FUTVOLEI_SLIDES } from '../data/corpoMidiaSlides';

// ================= DADOS DO CRONOGRAMA =================
const cronograma = [
  // ================= 2º TRIMESTRE =================
  { 
    data: '22/05', tri: '2º Tri', modulo: 'Módulo 1: Mídia e Racismo Invisível', titulo: 'Intro / Cultura Corporal', desc: 'O corpo na sociedade. Introdução à Decolonialidade.', trabalho: null, status: 'eja_concluido',
    resumo: `🎯 **Objetivo da Aula:** Apresentar a disciplina e introduzir a base legal (Leis 10.639/03 e 11.645/08).\n\n🗣️ **O que falar/Dinâmica:**\n• Fazer a introdução da disciplina.\n• Apresentar o conceito de "Decolonização": explicar que vamos aprender a questionar a história contada apenas pelo ponto de vista do colonizador europeu.\n• Chegar na "ponta do iceberg" do racismo invisível nas mídias e no dia a dia.\n\n📜 **Amparo Legal:** Cumprimento do estudo da matriz formadora da sociedade brasileira (Art. 26-A, Lei 10.639/03).` 
  },
  { 
    data: '29/05', tri: '2º Tri', modulo: 'Módulo 1: Mídia e Racismo Invisível', titulo: 'O Racismo Invisível', desc: 'O Padrão Estético e o apagamento. (Leitura de Artigo)', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Experiência acadêmica: leitura de artigo curto e debate sobre racismo velado.\n\n🗣️ **O que falar/Dinâmica:**\n• Levar cópias de um artigo curto (ex: coluna da Djamila Ribeiro ou um texto simples sobre "Branquitude na Mídia").\n• Leitura coletiva em sala.\n• Debate: Como o racismo invisível opera na escolha de atores para novelas, na publicidade e nos padrões do Instagram? Filtros de embelezamento são neutros?\n\n📜 **Amparo Legal:** Desconstrução de estereótipos prejudiciais e análise crítica da mídia.` 
  },
  { 
    data: '05/06', tri: '2º Tri', modulo: 'Módulo 1: Mídia e Racismo Invisível', titulo: 'Racismo Recreativo', desc: 'O humor que oprime: Adilson Moreira e a piada "inofensiva".', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Introduzir o conceito de "Racismo Recreativo" (Adilson Moreira).\n\n🗣️ **O que falar/Dinâmica:**\n• Explicar que o racismo também age através do "humor".\n• A piada não é inofensiva: ela serve para manter minorias em posição de inferioridade sem que o opressor seja cobrado ("era só brincadeira").\n• Dar exemplos de programas de humor antigos e o bullying escolar disfarçado de brincadeira.` 
  },
  { 
    data: '12/06', tri: '2º Tri', modulo: 'Módulo 2: O Racismo Estrutural', titulo: 'Fanon: Preto vs Negro', desc: 'Seminário de Leitura: "Pele Negra, Máscaras Brancas".', trabalho: 'passar', status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Diferenciar raça e identidade política e entender os danos psicológicos.\n\n🗣️ **O que falar/Dinâmica:**\n• Diferença pedagógica: "Preto" (cor) vs "Negro" (identidade política).\n• Ler um trecho de Frantz Fanon. Falar sobre a alienação colonial.\n\n⚠️ **LEMBRETE:** Passar o Trabalho Trimestral hoje (Colagem e reflexão sobre mídia e padrões)!` 
  },
  { 
    data: '19/06', tri: '2º Tri', modulo: 'Módulo 2: O Racismo Estrutural', titulo: 'Cida Bento e a Branquitude', desc: 'O Racismo Estrutural nas instituições e no poder.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Explicar o Racismo Estrutural como um sistema de manutenção de privilégios.\n\n🗣️ **O que falar/Dinâmica:**\n• Apresentar o "Pacto Narcísico da Branquitude" (Cida Bento).\n• Mostrar como a estrutura da sociedade (leis, empresas, escolas) é feita para beneficiar o padrão eurocêntrico e excluir corpos negros e indígenas dos espaços de poder.\n\n📜 **Amparo Legal:** Compreensão das relações étnico-raciais para a formação de cidadãos atuantes.` 
  },
  { 
    data: '26/06', tri: '2º Tri', modulo: 'Módulo 2: O Racismo Estrutural', titulo: 'Avaliação 1 (Parcial)', desc: 'Produção em sala: Fichamento ou Mapa Mental.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Avaliação formativa baseada nas leituras do trimestre.\n\n🗣️ **O que fazer em sala:**\n• Como na faculdade, pedir um "fichamento" ou mapa mental no caderno das ideias principais dos textos lidos e discutidos (Fanon, Racismo Recreativo, Cida Bento).\n• Passar vistando e dando a nota formativa.` 
  },
  { 
    data: '03/07', tri: '2º Tri', modulo: 'Módulo 3: Decolonialidade e Origens', titulo: 'Decolonialidade', desc: 'Questionando a "descoberta" e a história oficial.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Mergulhar no conceito de decolonialidade através dos Povos Originários.\n\n🗣️ **O que falar/Dinâmica:**\n• O Brasil foi "descoberto" ou "invadido"? O que é uma visão decolonial της história?\n• O genocídio indígena justificado pelo "progresso" e pela "civilização".\n\n📜 **Amparo Legal:** Cumprimento da **Lei 11.645/08** (História e Cultura Indígena).` 
  },
  { 
    data: '10/07', tri: '2º Tri', modulo: 'Módulo 3: Decolonialidade e Origens', titulo: 'Ailton Krenak', desc: 'Leitura: "Ideias para adiar o fim do mundo".', trabalho: 'recolher', status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Trazer a perspectiva filosófica indígena contemporânea.\n\n🗣️ **O que falar/Dinâmica:**\n• Leitura e debate de trechos de Ailton Krenak.\n• A visão capitalista (território é recurso) vs A visão indígena (o humano é o rio, a montanha).\n\n📥 **LEMBRETE:** Recolher o Trabalho Trimestral hoje!` 
  },
  { 
    data: '31/07', tri: '2º Tri', modulo: 'Módulo 3: Decolonialidade e Origens', titulo: 'Direito à Cidade', desc: 'Acesso desigual a parques e praças. Centro x Periferia.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Analisar a geografia do lazer em Maricá sob a ótica racial.\n\n🗣️ **O que falar:**\n• Onde estão as melhores quadras e parques? \n• Como a segregação socioespacial afeta predominantemente a população negra e parda. O Direito à Cidade negado.` 
  },
  { 
    data: '07/08', tri: '2º Tri', modulo: 'Módulo 4: Fechamento', titulo: 'Corpos Históricos e Luta', desc: 'A resistência indígena e negra. A capoeira e o quilombo.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Conectar as lutas pelo território.\n\n🗣️ **O que falar/Dinâmica:**\n• O Quilombo e as Aldeias como formas de organização de geografia de resistência.\n• A criminalização do corpo negro em movimento (a proibição histórica da Capoeira).` 
  },
  { 
    data: '14/08', tri: '2º Tri', modulo: 'Módulo 4: Fechamento', titulo: 'Preparação P/ Debate', desc: 'Divisão de grupos e estruturação de argumentos.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Organizar a turma para a avaliação final do trimestre (modelo de seminário universitário).\n\n🗣️ **O que fazer:**\n• Passar o tema do debate: "Como as mídias e a estrutura urbana perpetuam o racismo (invisível e estrutural) e o apagamento dos povos originários?"\n• Ajudar os grupos a separarem os argumentos dos textos lidos.` 
  },
  { 
    data: '21/08', tri: '2º Tri', modulo: 'Módulo 4: Fechamento', titulo: 'Avaliação 2', desc: 'Debate Final Acadêmico.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Realizar o debate avaliativo.\n\n🗣️ **O que fazer:**\n• Professor como mediador.\n• Avaliar o uso dos conceitos (Racismo Recreativo, Estrutural, Decolonialidade) no debate.\n• A avaliação oral atende a diferentes necessidades de aprendizagem.` 
  },
  { 
    data: '28/08', tri: '2º Tri', modulo: 'Módulo 4: Fechamento', titulo: 'Devolutiva', desc: 'Notas finais e feedback coletivo.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Transparência com os alunos.\n\n🗣️ **O que fazer:**\n• Entregar as médias.\n• Comentários sobre a evolução da turma na leitura de textos acadêmicos.` 
  },
  { 
    data: '04/09', tri: '2º Tri', modulo: 'Módulo 4: Fechamento', titulo: 'Encerramento', desc: 'Fechamento de Diário e Recuperação.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Burocracia final do trimestre.\n\n🗣️ **O que fazer:**\n• Atividade de recuperação paralela (ex: redação sobre Racismo Recreativo) para quem não atingiu a média.` 
  },
  
  // ================= 3º TRIMESTRE =================
  { 
    data: '11/09', tri: '3º Tri', modulo: 'Módulo 1: O Corpo Trabalhador', titulo: 'Marx e a Exploração', desc: 'Seminário de Leitura: Alienação e o corpo.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Introduzir a visão de Karl Marx sobre a exploração física e mental.\n\n🗣️ **O que falar/Dinâmica:**\n• Leitura de um texto curto ou excerto sobre alienação e a mercantilização do corpo humano sob o capitalismo.\n• Diferença entre o desgaste do trabalho braçal (base da pirâmide, maioria negra) e o trabalho intelectual.` 
  },
  { 
    data: '18/09', tri: '3º Tri', modulo: 'Módulo 1: O Corpo Trabalhador', titulo: 'Uberização e o Corpo', desc: 'A rotina dos entregadores e a geografia da exploração.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Atualizar Marx para o século 21.\n\n🗣️ **O que falar:**\n• A uberização do trabalho: longas jornadas, mortes no trânsito.\n• Quem são os rostos por trás dos capacetes de Ifood? (Jovens negros periféricos).\n• A geografia da exploração: sair da periferia de moto para servir o centro rico.` 
  },
  { 
    data: '25/09', tri: '3º Tri', modulo: 'Módulo 1: O Corpo Trabalhador', titulo: 'Corpo e Deficiência', desc: 'Acessibilidade urbana, barreiras e o capacitismo.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Atender à Semana Estadual da Educação Paralímpica explorando a interseccionalidade.\n\n🗣️ **O que falar:**\n• O direito à cidade para pessoas com deficiência. \n• O conceito de Capacitismo: o preconceito e a discriminação estrutural contra Pessoas com Deficiência.` 
  },
  { 
    data: '02/10', tri: '3º Tri', modulo: 'Módulo 2: Geopolítica no Esporte', titulo: 'Esporte no Tabuleiro', desc: 'A lógica do Xadrez global e o "Soft Power".', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Usar o Xadrez e a Geografia para explicar o power geopolítico.\n\n🗣️ **O que falar:**\n• A lógica do xadrez: controle do centro vs margens do tabuleiro.\n• Países centrais usam Olimpíadas/Esporte (Soft Power) para mostrar superioridade ao "Sul Global".` 
  },
  { 
    data: '09/10', tri: '3º Tri', modulo: 'Módulo 2: Geopolítica no Esporte', titulo: 'A Hipocrisia da Bola', desc: 'Geopolítica, sanções esportivas e o Imperialismo.', trabalho: 'passar', status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Discutir o racismo geopolítico através do esporte.\n\n🗣️ **O que falar/Dinâmica:**\n• Leitura de artigo de opinião sobre geopolítica esportiva.\n• Rússia banida, mas EUA e Israel competem e sediam eventos. Por que o Ocidente dita a regra? O Imperialismo nas federações (FIFA/COI).\n\n⚠️ **LEMBRETE:** Passar o Trabalho Trimestral sobre este tema hoje!` 
  },
  { 
    data: '16/10', tri: '3º Tri', modulo: 'Módulo 2: Geopolítica no Esporte', titulo: 'Semana Cultural (Prep)', desc: 'Dividir turmas para os projetos interescolares.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Preparações práticas para a Semana Cultural Interescolar.\n\n🗣️ **O que fazer:**\n• Organizar a sala para as atividades propostas pela SEEDUC.` 
  },
  { 
    data: '23/10', tri: '3º Tri', modulo: 'Módulo 2: Geopolítica no Esporte', titulo: 'Avaliação 1', desc: 'Apresentações da Semana Cultural Interescolar.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Avaliar a participação na Semana Cultural.\n\n🗣️ **O que fazer:**\n• Acompanhar e dar nota para os alunos durante os projetos.` 
  },
  { 
    data: '30/10', tri: '3º Tri', modulo: 'Módulo 3: Resistência e Cura', titulo: 'Soberania Africana', desc: 'Ibrahim Traoré, Pan-Africanismo e a África real.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Apresentar a geopolítica contemporânea africana de resistência.\n\n🗣️ **O que falar/Dinâmica:**\n• Quebrar o estereótipo da África miserável. A riqueza de seus recursos.\n• Ibrahim Traoré (Burkina Faso) e a expulsão do imperialismo francês.\n\n📜 **Amparo Legal:** Lei 10.639: "Estudo da História da África Contemporânea".` 
  },
  { 
    data: '06/11', tri: '3º Tri', modulo: 'Módulo 3: Resistência e Cura', titulo: 'A Escrevivência', desc: 'Conceição Evaristo. Literatura como mapa do território.', trabalho: 'recolher', status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Conectar território e literatura negra urbana.\n\n🗣️ **O que falar/Dinâmica:**\n• Leitura de um texto/poema curto de Conceição Evaristo.\n• O conceito de "Escrevivência". Mulheres negras descrevendo a geografia da favela e a resistência.\n\n📥 **LEMBRETE:** Recolher o Trabalho Trimestral hoje!` 
  },
  { 
    data: '13/11', tri: '3º Tri', modulo: 'Módulo 3: Resistência e Cura', titulo: 'Aquilombamento', desc: 'Esporte e artes urbanas (Slam) como espaços de cura.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Focar na cura, na rede de apoio e no Novembro Negro.\n\n🗣️ **O que falar:**\n• O Aquilombamento moderno: como os projetos comunitários (capoeira, times de várzea, Slam em Maricá) servem como refúgios para a saúde mental e proteção do corpo negro.` 
  },
  { 
    data: '27/11', tri: '3º Tri', modulo: 'Módulo 3: Resistência e Cura', titulo: 'Avaliação 2', desc: 'Seminário Visual Final: "Meu Corpo, Minha Voz".', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Última avaliação integrando os conceitos do ano.\n\n🗣️ **O que fazer:**\n• Apresentação de um "Manifesto" visual ou oral resumindo as leituras acadêmicas e discussões do ano (Racismo, Imperialismo, Decolonialidade).` 
  },
  { 
    data: '04/12', tri: '3º Tri', modulo: 'Módulo 3: Resistência e Cura', titulo: 'Fechamento 2', desc: 'Correção, médias e fechamento de diários.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Transparência e burocracia final.\n\n🗣️ **O que fazer:**\n• Dar as médias anuais.\n• Fechar o diário online da SEEDUC.` 
  },
  { 
    data: '18/12', tri: '3º Tri', modulo: 'Módulo 3: Resistência e Cura', titulo: 'Despedida', desc: 'Último dia. Plantão para dependência.', trabalho: null, status: 'pendente',
    resumo: `🎯 **Objetivo da Aula:** Fim de ciclo.\n\n🗣️ **O que fazer:**\n• Plantão final.` 
  }
];

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
  const [planningSubView, setPlanningSubView] = useState<null | '8ano' | 'ap' | 'gestao'>(null);
  const [selectedAulaPlan, setSelectedAulaPlan] = useState<typeof cronograma[0] | null>(null);

  // --- TELA DE MENU ---
  const renderMenu = () => (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-white font-sans relative">
      <button 
        onClick={onBack} 
        className="absolute top-2 left-2 flex items-center gap-2 text-slate-300 hover:text-white font-bold transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-lg text-sm"
      >
        <ChevronLeft size={16} /> Painel Principal
      </button>

      <div className="max-w-4xl w-full text-center mt-12 md:mt-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-emerald-400 uppercase drop-shadow-lg">
          Gestão do Professor
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-12 font-medium">Prof. André Brito</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('planejamento')}
            className="flex flex-col items-center justify-center p-8 bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 hover:border-emerald-400 hover:-translate-y-1 transition-all shadow-xl group"
          >
            <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={30} />
            </div>
            <h2 className="text-2xl font-black mb-1">Planejamento</h2>
            <p className="text-slate-400 text-sm text-center">Cronograma oficial e resumos.</p>
          </button>

          <button 
            onClick={() => setCurrentView('plano_anual_pe')}
            className="flex flex-col items-center justify-center p-8 bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 hover:border-indigo-400 hover:-translate-y-1 transition-all shadow-xl group"
          >
            <div className="w-16 h-16 bg-slate-900 text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={30} />
            </div>
            <h2 className="text-2xl font-black mb-1">Plano Anual</h2>
            <p className="text-slate-400 text-sm text-center">Gestão completa das aulas de PE.</p>
          </button>

          <button 
            onClick={() => setCurrentView('repositorio_aulas')}
            className="flex flex-col items-center justify-center p-8 bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 hover:border-blue-400 hover:-translate-y-1 transition-all shadow-xl group"
          >
            <div className="w-16 h-16 bg-slate-900 text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Presentation size={30} />
            </div>
            <h2 className="text-2xl font-black mb-1">Aulas (Datashow)</h2>
            <p className="text-slate-400 text-sm text-center">Slides para apresentação.</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlanejamentoMenu = () => (
    <div className="p-8 md:p-12 font-sans bg-slate-900 rounded-3xl min-h-[500px] flex flex-col items-center justify-center">
      <button onClick={() => { setCurrentView('menu'); setPlanningSubView(null); }} className="mb-8 self-start flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors">
        <ChevronLeft size={20} /> Voltar ao Menu Decolonial
      </button>

      <h2 className="text-3xl md:text-5xl font-black text-white mb-12 uppercase tracking-tighter">Escolha a Turma</h2>
      
      <div className="grid md:grid-cols-4 gap-6 w-full max-w-5xl">
        {[
          {id: '8ano', label: '8º Ano'},
          {id: 'ap', label: 'AP'},
          {id: 'gestao', label: 'Gestão do Professor - ILGCH'}
        ].map((turma) => (
          <button 
            key={turma.id}
            onClick={() => setPlanningSubView(turma.id as '8ano' | 'ap' | 'gestao')}
            className="p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-400 transition-all text-white font-black text-xl"
          >
            {turma.label}
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
    const isConcluido = aula.status === 'eja_concluido';
    
    let baseCardClasses = `flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 relative cursor-pointer group `;
    
    if (isPassar) baseCardClasses += ` ring-4 ring-amber-300 ring-offset-1`;
    else if (isRecolher) baseCardClasses += ` ring-4 ring-emerald-400 ring-offset-1`;

    return (
      <div key={index} onClick={() => setSelectedAulaPlan(aula)} className={baseCardClasses} title="Clique para ver o roteiro da aula">
        
        {isConcluido && (
          <div className="absolute top-0 right-0 m-2 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
            ✅ EJA OK | Falta 1001
          </div>
        )}

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

  const renderPlanejamentoClasses = (turma: '8ano' | 'ap') => {
    const planos = PE_PLAN[turma] || [];
    const tri2 = planos.filter(aula => aula.tri === '2º Tri');
    const tri3 = planos.filter(aula => aula.tri === '3º Tri');
    
    return (
      <div className="p-4 md:p-8 font-sans text-slate-800 relative bg-slate-50 rounded-2xl shadow-2xl">
        <button onClick={() => setPlanningSubView(null)} className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
           <ChevronLeft size={20} /> Voltar para Seleção de Turma
        </button>
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Planejamento: {turma === '8ano' ? '8º Ano' : 'AP'}</h2>
        <p className="text-slate-500 mb-12 font-medium">Cronograma de Educação Física e Cultura Corporal</p>
        
        <div className={`space-y-12 ${selectedAulaPlan ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}>
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-3 bg-blue-600 rounded-full shadow-lg"></div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">2º Trimestre</h2>
              <div className="flex-grow border-t-2 border-slate-200 border-dashed ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tri2.map((aula, idx) => renderCard(aula, idx, 'bg-blue-600', 'bg-blue-50 text-blue-800 border border-blue-200', turma))}
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
        {(planningSubView === '8ano' || planningSubView === 'ap') && renderPlanejamentoClasses(planningSubView)}
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
    <div className="p-8 md:p-12 font-sans bg-slate-900 rounded-3xl min-h-[500px] flex flex-col items-center justify-center">
      <button onClick={() => setCurrentView('menu')} className="mb-8 self-start flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors">
        <ChevronLeft size={20} /> Voltar ao Menu Decolonial
      </button>

      <h2 className="text-3xl md:text-5xl font-black text-white mb-12 uppercase tracking-tighter">Escolha a Turma</h2>
      
      <div className="grid md:grid-cols-4 gap-6 w-full max-w-5xl">
        {[
          {id: '8ano', label: '8º Ano'},
          {id: 'ap', label: 'AP'},
          {id: 'gestao', label: 'Gestão do Professor - ILGCH'}
        ].map((turma) => (
          <button 
            key={turma.id}
            onClick={() => { setPlanningSubView(turma.id as '8ano' | 'ap' | 'gestao'); setCurrentView('repositorio_aulas_lista'); }}
            className="p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-400 transition-all text-white font-black text-xl"
          >
            {turma.label}
          </button>
        ))}
      </div>
    </div>
  );

  // --- TELA REPOSITÓRIO DE AULAS (Menu de Slides) ---
  const renderRepositorioAulas = () => (
    <div className="p-6 md:p-12 font-sans bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => { setCurrentView('planejamento'); setPlanningSubView(null); }} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors">
          <ChevronLeft size={20} /> Voltar para Seleção de Turma
        </button>

        <header className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
            <LayoutGrid className="text-blue-500" size={36} /> Aulas Prontas ({planningSubView})
          </h2>
          <p className="text-slate-400 mt-2">Escolha a aula de hoje para abrir os slides.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aula Altinha e Futevolei adicionada para todas as turmas */}
          <div className="bg-slate-800 rounded-2xl border border-blue-500 overflow-hidden flex flex-col hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
              <div className="p-3 bg-blue-600 text-white font-bold text-sm flex justify-between">
                  <span>Aula Extra</span>
              </div>
              <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">Altinha & Futevôlei</h3>
                  <p className="text-slate-400 text-sm">Da Roda para a Rede</p>
              </div>
              <div className="p-4 bg-slate-900">
                  <button 
                      onClick={() => { 
                        setSelectedAulaData('altinha-futvolei'); 
                        setCurrentView('player'); 
                      }}
                      className="w-full py-3 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                      <Presentation size={18} /> Projetar Slides
                  </button>
              </div>
          </div>
          
          {cronograma.map((aula) => {
            const temSlides = slidesData[aula.data] !== undefined;
            
            return (
              <div key={aula.data} className={`bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col ${temSlides ? 'hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all' : 'opacity-60'}`}>
                <div className={`p-3 ${temSlides ? 'bg-blue-600' : 'bg-slate-700'} text-white font-bold text-sm flex justify-between`}>
                  <span>{aula.tri}</span>
                  <span>{aula.data}</span>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">{aula.titulo}</h3>
                  <p className="text-slate-400 text-sm">{aula.modulo}</p>
                </div>
                <div className="p-4 bg-slate-900">
                  {temSlides ? (
                    <button 
                      onClick={() => { setSelectedAulaData(aula.data); setCurrentView('player'); }}
                      className="w-full py-3 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Presentation size={18} /> Projetar Slides
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed text-sm">
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
    const slides = selectedAulaData === 'altinha-futvolei' ? ALTINHA_FUTVOLEI_SLIDES : (selectedAulaData ? slidesData[selectedAulaData] : null);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const slideAtual = slides[currentIndex];

    // Renderização dos Tipos de Slide Visual Limpo
    const renderSlideContent = () => {
      switch (slideAtual.tipo) {
        case 'capa':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 md:p-12 bg-slate-950 min-h-[450px]">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase leading-tight">
                {slideAtual.titulo}
              </h1>
              <p className="text-xl md:text-4xl font-medium text-amber-400">
                {slideAtual.subtitulo}
              </p>
            </div>
          );
        
        case 'texto_simples':
          return (
            <div className="w-full h-full flex flex-col justify-center p-6 md:p-16 bg-[#0B1120] min-h-[450px]">
              <h2 className="text-3xl md:text-5xl font-black text-emerald-400 mb-8 border-l-8 border-emerald-500 pl-4">
                {slideAtual.titulo}
              </h2>
              <ul className="space-y-6 max-w-5xl">
                {slideAtual.topicos?.map((topico, idx) => (
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
                 {slideAtual.texto}
               </h2>
               {slideAtual.subtexto && (
                 <p className="mt-8 text-2xl md:text-4xl text-emerald-400 font-bold border-b-4 border-emerald-400 pb-2">
                   {slideAtual.subtexto}
                 </p>
               )}
            </div>
          );

        default:
          return <div className="text-white text-3xl">Erro no formato do slide</div>;
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
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-50 no-print">
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
