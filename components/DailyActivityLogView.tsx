import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ClassDataMap, ClassData, DailyActivity } from '../types';

interface DailyActivityLogProps {
  classData: ClassDataMap;
  onBack: () => void;
  setClassData: (data: ClassDataMap) => void;
  onSave: (data: ClassDataMap) => void;
}

export const formatAndCorrectPortuguese = (text: string): string => {
  if (!text) return '';
  
  let formatted = text.trim();
  
  // Extended Portuguese shorthand and common typo replacement map (standard Portuguese)
  const replacements: [RegExp, string][] = [
    [/\bpq\b/gi, 'porque'],
    [/\bvc\b/gi, 'você'],
    [/\btd\b/gi, 'tudo'],
    [/\btb\b/gi, 'também'],
    [/\btbm\b/gi, 'também'],
    [/\bhj\b/gi, 'hoje'],
    [/\bqnd\b/gi, 'quando'],
    [/\bqq\b/gi, 'qualquer'],
    [/\bmsm\b/gi, 'mesmo'],
    [/\bnao\b/gi, 'não'],
    [/\bnet\b/gi, 'internet'],
    [/\bpro\b/gi, 'para o'],
    [/\bpra\b/gi, 'para a'],
    [/\bta\b/gi, 'está'],
    [/\bteorica\b/gi, 'teórica'],
    [/\bteorico\b/gi, 'teórico'],
    [/\bpratica\b/gi, 'prática'],
    [/\bpratico\b/gi, 'prático'],
    [/\bconteudo\b/gi, 'conteúdo'],
    [/\bconhecer as turmas\b/gi, 'conhecer as turmas'],
    [/\bsala de jogos\b/gi, 'Sala de Jogos'],
  ];

  // Apply substitutions preserving casing style (Upper, Capitalized, Lower)
  replacements.forEach(([pattern, val]) => {
    formatted = formatted.replace(pattern, (match) => {
      if (match === match.toUpperCase()) return val.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return val.charAt(0).toUpperCase() + val.slice(1);
      return val;
    });
  });

  // Standardize punctuation spacing (remove double spaces, correct spaces before/after punctuation)
  formatted = formatted
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/\s+([.,!?;:])\s*/g, '$1 ') // Ensure no spaces before punctuation, exactly one space after
    .trim();

  // Highlight paragraph/sentence boundaries and capitalize first letter of each sentence
  const sentences = formatted.split(/([.!?]\s+)/);
  formatted = sentences.map((segment, idx) => {
    // If it's a separator, return as is
    if (idx % 2 === 1) return segment;
    if (!segment) return '';
    // Capitalize the first non-whitespace character
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }).join('');

  // Capitalize very first character just in case
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Ensure standard final punctuation if missing
  if (formatted.length > 0 && !/[.!?]$/.test(formatted)) {
    formatted += '.';
  }

  return formatted;
};

