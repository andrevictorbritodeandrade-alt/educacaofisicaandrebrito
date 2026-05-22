
export interface AulaPlan {
    data: string;
    tri: string;
    modulo: string;
    titulo: string;
    desc: string;
    trabalho?: 'passar' | 'recolher' | null;
    status?: string;
    resumo: string;
}

const COMMON_RESUMOS: Record<string, string> = {
    'Futevôlei': `🎯 **Objetivo da Aula:** Apresentar a realidade das aulas (falta de quadra) e introduzir a história e técnica do futevôlei.\n\n🗣️ **Dinâmica:**\n• Conversa franca sobre o uso da sala de aula como espaço de esporte tático.\n• Slides sobre as regras básicas do Futevôlei.\n\n📜 **Reflexão:** Como adaptar um esporte de praia para o contexto urbano da Baixada?`,
    'Futepátio': `🎯 **Objetivo da Aula:** Desenvolver coordenação e controle de bola em espaço reduzido.\n\n🗣️ **Prática:**\n• Montagem de "mesas" no pátio ou uso de bancos.\n• Jogo 1x1 ou 2x2 com regras de controle (no máximo 3 toques).\n\n📜 **Reflexão:** A criatividade como ferramenta de resistência à falta de infraestrutura escolar.`,
    'Mancala': `🎯 **Objetivo da Aula:** Estudo de matrizes civilizatórias africanas através do jogo.\n\n🗣️ **Dinâmica:**\n• Explicar que Mancala não é sobre guerra (como xadrez), mas sobre agricultura e distribuição.\n• Jogar em duplas nas carteiras com sementes/feijões.\n\n📜 **Amparo Legal:** Cumprimento da Lei 10.639/03.`,
    'Várzea': `🎯 **Objetivo da Aula:** Analisar a história social do futebol no Brasil.\n\n🗣️ **Dinâmica:**\n• Debate sobre a elitização do futebol (Vasco vs Clubes aristocráticos).\n• Torneio de Futebol de Botão adaptado com tampinhas.\n\n📜 **Reflexão:** Por que o futebol da várzea é o berço da nossa cultura corporal?`,
    'E-Sports': `🎯 **Objetivo da Aula:** Debater o impacto das telas na saúde física.\n\n🗣️ **Dinâmica:**\n• Debate sobre o lucro das desenvolvedoras de games.\n• Prática: "Stop" (Adedonha) Esportivo no caderno.\n\n📜 **Reflexão:** O esporte como ferramenta de desconexão digital.`,
    'Onça': `🎯 **Objetivo da Aula:** Valorizar a cultura Bororo/Guarani.\n\n🗣️ **Dinâmica:**\n• Desenhar o tabuleiro no caderno.\n• Jogo de estratégia: 1 onça vs 14 cachorros.\n\n📜 **Amparo Legal:** Cumprimento da Lei 11.645/08.`,
    'Tabuleiros': `🎯 **Objetivo da Aula:** Desenvolver raciocínio tático e paciência.\n\n🗣️ **Dinâmica:**\n• Torneio livre em sala.\n• Professor como instrutor orientador.`,
    'Paralímpico': `🎯 **Objetivo da Aula:** Empatia e adaptação física.\n\n🗣️ **Dinâmica:**\n• Vôlei de Balão Sentado na sala.\n• Debate sobre barreiras arquitetônicas na Baixada.`,
    'Padrões': `🎯 **Objetivo da Aula:** Crítica aos padrões de beleza irreais.\n\n🗣️ **Dinâmica:**\n• Jogo "Quem sou eu?" com personalidades negras/indígenas.\n• Debate sobre racismo estético.`,
    'Lutas': `🎯 **Objetivo da Aula:** Diferenciar Luta de Briga.\n\n🗣️ **Dinâmica:**\n• Vídeo/Debate sobre a criminalização da Capoeira.\n• Vivência: "Briga de Galo" segura.\n\n⚠️ **TRABALHO:** Construção do tabuleiro de Shisima ou Mancala.`,
    'Precisão': `🎯 **Objetivo da Aula:** Foco e controle motor.\n\n🗣️ **Dinâmica:**\n• Arremesso de precisão em lixeiras com distâncias variadas.`,
    'Ilha': `🎯 **Objetivo da Aula:** Fomentar o trabalho em equipe.\n\n🗣️ **Dinâmica:**\n• Jogo "A Ilha" na sala (jornais no chão).`,
    'Shisima': `🎯 **Objetivo da Aula:** Praticar a lógica matemática queniana.\n\n🗣️ **Dinâmica:**\n• Organizar torneio com tabuleiros recicláveis.\n\n📥 **TRABALHO:** Recolher os tabuleiros.`,
    'Postura': `🎯 **Objetivo da Aula:** Prevenção de dores e vícios posturais.\n\n🗣️ **Dinâmica:**\n• Guia de ginástica laboral na cadeira escolar.`,
    'Olimpíadas': `🎯 **Objetivo da Aula:** Entender que o esporte não é neutro.\n\n🗣️ **Dinâmica:**\n• Jogo da Forca com termos de ética e política.`,
    'Dominó': `🎯 **Objetivo da Aula:** Tradição cultural e probabilidade básica.\n\n🗣️ **Dinâmica:**\n• Torneio de Dominó em grupos.`,
    'Apartheid': `🎯 **Objetivo da Aula:** Estudar o esporte como ferramenta política.\n\n🗣️ **Dinâmica:**\n• Debate sobre o banimento da África do Sul das Olimpíadas.\n\n⚠️ **TRABALHO:** Pesquisa: Atletas Negros Contra o Racismo.`,
    'Música': `🎯 **Objetivo da Aula:** Conectar ritmo e história.\n\n🗣️ **Dinâmica:**\n• Percussão corporal rítmica nas carteiras.`,
    'Cidade': `🎯 **Objetivo da Aula:** Conectar geografia urbana e lazer.\n\n🗣️ **Dinâmica:**\n• Debate: Por que faltam praças seguras na periferia?\n\n📥 **TRABALHO:** Entrega da pesquisa sobre Atletas Negros.`,
    'Avaliação': `🎯 **Objetivo da Aula:** Sistematização do conhecimento anual.\n\n🗣️ **Dinâmica:**\n• Aplicação de avaliação teórica e tempo livre.`,
    'Final': `🎯 **Objetivo da Aula:** Finalizar o ciclo letivo com reflexão coletiva.`
};

