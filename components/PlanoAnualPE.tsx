import React, { useState } from 'react';
import { Calendar, Info, X, Filter, Users, BookOpen, ClipboardList, CheckCircle, Bell, Download, ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. DADOS DE CONFIGURAÇÃO E CORES
// ============================================================================

const SEGMENTS = {
  FUNDAMENTAL: { id: 'fundamental', name: 'Ensino Fundamental (8º ano)', color: 'bg-blue-100 border-blue-300 text-blue-900', hover: 'hover:bg-blue-200' },
  ACELERACAO: { id: 'aceleracao', name: 'Aceleração (AP)', color: 'bg-green-100 border-green-300 text-green-900', hover: 'hover:bg-green-200' },
  MEDIO: { id: 'medio', name: 'ILGCH (Ensino Médio)', color: 'bg-orange-100 border-orange-300 text-orange-900', hover: 'hover:bg-orange-200' },
  EJA: { id: 'eja', name: 'EJA', color: 'bg-purple-100 border-purple-300 text-purple-900', hover: 'hover:bg-purple-200' },
};

const CLASSES = {
  MONDAY: [
    { id: '802', name: 'Turma 802 (EE Cordelia Paiva)', segment: SEGMENTS.FUNDAMENTAL },
    { id: '803', name: 'Turma 803 (EE Cordelia Paiva)', segment: SEGMENTS.FUNDAMENTAL },
    { id: '801', name: 'Turma 801 (EE Cordelia Paiva)', segment: SEGMENTS.FUNDAMENTAL },
    { id: 'AP198', name: 'AP 101 (CIEP 198)', segment: SEGMENTS.ACELERACAO },
    { id: 'EJANEM', name: 'EJANEM 101 (CE Euclides da Cunha)', segment: SEGMENTS.EJA },
  ],
  FRIDAY: [
    { id: 'AP320', name: 'AP 101 (CIEP 320)', segment: SEGMENTS.ACELERACAO },
    { id: '1003', name: 'Turma 1003 (CIEP 476)', segment: SEGMENTS.MEDIO },
    { id: '1001', name: 'Turma 1001 (CIEP 476)', segment: SEGMENTS.MEDIO },
    { id: 'AP301', name: 'Turma AP 301 (CIEP 320)', segment: SEGMENTS.ACELERACAO },
    { id: '1007', name: 'Turma 1007 (CIEP 476)', segment: SEGMENTS.MEDIO },
  ]
};

const MONTHS = [
  { id: '05', name: 'Maio' },
  { id: '06', name: 'Junho' },
  { id: '07', name: 'Julho' },
  { id: '08', name: 'Agosto' },
  { id: '09', name: 'Setembro' },
  { id: '10', name: 'Outubro' },
  { id: '11', name: 'Novembro' },
  { id: '12', name: 'Dezembro' },
];

const DEFAULT_DESC = '[Professor André, digite aqui as regras, o passo a passo da atividade e as reflexões que deseja fazer com a turma.]';

const QUEIMADO_INICIAL = { 
  title: 'Queimado com Regras (Quebra-gelo)', 
  description: 'Objetivos: Quebrar o gelo, estabelecer domínio de turma e incluir todos.\\n\\nRegras de ouro do Professor:\\n1. Times com números iguais (mistos, independente de gênero).\\n2. Obrigatoriedade: TODOS precisam jogar ou lançar a bola pelo menos 1 vez.\\n3. Eliminatória: Quem for queimado sai e não volta (sem regra de "coveiro" ou "cruzar").\\n4. Tempo limite: 5 minutos regressivos contados no relógio.\\n5. Vitória: O time que tiver MAIS pessoas em pé na quadra ao fim dos 5 minutos vence.\\n\\nApós o jogo: Tempo liberado para a atividade que eles quiserem (ex: futebol, vôlei livre).' 
};

const AULA_FUTEVOLEI = { title: 'Teoria Futevôlei (Em Sala)', description: 'Conversa inicial sobre a dinâmica das aulas: devido à falta de quadra na escola, as aulas serão majoritariamente em sala.\\n\\nApresentação de conteúdo teórico sobre Futevôlei (exibição até o slide 4).' };
const AULA_FUTEPATIO = { title: 'Prática: Futepátio', description: 'Continuidade do conteúdo de Futevôlei.\\n\\nJogo prático adaptado no pátio da escola, estilo "futemesa", batizado de Futepátio. Foco em adaptação ao espaço.' };
const AULA_MANCALA = { title: 'Lógica Africana (Mancala)', description: 'Teoria: Explicar a filosofia dos jogos de semeadura africanos. Diferente do xadrez (guerra), a Mancala simula a colheita, distribuição e agricultura.\\n\\nPrática: Jogar em duplas nas carteiras usando caixas de ovos e tampinhas/feijões.' };
const AULA_VARZEA = { title: 'Futebol, Racismo e Várzea', description: 'Teoria: A história elitista do futebol no Brasil, a fundação dos clubes por negros e operários (Bangu, Vasco) e a resistência da várzea.\\n\\nPrática: Torneio de "Futebol de Botão" adaptado com tampinhas de garrafa sobre as mesas.' };
const AULA_ESPORTS = { title: 'E-Sports e o Corpo', description: 'Teoria: O lucro da indústria dos games, o sedentarismo e o "roubo do tempo" da juventude.\\n\\nPrática: "Stop" (Adedonha) Esportivo no caderno. Categorias: Esporte com bola, Atleta negro histórico, Jogo de rua, Músculo do corpo. Ganha quem tiver mais vocabulário.' };
const AULA_ONCA = { title: 'Jogos Indígenas (Onça)', description: 'Teoria: A cultura dos povos originários e o "Jogo da Onça" (Bororo/Guarani), que ensina estratégia e preservação.\\n\\nPrática: Desenhar o tabuleiro no caderno e jogar com bolinhas de papel amssado (1 onça vs 14 cachorros).' };
const AULA_TABULEIROS = { title: 'Festival de Tabuleiros', description: 'Atividade focada: Aula livre para que os alunos joguem Xadrez e Damas. O professor atua como instrutor e orienta as estratégias.' };
const AULA_PARALIMPICO = { title: 'Esporte Paralímpico', description: 'Teoria: História das Paralimpíadas, acessibilidade urbana e o direito ao esporte para PCDs.\\n\\nPrática: Vôlei de Balão Sentado. Afastar as carteiras. Todos devem jogar sentados e passar a bexiga sem deixar cair.' };
const AULA_PADROES = { title: 'Corpo, Mídia e Padrões', description: 'Teoria: Estudo sobre racismo estético (Cida Bento/Fanon). Como a mídia constrói um "padrão de beleza" irreal que adoece os jovens.\\n\\nPrática: Jogo "Quem sou eu?" com post-its na testa, usando nomes de atletas e personalidades para quebrar estereótipos.' };
const AULA_PRECISAO = { title: 'Esportes de Precisão', description: 'Teoria: A diferença entre esportes de invasão, rede e precisão (como arco e flecha, bocha).\\n\\nPrática: Arremesso de bolinha de papel em lixeiras com distâncias e pontuações variadas.' };
const AULA_ILHA = { title: 'Competição vs Cooperação', description: 'Teoria: A lógica capitalista de "vencer o outro" vs a lógica coletiva de "crescer junto".\\n\\nPrática: Jogo "A Ilha" na sala de aula. Eles recebem folhas de jornal e todos precisam caber dentro sem rasgar, exigindo estratégia e ajuda mútua.' };
const AULA_POSTURA = { title: 'Saúde: Postura', description: 'Teoria: Ergonomia. O vício postural celular/estudante e como isso impacta o futuro trabalhador.\\n\\nPrática: Guia de ginástica laboral que pode ser feita sentado na própria cadeira escolar.' };
const AULA_OLIMPIADAS = { title: 'Olimpíadas e Política', description: 'Teoria: O esporte não é neutro. O protesto dos Panteras Negras no pódio de 1968 contra o racismo.\\n\\nPrática: "Jogo da Forca" na lousa com palavras e termos estudados sobre a cultura negra e esportiva.' };
const AULA_DOMINO = { title: 'Jogos de Salão: Dominó', description: 'Teoria: O lazer operário e o uso do tempo nas ruas periféricas com jogos de salão. Probabilidade matemática básica.\\n\\nPrática: Torneio de Dominó em grupos de 4.' };
const AULA_MUSICA = { title: 'A Música na Capoeira', description: 'Teoria: Os instrumentos e a comunicação secreta durante a escravidão (o toque de aviso de cavalaria).\\n\\nPrática: Ritmo e percussão corporal batendo na própria mesa escolar para criar sincronia de grupo.' };
const AULA_AVALIACAO = { title: 'Avaliação Teórica / Livre', description: 'Aplicação de prova teórica escrita sobre os conteúdos discutidos (racismo, saúde, história das lutas e jogos).\\n\\nApós término: Jogos de salão livres (Xadrez, UNO, Damas).' };
const AULA_AUTOAVALIACAO = { title: 'Autoavaliação e Livre', description: 'Roda final e tempo livre.' };

const AULA_LUTAS_BASE = () => ({ title: 'Lutas de Resistência', description: 'Teoria: Capoeira não é "briga", é resistência. Diferenciar briga (violência) de Luta (filosofia e regras).\\n\\nPrática: "Briga de Galo" adaptada e segura de mãos. Empurrar a mão do colega na mesa para tentar desequilibrar a postura.' });
const AULA_SHISIMA_BASE = () => ({ title: 'Torneio de Shisima', description: 'Teoria: Revisão e cobrança do material construído.\\n\\nPrática: Realizar o torneio inter-carteiras com o jogo de tabuleiro Shisima.' });
const AULA_APARTHEID_BASE = () => ({ title: 'Apartheid e o Esporte', description: 'Teoria: Como a África do Sul usou o esporte para segregar (Futebol vs Rugby) e a lição de Nelson Mandela.\\n\\nPrática: Criação de um jogo de tabuleiro pelos alunos no caderno.' });
const AULA_DIREITO_BASE = () => ({ title: 'Direito à Cidade (Lazer)', description: 'Teoria: Brincadeiras de rua vs Gentrificação (a falta de praças nas periferias e o excesso de carros).\\n\\nPrática: Resgate oral. Jogo do "Telefone Sem Fio" focado em comunicação ou mímica na frente do quadro.' });

const SCHEDULE_MONDAY = [
  { date: '11/05', type: 'class', activities: { 
    '802': { title: 'Apresentação e Provas', description: 'Conhecendo a turma.\\n\\nAplicação de provas de recuperação de outros professores.' }, 
    '803': { title: 'Apresentação e Provas', description: 'Conhecendo a turma.\\n\\nAplicação de provas de recuperação de outros professores.' }, 
    '801': { title: 'Apresentação e Provas', description: 'Conhecendo a turma.\\n\\nAplicação de provas de recuperação de outros professores.' }, 
    'AP198': { title: 'Apresentação + Jogo Virtual', description: 'Conhecendo a turma.\\n\\nDinâmica utilizando jogo virtual do aplicativo "Sala de Jogos" do professor.' }, 
    'EJANEM': { title: 'Sem Aula', description: 'Não houve aula neste dia.' } 
  }},
  { date: '18/05', type: 'class', activities: { 
    '802': AULA_FUTEVOLEI, 
    '803': AULA_FUTEVOLEI, 
    '801': AULA_FUTEVOLEI, 
    'AP198': AULA_FUTEVOLEI, 
    'EJANEM': { title: 'Debate "Corpo e Mídia"', description: 'Primeira aula com a turma.\\n\\nRoda de conversa pautada em Frantz Fanon e Cida Bento. Debater a hipersexualização e os estereótipos associados aos corpos negros e periféricos na televisão e na internet, contrapondo com a realidade.' } 
  }},
  { date: '25/05', type: 'class', activities: { 
    '802': AULA_FUTEPATIO, 
    '803': AULA_FUTEPATIO, 
    '801': AULA_FUTEPATIO, 
    'AP198': AULA_FUTEPATIO, 
    'EJANEM': { title: 'Saúde (LER/DORT)', description: DEFAULT_DESC } 
  }},
  { date: '08/06', type: 'class', activities: { 
    '802': AULA_MANCALA, 
    '803': AULA_MANCALA, 
    '801': AULA_MANCALA, 
    'AP198': AULA_MANCALA, 
    'EJANEM': { title: 'Ginástica laboral mãos', description: DEFAULT_DESC } 
  }},
  { date: '15/06', type: 'class', activities: { 
    '802': AULA_VARZEA, 
    '803': AULA_VARZEA, 
    '801': AULA_VARZEA, 
    'AP198': AULA_VARZEA, 
    'EJANEM': { title: 'Postura levantar peso', description: DEFAULT_DESC } 
  }},
  { date: '22/06', type: 'class', activities: { 
    '802': AULA_ESPORTS, 
    '803': AULA_ESPORTS, 
    '801': AULA_ESPORTS, 
    'AP198': AULA_ESPORTS, 
    'EJANEM': { title: 'Automassagem', description: DEFAULT_DESC } 
  }},
  { date: '29/06', type: 'class', activities: { 
    '802': AULA_ONCA, 
    '803': AULA_ONCA, 
    '801': AULA_ONCA, 
    'AP198': AULA_ONCA, 
    'EJANEM': { title: 'Roda "Meu corpo"', description: DEFAULT_DESC } 
  }},
  { date: '06/07', subtitle: 'Encerramento 2º Trim.', type: 'class', activities: { 
    '802': AULA_TABULEIROS, 
    '803': AULA_TABULEIROS, 
    '801': AULA_TABULEIROS, 
    'AP198': AULA_TABULEIROS, 
    'EJANEM': { title: 'Simulação SAMU', description: DEFAULT_DESC } 
  }},
  { date: '13/07', type: 'event', title: 'RECESSO ESCOLAR' },
  { date: '20/07', type: 'event', title: 'RECESSO ESCOLAR' },
  { date: '27/07', type: 'class', activities: { 
    '802': AULA_PARALIMPICO, 
    '803': AULA_PARALIMPICO, 
    '801': AULA_PARALIMPICO, 
    'AP198': AULA_PARALIMPICO, 
    'EJANEM': { title: '1ºs Socorros: AVC', description: DEFAULT_DESC } 
  }},
  { date: '03/08', type: 'class', activities: { 
    '802': AULA_PADROES, 
    '803': AULA_PADROES, 
    '801': AULA_PADROES, 
    'AP198': AULA_PADROES, 
    'EJANEM': { title: 'Manobra Heimlich', description: DEFAULT_DESC } 
  }},
  { date: '10/08', type: 'event', title: 'REUNIÃO DE RESPONSÁVEIS' },
  { date: '17/08', type: 'class', activities: { 
    '802': { ...AULA_LUTAS_BASE(), assignment: { type: 'passar', points: 3, deadline: '14/09', title: 'Construção de Jogos Africanos', text: 'Trazer um tabuleiro de Shisima ou Mancala construído em casa com material reciclável.'} }, 
    '803': { ...AULA_LUTAS_BASE(), assignment: { type: 'passar', points: 3, deadline: '14/09', title: 'Construção de Jogos Africanos', text: 'Trazer um tabuleiro de Shisima ou Mancala construído em casa com material reciclável.'} }, 
    '801': { ...AULA_LUTAS_BASE(), assignment: { type: 'passar', points: 3, deadline: '14/09', title: 'Construção de Jogos Africanos', text: 'Trazer um tabuleiro de Shisima ou Mancala construído em casa com material reciclável.'} }, 
    'AP198': { ...AULA_LUTAS_BASE(), assignment: { type: 'passar', points: 3, deadline: '14/09', title: 'Construção de Jogos Africanos', text: 'Trazer um tabuleiro de Shisima ou Mancala construído em casa com material reciclável.'} }, 
    'EJANEM': { title: '1ºs Socorros: queimaduras', description: DEFAULT_DESC, assignment: { type: 'passar', points: 3, deadline: '14/09', title: 'Cartilha de Sobrevivência', text: 'Criar um mini-guia dobrável com 3 dicas de primeiros socorros para acidentes no trabalho.'} } 
  }},
  { date: '24/08', type: 'class', activities: { 
    '802': AULA_PRECISAO, 
    '803': AULA_PRECISAO, 
    '801': AULA_PRECISAO, 
    'AP198': AULA_PRECISAO, 
    'EJANEM': { title: '1ºs Socorros: desmaio', description: DEFAULT_DESC } 
  }},
  { date: '31/08', type: 'class', activities: { 
    '802': AULA_ILHA, 
    '803': AULA_ILHA, 
    '801': AULA_ILHA, 
    'AP198': AULA_ILHA, 
    'EJANEM': { title: 'Mapa afetivo', description: DEFAULT_DESC } 
  }},
  { date: '07/09', type: 'event', title: 'FERIADO DA INDEPENDÊNCIA' },
  { date: '14/09', type: 'class', activities: { 
    '802': { ...AULA_SHISIMA_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Tabuleiros Africanos'} }, 
    '803': { ...AULA_SHISIMA_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Tabuleiros Africanos'} }, 
    '801': { ...AULA_SHISIMA_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Tabuleiros Africanos'} }, 
    'AP198': { ...AULA_SHISIMA_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Tabuleiros Africanos'} }, 
    'EJANEM': { title: 'Projeto Vida Ativa', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Cartilha Primeiros Socorros'} } 
  }},
  { date: '21/09', type: 'class', activities: { 
    '802': AULA_POSTURA, 
    '803': AULA_POSTURA, 
    '801': AULA_POSTURA, 
    'AP198': AULA_POSTURA, 
    'EJANEM': { title: 'Relaxamento muscular', description: DEFAULT_DESC } 
  }},
  { date: '28/09', type: 'event', title: 'ENEM' },
  { date: '05/10', type: 'class', activities: { 
    '802': AULA_OLIMPIADAS, 
    '803': AULA_OLIMPIADAS, 
    '801': AULA_OLIMPIADAS, 
    'AP198': AULA_OLIMPIADAS, 
    'EJANEM': { title: '1ºs Socorros: convulsão', description: DEFAULT_DESC } 
  }},
  { date: '12/10', type: 'event', title: 'FERIADO NOSSA SRª APARECIDA' },
  { date: '19/10', type: 'class', activities: { 
    '802': AULA_DOMINO, 
    '803': AULA_DOMINO, 
    '801': AULA_DOMINO, 
    'AP198': AULA_DOMINO, 
    'EJANEM': { title: 'Simulado socorros', description: DEFAULT_DESC } 
  }},
  { date: '26/10', subtitle: 'Novembro Negro', type: 'class', activities: { 
    '802': { ...AULA_APARTHEID_BASE(), assignment: { type: 'passar', points: 3, deadline: '30/11', title: 'Atletas contra o Racismo', text: 'Buscar a história de um atleta negro ou indígena que lutou contra o racismo.'} }, 
    '803': { ...AULA_APARTHEID_BASE(), assignment: { type: 'passar', points: 3, deadline: '30/11', title: 'Atletas contra o Racismo', text: 'Buscar a história de um atleta negro ou indígena que lutou contra o racismo.'} }, 
    '801': { ...AULA_APARTHEID_BASE(), assignment: { type: 'passar', points: 3, deadline: '30/11', title: 'Atletas contra o Racismo', text: 'Buscar a história de um atleta negro ou indígena que lutou contra o racismo.'} }, 
    'AP198': { ...AULA_APARTHEID_BASE(), assignment: { type: 'passar', points: 3, deadline: '30/11', title: 'Atletas contra o Racismo', text: 'Buscar a história de um atleta negro ou indígena que lutou contra o racismo.'} }, 
    'EJANEM': { title: 'Luiz Gama e várzea', description: 'Debate: Luiz Gama, abolicionista, e o futebol de várzea contra a elitização.', assignment: { type: 'passar', points: 3, deadline: '30/11', title: 'Resgate da Várzea', text: 'Pesquisar a história do futebol de várzea na sua comunidade.'} } 
  }},
  { date: '16/11', type: 'event', title: 'AVALIAÇÃO DIAGNÓSTICA' },
  { date: '23/11', subtitle: 'Consciência Negra', type: 'class', activities: { 
    '802': AULA_MUSICA, 
    '803': AULA_MUSICA, 
    '801': AULA_MUSICA, 
    'AP198': AULA_MUSICA, 
    'EJANEM': { title: 'Jongo: improviso', description: DEFAULT_DESC } 
  }},
  { date: '30/11', type: 'class', activities: { 
    '802': { ...AULA_DIREITO_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Atletas vs Racismo'} }, 
    '803': { ...AULA_DIREITO_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Atletas vs Racismo'} }, 
    '801': { ...AULA_DIREITO_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Atletas vs Racismo'} }, 
    'AP198': { ...AULA_DIREITO_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Atletas vs Racismo'} }, 
    'EJANEM': { title: '"Feijoada Imaterial"', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Trabalho Várzea'} } 
  }},
  { date: '07/12', type: 'class', activities: { 
    '802': AULA_AVALIACAO, 
    '803': AULA_AVALIACAO, 
    '801': AULA_AVALIACAO, 
    'AP198': AULA_AVALIACAO, 
    'EJANEM': { title: 'Confraternização', description: DEFAULT_DESC } 
  }},
  { date: '14/12', subtitle: 'Encerramento', type: 'class', activities: { 
    '802': AULA_AUTOAVALIACAO, 
    '803': AULA_AUTOAVALIACAO, 
    '801': AULA_AUTOAVALIACAO, 
    'AP198': AULA_AUTOAVALIACAO, 
    'EJANEM': { title: 'Roda de encerramento', description: DEFAULT_DESC } 
  }}
];

const SCHEDULE_FRIDAY = [
  { date: '08/05', type: 'class', activities: { 
    'AP320': QUEIMADO_INICIAL, 
    '1003': QUEIMADO_INICIAL, 
    '1001': QUEIMADO_INICIAL, 
    'AP301': QUEIMADO_INICIAL, 
    '1007': QUEIMADO_INICIAL 
  }},
  { date: '15/05', type: 'class', activities: { 
    'AP320': AULA_FUTEVOLEI, 
    '1003': { title: 'Debate "Corpo e mídia"', description: 'Roda de conversa pautada em Frantz Fanon e Cida Bento. \\n\\nDebater a hipersexualização e os estereótipos associados aos corpos negros e periféricos na televisão e na internet, contrapondo com a realidade.' }, 
    '1001': { title: 'Jogo "Estátua"', description: DEFAULT_DESC }, 
    'AP301': AULA_FUTEVOLEI, 
    '1007': { title: 'Mapa corporal', description: DEFAULT_DESC } 
  }},
  { date: '22/05', type: 'class', activities: { 
    'AP320': AULA_FUTEPATIO, 
    '1003': { title: 'Luta Marajoara', description: DEFAULT_DESC }, 
    '1001': { title: 'Esporte e Sociedade', description: DEFAULT_DESC }, 
    'AP301': AULA_FUTEPATIO, 
    '1007': { title: 'Mídia e racismo', description: 'Objetivo: Leitura crítica do racismo no esporte.\\n\\nDesenvolvimento:\\n1. Apresentação de casos reais recentes (futebol, atletismo).\\n2. Discutir como os locutores descrevem o atleta negro ("força física") versus o branco ("inteligência tática").' } 
  }},
  { date: '29/05', type: 'class', activities: { 
    'AP320': AULA_MANCALA, 
    '1003': { title: 'Luta Marajoara', description: DEFAULT_DESC }, 
    '1001': { title: 'Vôlei cooperativo', description: DEFAULT_DESC }, 
    'AP301': AULA_MANCALA, 
    '1007': { title: 'Torneio Futebol', description: DEFAULT_DESC } 
  }},
  { date: '05/06', type: 'class', activities: { 
    'AP320': AULA_VARZEA, 
    '1003': { title: 'Jogo "A Ilha"', description: DEFAULT_DESC }, 
    '1001': { title: 'Jogo "Nó Humano"', description: DEFAULT_DESC }, 
    'AP301': AULA_VARZEA, 
    '1007': { title: 'Alongamento em dupla', description: DEFAULT_DESC } 
  }},
  { date: '12/06', type: 'class', activities: { 
    'AP320': AULA_ESPORTS, 
    '1003': { title: 'Debate Violência', description: DEFAULT_DESC }, 
    '1001': { title: 'Debate Compulsão', description: DEFAULT_DESC }, 
    'AP301': AULA_ESPORTS, 
    '1007': { title: 'Futebol de Botão', description: DEFAULT_DESC } 
  }},
  { date: '19/06', type: 'class', activities: { 
    'AP320': AULA_ONCA, 
    '1003': { title: 'Pique-Bandeira', description: DEFAULT_DESC }, 
    '1001': { title: 'Queimada Cooperativa', description: DEFAULT_DESC }, 
    'AP301': AULA_ONCA, 
    '1007': { title: 'Lençolbol', description: DEFAULT_DESC } 
  }},
  { date: '26/06', type: 'class', activities: { 
    'AP320': AULA_TABULEIROS, 
    '1003': { title: 'Torneio de Damas', description: DEFAULT_DESC }, 
    '1001': { title: 'Torneio de Xadrez', description: 'Relembrar as regras fundamentais do Xadrez. Partidas rápidas.' }, 
    'AP301': AULA_TABULEIROS, 
    '1007': { title: 'Jogo da Velha tampinhas', description: DEFAULT_DESC } 
  }},
  { date: '03/07', subtitle: 'Integração', type: 'class', activities: { 
    'AP320': { title: 'Festival de Jogos', description: DEFAULT_DESC }, 
    '1003': { title: 'Festival de Jogos', description: DEFAULT_DESC }, 
    '1001': { title: 'Festival de Jogos', description: DEFAULT_DESC }, 
    'AP301': { title: 'Festival de Jogos', description: DEFAULT_DESC }, 
    '1007': { title: 'Festival de Jogos', description: DEFAULT_DESC } 
  }},
  { date: '31/07', type: 'class', activities: { 
    'AP320': AULA_PARALIMPICO, 
    '1003': { title: '1ºs Socorros: SAMU', description: DEFAULT_DESC }, 
    '1001': { title: '1ºs Socorros: entorse', description: DEFAULT_DESC }, 
    'AP301': AULA_PARALIMPICO, 
    '1007': { title: '1ºs Socorros: fratura', description: DEFAULT_DESC } 
  }},
  { date: '07/08', type: 'class', activities: { 
    'AP320': AULA_PADROES, 
    '1003': { title: '1ºs Socorros: sangramento', description: DEFAULT_DESC }, 
    '1001': { title: '1ºs Socorros: convulsão', description: DEFAULT_DESC }, 
    'AP301': AULA_PADROES, 
    '1007': { title: 'Mapa de riscos', description: DEFAULT_DESC } 
  }},
  { date: '14/08', type: 'class', activities: { 
    'AP320': { ...AULA_LUTAS_BASE(), assignment: { type: 'passar', points: 3, deadline: '04/09', title: 'Construção de Jogos Africanos', text: 'Trazer um tabuleiro de Shisima ou Mancala construído em casa.'} }, 
    '1003': { title: '1ºs Socorros: queimadura', description: DEFAULT_DESC }, 
    '1001': { title: '1ºs Socorros: choque', description: DEFAULT_DESC }, 
    'AP301': { ...AULA_LUTAS_BASE(), assignment: { type: 'passar', points: 3, deadline: '04/09', title: 'Construção de Jogos Africanos', text: 'Trazer um tabuleiro de Shisima ou Mancala construído em casa.'} }, 
    '1007': { title: 'Consciência Corporal', description: DEFAULT_DESC } 
  }},
  { date: '21/08', type: 'class', activities: { 
    'AP320': AULA_PRECISAO, 
    '1003': { title: 'Projeto: Caminhada', description: DEFAULT_DESC, assignment: { type: 'passar', points: 3, deadline: '18/09', title: 'Mapeamento da Gentrificação', text: 'Fotografar ou desenhar um espaço de lazer na Baixada/Maricá, analisando se ele é seguro e acessível para a classe trabalhadora.'} }, 
    '1001': { title: 'Projeto: Roda Capoeira', description: DEFAULT_DESC, assignment: { type: 'passar', points: 3, deadline: '18/09', title: 'Mapeamento da Gentrificação', text: 'Fotografar ou desenhar um espaço de lazer na Baixada/Maricá, analisando se ele é seguro e acessível para a classe trabalhadora.'} }, 
    'AP301': AULA_PRECISAO, 
    '1007': { title: 'Gentrificação', description: 'Debate: Como o crescimento das cidades empurra a classe trabalhadora para as margens?', assignment: { type: 'passar', points: 3, deadline: '18/09', title: 'Mapeamento da Gentrificação', text: 'Fotografar ou desenhar um espaço de lazer na Baixada/Maricá, analisando se ele é seguro e acessível para a classe trabalhadora.'} } 
  }},
  { date: '28/08', type: 'class', activities: { 
    'AP320': AULA_ILHA, 
    '1003': { title: 'Mapear espaços lazer', description: DEFAULT_DESC }, 
    '1001': { title: 'Convidar capoeirista', description: DEFAULT_DESC }, 
    'AP301': AULA_ILHA, 
    '1007': { title: 'Automassagem', description: DEFAULT_DESC } 
  }},
  { date: '04/09', subtitle: 'Encerramento 2º Trim.', type: 'class', activities: { 
    'AP320': { ...AULA_SHISIMA_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Tabuleiros Africanos'} }, 
    '1003': { title: 'Apresentação projetos', description: DEFAULT_DESC }, 
    '1001': { title: 'Apresentação projetos', description: DEFAULT_DESC }, 
    'AP301': { ...AULA_SHISIMA_BASE(), assignment: { type: 'receber', points: 3, title: 'Receber: Tabuleiros Africanos'} }, 
    '1007': { title: 'Apresentação projetos', description: DEFAULT_DESC } 
  }},
  { date: '11/09', type: 'class', activities: { 
    'AP320': AULA_POSTURA, 
    '1003': { title: 'Plano de Vida Ativa', description: DEFAULT_DESC }, 
    '1001': { title: 'Plano de Vida Ativa', description: DEFAULT_DESC }, 
    'AP301': AULA_POSTURA, 
    '1007': { title: 'Plano de Vida Ativa', description: DEFAULT_DESC } 
  }},
  { date: '18/09', type: 'class', activities: { 
    'AP320': AULA_OLIMPIADAS, 
    '1003': { title: 'Circuito funcional', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Trabalho Gentrificação'} }, 
    '1001': { title: 'Testar plano', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Trabalho Gentrificação'} }, 
    'AP301': AULA_OLIMPIADAS, 
    '1007': { title: 'Treino prático', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Trabalho Gentrificação'} } 
  }},
  { date: '25/09', subtitle: 'Semana Paralímpica', type: 'class', activities: { 
    'AP320': AULA_DOMINO, 
    '1003': { title: 'Esporte Adaptado: goalball', description: DEFAULT_DESC }, 
    '1001': { title: 'Vôlei sentado', description: DEFAULT_DESC }, 
    'AP301': AULA_DOMINO, 
    '1007': { title: 'Corrida guiada', description: DEFAULT_DESC } 
  }},
  { date: '09/10', type: 'class', activities: { 
    'AP320': { ...AULA_APARTHEID_BASE(), assignment: { type: 'passar', points: 3, deadline: '06/11', title: 'Atletas contra o Racismo', text: 'Buscar a história de um atleta negro ou indígena que lutou contra o racismo.'} }, 
    '1003': { title: 'Apresentação Planos', description: DEFAULT_DESC, assignment: { type: 'passar', points: 3, deadline: '30/10', title: 'O Plano de Vida Ativa', text: 'Entregar o projeto finalizado e por escrito: um planejamento de exercícios e saúde mental adaptado para a rotina de um trabalhador brasileiro.'} }, 
    '1001': { title: 'Apresentação Planos', description: DEFAULT_DESC, assignment: { type: 'passar', points: 3, deadline: '30/10', title: 'O Plano de Vida Ativa', text: 'Entregar o projeto finalizado e por escrito: um planejamento de exercícios e saúde mental adaptado para a rotina de um trabalhador brasileiro.'} }, 
    'AP301': { ...AULA_APARTHEID_BASE(), assignment: { type: 'passar', points: 3, deadline: '06/11', title: 'Atletas contra o Racismo', text: 'Buscar a história de um atleta negro ou indígena que lutou contra o racismo.'} }, 
    '1007': { title: 'Apresentação Planos', description: DEFAULT_DESC, assignment: { type: 'passar', points: 3, deadline: '30/10', title: 'O Plano de Vida Ativa', text: 'Entregar o projeto finalizado e por escrito: um planejamento de exercícios e saúde mental adaptado para a rotina de um trabalhador brasileiro.'} } 
  }},
  { date: '16/10', type: 'class', activities: { 
    'AP320': AULA_MUSICA, 
    '1003': { title: 'Teste prático', description: DEFAULT_DESC }, 
    '1001': { title: 'Teste prático', description: DEFAULT_DESC }, 
    'AP301': AULA_MUSICA, 
    '1007': { title: 'Teste prático', description: DEFAULT_DESC } 
  }},
  { date: '23/10', subtitle: 'Semana Cultural', type: 'class', activities: { 
    'AP320': AULA_DIREITO_BASE(), 
    '1003': { title: 'Ajuste planos', description: DEFAULT_DESC }, 
    '1001': { title: 'Ajuste planos', description: DEFAULT_DESC }, 
    'AP301': AULA_DIREITO_BASE(), 
    '1007': { title: 'Ajuste planos', description: DEFAULT_DESC } 
  }},
  { date: '30/10', type: 'class', activities: { 
    'AP320': AULA_AVALIACAO, 
    '1003': { title: 'Entrega final', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Plano Vida Ativa'} }, 
    '1001': { title: 'Entrega final', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Plano Vida Ativa'} }, 
    'AP301': AULA_AVALIACAO, 
    '1007': { title: 'Entrega final', description: DEFAULT_DESC, assignment: { type: 'receber', points: 3, title: 'Receber: Plano Vida Ativa'} } 
  }},
  { date: '06/11', subtitle: 'Abert. Novembro Negro', type: 'class', activities: { 
    'AP320': { ...AULA_AUTOAVALIACAO, assignment: { type: 'receber', points: 3, title: 'Receber: Atletas vs Racismo'} }, 
    '1003': { title: 'Pesquisa atleta negro', description: DEFAULT_DESC }, 
    '1001': { title: 'Roda Capoeira comunidade', description: DEFAULT_DESC }, 
    'AP301': { ...AULA_AUTOAVALIACAO, assignment: { type: 'receber', points: 3, title: 'Receber: Atletas vs Racismo'} }, 
    '1007': { title: 'Anemia falciforme', description: DEFAULT_DESC } 
  }},
  { date: '27/11', subtitle: 'Consciência Negra', type: 'class', activities: { 
    'AP320': { title: 'Torneio de Tabuleiros', description: 'Revisão prática. Torneio de Xadrez, Damas e Dominó nas mesas.' }, 
    '1003': { title: 'Maculelê', description: DEFAULT_DESC }, 
    '1001': { title: 'Dança dos Orixás', description: DEFAULT_DESC }, 
    'AP301': { title: 'Torneio de Tabuleiros', description: 'Revisão prática. Torneio de Xadrez, Damas e Dominó nas mesas.' }, 
    '1007': { title: 'Jongo aprofundado', description: DEFAULT_DESC } 
  }},
  { date: '04/12', type: 'class', activities: { 
    'AP320': { title: 'Jogos Livres', description: 'Atividade livre em sala. Alunos escolhem os jogos de tabuleiro e dinâmicas que preferem.' }, 
    '1003': { title: 'Sarau Afro', description: DEFAULT_DESC }, 
    '1001': { title: 'Sarau Afro', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jogos Livres', description: 'Atividade livre em sala. Alunos escolhem os jogos de tabuleiro e dinâmicas que preferem.' }, 
    '1007': { title: 'Sarau Afro', description: DEFAULT_DESC } 
  }},
  { date: '11/12', subtitle: 'Conselho de Classe', type: 'class', activities: { 
    'AP320': { title: 'Confraternização e Jogos', description: 'Jogos de tabuleiro leves.' }, 
    '1003': { title: 'Confraternização esportiva', description: DEFAULT_DESC }, 
    '1001': { title: 'Confraternização esportiva', description: DEFAULT_DESC }, 
    'AP301': { title: 'Confraternização e Jogos', description: 'Jogos de tabuleiro leves.' }, 
    '1007': { title: 'Confraternização', description: DEFAULT_DESC } 
  }},
  { date: '18/12', subtitle: 'Encerramento', type: 'class', activities: { 
    'AP320': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    '1003': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    '1001': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    'AP301': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    '1007': { title: 'Confraternização final', description: DEFAULT_DESC } 
  }},
];

// ============================================================================
// 3. COMPONENTE PRINCIPAL (EXPORTADO)
// ============================================================================

export const PlanoAnualPE: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('MONDAY');
  const [filterClass, setFilterClass] = useState('ALL');
  const [activeMonth, setActiveMonth] = useState('05');
  const [modalData, setModalData] = useState<any>(null);
  const [completedClasses, setCompletedClasses] = useState<string[]>([]);

  const currentClasses = activeTab === 'MONDAY' ? CLASSES.MONDAY : CLASSES.FRIDAY;
  const currentSchedule = activeTab === 'MONDAY' ? SCHEDULE_MONDAY : SCHEDULE_FRIDAY;

  const classesToRender = filterClass === 'ALL' 
    ? currentClasses 
    : currentClasses.filter(c => c.id === filterClass);

  const scheduleToRender = currentSchedule.filter(day => day.date.endsWith('/' + activeMonth));

  const toggleCompletion = (classId: string, date: string) => {
    const key = `${classId}-${date}`;
    setCompletedClasses(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 rounded-2xl shadow-inner border border-gray-200">
      
      {/* CABEÇALHO */}
      <header className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold bg-slate-100 px-4 py-2 rounded-lg shadow-sm border border-slate-200 transition-all hover:bg-slate-200"
        >
          <ChevronLeft size={20} /> Voltar ao Menu de Gestão
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Calendar className="text-indigo-600" size={32} />
          Calendário de Educação Física - 2026
        </h1>
        <p className="text-gray-600 mb-6 font-medium">Professor André Brito • Maricá, RJ</p>
        
        {/* CONTROLES: ABAS E FILTROS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => { setActiveTab('MONDAY'); setFilterClass('ALL'); }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-black transition-all uppercase tracking-widest ${
                activeTab === 'MONDAY' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Segunda-feira
            </button>
            <button
              onClick={() => { setActiveTab('FRIDAY'); setFilterClass('ALL'); }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-black transition-all uppercase tracking-widest ${
                activeTab === 'FRIDAY' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sexta-feira
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none shadow-sm"
            >
              <option value="ALL">Todas as Turmas (Neste dia)</option>
              {currentClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SELETOR DE MESES */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Selecione o Mês:</span>
          <div className="flex flex-wrap gap-2">
            {MONTHS.map(month => (
              <button
                key={month.id}
                onClick={() => setActiveMonth(month.id)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                  activeMonth === month.id
                    ? 'bg-indigo-600 text-white shadow-md border-indigo-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {month.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* LEGENDA DE CORES */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 bg-white/50 p-4 rounded-xl border border-slate-200">
        <span className="text-gray-700 flex items-center gap-2"><Info size={14}/> Segmentos:</span>
        {Object.values(SEGMENTS).map(seg => (
          <div key={seg.id} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full border ${seg.color.replace('text-', 'bg-').split(' ')[0]} ${seg.color.split(' ')[1]}`}></div>
            <span>{seg.name}</span>
          </div>
        ))}
        <div className="w-px h-4 bg-gray-300 mx-2"></div>
        <span className="text-gray-700 flex items-center gap-2"><Bell size={14}/> Alertas:</span>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div> <span>Passar Trabalho</span></div>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div> <span>Receber Trabalho</span></div>
      </div>

      {/* GRADE DO CALENDÁRIO */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-left table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="sticky left-0 bg-gray-50 z-20 border-r border-gray-200 p-4 w-[240px] min-w-[240px] max-w-[240px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="font-black uppercase tracking-tighter text-slate-800 flex items-center gap-2 text-lg">
                    <Users size={20} className="text-indigo-600"/> Turmas
                  </div>
                </th>
                
                {scheduleToRender.map((day, idx) => (
                  <th key={idx} className="p-4 border-r border-gray-200 w-[220px] min-w-[220px] max-w-[220px] align-top text-center bg-white">
                    <div className="font-black text-slate-900 text-xl tracking-tighter">{day.date}</div>
                    {day.subtitle && (
                      <div className="text-[10px] font-black uppercase tracking-widest text-white mt-1 bg-indigo-600 inline-block px-2 py-0.5 rounded shadow-sm">
                        {day.subtitle}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {classesToRender.map((classInfo) => (
                <tr key={classInfo.id} className="border-b border-gray-200 last:border-0 group">
                  <td className="sticky left-0 bg-white z-10 border-r border-gray-200 p-4 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-gray-50 transition-colors w-[240px] min-w-[240px] max-w-[240px]">
                    <div className="text-slate-900 font-black uppercase tracking-tighter text-lg leading-tight" title={classInfo.name}>{classInfo.name}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 truncate" title={classInfo.segment.name}>{classInfo.segment.name}</div>
                  </td>
                  
                  {scheduleToRender.map((day, idx) => {
                    if (day.type === 'event') {
                      return (
                        <td key={idx} className="p-2 border-r border-gray-200 bg-slate-50 w-[220px] min-w-[220px] max-w-[220px]">
                          <div className="w-full h-24 flex items-center justify-center p-3 rounded-xl bg-slate-200/50 text-slate-500 font-black uppercase tracking-widest text-[10px] text-center border-2 border-dashed border-slate-300">
                            {day.title}
                          </div>
                        </td>
                      );
                    }

                    const activity = (day.activities as any)[classInfo.id];
                    const isCompleted = activity ? completedClasses.includes(`${classInfo.id}-${day.date}`) : false;

                    return (
                      <td key={idx} className="p-2 border-r border-gray-200 align-top w-[220px] min-w-[220px] max-w-[220px]">
                        {activity ? (
                          <button
                            onClick={() => setModalData({
                              classId: classInfo.id,
                              date: day.date,
                              subtitle: day.subtitle,
                              className: classInfo.name,
                              segment: classInfo.segment,
                              activity: activity
                            })}
                            className={`relative w-full h-24 p-3 flex flex-col justify-center items-center text-center rounded-xl border-2 transition-all cursor-pointer shadow-sm
                              ${isCompleted ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 ring-offset-1' : `${classInfo.segment.color} ${classInfo.segment.hover}`} 
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 overflow-hidden group/card`}
                          >
                            {/* O Certificado Verde da aula concluída */}
                            {isCompleted && (
                              <div className="absolute top-1 right-1 flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm z-10">
                                <CheckCircle size={10} /> DADA
                              </div>
                            )}

                            {/* Alerta de Trabalho Escolar */}
                            {activity.assignment && !isCompleted && (
                              <div className={`absolute top-1 right-1 flex items-center gap-1 text-white text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded shadow-sm z-10
                                ${activity.assignment.type === 'passar' ? 'bg-orange-500 ring-2 ring-orange-200 shadow-orange-200' : 'bg-red-500 ring-2 ring-red-200 shadow-red-200'}`}>
                                {activity.assignment.type === 'passar' ? '📢 Passar' : '📥 Receber'}
                              </div>
                            )}

                            <span className={`line-clamp-3 text-xs font-black uppercase tracking-tight leading-tight w-full ${isCompleted ? 'text-emerald-900' : ''}`}>
                              {activity.title}
                            </span>
                            <div className="mt-1 text-[8px] font-bold opacity-0 group-hover/card:opacity-100 transition-opacity uppercase tracking-widest text-indigo-600 bg-white/50 px-2 py-0.5 rounded-full">
                               Clique p/ Detalhes
                            </div>
                          </button>
                        ) : (
                          <div className="w-full h-24 p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-gray-300 flex items-center justify-center text-center italic text-[10px] font-black uppercase tracking-widest">
                            Vazio
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JANELA MODAL PARA DETALHES DA AULA */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={() => setModalData(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200 border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className={`p-6 flex justify-between items-start border-b-2 ${modalData.segment.color.split(' ')[0]} border-white/20`}>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                  {modalData.className}
                  {completedClasses.includes(`${modalData.classId}-${modalData.date}`) && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md ml-2 border border-emerald-400">
                      <CheckCircle size={14} /> Aula Validada
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-white/80 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm border border-white">
                    Data: {modalData.date}
                  </span>
                  {modalData.subtitle && (
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                      {modalData.subtitle}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setModalData(null)}
                className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-all"
                aria-label="Fechar"
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Corpo do Modal */}
            <div className="p-8 overflow-y-auto max-h-[60vh] bg-slate-50/30">
              {/* Título Forte */}
              <h4 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4 border-b-2 border-slate-100 pb-4 tracking-tighter uppercase">
                 <BookOpen className="text-indigo-600" size={32} />
                 {modalData.activity.title}
              </h4>
              
              {/* Bloco de Avaliação (Se houver trabalho neste dia) */}
              {modalData.activity.assignment && (
                <div className={`mb-8 p-6 rounded-2xl border-2 shadow-xl ${modalData.activity.assignment.type === 'passar' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
                  <h5 className={`font-black text-xl flex items-center gap-3 tracking-tighter uppercase ${modalData.activity.assignment.type === 'passar' ? 'text-orange-900' : 'text-red-900'}`}>
                    {modalData.activity.assignment.type === 'passar' ? <Bell size={24} /> : <Download size={24} />}
                    {modalData.activity.assignment.type === 'passar' ? '📢 Passar Trabalho' : '📥 Receber Trabalho'}
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-2 border-white text-gray-800 ml-auto ring-2 ring-white/50">
                      {modalData.activity.assignment.points} pts
                    </span>
                  </h5>
                  
                  <div className="mt-4 text-gray-800">
                    <p className="font-black text-xl border-b-2 border-black/5 pb-3 mb-4 tracking-tight uppercase">{modalData.activity.assignment.title}</p>
                    
                    {modalData.activity.assignment.text && (
                      <p className="text-base text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl shadow-inner border border-white">
                        {modalData.activity.assignment.text}
                      </p>
                    )}
                    
                    {modalData.activity.assignment.deadline && (
                      <div className="mt-6 flex items-center gap-2">
                         <div className="h-px flex-grow bg-slate-200"></div>
                         <p className="text-[10px] font-black text-red-600 bg-red-100 uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-red-200">
                           🗓️ Entrega prevista: {modalData.activity.assignment.deadline}
                         </p>
                         <div className="h-px flex-grow bg-slate-200"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Descrição Longa e Explicativa */}
              {modalData.activity.description && modalData.activity.description !== DEFAULT_DESC && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-700 font-black text-[10px] uppercase tracking-[0.2em]">
                    <ClipboardList size={18} />
                    Roteiro e Procedimentos:
                  </div>
                  <div className="text-slate-700 text-base leading-relaxed bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm whitespace-pre-line font-medium">
                    {modalData.activity.description}
                  </div>
                </div>
              )}
            </div>
            
            {/* Rodapé do Modal */}
            <div className="p-6 bg-slate-50 border-t-2 border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              <button 
                onClick={() => toggleCompletion(modalData.classId, modalData.date)}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-xs rounded-xl transition-all ${
                  completedClasses.includes(`${modalData.classId}-${modalData.date}`)
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 shadow-sm'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-200/50 transform hover:-translate-y-1 active:scale-95'
                }`}
              >
                <CheckCircle size={20} />
                {completedClasses.includes(`${modalData.classId}-${modalData.date}`) ? 'Validado (Desfazer)' : 'Validar Aula Dada'}
              </button>

              <button 
                onClick={() => setModalData(null)}
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-800 transition-all shadow-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
