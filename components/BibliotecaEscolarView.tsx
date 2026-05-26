import React, { useState, useEffect } from 'react';
import { Folder, FileText, ArrowLeft, Upload, Users, BookOpen, Download, Trash2, Loader2, Presentation } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

import { getStoredConfig } from '../services/firebaseService';
import { FileViewer } from './FileViewer';

const firebaseConfig = getStoredConfig();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const appId = firebaseConfig.projectId;

const CATEGORIAS = [
  { id: '1º ANO', icon: Users, color: 'bg-blue-100 text-blue-800 border-blue-400' },
  { id: '8º ANO / AP', icon: FileText, color: 'bg-orange-100 text-orange-800 border-orange-400' }
];

export const BibliotecaEscolarView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    signInAnonymously(auth);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const arquivosRef = collection(db, 'artifacts', appId, 'users', user.uid, 'arquivos');
    const unsubscribe = onSnapshot(arquivosRef, (snapshot) => {
      const arquivosDoBanco = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      arquivosDoBanco.sort((a, b) => (b as any).createdAt - (a as any).createdAt);
      setArquivos(arquivosDoBanco);
    });
    return () => unsubscribe();
  }, [user]);

  const abrirCategoria = (categoria: string) => { setSelectedCategory(categoria); setView('categoria'); };
  const abrirArquivo = (arquivo: any) => { setSelectedFile(arquivo); setView('leitor'); };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const novoArquivo = {
        title: file.name,
        category: selectedCategory,
        type: file.type.includes('presentation') ? 'ppt' : 'pdf',
        dataUrl: event.target.result,
        createdAt: Date.now()
      };
      const arquivosRef = collection(db, 'artifacts', appId, 'users', user.uid, 'arquivos');
      await addDoc(arquivosRef, novoArquivo);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const apagarArquivo = async (id: string) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'arquivos', id));
  };

  if (view === 'home') {
    return (
      <div className="p-8 font-sans">
        <button onClick={onBack} className="text-white mb-4 flex items-center hover:text-orange-400 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar ao Painel
        </button>
        <h1 className="text-4xl font-extrabold text-white mb-8 uppercase">BIBLIOTECA ESCOLAR</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIAS.map((cat) => (
            <button key={cat.id} onClick={() => abrirCategoria(cat.id)} className={`flex items-center p-8 border-4 rounded-3xl ${cat.color} bg-opacity-60`}>
              <cat.icon className="w-16 h-16 mr-6" />
              <h2 className="text-3xl font-black">{cat.id}</h2>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'categoria') {
    const arquivosDaCategoria = arquivos.filter(arq => {
        if (selectedCategory === '1º ANO') return arq.category === '1º ANO DO ENSINO MÉDIO';
        if (selectedCategory === '8º ANO / AP') return arq.category === '8º ANO ENSINO FUNDAMENTAL' || arq.category === 'AP';
        return arq.category === selectedCategory;
    });
    const showPreLoadedButton = selectedCategory === '1º ANO';
    const showAltinhaButton = selectedCategory === '8º ANO / AP';

    return (
      <div className="p-8 font-sans">
        <button onClick={() => setView('home')} className="text-white mb-4 flex items-center hover:text-orange-400 transition-colors"> <ArrowLeft className="w-5 h-5 mr-2" /> Voltar </button>
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-white uppercase tracking-tighter">{selectedCategory}</h1>
            <label className="cursor-pointer bg-blue-700 text-white px-8 py-4 rounded-2xl">
              {isUploading ? '...' : 'Adicionar Arquivo'}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
        </div>
        
        {showPreLoadedButton && (
            <button onClick={() => (window as any).openSlideViewer('corpo-midia')} className="w-full mb-8 bg-indigo-600 text-white p-6 rounded-2xl flex items-center text-2xl font-bold shadow-lg">
                <Presentation className="w-10 h-10 mr-6" /> Abrir Aula: Debate - Corpo e Mídia
            </button>
        )}
        
        {showAltinhaButton && (
            <button onClick={() => (window as any).openSlideViewer('altinha-futvolei')} className="w-full mb-8 bg-emerald-600 text-white p-6 rounded-2xl flex items-center text-2xl font-bold shadow-lg">
                <Presentation className="w-10 h-10 mr-6" /> Abrir Aula: Altinha & Futevôlei
            </button>
        )}

        <div className="space-y-6">
          {arquivosDaCategoria.map((arq) => (
            <div key={arq.id} className="bg-white p-8 rounded-2xl shadow-md border-2 border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">{arq.title}</h3>
              <div className="flex gap-4">
                  <button onClick={() => apagarArquivo(arq.id)} className="text-red-500"><Trash2/></button>
                  <button onClick={() => abrirArquivo(arq)} className="bg-slate-100 px-4 py-2 rounded-xl">Abrir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'leitor') {
    return <FileViewer file={selectedFile} onClose={() => setView('categoria')} />;
  }
  return null;
};