export const PE_PLAN: Record<string, AulaPlan[]> = {
    '8ano': [
        { data: '18/05', tri: '2º Tri', modulo: 'Esportes de Rede', titulo: 'Teoria: Futevôlei', desc: 'Introdução ao futevôlei e dinâmica sem quadra.', resumo: COMMON_RESUMOS['Futevôlei'] },
        { data: '25/05', tri: '2º Tri', modulo: 'Esportes de Rede', titulo: 'Prática: Futepátio', desc: 'Adaptação técnica no pátio.', resumo: COMMON_RESUMOS['Futepátio'] },
        { data: '08/06', tri: '2º Tri', modulo: 'Matrizes Africanas', titulo: 'Jogos: Mancala', desc: 'Lógica e semeadura africana.', resumo: COMMON_RESUMOS['Mancala'] },
        { data: '15/06', tri: '2º Tri', modulo: 'Matrizes Africanas', titulo: 'Futebol e Várzea', desc: 'A resistência negra no futebol.', resumo: COMMON_RESUMOS['Várzea'] },
        { data: '22/06', tri: '2º Tri', modulo: 'Cultura Digital', titulo: 'E-Sports e o Corpo', desc: 'Sedentarismo e games.', resumo: COMMON_RESUMOS['E-Sports'] },
        { data: '29/06', tri: '2º Tri', modulo: 'Matrizes Indígenas', titulo: 'Jogo da Onça', desc: 'Estratégia dos povos originários.', resumo: COMMON_RESUMOS['Onça'] },
        { data: '06/07', tri: '2º Tri', modulo: 'Jogos de Salão', titulo: 'Festival de Tabuleiros', desc: 'Xadrez e Damas tático.', resumo: COMMON_RESUMOS['Tabuleiros'] },
        { data: '27/07', tri: '2º Tri', modulo: 'Inclusão', titulo: 'Esporte Paralímpico', desc: 'Acessibilidade e Vôlei Sentado.', resumo: COMMON_RESUMOS['Paralímpico'] },
        { data: '03/08', tri: '2º Tri', modulo: 'Inclusão', titulo: 'Mídia e Padrões', desc: 'Racismo estético e imagem.', resumo: COMMON_RESUMOS['Padrões'] },
        { data: '17/08', tri: '2º Tri', modulo: 'Lutas', titulo: 'Lutas de Resistência', desc: 'Filosofia da Capoeira.', trabalho: 'passar', resumo: COMMON_RESUMOS['Lutas'] },
        { data: '24/08', tri: '2º Tri', modulo: 'Lutas', titulo: 'Esportes de Precisão', desc: 'Foco e coordenação motora.', resumo: COMMON_RESUMOS['Precisão'] },
        { data: '31/08', tri: '2º Tri', modulo: 'Lutas', titulo: 'Cooperação (A Ilha)', desc: 'Desconstruindo a competição.', resumo: COMMON_RESUMOS['Ilha'] },
        { data: '14/09', tri: '3º Tri', modulo: 'Matrizes Africanas', titulo: 'Torneio de Shisima', desc: 'Lógica matemática queniana.', trabalho: 'recolher', resumo: COMMON_RESUMOS['Shisima'] },
        { data: '21/09', tri: '3º Tri', modulo: 'Saúde', titulo: 'Ergonomia: Postura', desc: 'Vícios posturais e prevenção.', resumo: COMMON_RESUMOS['Postura'] },
        { data: '05/10', tri: '3º Tri', modulo: 'Geopolítica', titulo: 'Olimpíadas e Política', desc: 'Protestos e história.', resumo: COMMON_RESUMOS['Olimpíadas'] },
        { data: '19/10', tri: '3º Tri', modulo: 'Cultura Popular', titulo: 'Jogos: Dominó', desc: 'Probabilidade e lazer operário.', resumo: COMMON_RESUMOS['Dominó'] },
        { data: '26/10', tri: '3º Tri', modulo: 'Geopolítica', titulo: 'Apartheid e Rugby', desc: 'Mandela e reconciliação.', trabalho: 'passar', resumo: COMMON_RESUMOS['Apartheid'] },
        { data: '23/11', tri: '3º Tri', modulo: 'Cultura Negra', titulo: 'Música e Capoeira', desc: 'Ritmo e comunicação secreta.', resumo: COMMON_RESUMOS['Música'] },
        { data: '30/11', tri: '3º Tri', modulo: 'Território', titulo: 'Direito à Cidade', desc: 'Lazer e gentrificação.', trabalho: 'recolher', resumo: COMMON_RESUMOS['Cidade'] },
        { data: '07/12', tri: '3º Tri', modulo: 'Encerramento', titulo: 'Avaliação Final', desc: 'Sistematização teórica.', resumo: COMMON_RESUMOS['Avaliação'] },
        { data: '14/12', tri: '3º Tri', modulo: 'Encerramento', titulo: 'Autoavaliação', desc: 'Roda de encerramento.', resumo: COMMON_RESUMOS['Final'] }
    ],
    'ap': [
        { data: '15/05', tri: '2º Tri', modulo: 'Esportes de Rede', titulo: 'Teoria: Futevôlei', desc: 'Introdução ao futevôlei e dinâmica sem quadra.', resumo: COMMON_RESUMOS['Futevôlei'] },
        { data: '22/05', tri: '2º Tri', modulo: 'Esportes de Rede', titulo: 'Prática: Futepátio', desc: 'Adaptação técnica no pátio.', resumo: COMMON_RESUMOS['Futepátio'] },
        { data: '29/05', tri: '2º Tri', modulo: 'Matrizes Africanas', titulo: 'Jogos: Mancala', desc: 'Lógica e semeadura africana.', resumo: COMMON_RESUMOS['Mancala'] },
        { data: '05/06', tri: '2º Tri', modulo: 'Matrizes Africanas', titulo: 'Futebol e Várzea', desc: 'A resistência negra no futebol.', trabalho: 'passar', resumo: COMMON_RESUMOS['Várzea'] },
        { data: '12/06', tri: '2º Tri', modulo: 'Cultura Digital', titulo: 'E-Sports e o Corpo', desc: 'Sedentarismo e games.', resumo: COMMON_RESUMOS['E-Sports'] },
        { data: '19/06', tri: '2º Tri', modulo: 'Matrizes Indígenas', titulo: 'Jogo da Onça', desc: 'Estratégia dos povos originários.', resumo: COMMON_RESUMOS['Onça'] },
        { data: '26/06', tri: '2º Tri', modulo: 'Jogos de Salão', titulo: 'Festival de Tabuleiros', desc: 'Xadrez e Damas tático.', resumo: COMMON_RESUMOS['Tabuleiros'] },
        { data: '31/07', tri: '2º Tri', modulo: 'Inclusão', titulo: 'Esporte Paralímpico', desc: 'Acessibilidade e Vôlei Sentado.', resumo: COMMON_RESUMOS['Paralímpico'] },
        { data: '07/08', tri: '2º Tri', modulo: 'Inclusão', titulo: 'Mídia e Padrões', desc: 'Racismo estético e imagem.', resumo: COMMON_RESUMOS['Padrões'] },
        { data: '14/08', tri: '2º Tri', modulo: 'Lutas', titulo: 'Lutas de Resistência', desc: 'Filosofia da Capoeira.', trabalho: 'passar', resumo: COMMON_RESUMOS['Lutas'] },
        { data: '21/08', tri: '2º Tri', modulo: 'Lutas', titulo: 'Esportes de Precisão', desc: 'Foco e coordenação motora.', resumo: COMMON_RESUMOS['Precisão'] },
        { data: '28/08', tri: '2º Tri', modulo: 'Lutas', titulo: 'Cooperação (A Ilha)', desc: 'Desconstruindo a competição.', resumo: COMMON_RESUMOS['Ilha'] },
        { data: '04/09', tri: '2º Tri', modulo: 'Matrizes Africanas', titulo: 'Torneio de Shisima', desc: 'Lógica matemática queniana.', trabalho: 'recolher', resumo: COMMON_RESUMOS['Shisima'] },
        { data: '11/09', tri: '3º Tri', modulo: 'Saúde', titulo: 'Ergonomia: Postura', desc: 'Vícios posturais e prevenção.', resumo: COMMON_RESUMOS['Postura'] },
        { data: '18/09', tri: '3º Tri', modulo: 'Geopolítica', titulo: 'Olimpíadas e Política', desc: 'Protestos e história.', resumo: COMMON_RESUMOS['Olimpíadas'] },
        { data: '25/09', tri: '3º Tri', modulo: 'Cultura Popular', titulo: 'Jogos: Dominó', desc: 'Probabilidade e lazer operário.', resumo: COMMON_RESUMOS['Dominó'] },
        { data: '09/10', tri: '3º Tri', modulo: 'Geopolítica', titulo: 'Apartheid e Rugby', desc: 'Mandela e reconciliação.', trabalho: 'passar', resumo: COMMON_RESUMOS['Apartheid'] },
        { data: '16/10', tri: '3º Tri', modulo: 'Cultura Negra', titulo: 'Música e Capoeira', desc: 'Ritmo e comunicação secreta.', resumo: COMMON_RESUMOS['Música'] },
        { data: '23/10', tri: '3º Tri', modulo: 'Território', titulo: 'Direito à Cidade', desc: 'Lazer e gentrificação.', resumo: COMMON_RESUMOS['Cidade'] },
        { data: '30/10', tri: '3º Tri', modulo: 'Encerramento', titulo: 'Avaliação Final', desc: 'Sistematização teórica.', resumo: COMMON_RESUMOS['Avaliação'] },
        { data: '06/11', tri: '3º Tri', modulo: 'Encerramento', titulo: 'Autoavaliação', desc: 'Roda de encerramento.', resumo: COMMON_RESUMOS['Final'] }
    ],
    'ejanem': [
        { data: '18/05', tri: '2º Tri', modulo: 'Saúde Trabalhador', titulo: 'Corpo e Mídia', desc: 'Hipersexualização.', resumo: `🎯 **Objetivo:** Analisar criticamente a imagem do corpo negro na mídia.` },
        { data: '25/05', tri: '2º Tri', modulo: 'Saúde Trabalhador', titulo: 'LER e DORT', desc: 'Prevenção ocupacional.', resumo: `🎯 **Objetivo:** Conhecimentos práticos de saúde para o trabalho.` },
        { data: '08/06', tri: '2º Tri', modulo: 'Saúde Trabalhador', titulo: 'Ginástica Laboral', desc: 'Mãos e braços.', resumo: `🎯 **Objetivo:** Prevenção de lesões repetitivas.` },
        { data: '15/06', tri: '2º Tri', modulo: 'Saúde Trabalhador', titulo: 'Postura e Carga', desc: 'Como levantar peso.', resumo: `🎯 **Objetivo:** Ergonomia no posto de trabalho.` },
        { data: '22/06', tri: '2º Tri', modulo: 'Bem Estar', titulo: 'Automassagem', desc: 'Relaxamento muscular.', resumo: `🎯 **Objetivo:** Alívio de tensões do dia a dia.` },
        { data: '29/06', tri: '2º Tri', modulo: 'Bem Estar', titulo: 'Roda: Meu Corpo', desc: 'Identidade e aceitação.', resumo: `🎯 **Objetivo:** Troca de experiências sobre envelhecimento e trabalho.` },
        { data: '06/07', tri: '2º Tri', modulo: 'Socorros', titulo: 'Simulação SAMU', desc: 'Como pedir ajuda.', resumo: `🎯 **Objetivo:** Comunicação eficiente em crises.` },
        { data: '27/07', tri: '2º Tri', modulo: 'Socorros', titulo: 'Socorros: AVC', desc: 'Identificar sinais.', resumo: `🎯 **Objetivo:** Rapidez no socorro de derrame.` },
        { data: '03/08', tri: '2º Tri', modulo: 'Socorros', titulo: 'Manobra Heimlich', desc: 'Engasgos.', resumo: `🎯 **Objetivo:** Desobstrução de vias aéreas.` },
        { data: '17/08', tri: '2º Tri', modulo: 'Socorros', titulo: 'Socorros: Queimaduras', desc: 'Emergências.', trabalho: 'passar', resumo: `🎯 **Objetivo:** Cuidados imediatos com a pele.` },
        { data: '24/08', tri: '2º Tri', modulo: 'Socorros', titulo: 'Socorros: Desmaio', desc: 'O que fazer.', resumo: `🎯 **Objetivo:** Estabilização e ventilação.` },
        { data: '31/08', tri: '2º Tri', modulo: 'Socorros', titulo: 'Mapa Afetivo', desc: 'Redes de apoio.', resumo: `🎯 **Objetivo:** Identificar locais de lazer e saúde.` },
        { data: '14/09', tri: '3º Tri', modulo: 'Saúde', titulo: 'Vida Ativa', desc: 'Plano de exercícios.', trabalho: 'recolher', resumo: `🎯 **Objetivo:** Adaptar movimento à rotina pesada.` },
        { data: '21/09', tri: '3º Tri', modulo: 'Saúde', titulo: 'Relaxamento', desc: 'Higiene do sono.', resumo: `🎯 **Objetivo:** Melhorar a qualidade do descanso.` },
        { data: '05/10', tri: '3º Tri', modulo: 'Socorros', titulo: 'Socorros: Convulsão', desc: 'Proteção física.', resumo: `🎯 **Objetivo:** Saber lidar com crises epiléticas.` },
        { data: '19/10', tri: '3º Tri', modulo: 'Socorros', titulo: 'Simulado Final', desc: 'Prática de socorros.', resumo: `🎯 **Objetivo:** Testar conhecimentos do tri.` },
        { data: '26/10', tri: '3º Tri', modulo: 'História', titulo: 'Luiz Gama e Várzea', desc: 'Resistência negra.', trabalho: 'passar', resumo: `🎯 **Objetivo:** Abolicionismo e esporte popular.` },
        { data: '23/11', tri: '3º Tri', modulo: 'Cultura', titulo: 'Jongo: Improviso', desc: 'Dança e oralidade.', resumo: `🎯 **Objetivo:** Conhecer a matriz do samba.` },
        { data: '30/11', tri: '3º Tri', modulo: 'Cultura', titulo: 'Feijoada Imaterial', desc: 'Encontro coletivo.', trabalho: 'recolher', resumo: `🎯 **Objetivo:** Patrimônio cultural e alimentação.` },
        { data: '07/12', tri: '3º Tri', modulo: 'Final', titulo: 'Confraternização', desc: 'Notas e feedback.', resumo: `🎯 **Objetivo:** Concluir o semestre com união.` },
        { data: '14/12', tri: '3º Tri', modulo: 'Final', titulo: 'Roda de Fechamento', desc: 'Planos p/ futuro.', resumo: `🎯 **Objetivo:** Autoavaliação e acolhimento.` }
    ]
};
