import { ClassDataMap, ClassificationDataMap, UserProfile } from './types';

export const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=3870&auto=format&fit=crop", // Gym/Fitness
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=3869&auto=format&fit=crop", // Running/Athletics
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=3936&auto=format&fit=crop", // Soccer/Field
  "https://images.unsplash.com/photo-1526676023131-d352423b06b4?q=80&w=3870&auto=format&fit=crop", // Basketball court
  "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=3870&auto=format&fit=crop"  // Swimming/Sports
];

// Helper para gerar alunos mockados (para outras turmas)
const generateStudents = (count: number) => {
  const names = ["Ana Silva", "Beatriz Costa", "Carlos Oliveira", "Davi Souza", "Eduardo Lima", "Fernanda Rocha", "Gabriel Alves", "Helena Dias", "Igor Martins", "Julia Pereira", "Kaique Santos", "Larissa Gomes", "Miguel Ferreira", "Nicole Ribeiro", "Otávio Castro"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i > 14 ? ` ${i}` : ''),
    attendance: {}
  }));
};

// Helper para formatar nomes (Capitalize)
const formatName = (name: string) => {
  return name.toLowerCase().split(' ').map(word => {
    if (['da', 'de', 'do', 'dos', 'das', 'e'].includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

const students601Raw = [
  "Allanda Lima",
  "Ana Beatriz",
  "Anderson",
  "Arthur Bastos",
  "Arthur Cruz",
  "Aryel Monteiro",
  "Bernardo Lamprecht",
  "Carlos Eduardo",
  "Emanuelly",
  "Esther",
  "Gabriel Alves",
  "Geovane",
  "Gustavo Reinaldo",
  "Henrique Lemos",
  "Kelvin Oliveira",
  "Maria Luísa Magalhães",
  "Miguel de Oliveira",
  "Pedro Cruz",
  "Pedro Henrique Oliveira",
  "Rickarlyson",
  "Thiago",
  "Vitor Bastos",
  "Vitória Beatriz",
  "Vívian Avelino",
  "Ysabella Ricas"
];

const students602Raw = [
  "Agatha de Souza",
  "Alice Costa",
  "Alice dos Santos",
  "Ana Beatriz",
  "Ana Clara",
  "Ana Kateryne",
  "Ana Sophia",
  "Anna Ester",
  "Annalu Barros",
  "Any Carreiri",
  "Arthur Azevedo",
  "Benício Diniz",
  "Cristal Marisa",
  "Davi Leal",
  "Davi Lucas",
  "Davi Luiz",
  "Davi Miguel",
  "Eloah",
  "Enzo",
  "Gabriel",
  "Gabriel de Oliveira",
  "Geovanna",
  "Heitor",
  "Helena",
  "Heloísa",
  "Isadora",
  "João Gabriel",
  "João Guilherme",
  "João Lucas",
  "João Pedro",
  "João Victor",
  "Júlia",
  "Kauã",
  "Lara",
  "Larissa",
  "Laura",
  "Lavínia",
  "Letícia",
  "Lívia",
  "Lorena",
  "Lucas",
  "Lucca",
  "Luiz Felipe",
  "Luiz Gustavo",
  "Luiz Henrique",
  "Luiz Otávio",
  "Luíza",
  "Manuela",
  "Maria Alice",
  "Maria Clara",
  "Maria Eduarda",
  "Maria Fernanda",
  "Maria Júlia",
  "Maria Luíza",
  "Maria Sophia",
  "Mariana",
  "Marina",
  "Mateus",
  "Matheus",
  "Melissa",
  "Miguel",
  "Milena",
  "Murilo",
  "Natália",
  "Nathan",
  "Nicolas",
  "Nicole",
  "Otávio",
  "Paulo",
  "Pedro",
  "Pietro",
  "Rafael",
  "Rafaela",
  "Rebeca",
  "Rodrigo",
  "Samuel",
  "Sarah",
  "Sophia",
  "Thales",
  "Theo",
  "Thiago",
  "Valentina",
  "Victor",
  "Vinícius",
  "Vitor",
  "Vitória",
  "Yasmin",
  "Yuri"
];

const students603Raw = [
  "Alycia Vitória",
  "Arnaldo Barbosa",
  "Arthur Coutinho",
  "Arthur Nogueira",
  "Beatriz Vidal",
  "Breno Henrique",
  "Catarina Santiago",
  "Davi Lucca",
  "Fabiano Rocha",
  "Fabíola Gabryella",
  "Fernanda Isaías",
  "Gabriel Gosta",
  "João Miguel",
  "Laís Moura",
  "Lavínia da Rocha",
  "Leidania",
  "Luís Henrique Marchi",
  "Mariana Tostes",
  "Miguel Macedo",
  "Moisés Santiago",
  "Nathalia de Melo",
  "Pedro Joaquim",
  "Peron Pérez",
  "Pietro dos Santos",
  "Piettra Moreira"
];

const students604Raw = [
  "Manuella da Silva",
  "Arthur Mendonça",
  "Sthefany Vitória",
  "Paulo Sérgio",
  "Nina Pacheco",
  "Isaque oliveira",
  "Laura Neves",
  "Richard EIke",
  "Milena Gonçalves",
  "Mirella Ramos",
  "Patrícia da França",
  "Pyetro Coelho",
  "Rafaella Alves",
  "Sofia Dutra",
  "Thallys Monteiro",
  "Ygorvde Castro",
  "Pedro Lucas",
  "Thayna de Araújo",
  "Ana Luíza Guedes",
  "Isaías Alexsander",
  "João Gabriel",
  "José Bernardo",
  "Júlia Franco",
  "Júlia Melo",
  "Luca Ávila",
  "Juliana Monteiro",
  "Safira de Aguiar"
];

const createStudents = (rawList: string[], classId: string) => {
  return rawList.map((name, i) => {
    const attendance: { [date: string]: 'P' | 'F' | null } = {};
    
    // Frequência de 09/03 para a Turma 603
    if (classId === '603') {
      const present603 = [
        "Alicia Vitória Silva dos Santos",
        "Arnaldo Barbosa Vilaça Junior",
        "Arthur Coutinho Oliveira",
        "Arthur Nogueira Pinto da Silva",
        "Beatriz Vidal Machado",
        "Breno Henrique Souza de Oliveira",
        "Catarina Santiago Martins",
        "Davi Lucca Duarte Bastos",
        "Fábiolla Gabryella Bach do Rosário Pereira",
        "Gabriel Costa de Azevedo"
      ];
      const absent603 = [
        "Fabiano Rocha de Oliveira Júnior",
        "Fernanda Isaías",
        "João Miguel Henriques Brum"
      ];
      
      if (present603.includes(name)) attendance["09/03"] = "P";
      if (absent603.includes(name)) attendance["09/03"] = "F";
    }

    // Frequência de 09/03 para a Turma 604
    if (classId === '604') {
      const present604 = [
        "Manuela da Silva Gomes",
        "Arthur Mendonça da Silva",
        "Laura Neves",
        "Patrícia da França Gomes dos Santos",
        "Pyetro Coelho Santana",
        "Rafaela Alves Freitas Passos"
      ];
      const absent604 = [
        "Sthefany Vitória Valadares Neves da Silva",
        "Paulo Sérgio Batista de Souza",
        "Nina Pacheco Dias da Silva",
        "Isaque Oliveira Matos dos Santos",
        "Richard EIke",
        "Milena Gonçalves Rodrigues",
        "Mirella Ramos dos Santos Gomes"
      ];
      
      if (present604.includes(name)) attendance["09/03"] = "P";
      if (absent604.includes(name)) attendance["09/03"] = "F";
    }

    return {
      id: parseInt(classId) * 100 + i,
      name: name,
      attendance: attendance
    };
  });
};

export const initialClassData: ClassDataMap = {
  "801": { 
    id: "801", 
    name: "Turma 801", 
    grade: "8", 
    school: "EE Cordelia Paiva",
    students: [],
    schedule: "10:35 – 12:15",
    days: ["Segunda"]
  },
  "802": { 
    id: "802", 
    name: "Turma 802", 
    grade: "8", 
    school: "EE Cordelia Paiva",
    students: [],
    schedule: "07:00 – 08:40",
    days: ["Segunda"]
  },
  "803": { 
    id: "803", 
    name: "Turma 803", 
    grade: "8", 
    school: "EE Cordelia Paiva",
    students: [],
    schedule: "08:40 – 10:20",
    days: ["Segunda"]
  },
  "CIEP198_AP101": { 
    id: "CIEP198_AP101", 
    name: "AP 101", 
    grade: "1", 
    school: "CIEP 198",
    students: [],
    schedule: "13:35 – 15:15",
    days: ["Segunda"]
  },
  "EUCLIDES_I01": { 
    id: "EUCLIDES_I01", 
    name: "EJANEM I01", 
    grade: "EJA", 
    school: "Colégio Estadual Euclides da Cunha",
    students: [],
    schedule: "20:45 – 22:25",
    days: ["Segunda"]
  },
  "CIEP320_AP101": { 
    id: "CIEP320_AP101", 
    name: "AP 101", 
    grade: "1", 
    school: "CIEP 320",
    students: [
      { id: 10101, name: "Ana Clara", attendance: { "08/05": "P" } },
      { id: 10102, name: "Benjamin Luccas", attendance: { "08/05": "P" } },
      { id: 10103, name: "Diego Rafael", attendance: { "08/05": "P" } },
      { id: 10104, name: "Ester Silis", attendance: { "08/05": "P" } },
      { id: 10105, name: "Everson Lima", attendance: { "08/05": "P" } },
      { id: 10106, name: "Gabriel Lima", attendance: { "08/05": "P" } },
      { id: 10107, name: "Ícaro Martins", attendance: { "08/05": "P" } },
      { id: 10108, name: "Lucas Gabriel", attendance: { "08/05": "P" } },
      { id: 10109, name: "Lucas Rodrigues", attendance: { "08/05": "P" } },
      { id: 10110, name: "Miguel Ângelo", attendance: { "08/05": "P" } },
      { id: 10111, name: "Milena Vitória", attendance: { "08/05": "P" } },
      { id: 10112, name: "Natan Galvão", attendance: { "08/05": "P" } },
      { id: 10113, name: "Pedro Henrique", attendance: { "08/05": "P" } },
      { id: 10114, name: "Walbert Leonardo", attendance: { "08/05": "P" } }
    ],
    schedule: "07:00 – 08:40",
    days: ["Sexta"]
  },
  "CIEP320_AP301": { 
    id: "CIEP320_AP301", 
    name: "AP 301", 
    grade: "3", 
    school: "CIEP 320",
    students: [],
    schedule: "12:45 - 14:25",
    days: ["Sexta"]
  },
  "CIEP476_1001": { 
    id: "CIEP476_1001", 
    name: "Turma 1001", 
    grade: "1", 
    school: "CIEP 476",
    students: [],
    schedule: "10:35 - 12:15",
    days: ["Sexta"]
  },
  "CIEP476_1003": { 
    id: "CIEP476_1003", 
    name: "Turma 1003", 
    grade: "1", 
    school: "CIEP 476",
    students: [],
    schedule: "08:40 – 10:20",
    days: ["Sexta"]
  },
  "CIEP476_1007": { 
    id: "CIEP476_1007", 
    name: "Turma 1007", 
    grade: "1", 
    school: "CIEP 476",
    students: [],
    schedule: "19:40 – 21:20",
    days: ["Sexta"]
  }
};

export const initialClassificationData: ClassificationDataMap = {
  "611": {
    name: "Ranking Geral",
    students: [
      { position: "1º", name: "Isabella Teixeira", points: "5", wins: 4, losses: 0, draws: 2 },
      { position: "2º", name: "Davi Lucca", points: "4,5", wins: 4, losses: 0, draws: 1 },
      { position: "3º", name: "Alice Caldeira", points: "4", wins: 3, losses: 1, draws: 2 },
    ]
  }
};

export const mockUserProfile: UserProfile = {
  id: "user_123",
  name: "André Brito",
  email: "andre.brito@escola.com",
  elo: 1450,
  gamesPlayed: 124,
  wins: 68,
  losses: 42,
  draws: 14,
  joinedAt: "Fev 2024",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andre",
  recentGames: [
    { id: '1', date: '12/mar', opponent: 'Carlos Silva', result: 'win', moves: 24 },
    { id: '2', date: '10/mar', opponent: 'Davi Lucca', result: 'loss', moves: 32 },
    { id: '3', date: '08/mar', opponent: 'Ana Clara', result: 'draw', moves: 45 },
  ],
  achievements: [
    { id: '1', title: 'Mestre da Estratégia', description: 'Venceu 50 partidas', icon: '🏆' },
    { id: '2', title: 'Foco Total', description: 'Fez 100% nas atividades', icon: '🎯' },
    { id: '3', title: 'Sempre Presente', description: 'Nenhuma falta em 1 mês', icon: '✅' },
  ]
};
