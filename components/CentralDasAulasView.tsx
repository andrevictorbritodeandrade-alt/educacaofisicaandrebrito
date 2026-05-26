import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, X } from 'lucide-react';
import { ViewState } from '../types';

// ===================== BASE DE DADOS DAS AULAS (SLIDES) =====================

const aulasFundamental2Trimestre = [
  {
    id: 'f2-1',
    titulo: 'Capoeira: Luta, Dança e Resistência',
    subtitulo: 'Patrimônio Cultural Afro-brasileiro',
    imagem: 'https://images.unsplash.com/photo-1578262825743-a4e402caab5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Cultura Afro-brasileira',
    conteudo: `A capoeira não é apenas um esporte; é uma tecnologia de sobrevivência e resistência criada pelos africanos escravizados no Brasil. Para o povo negro, cujo corpo era tratado como mercadoria e instrumento de trabalho forçado (alienação do corpo), a capoeira foi a forma de retomar a posse sobre si mesmo.

Fundamentos técnicos e filosóficos:
🔸 Ginga: É o movimento base. Não é apenas "balançar", mas manter-se em constante adaptação. Filosoficamente, ensina que quem está na base da pirâmide social não pode ser um alvo fixo.
🔸 Esquiva: A arte de não confrontar a força bruta com força bruta, mas usar a força do oponente contra ele mesmo. O corpo se afasta do golpe, protegendo a integridade.
🔸 Golpes (Meia-lua, Armada, Queixada): Movimentos circulares e de surpresa, que exigem precisão, força de alavanca e leitura de espaço.
🔸 A Roda: Um microcosmo da sociedade. No centro, o conflito. Em volta, a comunidade (coro) que protege, dita o ritmo (berimbau) e valida os saberes (mestre e contramestre).`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'O Código Penal de 1890 previa prisão de 2 a 6 meses para quem praticasse capoeira nas ruas. Isso é um exemplo clássico de racismo institucional.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'Em 2014, a Roda de Capoeira foi reconhecida pela UNESCO como Patrimônio Cultural Imaterial da Humanidade.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Formamos uma roda. Compreendemos a hierarquia do som: o Berimbau manda, o atabaque marca, o pandeiro floreia.' }
    ]
  },
  {
    id: 'f2-2',
    titulo: 'Huka-Huka: A Luta dos Povos Originários',
    subtitulo: 'Tradição do Alto Xingu',
    imagem: 'https://images.unsplash.com/photo-1623945366124-5f5f0e4c2e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Povos Originários',
    conteudo: `O Huka-Huka é uma prática corporal sistematizada dos povos indígenas do Alto Xingu. Ao contrário dos esportes ocidentais hiper-competitivos, o Huka-Huka é guiado por uma ética comunitária de respeito mútuo.`,
    boxes: [
      { tipo: 'geografia', titulo: 'Conexão Geográfica', texto: 'O Parque Indígena do Xingu foi criado em 1961 para proteger esses povos.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Por que o currículo escolar tradicional ignora as lutas desenvolvidas no nosso próprio continente?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'No tatame, ajoelhados frente a frente. O objetivo é alcançar e imobilizar o joelho do colega.' }
    ]
  },
  {
    id: 'f2-3',
    titulo: 'Luta Marajoara: Força dos Rios',
    subtitulo: 'Patrimônio do Pará',
    imagem: 'https://images.unsplash.com/photo-1574680096145-d25b74b82b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Natureza e Luta',
    conteudo: `Nascida na Ilha de Marajó, no arquipélago fluviomarítimo do Pará, a Luta Marajoara é a expressão máxima da identidade do povo ribeirinho e caboclo.`,
    boxes: [
      { tipo: 'geografia', titulo: 'Conexão Geográfica', texto: 'A Ilha de Marajó tem planícies inundáveis. O vaqueiro marajoara caminha na lama densa.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'Grandes campeões brasileiros de MMA e atletas de Jiu-Jitsu incorporaram técnicas de projeção da Luta Marajoara em seus arsenais globais.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Em duplas, de pé, usando cordas como "faixas" na cintura. Praticamos o desequilíbrio do eixo central.' }
    ]
  },
  {
    id: 'f2-4',
    titulo: 'Jogos Cooperativos: Ganhar Juntos',
    subtitulo: 'Lençolbol, Nó Humano, A Ilha',
    imagem: 'https://images.unsplash.com/photo-1607743386760-88ac62b5482a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Trabalho de Equipa',
    conteudo: `A sociedade capitalista moderna hipervaloriza a competição: o lucro de um muitas vezes significa a falência de outro. No esporte tradicional, essa lógica se repete. Os Jogos Cooperativos surgem como uma crítica pedagógica a essa estrutura.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'A exclusão esportiva nas aulas de Educação Física ocorre quando supervalorizamos os alunos mais habilidosos e eliminamos os "menos aptos".' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Como o individualismo estimulado pelos jogos de eliminação afeta a forma como enxergamos a sociedade?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Vivenciamos os três jogos. No "Lençolbol", tentamos bater o recorde da turma de quantos lançamentos seguidos conseguimos fazer.' }
    ]
  },
  {
    id: 'f2-5',
    titulo: 'Jogos de Tabuleiro Africanos',
    subtitulo: 'Shisima (Quênia) e Mancala',
    imagem: 'https://images.unsplash.com/photo-1610890690848-51430b09767f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Estratégia Ancestral',
    conteudo: `Existe um mito colonial de que o pensamento estratégico, a matemática avançada e a filosofia nasceram apenas na Europa e na Ásia. Os jogos de tabuleiro africanos são a prova viva da "Etnomatemática".`,
    boxes: [
      { tipo: 'historia', titulo: 'Contexto Histórico', texto: 'Jogos como a Mancala são baseados no ciclo agrário, no comércio e no acúmulo de bens alimentícios. Refletem visões de mundo distintas.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'Existem mais de 200 variações catalogadas de Mancala na África.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Na lógica da sustentabilidade, construímos nossos tabuleiros usando caixas de ovos, tampinhas de garrafa e grãos de feijão.' }
    ]
  },
  {
    id: 'f2-6',
    titulo: 'Atletismo com Materiais Adaptados',
    subtitulo: 'Superação e Medição',
    imagem: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Foco e Superação',
    conteudo: `O atletismo é a base de todas as habilidades motoras humanas. Contudo, na sociedade atual, o atletismo se tornou elitizado devido à necessidade de pistas emborrachadas e equipamentos caros.`,
    boxes: [
      { tipo: 'geografia', titulo: 'Conexão Geográfica', texto: 'Por que bairros periféricos raramente possuem pistas de atletismo públicas, enquanto bairros de elite possuem complexos esportivos?' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'O atletismo tradicional mede o humano contra o cronômetro. Na nossa aula, a verdadeira vitória não é vencer o colega, mas bater a sua própria marca.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Montamos um circuito com 4 estações. Cada aluno recebe uma ficha de registro.' }
    ]
  },
  {
    id: 'f2-7',
    titulo: 'Altinha & Futevôlei',
    subtitulo: 'Da Roda para a Rede: Uma jornada pelas areias',
    imagem: 'https://images.unsplash.com/photo-1598467440478-f027376a43b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Esportes de Areia',
    pdf: '/pdf/altinha_futevolei.pdf',
    conteudo: `Apresentação sobre Altinha e Futevôlei`,
    boxes: [
      { tipo: 'sabia', titulo: 'Fundamentos Altinha', texto: 'Chapa (passe seguro), Peito e Cabeça (recepção), Acrobacias (salvar bolas difíceis).' },
      { tipo: 'reflexao', titulo: 'O Desafio do Futevôlei', texto: 'Puramente competitivo (duplas). Exige os mesmos fundamentos da Altinha, mas com rede e regras de pontuação.' },
      { tipo: 'atividade', titulo: 'Por que começar pela Altinha?', texto: 'Desenvolve intimidade com a bola, leitura de trajetória, prepara as articulações e é inclusivo.' }
    ]
  }
];

const aulasFundamental3Trimestre = [
  {
    id: 'f3-1',
    titulo: 'Jongo: A Dança dos Ancestrais',
    subtitulo: 'Avó do Samba, Filha dos Terreiros',
    imagem: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Dança Ancestral',
    conteudo: `O Jongo (ou Caxambu) é uma expressão cultural de matriz banto. À noite, após jornadas desumanas de trabalho forçado, as comunidades se reuniam nos terreiros.`,
    boxes: [
      { tipo: 'historia', titulo: 'Contexto Histórico', texto: 'Os senhores de escravos permitiam o Jongo achando que era "apenas folclore inofensivo".' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'O Jongo é considerado uma das matrizes fundamentais para a criação do Samba Carioca.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Formamos a roda. Aprendemos o toque base das palmas.' }
    ]
  },
  {
    id: 'f3-2',
    titulo: 'Maculelê: A Dança das Varas',
    subtitulo: 'Guerreiros, Canto e Ritmo',
    imagem: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Força e Ritmo',
    conteudo: `O Maculelê é uma manifestação cultural com profunda energia guerreira, originada na cidade de Santo Amaro, no Recôncavo Baiano.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'A figura do guerreiro empunhando facões e varas remete à Revolta dos Malês.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'A linha que separa Luta, Dança e Jogo nas culturas afro-brasileiras é tênue e borrada de propósito.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Usamos jornais enrolados fortemente com fita adesiva (para simular as grimas com segurança).' }
    ]
  },
  {
    id: 'f3-3',
    titulo: 'Danças Urbanas e Periféricas',
    subtitulo: 'Funk, Passinho e Hip Hop',
    imagem: 'https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Resistência Urbana',
    conteudo: `A cultura corporal das periferias globais e brasileiras, expressa através de movimentos como o Hip Hop (Breakdance) e o Funk Carioca (e suas vertentes, como o Passinho), é a voz de uma juventude sistemicamente silenciada.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'A lei já proibiu a capoeira, tentou proibir o samba, e hoje criminaliza os bailes funk através da violência policial.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'Em 2018, a "Batalha do Passinho" foi declarada Patrimônio Cultural Imaterial do Estado do Rio de Janeiro.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Organizamos uma "Cypher" (roda de dança urbana).' }
    ]
  },
  {
    id: 'f3-4',
    titulo: 'Brincadeiras de Rua e Construção de Brinquedos',
    subtitulo: 'Memória e Sustentabilidade',
    imagem: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'A Rua é o Ecrã',
    conteudo: `As brincadeiras de rua tradicionais são repositórios da memória cultural coletiva e ferramentas fundamentais para o desenvolvimento motor, cognitivo e social.`,
    boxes: [
      { tipo: 'geografia', titulo: 'Conexão Geográfica', texto: 'O urbanismo centrado no carro e na propriedade privada exterminou o "brincar lá fora" nas grandes cidades.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Quanto de criatividade nós perdemos ao focar apenas no celular?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Oficina de criatividade. Cada aluno traz materiais recicláveis de casa.' }
    ]
  },
  {
    id: 'f3-5',
    titulo: 'Consciência Corporal e Respiração',
    subtitulo: 'Cuidando da Mente pelo Corpo',
    imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Autoconhecimento',
    conteudo: `Nesta aula, a Educação Física atua no resgate da posse do próprio corpo. A respiração consciente não é misticismo; é neurofisiologia pura para acalmar o sistema nervoso simpático e ativar o parassimpático.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'A sociedade do cansaço nos exige produtividade 24 horas por dia.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Você consegue identificar onde o seu corpo guarda o nervosismo?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Deitados, em posição de decúbito dorsal (barriga para cima), realizamos o escaneamento corporal guiado pelo professor.' }
    ]
  }
];

