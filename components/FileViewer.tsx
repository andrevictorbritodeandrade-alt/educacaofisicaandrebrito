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
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col h-screen">
      <div className="shrink-0 flex justify-between items-center p-4 bg-slate-900 border-b border-orange-500/50">
        <div className="flex items-center gap-4 text-white">
          <FileText className="w-8 h-8 text-orange-500" />
          <h1 className="text-xl font-bold">{file.title}</h1>
        </div>
        <div className="flex gap-4">
          <a href={file.dataUrl} download={file.title} className="text-slate-300 hover:text-white p-2">
            <Download className="w-6 h-6" />
          </a>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-300"><X /></button>
        </div>
      </div>
      <div className="flex-1 bg-white p-4">
        <embed src={file.dataUrl} type={file.type === 'pdf' ? 'application/pdf' : 'application/vnd.ms-powerpoint'} className="w-full h-full" />
      </div>
    </div>
  );
};
