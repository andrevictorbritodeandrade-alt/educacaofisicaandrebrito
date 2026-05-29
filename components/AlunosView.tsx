import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassDataMap } from '../types';
import { PE_PLAN } from '../data/planosPE';
import { AI_SUMMARIES } from '../data/materiaisApoio';

interface AlunosViewProps {
  onBack: () => void;
  classData: ClassDataMap;
}

const TURMAS_ALUNOS = [
  { id: 'cordelia', title: '801 - 802 - 803', school: 'Cordélia Paiva' },
  { id: 'ciep198', title: 'AP 101', school: 'CIEP 198' },
  { id: 'ciep320', title: 'AP 101 e 301', school: 'CIEP 320' },
  { id: 'ciep476', title: 'ILGCH 1001 - 1003 - 1007', school: 'CIEP 476' },
];

export const AlunosView: React.FC<AlunosViewProps> = ({ onBack, classData }) => {
  const [selectedTurma, setSelectedTurma] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<{title: string, date: string, content: string} | null>(null);

  // Mapeia data de aulas (simulação com base em dados de planejamento)
  const getMateriaisLiberados = (turmaId: string) => {
    const agora = new Date('2026-05-28T23:59:59Z'); // Fixando a data de hoje baseado no contexto
    
    let planKey = '8ano';
    if (turmaId === 'ciep198') planKey = 'ap';
    if (turmaId === 'ciep320') planKey = 'ap_sexta';
    if (turmaId === 'ciep476') planKey = 'ilgch';
    
    let planos = PE_PLAN[planKey] || [];

    const baseClasses = planos.filter(p => {
        const lowerTitle = p.titulo.toLowerCase();
        const lowerModulo = p.modulo.toLowerCase();
        const lowerDesc = p.desc.toLowerCase();
        const isExcluded = lowerModulo.includes('prática') || 
                           lowerModulo.includes('apresentação') || 
                           lowerModulo.includes('trabalho') ||
                           lowerModulo.includes('avaliação') || 
                           lowerModulo.includes('recuperação') || 
                           lowerModulo.includes('torneio') ||
                           lowerModulo.includes('competição') ||
                           lowerTitle.includes('prática') || 
                           lowerTitle.includes('apresentação') || 
                           lowerTitle.includes('avaliação') ||
                           lowerTitle.includes('recuperação') ||
                           lowerDesc.includes('aula prática') ||
                           lowerDesc.includes('apresentação');
        return !isExcluded && p.resumo && p.resumo.trim() !== '';
    }).map((p, index) => {
        const parts = p.data.split('/');
        // Padronizando para 2026.
        const lessonDate = new Date(`2026-${parts[1]}-${parts[0]}T12:00:00Z`);
        return {
            id: index + 1,
            title: p.titulo,
            date: lessonDate.toISOString(),
            content: AI_SUMMARIES[p.titulo] || p.resumo
        };
    });

    return baseClasses.filter(c => new Date(c.date) <= agora);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#111] overflow-y-auto w-full h-full pb-20 print:bg-white print:text-black">
      {/* Header Alunos */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => selectedMaterial ? setSelectedMaterial(null) : (selectedTurma ? setSelectedTurma(null) : onBack())}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Portal do Aluno</h1>
            {selectedTurma && <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{TURMAS_ALUNOS.find(t => t.id === selectedTurma)?.title}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto p-6 md:p-8 flex-1">
        
        <AnimatePresence mode="wait">
          {!selectedTurma ? (
            <motion.div
              key="turmas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="col-span-full mb-6">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Selecione sua Turma</h2>
                <p className="text-slate-400 font-medium">Acesse resumos, anotações de aula e materiais de estudo para recuperação/provas teóricas.</p>
              </div>
              
              {TURMAS_ALUNOS.map((turma) => (
                <button
                  key={turma.id}
                  onClick={() => setSelectedTurma(turma.id)}
                  className="bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 p-6 rounded-2xl flex flex-col text-left transition-all duration-300 group"
                >
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 group-hover:text-emerald-400/70">{turma.school}</span>
                  <span className="text-2xl font-black text-white">{turma.title}</span>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] bg-white/10 text-white px-2 py-1 rounded font-mono">Acesso aos Materiais</span>
                    <svg className="w-5 h-5 text-white/30 group-hover:text-emerald-400 transform group-hover:translate-x-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : !selectedMaterial ? (
             <motion.div
              key="materiais"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Material de Apoio</h2>
                <p className="text-slate-400 font-medium">Estudos liberados com base no progresso das aulas dadas até o momento.</p>
              </div>

              <div className="space-y-3">
                {getMateriaisLiberados(selectedTurma).length === 0 ? (
                  <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center">
                    <p className="text-white/40 font-medium">Nenhum material liberado para esta turma até o momento.</p>
                  </div>
                ) : (
                  getMateriaisLiberados(selectedTurma).map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat)}
                      className="w-full bg-white/5 border border-white/10 hover:bg-white/10 p-5 rounded-2xl flex items-center justify-between text-left transition-colors"
                    >
                      <div>
                        <p className="text-[10px] font-mono text-emerald-400 mb-1">AULA DATA: {new Date(mat.date).toLocaleDateString('pt-BR')} • {mat.id < 4 ? "LEITURA RECOMENDADA" : "NOVO"}</p>
                        <h3 className="text-base font-bold text-white">{mat.title}</h3>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl ml-4 shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
             <motion.div
              key="post"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl print:shadow-none print:p-0"
            >
              <div className="flex items-center justify-between mb-8 print:hidden">
                <p className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">DOCUMENTO OFICIAL DE REVISÃO</p>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-2 rounded-full font-bold text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir / PDF
                </button>
              </div>

              <div className="print:block">
                <div className="border-b-2 border-slate-900 pb-4 mb-8">
                   <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">{selectedMaterial.title}</h1>
                   <div className="flex gap-4 text-sm font-bold text-slate-500">
                     <p>Prof. André Brito</p>
                     <p>•</p>
                     <p>Data: {new Date(selectedMaterial.date).toLocaleDateString('pt-BR')}</p>
                     <p>•</p>
                     <p>{TURMAS_ALUNOS.find(t => t.id === selectedTurma)?.title}</p>
                   </div>
                </div>

                <div 
                  className="prose prose-slate prose-lg max-w-none 
                    prose-h1:text-2xl prose-h1:font-black prose-h1:text-slate-900 prose-h1:mb-4
                    prose-h2:text-xl prose-h2:font-bold prose-h2:text-slate-800 prose-h2:mt-8
                    prose-p:text-slate-700 prose-p:leading-relaxed
                    prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-li:text-slate-700
                    prose-strong:text-slate-900
                  "
                  dangerouslySetInnerHTML={{
                    __html: selectedMaterial.content
                      .replace(/^#\s(.*?)$/gm, '<h1>$1</h1>')
                      .replace(/^##\s(.*?)$/gm, '<h2>$1</h2>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/^- (.*?)$/gm, '<li>$1</li>')
                      .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/^((?!<[hu]|<li).+)$/gm, '<p>$1</p>')
                  }}
                />

                <div className="mt-16 pt-8 border-t border-slate-200 text-center print:mt-10">
                   <p className="text-xs text-slate-500 font-medium">
                     Este material é um resumo didático para fins de estudo das turmas especificadas. <br/>
                     © {new Date().getFullYear()} - Educação Física SEEDUC-RJ.
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