const aulasMedio2Trimestre = [
  {
    id: 'm2-1',
    titulo: 'Esporte, Mídia e Racismo',
    subtitulo: 'Análise Crítica do Esporte-Espetáculo',
    imagem: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Olhar Crítico',
    conteudo: `O esporte de alto rendimento hoje é o "Esporte-Espetáculo": um produto embalado para venda pela mídia e grandes corporações. `,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'Casos como os ataques racistas contra Vini Jr. na Europa não são atos isolados de "torcedores malucos".' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Quando um atleta negro se posiciona politicamente sobre injustiças, a mídia e os torcedores dizem: "Foque apenas em jogar e cale a boca".' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Estudo de caso e Seminário. Dividimos a sala em grupos.' }
    ]
  },
  {
    id: 'm2-debate-corpo',
    titulo: 'Debate: Corpo e Mídia',
    subtitulo: 'Desconstruindo estereótipos com Frantz Fanon e Cida Bento',
    imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Educação Física - Prof. André Brito',
    conteudo: `Slide 1: Debate: Corpo e Mídia - Desconstruindo estereótipos com Frantz Fanon e Cida Bento.
    
    Slide 2: O Ponto de Partida - Uma reflexão sociológica sobre como a televisão e a internet afetam, representam e limitam as narrativas sobre corpos negros e periféricos.

    Slide 3: Nossos Guias Teóricos:
    - Frantz Fanon: Psiquiatra e filósofo. Em "Pele Negra, Máscaras Brancas", ele explica como o corpo negro é objetificado pelo olhar racista. A mídia, muitas vezes, reproduz esse olhar, causando um impacto psicológico de alienação.
    - Cida Bento: Psicóloga e pesquisadora brasileira. Em "O Pacto da Branquitude", expõe como grupos dominantes protegem seus privilégios e espaços (como a mídia), determinando quem é protagonista e quem é estereotipado.

    Slide 4: A Mídia como "Espelho" - A mídia não é neutra; ela não apenas reflete a sociedade, mas constrói realidades e valores ativamente. Historicamente, a televisão e a internet reservam aos corpos negros e periféricos narrativas limitadas, negando-lhes a complexidade, a intelectualidade e a humanidade plena que lhes é de direito. Isso gera uma "história única" que precisamos aprender a identificar e questionar.

    Slide 5: Como o Estereótipo Atua?
    - Hipersexualização: Redução do indivíduo puramente aos seus atributos físicos. O corpo é transformado em um objeto de desejo ou entretenimento, esvaziando sua capacidade intelectual.
    - Marginalização: A frequente associação de pessoas periféricas e negras a papéis de violência, criminalidade ou perigo, alimentando o medo e o preconceito social.
    - Subserviência: A limitação a papéis de serviço e subordinação. O "pacto da branquitude" garante que os papéis de liderança, sucesso e chefia fiquem restritos ao padrão branco.

    Slide 6: Frantz Fanon: "Eu sou dado a mim mesmo pelo outro. O olhar do outro me fixa, assim como um corante fixa uma preparação química."

    Slide 7: Contrapondo com a Realidade:
    - Pluralidade e Potência: A periferia é o maior polo de inovação, arte, cultura e intelectualidade do país. Não somos apenas carência.
    - Consumo Crítico: O primeiro passo para romper o ciclo é não consumir passivamente. É preciso questionar: "Quem está contando essa história?"
    - Novas Narrativas: Apoiar criadores de conteúdo independentes e exigir representatividade real nos espaços de poder midiático.

    Slide 8: Roda de Conversa: "A palavra agora é de vocês." Como vocês percebem a hipersexualização e os estereótipos no seu feed do Instagram, TikTok ou nas novelas hoje?`,
    boxes: [
      { tipo: 'critica', titulo: 'O papel da mídia', texto: 'A mídia constrói realidades ativamente. Precisamos identificar a "história única".' },
      { tipo: 'sabia', titulo: 'Contexto teórico', texto: 'Fanon e Cida Bento nos dão as ferramentas para analisar o racismo na mídia.' },
      { tipo: 'reflexao', titulo: 'Roda de conversa', texto: 'Como você enxerga esses estereótipos no seu dia a dia?' }
    ]
  },
  {
    id: 'm2-2',
    titulo: 'Primeiros Socorros: Saber que Salva',
    subtitulo: 'SAMU, Engasgo e Desmaio',
    imagem: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Segurança em Ação',
    conteudo: `A formação cidadã exige o preparo para preservar a própria vida e a vida do próximo. No Brasil, o SUS (Sistema Único de Saúde) garante o atendimento de urgência e emergência através do SAMU (192), uma conquista democrática.`,
    boxes: [
      { tipo: 'geografia', titulo: 'Conexão Geográfica', texto: 'Em muitas favelas, becos, vielas e morros do Rio de Janeiro, a ambulância do SAMU simplesmente não consegue acessar por falta de asfalto ou devido às barricadas.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'No Brasil existe o artigo 135 do Código Penal que criminaliza a Omissão de Socorro.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Simulação realista ("Roleplay"). Criamos cenários de emergência surpresa.' }
    ]
  },
  {
    id: 'm2-3',
    titulo: 'Saúde do Trabalhador e LER/DORT',
    subtitulo: 'Ginástica Laboral e Postura',
    imagem: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Corpo no Trabalho',
    conteudo: `O sistema produtivo muitas vezes transforma o corpo humano em uma mera máquina, uma ferramenta de lucro alienada.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'Quando um trabalhador adoece por DORT e perde a capacidade produtiva, muitas vezes a empresa tenta se isentar e o Estado o empurra para as filas do INSS.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Com a plataformização do trabalho (motoristas e entregadores de app), onde não há "chefe" direto ou empresa formalizando vínculo, quem se responsabiliza pela postura?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Aprendizado de Pausa Ativa. Mapeamos os músculos mais usados quando se digita em um celular ou se carrega caixas pesadas.' }
    ]
  },
  {
    id: 'm2-4',
    titulo: 'Lutas Brasileiras: Resistência e Identidade',
    subtitulo: 'Huka-Huka, Marajoara e Capoeira no Ensino Médio',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Ancestralidade de Combate',
    conteudo: `As lutas e artes marciais não são neutras; elas carregam os códigos éticos, a visão de mundo e a cosmologia das sociedades que as criaram.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'Por que academias modernas cobram mensalidades altíssimas para ensinar Muay Thai ou Krav Maga, mas lutas originárias brasileiras são frequentemente vistas com preconceito?' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'A prática do MMA, controlada por corporações do entretenimento (UFC), transformou a luta numa rinha de humanos vendida em pay-per-view.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Laboratório comparativo. Criamos três "ilhas" (tatames).' }
    ]
  }
];

