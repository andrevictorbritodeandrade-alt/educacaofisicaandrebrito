
export interface AulaPlan {
    data: string;
    titulo: string;
    desc: string;
    tipo: 'normal' | 'prova' | 'segunda_chamada' | 'recuperacao';
}

export const PE_PLAN: Record<string, AulaPlan[]> = {
    '8ano': [
        // ... (conteúdo do 8ano)
        { data: '25/05', titulo: 'Aprofundamento BNCC: Esportes e Inclusão', desc: 'Introdução ao trimestre.', tipo: 'normal' },
        { data: '17/08', titulo: 'Data da Prova 1', desc: 'Avaliação teórica/prática.', tipo: 'prova' },
        { data: '24/08', titulo: 'Aula Normal + Segunda Chamada', desc: 'Conteúdo do 3º tri.', tipo: 'segunda_chamada' },
        { data: '31/08', titulo: 'Recuperação 2º Tri', desc: 'Sem matéria nova.', tipo: 'recuperacao' },
        { data: '16/11', titulo: 'Data da Prova 2', desc: 'Avaliação teórica/prática.', tipo: 'prova' },
        { data: '23/11', titulo: 'Aula Normal + Segunda Chamada', desc: 'Conteúdo final.', tipo: 'segunda_chamada' },
        { data: '30/11', titulo: 'Recuperação 3º Tri', desc: 'Sem matéria nova.', tipo: 'recuperacao' },
    ],
    'ap': [
        // Copiando o conteúdo do 8ano para AP
        { data: '25/05', titulo: 'Aprofundamento BNCC: Esportes e Inclusão', desc: 'Introdução ao trimestre.', tipo: 'normal' },
        { data: '17/08', titulo: 'Data da Prova 1', desc: 'Avaliação teórica/prática.', tipo: 'prova' },
        { data: '24/08', titulo: 'Aula Normal + Segunda Chamada', desc: 'Conteúdo do 3º tri.', tipo: 'segunda_chamada' },
        { data: '31/08', titulo: 'Recuperação 2º Tri', desc: 'Sem matéria nova.', tipo: 'recuperacao' },
        { data: '16/11', titulo: 'Data da Prova 2', desc: 'Avaliação teórica/prática.', tipo: 'prova' },
        { data: '23/11', titulo: 'Aula Normal + Segunda Chamada', desc: 'Conteúdo final.', tipo: 'segunda_chamada' },
        { data: '30/11', titulo: 'Recuperação 3º Tri', desc: 'Sem matéria nova.', tipo: 'recuperacao' },
    ],
    'ejanem': [
        // ... (conteúdo do ejanem)
        { data: '25/05', titulo: 'BNCC: Saúde do Trabalhador', desc: 'Introdução ao trimestre.', tipo: 'normal' },
        { data: '17/08', titulo: 'Data da Prova 1', desc: 'Avaliação.', tipo: 'prova' },
        { data: '24/08', titulo: 'Aula Normal + Segunda Chamada', desc: 'Conteúdo.', tipo: 'segunda_chamada' },
        { data: '31/08', titulo: 'Recuperação 2º Tri', desc: 'Sem matéria nova.', tipo: 'recuperacao' },
        { data: '16/11', titulo: 'Data da Prova 2', desc: 'Avaliação.', tipo: 'prova' },
        { data: '23/11', titulo: 'Aula Normal + Segunda Chamada', desc: 'Conteúdo.', tipo: 'segunda_chamada' },
        { data: '30/11', titulo: 'Recuperação 3º Tri', desc: 'Sem matéria nova.', tipo: 'recuperacao' },
    ]
};
