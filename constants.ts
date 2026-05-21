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
    students: [
      { id: 80101, name: "Alice Vitória Rosa de Sales Ramos", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80102, name: "Ana Cristina Silva Pereira", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80103, name: "Ana Luiza da Costa Martins", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80104, name: "Ana Luiza Rodrigues da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80105, name: "Ana Vitória Farias Correa", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80106, name: "André Nunes da Silva Lopes", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80107, name: "Andressa da Silva Vieira", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80108, name: "Andrey de Sousa Santos", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80109, name: "Angelliny de Oliveira Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80110, name: "Anna Beatriz Souza Lima", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80111, name: "Anna Karolinny Souza Lima", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80112, name: "Bianca Santos de Souza Oliveira", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80113, name: "Camili Oliveira Batista", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80114, name: "Carolina Caldas Souza", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80115, name: "Cauã Victor Nobre de Oliveira Lins", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80116, name: "Davi Moura da Cruz", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80117, name: "Davi Sousa Santos da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80118, name: "Enzo José Jardim Augusto", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80119, name: "Ezequiel Lima de Oliveira", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80120, name: "Fernanda Honorato Sabino da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80121, name: "Gabrieli de Barros Caiana", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80122, name: "Gabrielly Lima da Silva", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80123, name: "Geovana Fernandes R. de Andrade", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80124, name: "Giovanna Kaylane Gonçalves Godoy", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80125, name: "Guilherme Santos de Jesus", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80126, name: "Gustavo Nascimento de Jesus", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80127, name: "Hashelly Letícia B. dos Santos", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80128, name: "Miguel de Souza R. do Nascimento", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80129, name: "Nicolly Baptista do Nascimento", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80130, name: "Richard Josafá V. B. T. Augusto", attendance: { "08/05": "P", "18/05": "P" } }
    ],
    schedule: "10:35 – 12:15",
    days: ["Segunda"]
  },
  "802": { 
    id: "802", 
    name: "Turma 802", 
    grade: "8", 
    school: "EE Cordelia Paiva",
    students: [
      { id: 802001, name: "Henzo Martins da Silva Evangelista", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802002, name: "Isabella Ribeiro Gomes", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802003, name: "Isabella Vitoria Correa Pereira", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802004, name: "Isabelly Lopes do Nascimento", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802005, name: "Jhully Victoria C. S. Oliveira", attendance: { "11/05": "F", "18/05": "P" } },
      { id: 802006, name: "João Davi Gomes Pereira", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802007, name: "João Gabriel Alves da Costa", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802008, name: "João Marcos Oliveira Ribeiro", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802009, name: "Julia Oliveira da Silva", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802010, name: "Juliana Arueira Luparelli", attendance: { "11/05": "F", "18/05": "P" } },
      { id: 802011, name: "Kaique Cruz Gonçalves Damião", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802012, name: "Kevin Gabriel Gomes da Silva", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802013, name: "Lara Maria de Sousa Soares", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802014, name: "Lara Monteiro dos Santos", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802015, name: "Lara Vieira de Andrade", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802016, name: "Lavinnya de Souza de Araújo", attendance: { "11/05": "F", "18/05": "F" } },
      { id: 802017, name: "Laysa Ambrozio Claudio", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802018, name: "Leticia Costa Santos", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802019, name: "Livia Duarte Soares de Lima", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802020, name: "Livia Fernandes Gaiani", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802021, name: "Luis Fernando Amorim de Deus", attendance: { "11/05": "P", "18/05": "F" } },
      { id: 802022, name: "Manuela Figueiredo da Silva", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802023, name: "Manuela Ribeiro dos Santos", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802024, name: "Manuella Magalhães Martins", attendance: { "11/05": "F", "18/05": "P" } },
      { id: 802025, name: "Maria Rita de Jesus Sergio", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802026, name: "Mellyna Santos Spatafora", attendance: { "11/05": "P", "18/05": "P" } },
      { id: 802027, name: "Sophia Oliveira Ribeiro", attendance: { "11/05": "P", "18/05": "P" } }
    ],
    schedule: "07:00 – 08:40",
    days: ["Segunda"]
  },
  "803": { 
    id: "803", 
    name: "Turma 803", 
    grade: "8", 
    school: "EE Cordelia Paiva",
    students: [
      { id: 80301, name: "Adrieli Vitória dos Santos da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80302, name: "Ana Clara de Jesus Pereira", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80303, name: "Danilo Ribeiro Feliciano", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80304, name: "Esther Nunes da Costa", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80305, name: "Felipe Santos Vital Guimarães", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80306, name: "Ítalo Silva de Almeida", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80307, name: "João Paulo Lima da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80308, name: "Matheus Araujo da Silva", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80309, name: "Matheus Severiano Galdino da Silva", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80310, name: "Micaella Moraes Lourenço da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80311, name: "Micaelly Vitória Alves de França", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80312, name: "Miguel Lucas Vicente Gomes", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80313, name: "Milena Vitória Tavares de Jesus", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80314, name: "Nicole Archanjo Santos", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80315, name: "Pedro Henryk dos Santos Coelho", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80316, name: "Pietro Vitor Santos Braga", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80317, name: "Rafaela Lourenço da Silva Camilo", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80318, name: "Rafaelle dos Santos Almeida", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80319, name: "Ray Bomfim Pereira", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80320, name: "Richard Reis Costa", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80321, name: "Riquelme Oliveira Carlos", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80322, name: "Roberta Flôr de Liz Araujo da Silva", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80323, name: "Ryan Lucas Soares Velasco", attendance: { "08/05": "P", "18/05": "F" } },
      { id: 80324, name: "Sarah Rafaela de Souza Ferreira", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80325, name: "Sofia Nascimento de Araujo", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80326, name: "Sophia Quaresma Jeronymo", attendance: { "08/05": "P", "18/05": "P" } },
      { id: 80327, name: "Vitor Manoel Gomes da Silva", attendance: { "08/05": "P", "18/05": "P" } }
    ],
    schedule: "08:40 – 10:20",
    days: ["Segunda"]
  },
  "CIEP198_AP101": { 
    id: "CIEP198_AP101", 
    name: "AP 101", 
    grade: "1", 
    school: "CIEP 198",
    students: [],
    assignments: [{ id: "A1", title: "O Corpo na Mídia - Estereótipo vs. Realidade", discipline: "Educação Física", description: "Pesquisa sobre como corpos negros e periféricos são vistos na mídia.", totalPoints: 3, format: "Individual ou dupla", dueDate: "22/05/2026" }],
    schedule: "13:35 – 15:15",
    days: ["Segunda"]
  },
  "EUCLIDES_I01": { 
    id: "EUCLIDES_I01", 
    name: "EJANEM I01", 
    grade: "EJA", 
    school: "Colégio Estadual Euclides da Cunha",
    students: [],
    assignments: [{ id: "A1", title: "O Corpo na Mídia - Estereótipo vs. Realidade", discipline: "Educação Física", description: "Pesquisa sobre como corpos negros e periféricos são vistos na mídia.", totalPoints: 3, format: "Individual ou dupla", dueDate: "22/05/2026" }],
    schedule: "20:45 – 22:25",
    days: ["Segunda"]
  },
  "CIEP320_AP101": { 
    id: "CIEP320_AP101", 
    name: "AP 101", 
    grade: "1", 
    school: "CIEP 320",
    students: [
      { id: 10107, name: "Danyelle Thomaz Canêdo", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10106, name: "Diego Rafael da Silva Zan Pires", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10120, name: "Emylly Vitória Nascimento dos Santos", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10116, name: "Enzo de Jesus Rodrigues", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10113, name: "Ester Senes Magela", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10109, name: "Heverton Lima Xavier", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10108, name: "Ícaro Martins França", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10115, name: "Kevin Lucas Oliveira dos Santos", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10104, name: "Lucas Gabryel da Silva Nascimento", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10105, name: "Lucas Rodrigues da Silva Lima", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10123, name: "Maria Tayryne de Souza de Lima", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10103, name: "Micaelly Avolio Falsetta", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10102, name: "Millena Vitoria da Silva Jesus", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10110, name: "Nathan Galvão Bastos", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10119, name: "Nayara Vytorya dos Santos", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10101, name: "Sophia Lourenço da Silva", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10111, name: "Walbert Leonardo Lima Novaes", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10118, name: "Yuri da Silva Ribeiro", attendance: { "15/05": "P", "08/05": "P" } },
      { id: 10112, name: "Yuri Ryan Jesus Nascimento", attendance: { "15/05": "P", "08/05": "P" } }
    ],
    assignments: [{ id: "A1", title: "O Corpo na Mídia - Estereótipo vs. Realidade", discipline: "Educação Física", description: "Pesquisa sobre como corpos negros e periféricos são vistos na mídia.", totalPoints: 3, format: "Individual ou dupla", dueDate: "22/05/2026" }],
    schedule: "07:00 – 08:40",
    days: ["Sexta"]
  },
  "CIEP320_AP301": { 
    id: "CIEP320_AP301", 
    name: "AP 301", 
    grade: "3", 
    school: "CIEP 320",
    students: [
      { id: 30101, name: "Ana Karollina Silva Ávila", attendance: { "15/05": "P" } },
      { id: 30102, name: "Breno Carneiro Roque da Cruz", attendance: { "15/05": "F" } },
      { id: 30103, name: "Emilly Souza Lima", attendance: { "15/05": "F" } },
      { id: 30104, name: "Gabriel Costa Santana", attendance: { "15/05": "F" } },
      { id: 30105, name: "Iuri Klinger Soares dos Santos", attendance: { "15/05": "F" } },
      { id: 30106, name: "Kaio Klinger Soares dos Santos", attendance: { "15/05": "F" } },
      { id: 30107, name: "Kaylanne Ribeiro Canuto", attendance: { "15/05": "P" } },
      { id: 30108, name: "Leonardo Kauã Oliveira de Paiva", attendance: { "15/05": "P" } },
      { id: 30109, name: "Lorena Ribeiro de Almeida", attendance: { "15/05": "F" } },
      { id: 30110, name: "Luiz André Lima Bezerra", attendance: { "15/05": "P" } },
      { id: 30111, name: "Marcelly Gomes Serra", attendance: { "15/05": "F" } },
      { id: 30112, name: "Maria Alyndy Lopes da Cunha", attendance: { "15/05": "F" } },
      { id: 30113, name: "Rodrigo Rafael Silva de Oliveira", attendance: { "15/05": "P" } },
      { id: 30114, name: "Ryan Bruno Arcanjo da Cruz", attendance: { "15/05": "P" } }
    ],
    schedule: "12:45 - 14:25",
    days: ["Sexta"]
  },
  "CIEP476_1001": { 
    id: "CIEP476_1001", 
    name: "Turma 1001", 
    grade: "1", 
    school: "CIEP 476",
    students: [
      { id: 100101, name: "Ana Carolina Pereira Silva", attendance: { "15/05": "P" } },
      { id: 100102, name: "Andrey Vinicius Santos Marques", attendance: { "15/05": "P" } },
      { id: 100105, name: "Beatriz Barbosa de Souza", attendance: { "15/05": "F" } },
      { id: 100103, name: "Davi Lemes Wandermurem", attendance: { "15/05": "P" } },
      { id: 100104, name: "Geovanna Martins Xavier", attendance: { "15/05": "F" } },
      { id: 100106, name: "Gustavo do Couto dos Santos", attendance: { "15/05": "P" } },
      { id: 100107, name: "Isabella Pereira", attendance: { "15/05": "P" } },
      { id: 100108, name: "Jarllan Abraão Lima da Silva", attendance: { "15/05": "P" } },
      { id: 100109, name: "João Ricardo de Sousa", attendance: { "15/05": "P" } },
      { id: 100110, name: "Kaike dos Santos Ferreira", attendance: { "15/05": "P" } },
      { id: 100111, name: "Kauan Lima Gomes", attendance: { "15/05": "P" } },
      { id: 100112, name: "Leonardo Mendes", attendance: { "15/05": "P" } },
      { id: 100113, name: "Lívia Pereira Santos", attendance: { "15/05": "P" } },
      { id: 100114, name: "Luiz Henrique Amaral Affonso", attendance: { "15/05": "P" } },
      { id: 100115, name: "Mariana Goulart da Conceição", attendance: { "15/05": "P" } },
      { id: 100116, name: "Miguel Bastos", attendance: { "15/05": "P" } },
      { id: 100117, name: "Milena Simões Pontife", attendance: { "15/05": "P" } },
      { id: 100118, name: "Mylena Santos Alves Duque", attendance: { "15/05": "F" } },
      { id: 100119, name: "Pedro Henrique Teixeira da Rocha", attendance: { "15/05": "P" } },
      { id: 100120, name: "Richard da Silva", attendance: { "15/05": "P" } },
      { id: 100121, name: "Samuel Carvalho Vieira", attendance: { "15/05": "P" } },
      { id: 100122, name: "Victor Hugo de Oliveira Carvalho", attendance: { "15/05": "P" } },
      { id: 100123, name: "Walison Teixeira Ribeiro", attendance: { "15/05": "P" } },
      { id: 100124, name: "Yuri da Silva Ferreira", attendance: { "15/05": "P" } }
    ],
    assignments: [{ id: "A1", title: "O Corpo na Mídia - Estereótipo vs. Realidade", discipline: "Educação Física", description: "Pesquisa sobre como corpos negros e periféricos são vistos na mídia.", totalPoints: 3, format: "Individual ou dupla", dueDate: "22/05/2026" }],
    schedule: "10:35 - 12:15",
    days: ["Sexta"]
  },
  "CIEP476_1003": { 
    id: "CIEP476_1003", 
    name: "Turma 1003", 
    grade: "1", 
    school: "CIEP 476",
    students: [],
    assignments: [{ id: "A1", title: "O Corpo na Mídia - Estereótipo vs. Realidade", discipline: "Educação Física", description: "Pesquisa sobre como corpos negros e periféricos são vistos na mídia.", totalPoints: 3, format: "Individual ou dupla", dueDate: "22/05/2026" }],
    schedule: "08:40 – 10:20",
    days: ["Sexta"]
  },
  "CIEP476_1007": { 
    id: "CIEP476_1007", 
    name: "Turma 1007", 
    grade: "1", 
    school: "CIEP 476",
    students: [],
    assignments: [{ id: "A1", title: "O Corpo na Mídia - Estereótipo vs. Realidade", discipline: "Educação Física", description: "Pesquisa sobre como corpos negros e periféricos são vistos na mídia.", totalPoints: 3, format: "Individual ou dupla", dueDate: "22/05/2026" }],
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