export const DailyActivityLogView: React.FC<DailyActivityLogProps> = ({ classData, onBack, setClassData, onSave }) => {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [recordDate, setRecordDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [actual, setActual] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const schools = useMemo(() => Array.from(new Set(Object.values(classData).map((c: ClassData) => c.school).filter(Boolean))), [classData]);
  const classesInSchool = useMemo(() => Object.values(classData).filter((c: ClassData) => c.school === selectedSchool && c.id), [classData, selectedSchool]);

  const handleSave = () => {
    if (!selectedClassId) return;
    if (!actual.trim()) {
      alert("Por favor, digite a atividade realizada antes de salvar.");
      return;
    }
    
    // Apply corrections and standard Portuguese formatting
    const correctedActivity = formatAndCorrectPortuguese(actual);

    const newEntry: DailyActivity = {
      id: Date.now().toString(),
      date: new Date(recordDate + 'T12:00:00').toISOString(), // Use noon to avoid timezone shifts
      plannedActivity: '',
      actualActivity: correctedActivity,
      observations: ''
    };

    const newData = {
      ...classData,
      [selectedClassId]: {
        ...classData[selectedClassId],
        dailyActivities: [...(classData[selectedClassId].dailyActivities || []), newEntry]
      }
    };
    setClassData(newData);
    onSave(newData);
    setActual('');
    alert("Registro salvo e corrigido para o português padrão!");
  };

  const handleDelete = (entryId: string) => {
    if (!window.confirm("Deseja realmente excluir este registro do histórico?")) return;
    
    const filtered = (selectedClass?.dailyActivities || []).filter(a => a.id !== entryId);
    const newData = {
      ...classData,
      [selectedClassId]: {
        ...classData[selectedClassId],
        dailyActivities: filtered
      }
    };
    setClassData(newData);
    onSave(newData);
  };

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(printContainerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;
      
      const margin = 12;
      const contentWidth = pdfWidth - (2 * margin);
      const contentHeight = contentWidth / ratio;
      
      let heightLeft = contentHeight;
      let position = margin;
      
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - 2 * margin);
      
      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - 2 * margin);
      }
      
      const sanitizedSchool = selectedClass.school.toUpperCase().replace(/\s/g, '_');
      const sanitizedClass = selectedClass.name.toUpperCase().replace(/\s/g, '_');
      pdf.save(`DIARIO_DE_CLASSE_${sanitizedSchool}_${sanitizedClass}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o diário escolar em PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const selectedClass = classData[selectedClassId];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl">
      <button 
        onClick={onBack} 
        className="mb-4 px-5 py-2.5 bg-white hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-full font-bold transition-all shadow-md flex items-center w-fit active:scale-95"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Voltar ao Menu
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Registro Diário de Aula</h2>
          <p className="text-sm text-slate-500">Registre o conteúdo que você ministrou para cada turma de forma rápida.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            className="p-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500 outline-none shadow-sm text-sm" 
            value={selectedSchool} 
            onChange={(e) => {setSelectedSchool(e.target.value); setSelectedClassId('');}}
          >
            <option key="default-school-opt" value="">Selecionar Escola</option>
            {schools.map(s => <option key={`school-opt-${s}`} value={s}>{s}</option>)}
          </select>
          
          <select 
            className="p-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500 outline-none shadow-sm text-sm" 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            disabled={!selectedSchool}
          >
            <option key="default-class-opt" value="">Selecionar Turma</option>
            {classesInSchool.map(c => <option key={`class-opt-${c.id}`} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {selectedClass ? (
        <div className="space-y-6">
          <div className="bg-[#f4ece0] p-6 rounded-2xl border border-slate-300 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Novo Registro para a {selectedClass.name} - {selectedClass.school}
            </h3>

            <div className="grid md:grid-cols-3 gap-4 xl:gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase">Dia da Aula</label>
                <input 
                  type="date" 
                  className="p-3 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-sky-500 outline-none w-full shadow-sm" 
                  value={recordDate} 
                  onChange={e => setRecordDate(e.target.value)} 
                />
                <p className="text-[10px] text-slate-500 leading-snug">Registrado automaticamente com o dia de hoje. Ajuste se a aula ocorreu em outro dia.</p>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase">Atividade Realizada (Conteúdo Ministrado)</label>
                <textarea 
                  className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-800 h-28 focus:ring-2 focus:ring-sky-500 outline-none shadow-sm font-medium" 
                  placeholder="Ex: Introdução ao passe do Futevôlei e posicionamento na rede..." 
                  value={actual} 
                  onChange={e => setActual(e.target.value)} 
                />
                <p className="text-[10px] text-sky-700 italic font-bold leading-snug flex items-center gap-1">
                  ✨ O sistema iniciará seu registro com letra maiúscula, corrigirá abreviações (como "pq", "td", "qq") e aplicará a grafia formal padrão do português ao salvar.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-black transition shadow-md shadow-sky-600/20 active:scale-95 flex items-center gap-2 text-sm uppercase" 
                onClick={handleSave}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Salvar Registro de Aula
              </button>
            </div>
          </div>

          {/* Histórico prominent and clear */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200">
              <h3 className="text-lg text-slate-800 font-extrabold flex items-center gap-2 uppercase">
                <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Histórico de Aulas Ministradas
              </h3>
              {selectedClass.dailyActivities && selectedClass.dailyActivities.length > 0 && (
                <button 
                  className="bg-white border border-slate-300 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-sm active:scale-95" 
                  onClick={() => setIsPrintModalOpen(true)}
                >
                  🖨️ Imprimir Histórico
                </button>
              )}
            </div>

            {!selectedClass.dailyActivities || selectedClass.dailyActivities.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium">
                Nenhum registro de atividade foi encontrado para a turma {selectedClass.name} ainda. Use o formulário acima para lançar o primeiro.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...selectedClass.dailyActivities].reverse().map(a => (
                  <div key={a.id} className="p-5 bg-white border border-slate-300 rounded-xl text-slate-800 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between min-h-[140px]">
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 uppercase">
                          {new Date(a.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">ID: {a.id.slice(-6)}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed">{a.actualActivity || <span className="text-slate-400 italic">Sem atividade descrita</span>}</p>
                    </div>
                    <div className="mt-4 flex justify-end border-t border-slate-100 pt-2">
                      <button 
                        onClick={() => handleDelete(a.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                        title="Excluir Registro"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-[#fdfaf6] border border-dashed border-slate-350 rounded-2xl text-slate-500 font-bold max-w-xl mx-auto my-8">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Por favor, selecione uma escola e uma turma no topo da tela para ver e gerenciar os registros e o histórico de aulas.
        </div>
      )}

      {/* Modal de Impressão de Diário de Classe */}
      {isPrintModalOpen && selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="flex flex-col h-full w-full max-w-5xl bg-slate-100 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="bg-[#f4ece0] text-slate-800 p-4 flex justify-between items-center shrink-0 border-b border-slate-300">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Diário Escolar Oficial - SEEDUC-RJ</h3>
                <p className="text-xs text-slate-600 font-medium">Visualização de impressão otimizada. Baixe como PDF para imprimir.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl transition active:scale-95"
                >
                  Fechar
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-5 py-2 text-xs font-black bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md uppercase transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isGeneratingPdf ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></span>
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      📥 Baixar PDF do Diário
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Printable Container wrapper with scroll */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-200">
              {/* THE PAPER (Optimized for A4 proportions in browser) */}
              <div 
                ref={printContainerRef}
                className="bg-white text-slate-900 shadow-xl p-8 font-sans leading-relaxed tracking-tight text-sm"
                style={{ 
                  width: '210mm', // standard A4 portrait width
                  minHeight: '297mm', // standard A4 portrait height
                  boxSizing: 'border-box'
                }}
              >
                {/* Cabecalho de Diário Escolar (SEEDUC-RJ style) */}
                <div className="border-b border-slate-300 pb-5 mb-6 text-center space-y-1">
                  <div className="flex justify-center items-center gap-2 mb-1.5">
                    <span className="font-bold text-[#0c2340] uppercase">Governo do Estado do Rio de Janeiro</span>
                  </div>
                  <h1 className="font-bold text-md uppercase text-slate-800">Secretaria de Estado de Educação - SEEDUC-RJ</h1>
                  <h2 className="font-medium text-xs uppercase text-slate-500">Calendário Escolar Regular - Resolução SEEDUC Nº 6392/2025</h2>
                  <div className="font-bold text-xs uppercase text-slate-700 mt-2.5">
                    REGISTRO DIÁRIO DE AULAS / DIÁRIO DE CLASSE
                  </div>
                </div>

                {/* Metadados / Informacoes do Professor-Escola */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 border border-slate-200 p-4 mb-6 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase">Unidade de Ensino:</span>{' '}
                    <span className="font-semibold text-slate-900">{selectedClass.school.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase">Turma / Componente:</span>{' '}
                    <span className="font-semibold text-slate-900">{selectedClass.name.toUpperCase()} - Educação Física</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase">Professor Regente:</span>{' '}
                    <span className="font-semibold text-slate-900">André Víctor Brito de Andrade</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase">Ano Letivo de Referência:</span>{' '}
                    <span className="font-semibold text-slate-900">2026</span>
                  </div>
                </div>

                {/* Tabela de registro do diario */}
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-300">
                      <th className="border-r border-slate-300 p-2.5 text-center w-12 font-semibold uppercase">Nº</th>
                      <th className="border-r border-slate-300 p-2.5 text-center w-28 font-semibold uppercase">Data da Aula</th>
                      <th className="border-r border-slate-300 p-2.5 text-left font-semibold uppercase">Conteúdo Ministrado (Atividade Realizada)</th>
                      <th className="p-2.5 text-center w-36 font-semibold uppercase">Visto / Assinatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.dailyActivities && selectedClass.dailyActivities.length > 0 ? (
                      [...selectedClass.dailyActivities].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((act, index) => (
                        <tr key={act.id} className="border-b border-slate-200">
                          <td className="border-r border-slate-200 p-3 text-center text-slate-600">
                            {index + 1}
                          </td>
                          <td className="border-r border-slate-200 p-3 text-center">
                            <span className="text-slate-900">
                              {new Date(act.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                            </span>
                          </td>
                          <td className="border-r border-slate-200 p-3 text-left text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {act.actualActivity}
                          </td>
                          <td className="p-3 text-center text-[10px] text-slate-400 relative">
                            {/* Signature Line */}
                            <div className="border-b border-dotted border-slate-200 w-full pt-6"></div>
                            <span className="block mt-1 text-[8px] text-slate-400">Coordenação</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                          Nenhum registro de aula lançado no diário para esta turma.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Rodape das Assinaturas */}
                <div className="mt-16 flex justify-between items-end border-t border-slate-200 pt-8 text-xs">
                  <div className="text-left leading-relaxed space-y-1">
                    <p className="font-semibold uppercase text-slate-700">Resumo de Registros:</p>
                    <p className="text-slate-600">Total de aulas ministradas registradas: <span className="font-semibold text-slate-900">{(selectedClass.dailyActivities || []).length}</span></p>
                    <p className="text-slate-400 text-[8.5px]">Gerado digitalmente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                  </div>
                  
                  <div className="text-center space-y-1.5">
                    <div className="w-56 border-b border-slate-300"></div>
                    <p className="font-semibold text-[10px] uppercase text-slate-800">André Víctor Brito de Andrade</p>
                    <p className="text-slate-400 text-[8.5px] uppercase">CREF 039443 G/RJ • Professor Regente</p>
                  </div>
                </div>

                {/* Pagina de Autenticidade */}
                <div className="mt-20 border-t border-slate-100 pt-4 text-center">
                  <p className="text-[9px] text-slate-400">
                    Documento letivo complementar oficial - SEEDUC-RJ - Sistema Clube do Xadrez e Educação Física
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
