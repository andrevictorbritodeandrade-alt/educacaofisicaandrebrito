import React from 'react';
import { X, FileText, Download } from 'lucide-react';

interface FileViewerProps {
  file: {
    title: string;
    dataUrl: string;
    type: string;
  };
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  const isPdf = file.type === 'pdf';

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col h-screen">
      <div className="shrink-0 flex justify-between items-center p-6 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-4 text-white">
          <FileText className="w-8 h-8 text-orange-500" />
          <h1 className="text-xl font-bold">{file.title}</h1>
        </div>
        <div className="flex gap-4">
          <a href={file.dataUrl} download={file.title} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-500">
            <Download className="w-5 h-5" /> Download
          </a>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-300"><X /></button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-slate-100 p-8">
        {isPdf ? (
            <iframe src={file.dataUrl} className="w-full h-full rounded-2xl shadow-2xl" />
        ) : (
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-lg border border-slate-200">
                <p className="text-slate-600 text-2xl mb-6">Visualização direta de arquivos PPT não disponível.</p>
                <a href={file.dataUrl} download={file.title} className="bg-orange-600 text-white px-8 py-4 rounded-2xl text-xl font-bold">Baixar para visualizar</a>
            </div>
        )}
      </div>
    </div>
  );
};
