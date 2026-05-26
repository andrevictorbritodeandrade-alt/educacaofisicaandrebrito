import React, { useState } from 'react';
import { Calendar, Info, X, Filter, Users, BookOpen, ClipboardList, CheckCircle } from 'lucide-react';

// ============================================================================
// 1. DADOS DE CONFIGURAÇÃO E CORES
// ============================================================================

const SEGMENTS = {
  FUNDAMENTAL: { id: 'fundamental', name: 'Ensino Fundamental (6º e 8º)', color: 'bg-yellow-100 border-yellow-300 text-yellow-900', hover: 'hover:bg-yellow-200' },
  ACELERACAO: { id: 'aceleracao', name: 'Aceleração (AP)', color: 'bg-green-100 border-green-300 text-green-900', hover: 'hover:bg-green-200' },
  MEDIO: { id: 'medio', name: 'Ensino Médio', color: 'bg-yellow-100 border-yellow-300 text-yellow-900', hover: 'hover:bg-yellow-200' },
  EJA: { id: 'eja', name: 'EJA', color: 'bg-blue-100 border-blue-300 text-blue-900', hover: 'hover:bg-blue-200' },
};

const CLASSES = {
  MONDAY: [
    { id: '802', name: 'Turma 802 (EE Cordelia Paiva)', segment: SEGMENTS.FUNDAMENTAL },
    { id: '803', name: 'Turma 803 (EE Cordelia Paiva)', segment: SEGMENTS.FUNDAMENTAL },
    { id: '801', name: 'Turma 801 (EE Cordelia Paiva)', segment: SEGMENTS.FUNDAMENTAL },
    { id: 'AP198', name: 'AP 101 (CIEP 198)', segment: SEGMENTS.ACELERACAO },
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
  description: 'Objetivos: Quebrar o gelo, estabelecer domínio de turma e incluir todos.\n\nRegras de ouro do Professor:\n1. Times com números iguais (mistos, independente de gênero).\n2. Obrigatoriedade: TODOS precisam jogar ou lançar a bola pelo menos 1 vez.\n3. Eliminatória: Quem for queimado sai e não volta (sem regra de "coveiro" ou "cruzar").\n4. Tempo limite: 5 minutos regressivos contados no relógio.\n5. Vitória: O time que tiver MAIS pessoas em pé na quadra ao fim dos 5 minutos vence.\n\nApós o jogo: Tempo liberado para a atividade que eles quiserem (ex: futebol, vôlei livre).' 
};

// ============================================================================
// 2. BANCO DE DADOS DAS AULAS COM DESCRIÇÕES DETALHADAS
// ============================================================================

const SCHEDULE_MONDAY = [
  { date: '11/05', type: 'class', activities: { 
    '802': QUEIMADO_INICIAL, 
    '803': QUEIMADO_INICIAL, 
    '801': QUEIMADO_INICIAL, 
    'AP198': QUEIMADO_INICIAL, 
  }},
  { date: '18/05', type: 'class', activities: { 
    '802': { title: 'Jogo Gato e Rato', description: 'Baixo esforço do professor.\n\nAlunos formam um círculo de mãos dadas. Um é o gato (fora) e outro o rato (dentro). O professor apenas apita os inícios e tempos de troca.' }, 
    '803': { title: 'Jogo Gato e Rato', description: 'Baixo esforço do professor.\n\nAlunos formam um círculo de mãos dadas. Um é o gato (fora) e outro o rato (dentro). O professor apenas apita os inícios e tempos de troca.' }, 
    '801': { title: 'Jogo Gato e Rato', description: 'Baixo esforço do professor.\n\nAlunos formam um círculo de mãos dadas. Um é o gato (fora) e outro o rato (dentro). O professor apenas apita os inícios e tempos de troca.' }, 
    'AP198': { title: 'Jogo da Velha Humano', description: DEFAULT_DESC }, 
  }},
  { date: '25/05', type: 'class', activities: { 
    '802': { title: 'Capoeira (História e Ginga)', description: 'Professor centraliza a turma sentada (poupa energia física), conta a história da capoeira (luta de resistência negra). Em seguida, ensina o passo básico da ginga. Sem contato físico.' }, 
    '803': { title: 'Capoeira (História e Ginga)', description: 'Professor centraliza a turma sentada (poupa energia física), conta a história da capoeira (luta de resistência negra). Em seguida, ensina o passo básico da ginga. Sem contato físico.' }, 
    '801': { title: 'Capoeira (História e Ginga)', description: 'Professor centraliza a turma sentada (poupa energia física), conta a história da capoeira (luta de resistência negra). Em seguida, ensina o passo básico da ginga. Sem contato físico.' }, 
    'AP198': { title: 'Capoeira "Pega-Pé"', description: DEFAULT_DESC }, 
  }},
  { date: '08/06', type: 'class', activities: { 
    '802': { title: 'Capoeira (Roda e Palmas)', description: 'Turma em roda batendo palmas no ritmo. Alunos entram em duplas apenas para fazer a ginga, sem golpes. Professor apenas comanda a roda.' }, 
    '803': { title: 'Capoeira (Roda e Palmas)', description: 'Turma em roda batendo palmas no ritmo. Alunos entram em duplas apenas para fazer a ginga, sem golpes. Professor apenas comanda a roda.' }, 
    '801': { title: 'Capoeira (Roda e Palmas)', description: 'Turma em roda batendo palmas no ritmo. Alunos entram em duplas apenas para fazer a ginga, sem golpes. Professor apenas comanda a roda.' }, 
    'AP198': { title: 'Capoeira Angola', description: DEFAULT_DESC }, 
  }},
  { date: '15/06', type: 'class', activities: { 
    '802': { title: 'Brincadeira "Terra e Mar"', description: 'Fácil comando de voz. Uma linha no chão: um lado é Terra, o outro é Mar. Professor grita os comandos. Quem erra sai. Ótimo para atenção e requer zero esforço físico do professor.' }, 
    '803': { title: 'Brincadeira "Terra e Mar"', description: 'Fácil comando de voz. Uma linha no chão: um lado é Terra, o outro é Mar. Professor grita os comandos. Quem erra sai. Ótimo para atenção e requer zero esforço físico do professor.' }, 
    '801': { title: 'Brincadeira "Terra e Mar"', description: 'Fácil comando de voz. Uma linha no chão: um lado é Terra, o outro é Mar. Professor grita os comandos. Quem erra sai. Ótimo para atenção e requer zero esforço físico do professor.' }, 
    'AP198': { title: 'Construção de peteca', description: DEFAULT_DESC }, 
  }},
  { date: '22/06', type: 'class', activities: { 
    '802': { title: 'Pega Corrente', description: 'Um aluno começa como pegador. Quem ele tocar, dá as mãos e formam uma corrente. O professor apenas supervisiona a segurança do espaço.' }, 
    '803': { title: 'Pega Corrente', description: 'Um aluno começa como pegador. Quem ele tocar, dá as mãos e formam uma corrente. O professor apenas supervisiona a segurança do espaço.' }, 
    '801': { title: 'Pega Corrente', description: 'Um aluno começa como pegador. Quem ele tocar, dá as mãos e formam uma corrente. O professor apenas supervisiona a segurança do espaço.' }, 
    'AP198': { title: 'Peteca em duplas', description: DEFAULT_DESC }, 
  }},
  { date: '29/06', type: 'class', activities: { 
    '802': { title: 'Bandeirinha (Rouba Bandeira)', description: 'Divisão simples de quadra. Atividade auto-gerenciável pelos alunos. Flui sozinha após as regras.' }, 
    '803': { title: 'Bandeirinha (Rouba Bandeira)', description: 'Divisão simples de quadra. Atividade auto-gerenciável pelos alunos. Flui sozinha após as regras.' }, 
    '801': { title: 'Bandeirinha (Rouba Bandeira)', description: 'Divisão simples de quadra. Atividade auto-gerenciável pelos alunos. Flui sozinha após as regras.' }, 
    'AP198': { title: 'Pega-Pega Senegalês', description: DEFAULT_DESC }, 
  }},
  { date: '06/07', subtitle: 'Encerramento 2º Trim.', type: 'class', activities: { 
    '802': { title: 'Torneio de Damas', description: 'Atividade muito focada (excelente para acalmar a turma no fim do trimestre). Alunos sentados jogando damas sob o modelo do xadrez.' }, 
    '803': { title: 'Torneio de Damas', description: 'Atividade muito focada (excelente para acalmar a turma no fim do trimestre). Alunos sentados jogando damas sob o modelo do xadrez.' }, 
    '801': { title: 'Torneio de Damas', description: 'Atividade muito focada (excelente para acalmar a turma no fim do trimestre). Alunos sentados jogando damas sob o modelo do xadrez.' }, 
    'AP198': { title: 'Elástico com cantigas', description: DEFAULT_DESC }, 
  }},
  { date: '27/07', type: 'class', activities: { 
    '802': { title: 'Jongo (Passo e Roda)', description: 'Formar roda. Ensinar o passo básico arrastado do Jongo (origem banto) e a umbigada simbólica (sem toque). Atividade rítmica leve.' }, 
    '803': { title: 'Jongo (Passo e Roda)', description: 'Formar roda. Ensinar o passo básico arrastado do Jongo (origem banto) e a umbigada simbólica (sem toque). Atividade rítmica leve.' }, 
    '801': { title: 'Jongo (Passo e Roda)', description: 'Formar roda. Ensinar o passo básico arrastado do Jongo (origem banto) e a umbigada simbólica (sem toque). Atividade rítmica leve.' }, 
    'AP198': { title: 'Amarelinha', description: DEFAULT_DESC }, 
  }},
  { date: '03/08', type: 'class', activities: { 
    '802': { title: 'Atletismo (Tiro Curto)', description: 'Tiros curtos de velocidade (20m). Alta queima de energia para os alunos, e você só precisa soprar o apito.' }, 
    '803': { title: 'Atletismo (Tiro Curto)', description: 'Tiros curtos de velocidade (20m). Alta queima de energia para os alunos, e você só precisa soprar o apito.' }, 
    '801': { title: 'Atletismo (Tiro Curto)', description: 'Tiros curtos de velocidade (20m). Alta queima de energia para os alunos, e você só precisa soprar o apito.' }, 
    'AP198': { title: 'Atletismo (pelota)', description: DEFAULT_DESC }, 
  }},
  { date: '17/08', type: 'class', activities: { 
    '802': { title: 'Roda de Passinho / Funk', description: 'Alunos formam uma roda e, um por vez, vão ao centro mostrar um passo. Professor atua como mediador.' }, 
    '803': { title: 'Roda de Passinho / Funk', description: 'Alunos formam uma roda e, um por vez, vão ao centro mostrar um passo. Professor atua como mediador.' }, 
    '801': { title: 'Roda de Passinho / Funk', description: 'Alunos formam uma roda e, um por vez, vão ao centro mostrar um passo. Professor atua como mediador.' }, 
    'AP198': { title: 'Cabo de Guerra', description: DEFAULT_DESC }, 
  }},
  { date: '24/08', type: 'class', activities: { 
    '802': { title: 'Apresentação de Dança', description: 'Alunos apresentam as sequências de passinhos. Você senta, avalia e assiste.' }, 
    '803': { title: 'Apresentação de Dança', description: 'Alunos apresentam as sequências de passinhos. Você senta, avalia e assiste.' }, 
    '801': { title: 'Apresentação de Dança', description: 'Alunos apresentam as sequências de passinhos. Você senta, avalia e assiste.' }, 
    'AP198': { title: 'Coelhinho sai da Toca', description: DEFAULT_DESC }, 
  }},
  { date: '31/08', type: 'class', activities: { 
    '802': { title: 'Jogo Shisima (Quênia)', description: 'Desenhar a estrela de 8 pontas no chão. Jogo queniano simples, silencioso e mental. Alunos jogam sentados.' }, 
    '803': { title: 'Jogo Shisima (Quênia)', description: 'Desenhar a estrela de 8 pontas no chão. Jogo queniano simples, silencioso e mental. Alunos jogam sentados.' }, 
    '801': { title: 'Jogo Shisima (Quênia)', description: 'Desenhar a estrela de 8 pontas no chão. Jogo queniano simples, silencioso e mental. Alunos jogam sentados.' }, 
    'AP198': { title: 'Vai-e-vem', description: DEFAULT_DESC }, 
  }},
  { date: '14/09', type: 'class', activities: { 
    '802': { title: 'Torneio de Shisima', description: 'Continuação do jogo em formato de mini-torneio. Fácil supervisão.' }, 
    '803': { title: 'Torneio de Shisima', description: 'Continuação do jogo em formato de mini-torneio. Fácil supervisão.' }, 
    '801': { title: 'Torneio de Shisima', description: 'Continuação do jogo em formato de mini-torneio. Fácil supervisão.' }, 
    'AP198': { title: 'Cinco Marias', description: DEFAULT_DESC }, 
  }},
  { date: '21/09', type: 'class', activities: { 
    '802': { title: 'Relaxamento Guiado', description: 'Turma deitada na quadra (ou sentada). Professor guia escaneamento corporal e respiração diafragmática. Excelente para baixar a frequência.' }, 
    '803': { title: 'Relaxamento Guiado', description: 'Turma deitada na quadra (ou sentada). Professor guia escaneamento corporal e respiração diafragmática. Excelente para baixar a frequência.' }, 
    '801': { title: 'Relaxamento Guiado', description: 'Turma deitada na quadra (ou sentada). Professor guia escaneamento corporal e respiração diafragmática. Excelente para baixar a frequência.' }, 
    'AP198': { title: 'Seu Mestre Mandou', description: DEFAULT_DESC }, 
  }},
  { date: '05/10', type: 'class', activities: { 
    '802': { title: 'Ciranda', description: 'Dança de roda clássica e inclusiva de mãos dadas. Ritmo simples que requer pouca explicação.' }, 
    '803': { title: 'Ciranda', description: 'Dança de roda clássica e inclusiva de mãos dadas. Ritmo simples que requer pouca explicação.' }, 
    '801': { title: 'Ciranda', description: 'Dança de roda clássica e inclusiva de mãos dadas. Ritmo simples que requer pouca explicação.' }, 
    'AP198': { title: 'Pular Corda', description: DEFAULT_DESC }, 
  }},
  { date: '19/10', type: 'class', activities: { 
    '802': { title: 'Carimba (Queimada Alvo)', description: 'Variação onde o objetivo é derrubar uma garrafa PET no campo adversário.' }, 
    '803': { title: 'Carimba (Queimada Alvo)', description: 'Variação onde o objetivo é derrubar uma garrafa PET no campo adversário.' }, 
    '801': { title: 'Carimba (Queimada Alvo)', description: 'Variação onde o objetivo é derrubar uma garrafa PET no campo adversário.' }, 
    'AP198': { title: 'Bilboquê', description: DEFAULT_DESC }, 
  }},
  { date: '26/10', subtitle: 'Novembro Negro', type: 'class', activities: { 
    '802': { title: 'Debate: L. Gama e Várzea', description: 'Roda de conversa sentada. Discutir o esporte de várzea, elitização e a resistência negra, citando o abolicionista Luiz Gama.' }, 
    '803': { title: 'Debate: L. Gama e Várzea', description: 'Roda de conversa sentada. Discutir o esporte de várzea, elitização e a resistência negra, citando o abolicionista Luiz Gama.' }, 
    '801': { title: 'Debate: L. Gama e Várzea', description: 'Roda de conversa sentada. Discutir o esporte de várzea, elitização e a resistência negra, citando o abolicionista Luiz Gama.' }, 
    'AP198': { title: 'Construção Mancala', description: DEFAULT_DESC }, 
  }},
  { date: '23/11', subtitle: 'Consciência Negra', type: 'class', activities: { 
    '802': { title: '"Terra e Mar" + Quiz África', description: 'Mesma mecânica simples do Terra e Mar, mas adicionando perguntas fáceis sobre curiosidades da África.' }, 
    '803': { title: '"Terra e Mar" + Quiz África', description: 'Mesma mecânica simples do Terra e Mar, mas adicionando perguntas fáceis sobre curiosidades da África.' }, 
    '801': { title: '"Terra e Mar" + Quiz África', description: 'Mesma mecânica simples do Terra e Mar, mas adicionando perguntas fáceis sobre curiosidades da África.' }, 
    'AP198': { title: 'Vivência Mancala', description: DEFAULT_DESC }, 
  }},
  { date: '30/11', type: 'class', activities: { 
    '802': { title: 'Brincadeira "Ampe" (Gana)', description: 'Salto em dupla projetando a perna (como pedra, papel e tesoura com os pés). Auto-gerenciável.' }, 
    '803': { title: 'Brincadeira "Ampe" (Gana)', description: 'Salto em dupla projetando a perna (como pedra, papel e tesoura com os pés). Auto-gerenciável.' }, 
    '801': { title: 'Brincadeira "Ampe" (Gana)', description: 'Salto em dupla projetando a perna (como pedra, papel e tesoura com os pés). Auto-gerenciável.' }, 
    'AP198': { title: 'Dança do Frevo', description: DEFAULT_DESC }, 
  }},
  { date: '07/12', type: 'class', activities: { 
    '802': { title: 'Jogo "Câmbio" (Vôlei)', description: 'Vôlei onde é permitido segurar a bola antes de passar. A bola cai muito menos e exige muito menos interrupções de apito.' }, 
    '803': { title: 'Jogo "Câmbio" (Vôlei)', description: 'Vôlei onde é permitido segurar a bola antes de passar. A bola cai muito menos e exige muito menos interrupções de apito.' }, 
    '801': { title: 'Jogo "Câmbio" (Vôlei)', description: 'Vôlei onde é permitido segurar a bola antes de passar. A bola cai muito menos e exige muito menos interrupções de apito.' }, 
    'AP198': { title: 'Jogo "Gato e Rato"', description: DEFAULT_DESC }, 
  }},
  { date: '14/12', subtitle: 'Encerramento', type: 'class', activities: { 
    '802': { title: 'Autoavaliação e Livre', description: 'Roda final e tempo livre.' }, 
    '803': { title: 'Autoavaliação e Livre', description: 'Roda final e tempo livre.' }, 
    '801': { title: 'Autoavaliação e Livre', description: 'Roda final e tempo livre.' }, 
    'AP198': { title: 'Brincadeira livre', description: DEFAULT_DESC }, 
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
    'AP320': { title: 'Queimada alvo', description: DEFAULT_DESC }, 
    '1003': { title: 'Debate "Corpo e mídia"', description: 'Roda de conversa pautada em Frantz Fanon e Cida Bento. \n\nDebater a hipersexualização e os estereótipos associados aos corpos negros e periféricos na televisão e na internet, contrapondo com a realidade.' }, 
    '1001': { title: 'Jogo "Estátua"', description: DEFAULT_DESC }, 
    'AP301': { title: 'Gol a Gol', description: DEFAULT_DESC }, 
    '1007': { title: 'Mapa corporal', description: DEFAULT_DESC } 
  }},
  { date: '22/05', type: 'class', activities: { 
    'AP320': { title: 'Capoeira', description: DEFAULT_DESC }, 
    '1003': { title: 'Luta Marajoara', description: DEFAULT_DESC }, 
    '1001': { title: 'Esporte e Sociedade', description: DEFAULT_DESC }, 
    'AP301': { title: 'Capoeira', description: DEFAULT_DESC }, 
    '1007': { title: 'Mídia e racismo', description: 'Objetivo: Leitura crítica do racismo no esporte.\n\nDesenvolvimento:\n1. Apresentação de casos reais recentes (futebol, atletismo).\n2. Discutir como os locutores descrevem o atleta negro ("força física") versus o branco ("inteligência tática").\n3. Como combater no dia a dia da escola.' } 
  }},
  { date: '29/05', type: 'class', activities: { 
    'AP320': { title: 'Capoeira "Pega-Pé"', description: DEFAULT_DESC }, 
    '1003': { title: 'Luta Marajoara', description: DEFAULT_DESC }, 
    '1001': { title: 'Vôlei cooperativo', description: DEFAULT_DESC }, 
    'AP301': { title: 'Huka-Huka', description: DEFAULT_DESC }, 
    '1007': { title: 'Torneio Futebol', description: DEFAULT_DESC } 
  }},
  { date: '05/06', type: 'class', activities: { 
    'AP320': { title: 'Huka-Huka', description: DEFAULT_DESC }, 
    '1003': { title: 'Jogo "A Ilha"', description: DEFAULT_DESC }, 
    '1001': { title: 'Jogo "Nó Humano"', description: DEFAULT_DESC }, 
    'AP301': { title: 'Briga de Galo', description: DEFAULT_DESC }, 
    '1007': { title: 'Alongamento em dupla', description: DEFAULT_DESC } 
  }},
  { date: '12/06', type: 'class', activities: { 
    'AP320': { title: 'Cabo de Guerra', description: DEFAULT_DESC }, 
    '1003': { title: 'Debate Violência', description: DEFAULT_DESC }, 
    '1001': { title: 'Debate Compulsão', description: DEFAULT_DESC }, 
    'AP301': { title: 'Luta Marajoara', description: DEFAULT_DESC }, 
    '1007': { title: 'Futebol de Botão', description: DEFAULT_DESC } 
  }},
  { date: '19/06', type: 'class', activities: { 
    'AP320': { title: '"Terra e Mar" africano', description: DEFAULT_DESC }, 
    '1003': { title: 'Pique-Bandeira', description: DEFAULT_DESC }, 
    '1001': { title: 'Queimada Cooperativa', description: DEFAULT_DESC }, 
    'AP301': { title: 'Miniolimpíada Jogos', description: DEFAULT_DESC }, 
    '1007': { title: 'Lençolbol', description: DEFAULT_DESC } 
  }},
  { date: '26/06', type: 'class', activities: { 
    'AP320': { title: 'Jogo da Velha Humano', description: DEFAULT_DESC }, 
    '1003': { title: 'Torneio de Damas', description: DEFAULT_DESC }, 
    '1001': { title: 'Torneio de Xadrez', description: 'Relembrar as regras fundamentais do Xadrez. Como instrutor de xadrez da escola, promover partidas rápidas, focando no planejamento e na antecipação de problemas.' }, 
    'AP301': { title: 'Xadrez Humano', description: DEFAULT_DESC }, 
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
    'AP320': { title: 'Atletismo (corrida)', description: DEFAULT_DESC }, 
    '1003': { title: '1ºs Socorros: SAMU', description: DEFAULT_DESC }, 
    '1001': { title: '1ºs Socorros: entorse', description: DEFAULT_DESC }, 
    'AP301': { title: 'Atletismo (revezamento)', description: DEFAULT_DESC }, 
    '1007': { title: '1ºs Socorros: fratura', description: DEFAULT_DESC } 
  }},
  { date: '07/08', type: 'class', activities: { 
    'AP320': { title: 'Atletismo (salto)', description: DEFAULT_DESC }, 
    '1003': { title: '1ºs Socorros: sangramento', description: DEFAULT_DESC }, 
    '1001': { title: '1ºs Socorros: convulsão', description: DEFAULT_DESC }, 
    'AP301': { title: 'Atletismo (pelota)', description: DEFAULT_DESC }, 
    '1007': { title: 'Mapa de riscos', description: DEFAULT_DESC } 
  }},
  { date: '14/08', type: 'class', activities: { 
    'AP320': { title: 'Mini-Olimpíada', description: DEFAULT_DESC }, 
    '1003': { title: '1ºs Socorros: queimadura', description: DEFAULT_DESC }, 
    '1001': { title: '1ºs Socorros: choque', description: DEFAULT_DESC }, 
    'AP301': { title: 'Mini-Olimpíada adaptada', description: DEFAULT_DESC }, 
    '1007': { title: 'Consciência Corporal', description: DEFAULT_DESC } 
  }},
  { date: '21/08', type: 'class', activities: { 
    'AP320': { title: 'Perna de Pau', description: DEFAULT_DESC }, 
    '1003': { title: 'Projeto: Caminhada', description: DEFAULT_DESC }, 
    '1001': { title: 'Projeto: Roda Capoeira', description: DEFAULT_DESC }, 
    'AP301': { title: 'Práticas Circenses', description: DEFAULT_DESC }, 
    '1007': { title: 'Gentrificação', description: 'Debate: Como o crescimento das cidades empurra a classe trabalhadora para as margens? Como fica o direito ao lazer e aos espaços públicos seguros na Baixada/Maricá?' } 
  }},
  { date: '28/08', type: 'class', activities: { 
    'AP320': { title: 'Morto-Vivo', description: DEFAULT_DESC }, 
    '1003': { title: 'Mapear espaços lazer', description: DEFAULT_DESC }, 
    '1001': { title: 'Convidar capoeirista', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jogo "Passe o Bambolê"', description: DEFAULT_DESC }, 
    '1007': { title: 'Automassagem', description: DEFAULT_DESC } 
  }},
  { date: '04/09', subtitle: 'Encerramento 2º Trim.', type: 'class', activities: { 
    'AP320': { title: 'Festa de Talentos', description: DEFAULT_DESC }, 
    '1003': { title: 'Apresentação projetos', description: DEFAULT_DESC }, 
    '1001': { title: 'Apresentação projetos', description: DEFAULT_DESC }, 
    'AP301': { title: 'Festa de Talentos', description: DEFAULT_DESC }, 
    '1007': { title: 'Apresentação projetos', description: DEFAULT_DESC } 
  }},
  { date: '11/09', type: 'class', activities: { 
    'AP320': { title: 'Hip Hop', description: DEFAULT_DESC }, 
    '1003': { title: 'Plano de Vida Ativa', description: DEFAULT_DESC }, 
    '1001': { title: 'Plano de Vida Ativa', description: DEFAULT_DESC }, 
    'AP301': { title: 'Maculelê', description: DEFAULT_DESC }, 
    '1007': { title: 'Plano de Vida Ativa', description: DEFAULT_DESC } 
  }},
  { date: '18/09', type: 'class', activities: { 
    'AP320': { title: 'Funk', description: DEFAULT_DESC }, 
    '1003': { title: 'Circuito funcional', description: DEFAULT_DESC }, 
    '1001': { title: 'Testar plano', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jongo', description: DEFAULT_DESC }, 
    '1007': { title: 'Treino prático', description: DEFAULT_DESC } 
  }},
  { date: '25/09', subtitle: 'Semana Paralímpica', type: 'class', activities: { 
    'AP320': { title: 'Dança Inclusiva', description: DEFAULT_DESC }, 
    '1003': { title: 'Esporte Adaptado: goalball', description: DEFAULT_DESC }, 
    '1001': { title: 'Vôlei sentado', description: DEFAULT_DESC }, 
    'AP301': { title: 'Xadrez para cegos', description: DEFAULT_DESC }, 
    '1007': { title: 'Corrida guiada', description: DEFAULT_DESC } 
  }},
  { date: '09/10', type: 'class', activities: { 
    'AP320': { title: 'Elástico', description: DEFAULT_DESC }, 
    '1003': { title: 'Apresentação Planos', description: DEFAULT_DESC }, 
    '1001': { title: 'Apresentação Planos', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jogo "Shisima"', description: DEFAULT_DESC }, 
    '1007': { title: 'Apresentação Planos', description: DEFAULT_DESC } 
  }},
  { date: '16/10', type: 'class', activities: { 
    'AP320': { title: 'Construção Vai-e-vem', description: DEFAULT_DESC }, 
    '1003': { title: 'Teste prático', description: DEFAULT_DESC }, 
    '1001': { title: 'Teste prático', description: DEFAULT_DESC }, 
    'AP301': { title: 'Construção Mancala', description: DEFAULT_DESC }, 
    '1007': { title: 'Teste prático', description: DEFAULT_DESC } 
  }},
  { date: '23/10', subtitle: 'Semana Cultural', type: 'class', activities: { 
    'AP320': { title: 'Apresentação Hip Hop/Funk', description: DEFAULT_DESC }, 
    '1003': { title: 'Ajuste planos', description: DEFAULT_DESC }, 
    '1001': { title: 'Ajuste planos', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jogo Bets (Taco)', description: DEFAULT_DESC }, 
    '1007': { title: 'Ajuste planos', description: DEFAULT_DESC } 
  }},
  { date: '30/10', type: 'class', activities: { 
    'AP320': { title: 'Roda expressão corporal', description: DEFAULT_DESC }, 
    '1003': { title: 'Entrega final', description: DEFAULT_DESC }, 
    '1001': { title: 'Entrega final', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jogo Carimba', description: DEFAULT_DESC }, 
    '1007': { title: 'Entrega final', description: DEFAULT_DESC } 
  }},
  { date: '06/11', subtitle: 'Abert. Novembro Negro', type: 'class', activities: { 
    'AP320': { title: 'Capoeira "Pega-Pé"', description: DEFAULT_DESC }, 
    '1003': { title: 'Pesquisa atleta negro', description: DEFAULT_DESC }, 
    '1001': { title: 'Roda Capoeira comunidade', description: DEFAULT_DESC }, 
    'AP301': { title: 'Jongo', description: DEFAULT_DESC }, 
    '1007': { title: 'Anemia falciforme', description: DEFAULT_DESC } 
  }},
  { date: '27/11', subtitle: 'Consciência Negra', type: 'class', activities: { 
    'AP320': { title: 'Brincadeira "Ampe"', description: DEFAULT_DESC }, 
    '1003': { title: 'Maculelê', description: DEFAULT_DESC }, 
    '1001': { title: 'Dança dos Orixás', description: DEFAULT_DESC }, 
    'AP301': { title: 'Maracatu Rural', description: DEFAULT_DESC }, 
    '1007': { title: 'Jongo aprofundado', description: DEFAULT_DESC } 
  }},
  { date: '04/12', type: 'class', activities: { 
    'AP320': { title: 'Kiriku e a Feiticeira', description: DEFAULT_DESC }, 
    '1003': { title: 'Sarau Afro', description: DEFAULT_DESC }, 
    '1001': { title: 'Sarau Afro', description: DEFAULT_DESC }, 
    'AP301': { title: 'Capoeira Angola', description: DEFAULT_DESC }, 
    '1007': { title: 'Sarau Afro', description: DEFAULT_DESC } 
  }},
  { date: '11/12', subtitle: 'Conselho de Classe', type: 'class', activities: { 
    'AP320': { title: 'Pular Corda', description: DEFAULT_DESC }, 
    '1003': { title: 'Confraternização esportiva', description: DEFAULT_DESC }, 
    '1001': { title: 'Confraternização esportiva', description: DEFAULT_DESC }, 
    'AP301': { title: 'Damas e Dominó', description: DEFAULT_DESC }, 
    '1007': { title: 'Confraternização', description: DEFAULT_DESC } 
  }},
  { date: '18/12', subtitle: 'Encerramento', type: 'class', activities: { 
    'AP320': { title: 'Entrega de jogos', description: DEFAULT_DESC }, 
    '1003': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    '1001': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    'AP301': { title: 'Confraternização final', description: DEFAULT_DESC }, 
    '1007': { title: 'Confraternização final', description: DEFAULT_DESC } 
  }},
];

interface LessonContentViewProps {
  onBack: () => void;
}

export const LessonContentView: React.FC<LessonContentViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'MONDAY' | 'FRIDAY'>('MONDAY');
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
    <div className="space-y-6 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white font-bold transition-all shadow-lg hover:bg-white/20 flex items-center active:scale-95 border border-white/10"
        >
          <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Menu Anterior
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-xl leading-none mb-2">Conteúdo das Aulas</h1>
          <p className="text-blue-300 font-bold text-xs tracking-widest uppercase">Planejamento Pedagógico • 2026</p>
        </div>
      </header>

      <div className="bg-white/95 backdrop-blur-2xl p-6 md:p-8 rounded-[3rem] shadow-2xl border border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto shadow-inner border border-slate-200">
            <button
              onClick={() => { setActiveTab('MONDAY'); setFilterClass('ALL'); }}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'MONDAY' ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Segunda-feira
            </button>
            <button
              onClick={() => { setActiveTab('FRIDAY'); setFilterClass('ALL'); }}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'FRIDAY' ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sexta-feira
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <Filter size={18} className="text-slate-400 ml-2" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-transparent border-none text-slate-700 text-xs font-bold uppercase tracking-widest block w-full outline-none cursor-pointer"
            >
              <option value="ALL">Todas as Turmas</option>
              {currentClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-10 overflow-x-auto pb-4 custom-scrollbar">
           <div className="flex gap-2">
            {MONTHS.map(month => (
              <button
                key={month.id}
                onClick={() => setActiveMonth(month.id)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ring-1 shrink-0 ${
                  activeMonth === month.id
                    ? 'bg-indigo-600 text-white shadow-xl ring-indigo-400'
                    : 'bg-white text-slate-500 hover:bg-slate-50 ring-slate-200'
                }`}
              >
                {month.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 shadow-sm">
          <table className="w-full border-collapse text-xs text-left bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 bg-slate-50 z-20 border-r border-slate-200 p-6 min-w-[200px] shadow-lg">
                  <div className="font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Users size={16} className="text-indigo-500" /> Turma / Escola
                  </div>
                </th>
                {scheduleToRender.map((day, idx) => (
                  <th key={idx} className="p-6 border-r border-slate-200 min-w-[200px] text-center">
                    <div className="font-black text-slate-900 text-base tracking-tighter">{day.date}</div>
                    {day.subtitle && (
                      <div className="text-[9px] font-black text-indigo-600 mt-2 bg-indigo-50 inline-block px-3 py-1 rounded-full uppercase tracking-widest">
                        {day.subtitle}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classesToRender.map((classInfo) => (
                <tr key={classInfo.id} className="border-b border-slate-200 last:border-0 group hover:bg-slate-50/50 transition-colors">
                  <td className="sticky left-0 bg-white z-10 border-r border-slate-200 p-6 shadow-lg group-hover:bg-slate-50">
                    <div className="text-slate-900 font-black tracking-tight leading-tight mb-1">{classInfo.name}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md inline-block ${classInfo.segment.color}`}>
                      {classInfo.segment.name.split(' ')[0]}
                    </div>
                  </td>
                  {scheduleToRender.map((day : any, idx) => {
                    if (day.type === 'event') {
                      return (
                        <td key={idx} className="p-4 bg-slate-100/50">
                          <div className="h-24 flex items-center justify-center p-4 rounded-3xl bg-slate-200/50 text-slate-600 font-black text-center text-[10px] uppercase tracking-widest border border-slate-300/50">
                            {day.title}
                          </div>
                        </td>
                      );
                    }

                    const activity = day.activities?.[classInfo.id];
                    const isCompleted = activity ? completedClasses.includes(`${classInfo.id}-${day.date}`) : false;

                    return (
                      <td key={idx} className="p-4 align-top">
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
                            className={`relative w-full h-24 p-5 flex flex-col justify-center items-center text-center rounded-[2rem] border transition-all cursor-pointer shadow-sm active:scale-95
                              ${isCompleted ? 'bg-emerald-50 border-emerald-500 shadow-emerald-100' : `${classInfo.segment.color} ${classInfo.segment.hover} border-transparent`} 
                              focus:outline-none overflow-hidden group/card`}
                          >
                            {isCompleted && (
                              <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20">
                                <CheckCircle size={10} /> DADA
                              </div>
                            )}
                            <span className={`line-clamp-2 text-xs font-black uppercase tracking-tight leading-tight ${isCompleted ? 'text-emerald-900' : ''}`}>
                              {activity.title}
                            </span>
                            <div className="mt-3 text-[9px] font-bold opacity-40 group-hover/card:opacity-100 transition-opacity">Ver Detalhes →</div>
                          </button>
                        ) : (
                          <div className="h-24 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                            Vago
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

      {modalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setModalData(null)}>
          <div 
            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transform transition-all animate-slide-up ring-8 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className={`p-8 flex justify-between items-start border-b border-slate-100 ${modalData.segment.color}`}>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                  {modalData.className}
                  {completedClasses.includes(`${modalData.classId}-${modalData.date}`) && (
                    <span className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1 font-black shadow-lg uppercase tracking-widest">
                      <CheckCircle size={14} /> Validada
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="bg-white/50 px-4 py-1.5 rounded-xl text-xs font-black text-slate-800 uppercase tracking-widest border border-white/20">
                    {modalData.date}
                  </span>
                  {modalData.subtitle && (
                    <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-md">
                      {modalData.subtitle}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setModalData(null)}
                className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-3 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10">
              <h4 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4 border-b border-slate-100 pb-6 tracking-tighter uppercase leading-none">
                 <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <BookOpen size={24} />
                 </div>
                 {modalData.activity.title}
              </h4>
              
              <div className="flex items-center gap-3 text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] mb-4">
                <ClipboardList size={18} />
                Passo a passo pedagógico
              </div>
              
              <p className="text-slate-700 text-base leading-relaxed bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 whitespace-pre-line font-medium shadow-inner">
                {modalData.activity.description}
              </p>
            </div>
            
            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <button 
                onClick={() => {
                  toggleCompletion(modalData.classId, modalData.date);
                }}
                className={`flex items-center gap-3 px-8 py-4 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
                  completedClasses.includes(`${modalData.classId}-${modalData.date}`)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-200'
                }`}
              >
                <CheckCircle size={20} />
                {completedClasses.includes(`${modalData.classId}-${modalData.date}`) ? 'Aula Dada (Desfazer)' : 'Validar Aula dada'}
              </button>

              <button 
                onClick={() => setModalData(null)}
                className="px-8 py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
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