const aulasMedio3Trimestre = [
  {
    id: 'm3-1',
    titulo: 'Dança dos Orixás e Ijexá',
    subtitulo: 'Cultura Afro-brasileira e Sagrado',
    imagem: 'https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Matrizes Africanas',
    conteudo: `As Epistemologias do Sul nos mostram que não existe divisão entre o corpo, a mente e o espírito nas culturas de matriz africana (Candomblé e Umbanda).`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'A demonização histórica das religiões de matriz africana no Brasil é puro racismo religioso estrutural.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'Na cosmologia africana não há divisão entre "corpo que dança" e "corpo que reza".' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Vivência rítmica e corporal. Com o áudio de um toque Ijexá, treinamos a dissociação motora.' }
    ]
  },
  {
    id: 'm3-2',
    titulo: 'Projeto de Vida Ativa e Mapa Afetivo',
    subtitulo: 'Planejamento, Território e Autonomia',
    imagem: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Território em Movimento',
    conteudo: `A Educação Física no Ensino Médio tem um objetivo fundamental: a emancipação. O aluno precisa sair da escola capaz de ser "o próprio professor" e dono do seu corpo, gerindo sua saúde física ao longo da vida adulta sem precisar de dependência financeira de academias caras.`,
    boxes: [
      { tipo: 'geografia', titulo: 'Conexão Geográfica', texto: 'Muitos prefeitos constroem equipamentos de lazer modernos nos centros e em áreas turísticas, enquanto a periferia carece de calçadas niveladas, iluminação noturna e segurança.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Se a saúde pública gasta fortunas com internações por hipertensão e diabetes (doenças que o exercício previne), por que o acesso democrático ao esporte não é levado tão a sério pelos governantes?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Cada aluno entrega um plano estruturado de 30 dias para si mesmo.' }
    ]
  },
  {
    id: 'm3-3',
    titulo: 'Anemia Falciforme e a População Negra',
    subtitulo: 'Genética, Racismo e Direito à Saúde',
    imagem: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Saúde e Ciência',
    conteudo: `Discutir o corpo humano na escola exige discutir biologia profunda e racismo na saúde. A Anemia Falciforme é a doença genética hereditária mais prevalente no Brasil, atingindo majoritariamente a população negra.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'O racismo científico no Brasil no século XIX/XX via o corpo negro como inferior e doente, invisibilizando males específicos como a Falciforme.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Temos algum colega na escola ou conhecido portador de Anemia Falciforme?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Roda de leitura de textos científicos e testemunhos reais de pacientes com a doença.' }
    ]
  },
  {
    id: 'm3-4',
    titulo: 'Luiz Gama e o Futebol de Várzea',
    subtitulo: 'Abolicionista, Poeta e Patrono do Povo',
    imagem: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'A Várzea é do Povo',
    conteudo: `Luiz Gama (1830-1882) é uma das maiores figuras intelectuais e de ação política da história brasileira. Em 2018, em São Paulo, o campo de futebol de várzea tomou Luiz Gama como patrono.`,
    boxes: [
      { tipo: 'historia', titulo: 'Contexto Histórico', texto: 'Quando Luiz Gama ia aos tribunais resgatar negros, ele subvertia a regra do jogo usando a própria lei dos brancos contra eles.' },
      { tipo: 'sabia', titulo: 'Sabia que?', texto: 'Luiz Gama também foi um notável poeta e um dos maiores jornalistas satíricos do Império.' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Projeto "Historiadores do Bairro". Os alunos têm como tarefa investigar onde ficava o campo de várzea original do seu próprio bairro.' }
    ]
  },
  {
    id: 'm3-5',
    titulo: 'Sarau Afro: Culminância e Memória',
    subtitulo: 'Celebrando Nossa Ancestralidade',
    imagem: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    creditos: 'Festa e Memória',
    conteudo: `Na pedagogia libertadora, a sala de aula ou a quadra esportiva não deve terminar num exame ou numa "prova escrita" punitiva e decorada. Ela deve terminar numa festa da partilha do saber.`,
    boxes: [
      { tipo: 'critica', titulo: 'Crítica Social', texto: 'A escola ocidental ensina o aluno a individualidade extrema: sentar em fileira, um olhando para a nuca do outro. O Sarau reverte isso.' },
      { tipo: 'reflexao', titulo: 'Para pensar', texto: 'Qual foi a marca profunda que a Educação Física deixou no seu corpo intelectual neste ano?' },
      { tipo: 'atividade', titulo: 'Na prática', texto: 'Construção coletiva de evento. Dividimos comissões: Comissão de palco, Comissão musical, Comissão de decoração e Comissão da comensalidade.' }
    ]
  }
];

function IlustracaoAula({ id, className }: { id: string, className?: string }) {
  const configs: Record<string, { gradient: string; icon: string; pattern: string }> = {
    'f2-1': { gradient: 'from-orange-500 to-amber-700', icon: '🪘', pattern: 'circle' },
    'f2-2': { gradient: 'from-emerald-700 to-green-900', icon: '🌿', pattern: 'dots' },
    'f2-3': { gradient: 'from-cyan-600 to-blue-800', icon: '🌊', pattern: 'wave' },
    'f2-4': { gradient: 'from-purple-500 to-indigo-700', icon: '🤝', pattern: 'grid' },
    'f2-5': { gradient: 'from-yellow-500 to-amber-800', icon: '🎲', pattern: 'circle' },
    'f2-6': { gradient: 'from-blue-500 to-teal-600', icon: '👟', pattern: 'lines' },
    'f3-1': { gradient: 'from-rose-600 to-pink-900', icon: '🔥', pattern: 'wave' },
    'f3-2': { gradient: 'from-orange-600 to-red-800', icon: '⚔️', pattern: 'lines' },
    'f3-3': { gradient: 'from-violet-600 to-fuchsia-900', icon: '📻', pattern: 'dots' },
    'f3-4': { gradient: 'from-sky-400 to-blue-600', icon: '🪁', pattern: 'grid' },
    'f3-5': { gradient: 'from-teal-500 to-emerald-700', icon: '🧘🏾', pattern: 'wave' },
    'm2-1': { gradient: 'from-slate-800 to-black', icon: '✊🏿', pattern: 'dots' },
    'm2-2': { gradient: 'from-red-500 to-rose-700', icon: '❤️‍🩹', pattern: 'cross' },
    'm2-3': { gradient: 'from-blue-600 to-indigo-800', icon: '🪑', pattern: 'grid' },
    'm2-4': { gradient: 'from-green-600 to-yellow-600', icon: '🇧🇷', pattern: 'wave' },
    'm3-1': { gradient: 'from-yellow-400 to-amber-600', icon: '✨', pattern: 'circle' },
    'm3-2': { gradient: 'from-emerald-500 to-teal-700', icon: '🗺️', pattern: 'grid' },
    'm3-3': { gradient: 'from-red-600 to-red-900', icon: '🩸', pattern: 'dots' },
    'm3-4': { gradient: 'from-stone-600 to-stone-800', icon: '⚽', pattern: 'lines' },
    'm3-5': { gradient: 'from-purple-600 to-violet-900', icon: '🎭', pattern: 'wave' },
  };

  const conf = configs[id] || { gradient: 'from-gray-500 to-gray-700', icon: '📚', pattern: 'dots' };

  return (
    <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${conf.gradient} flex items-center justify-center overflow-hidden ${className || ''}`}>
      {/* Fallback pattern simplified for performance and code size */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`pattern-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pattern-${id})`} />
        </svg>
      </div>
      <div className="relative z-10 text-6xl md:text-8xl drop-shadow-2xl select-none opacity-80">
        {conf.icon}
      </div>
    </div>
  );
}

