import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface EmentaPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  planData?: {
    title: string;
    subtitle: string;
    content: {
      justificativa: string;
      bimestres: Array<{
        period: string;
        objeto: string;
        habilidade: string;
        pratica: string;
      }>;
      avaliacao: string;
    };
  };
}

export const EmentaPrintModal: React.FC<EmentaPrintModalProps> = ({ isOpen, onClose, planData }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fallback to avoid errors if planData is missing
  const data = planData || {
    title: 'Plano de Curso',
    subtitle: 'Educação Física',
    content: { justificativa: '', bimestres: [], avaliacao: '' }
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      // Ensure we are at the top to avoid offset issues
      window.scrollTo(0,0);
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('print-content');
          if (el) el.style.display = 'block';
        }
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4'); // Retrato para planos de curso longos
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;
      
      const margin = 15;
      const contentWidth = pdfWidth - (2 * margin);
      const contentHeight = contentWidth / ratio;

      if (contentHeight <= pdfHeight - (2 * margin)) {
         pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      } else {
         // Multipágina simplificado (apenas escala para fit se for ligeiramente maior, ou corta)
         pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, pdfHeight - (2 * margin));
      }

      pdf.save(`${data.title.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
       <div className="flex flex-col h-full w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header Toolbar */}
          <div className="bg-[#f4ece0] text-slate-800 p-4 flex justify-between items-center shadow-md z-10 shrink-0 border-b border-slate-300">
             <div>
               <h2 className="text-xl font-bold uppercase font-sans">Imprimir Plano de Curso</h2>
               <p className="text-xs text-slate-500">Layout Retrato (A4)</p>
             </div>
             <div className="flex space-x-3">
               <button 
                 onClick={onClose} 
                 className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleDownloadPdf} 
                 disabled={isGenerating} 
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center space-x-2 transition-transform transform active:scale-95 disabled:opacity-50"
               >
                  {isGenerating ? <span>Gerando...</span> : <span>Baixar PDF</span>}
               </button>
             </div>
          </div>

          {/* Scrollable Preview Area */}
          <div className="flex-1 overflow-auto bg-slate-200 p-8 flex justify-center">
             
             {/* THE PAPER (A4 Portrait) */}
             <div 
               ref={printRef} 
               id="print-content"
               className="bg-white shadow-2xl mx-auto flex flex-col relative" 
               style={{ width: '210mm', minHeight: '297mm', padding: '20mm', boxSizing: 'border-box' }}
             >
                {/* Official Header */}
                <div className="border-b-4 border-black pb-4 mb-8 text-center">
                   <h1 className="font-bold text-base uppercase text-black">Governo do Estado do Rio de Janeiro</h1>
                   <h2 className="font-bold text-sm uppercase text-black">Secretaria de Estado de Educação</h2>
                </div>

                <div className="text-center mb-10">
                   <h2 className="font-black text-2xl uppercase text-black mb-2">{data.title}</h2>
                   <div className="inline-block border-2 border-black px-4 py-1 font-bold text-sm uppercase text-black">
                     {data.subtitle}
                   </div>
                   <p className="text-xs font-bold uppercase mt-4 text-black">Prof. André Brito • Educação Física • CREF 039443 G/RJ • 2026</p>
                </div>

                {/* Content */}
                <div className="space-y-8 flex-1">
                    <section>
                        <h3 className="font-black text-sm uppercase border-b border-black mb-2 text-black">01. Justificativa e Contexto</h3>
                        <p className="text-xs text-black leading-relaxed text-justify">{data.content.justificativa}</p>
                    </section>

                    <section>
                        <h3 className="font-black text-sm uppercase border-b border-black mb-4 text-black">02. Eixos Temáticos e Habilidades</h3>
                        <div className="space-y-6">
                            {data.content.bimestres.map((bim, idx) => (
                                <div key={idx} className="border border-black p-4">
                                    <h4 className="font-black text-xs uppercase mb-2 border-b border-black/10 text-black">{bim.period}</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        <p className="text-[10px] text-black"><strong>Objeto:</strong> {bim.objeto}</p>
                                        <p className="text-[10px] text-black italic"><strong>Habilidade:</strong> {bim.habilidade}</p>
                                        <p className="text-[10px] text-black font-bold bg-gray-100 p-2 border-l-2 border-black mt-1"><strong>Prática Sugerida:</strong> {bim.pratica}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="font-black text-sm uppercase border-b border-black mb-2 text-black">03. Metodologia de Avaliação</h3>
                        <p className="text-xs text-black leading-relaxed text-justify">{data.content.avaliacao}</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-black text-center">
                    <p className="font-bold text-xs uppercase text-black">Prof. André Brito</p>
                    <p className="text-[10px] text-black">Educação Física • CREF 039443 G/RJ</p>
                </div>

                <div className="absolute bottom-10 left-0 w-full text-center">
                   <p className="text-[8px] text-gray-500">Documento gerado digitalmente • Maricá, RJ • 2026</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};