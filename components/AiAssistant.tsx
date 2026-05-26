import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: 'Olá, Professor! Sou seu Assistente de Gestão Escolar. 📚\n\nPosso ajudar com o Calendário SEEDUC-RJ 2026, planejar aulas de Educação Física, sugerir dinâmicas decoloniais ou organizar seu Diário de Classe. O que vamos fazer hoje?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize Gemini
      // Utilizando a chave fornecida pelo usuário
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Você é o "Assistente de Gestão SEEDUC", uma IA especialista em gestão escolar, pedagogia de Educação Física e legislação educacional (Leis 10.639/03 e 11.645/08).
        
        Suas capacidades:
        1. Calendário SEEDUC-RJ 2026: Você conhece a Resolução SEEDUC Nº 6392/2025.
           - 1º Tri: 05/02 a 18/05. COC 1: 19-21/05.
           - 2º Tri: 19/05 a 04/09. COC 2: 08-10/09.
           - 3º Tri: 08/09 a 22/12. COC 3: 09-11/12.
           - Total: 206 dias letivos.
        2. Pedagogo Decolonial: Você cria planos de aula focados em cultura corporal, lutas e jogos de matriz africana/indígena.
        3. Organizador: Ajuda a estruturar o Diário de Classe e relatórios de assiduidade.
        
        Diretrizes:
        - Responda sempre em Português do Brasil (PT-BR).
        - Use formatação clara (listas, negrito para datas e termos importantes).
        - Seja encorajador, pragmático e profissional.
        - Se o usuário pedir um plano de aula, use a estrutura de Módulos (Saúde, Território, Cultura, Lutas).
      `;

      // Construct history for context
      // Filter out the 'welcome' message from API history as it's not a real conversation turn
      // and starting with 'model' can sometimes cause issues if strict validation is present.
      const chatHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
           role: m.role,
           parts: [{ text: m.text }]
        }));

      // Current interaction
      const currentInteraction = { role: 'user', parts: [{ text: userMsg.text }] };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: [
            ...chatHistory,
            currentInteraction
        ],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7, 
        }
      });

      const text = response.text;
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: text || "Desculpe, tive um problema ao analisar o tabuleiro. Tente novamente." 
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("Erro na IA:", error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: "⚠️ Erro de conexão com o Grande Mestre. Tente novamente em instantes." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick Action Chips
  const quickActions = [
    "Plano de Aula: Luta Africana",
    "Datas do 2º Trimestre",
    "Dinâmica sobre Mídia e Corpo",
    "Resumo da Resolução 6392/2025"
  ];

  const handleQuickAction = (text: string) => {
      setInput(text);
      // Optional: auto-send
      // handleSend(); 
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform animate-fade-in border-2 border-white/20"
          title="Assistente IA"
        >
          <span className="text-3xl">🤖</span>
          {/* Notification badge effect */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
          </span>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl">
                 🤖
               </div>
               <div>
                 <h3 className="text-white font-bold text-sm md:text-base">Assistente SEEDUC</h3>
                 <p className="text-indigo-200 text-xs">Gestão & Pedagogia</p>
               </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {/* Basic Bold Formatting for AI responses */}
                  {msg.role === 'model' ? (
                      msg.text.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )
                  ) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (only if empty input or start) */}
          {messages.length < 3 && !isLoading && (
              <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
                  {quickActions.map((action, i) => (
                      <button 
                        key={i}
                        onClick={() => handleQuickAction(action)}
                        className="whitespace-nowrap px-3 py-1 bg-white border border-indigo-100 text-indigo-600 text-xs rounded-full hover:bg-indigo-50 transition shadow-sm"
                      >
                        {action}
                      </button>
                  ))}
              </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="relative flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ex: Crie uma aula sobre Shisima..."
                className="w-full p-3 pr-10 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none text-slate-700 text-sm max-h-32 min-h-[50px] custom-scrollbar"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};