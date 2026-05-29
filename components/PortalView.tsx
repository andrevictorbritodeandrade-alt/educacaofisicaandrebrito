import React from 'react';
import { motion } from 'framer-motion';

interface PortalViewProps {
  onSelectAccess: (level: 'alunos' | 'professor_login') => void;
}

export const PortalView: React.FC<PortalViewProps> = ({ onSelectAccess }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-transparent">
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAccess('alunos')}
          className="relative overflow-hidden group rounded-3xl bg-white/10 p-8 border border-white/20 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svg className="w-20 h-20 text-white mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Alunos</h2>
          <p className="text-sm text-white/50 mt-4 text-center">Acesse materiais, resumos e conteúdos das aulas de Educação Física.</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAccess('professor_login')}
          className="relative overflow-hidden group rounded-3xl bg-white/10 p-8 border border-white/20 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svg className="w-20 h-20 text-white mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Professor</h2>
          <p className="text-sm text-white/50 mt-4 text-center">Área restrita. Controle de diários, planos de curso e gestão acadêmica.</p>
        </motion.button>
      </div>
    </div>
  );
};