function ImagemComFallback({ src, alt, id }: { src: string, alt: string, id: string }) {
  const [comErro, setComErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  if (comErro) {
    return <IlustracaoAula id={id} />;
  }

  return (
    <div className="relative w-full h-full bg-gray-200">
      {carregando && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500 text-sm font-medium animate-pulse">A carregar imagem...</span>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${carregando ? 'opacity-0' : 'opacity-100'}`} 
        onLoad={() => setCarregando(false)}
        onError={() => {
          setComErro(true);
          setCarregando(false);
        }}
      />
    </div>
  );
}

import { PdfViewer } from './PdfViewer';

// ... (inside the Slide component, add this mapping for PDF)
// ...

function Slide({ aula, onClose }: { aula: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden rounded-t-2xl group">
          <ImagemComFallback src={aula.imagem} alt={aula.titulo} id={aula.id} />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{aula.titulo}</h1>
            <p className="text-xl text-indigo-200">{aula.subtitulo}</p>
          </div>
          <span className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded shadow z-20">{aula.creditos}</span>
        </div>

        <div className="p-6 md:p-8">
          {aula.pdf ? (
            <PdfViewer file={aula.pdf} />
          ) : (
            <div className="prose max-w-none text-gray-800 text-lg leading-relaxed whitespace-pre-line mb-8">
              {aula.conteudo}
            </div>
          )}
          
          {!aula.pdf && (
            <div className="space-y-4">
              {aula.boxes.map((box: any, idx: number) => {
                let bgColor = 'bg-blue-50 border-blue-400 text-blue-900';
                let icon = '💡';
                
                if (box.tipo === 'reflexao') { bgColor = 'bg-amber-50 border-amber-400 text-amber-900'; icon = '🤔'; }
                if (box.tipo === 'sabia') { bgColor = 'bg-purple-50 border-purple-400 text-purple-900'; icon = '🌟'; }
                if (box.tipo === 'atividade') { bgColor = 'bg-green-50 border-green-400 text-green-900'; icon = '🏃'; }
                if (box.tipo === 'critica') { bgColor = 'bg-red-50 border-red-400 text-red-900'; icon = '✊🏿'; }
                if (box.tipo === 'historia') { bgColor = 'bg-stone-50 border-stone-400 text-stone-900'; icon = '📜'; }
                if (box.tipo === 'geografia') { bgColor = 'bg-emerald-50 border-emerald-400 text-emerald-900'; icon = '🗺️'; }

                return (
                  <div key={idx} className={`p-5 rounded-xl border-l-4 ${bgColor}`}>
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">{icon} {box.titulo}</h3>
                    <p className="leading-relaxed font-medium">{box.texto}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

interface CentralDasAulasViewProps {
  onBack: (view?: ViewState) => void;
}

export const CentralDasAulasView: React.FC<CentralDasAulasViewProps> = ({ onBack }) => {
  const [segmento, setSegmento] = useState('fundamental');
  const [trimestre, setTrimestre] = useState('trimestre2');
  const [aulaAtiva, setAulaAtiva] = useState<any>(null);

  const getAulas = () => {
    if (segmento === 'fundamental') {
      return trimestre === 'trimestre2' ? aulasFundamental2Trimestre : aulasFundamental3Trimestre;
    } else {
      return trimestre === 'trimestre2' ? aulasMedio2Trimestre : aulasMedio3Trimestre;
    }
  };

  const aulas = getAulas();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-[#002b36] border-b border-indigo-900 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onBack('home')}
            className="p-2 hover:bg-indigo-900 rounded-full transition-colors text-white"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tighter flex items-center gap-2">
              <span className="text-2xl">📚</span> Central de Aulas
            </h1>
            <p className="text-sm text-indigo-300 font-bold uppercase tracking-widest hidden sm:block">
              Educação Física • Prof. André Brito
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={segmento} 
            onChange={e => setSegmento(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="fundamental">Ensino Fundamental</option>
            <option value="medio">Ensino Médio e EJA</option>
          </select>
          <select 
            value={trimestre} 
            onChange={e => setTrimestre(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="trimestre2">2º Trimestre</option>
            <option value="trimestre3">3º Trimestre</option>
          </select>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aulas.map((aula, i) => (
            <button
              key={aula.id}
              onClick={() => setAulaAtiva(aula)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden text-left transition-all duration-300 flex flex-col relative transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationFillMode: 'both', animationDelay: `${i * 50}ms` }}
            >
              <div className="h-48 w-full overflow-hidden bg-gray-200 shrink-0 relative">
                <ImagemComFallback src={aula.imagem} alt={aula.titulo} id={aula.id} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium text-sm flex items-center gap-1">
                    <BookOpen size={16} /> Abrir Aula
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 relative z-10 bg-white group-hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-indigo-700">{aula.titulo}</h3>
                <p className="text-sm text-indigo-600 font-medium line-clamp-1">{aula.subtitulo}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {aulaAtiva && <Slide aula={aulaAtiva} onClose={() => setAulaAtiva(null)} />}
    </div>
  );
};
