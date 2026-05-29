import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CORPO_MIDIA_SLIDES, ALTINHA_FUTVOLEI_SLIDES } from '../data/corpoMidiaSlides';

export const SlideViewer: React.FC<{ onClose: () => void, slideType?: 'corpo-midia' | 'altinha-futvolei' }> = ({ onClose, slideType = 'corpo-midia' }) => {
  const slides = slideType === 'altinha-futvolei' ? ALTINHA_FUTVOLEI_SLIDES : CORPO_MIDIA_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[9999] bg-[#e1f5fe] flex flex-col h-screen overflow-hidden text-[#1a237e]">
      {/* Header */}
      <div className="shrink-0 flex justify-between items-center p-4 bg-[#b3e5fc] border-b border-[#81d4fa]">
        <h1 className="text-xl font-bold font-sans tracking-wider uppercase">{slideType === 'altinha-futvolei' ? 'Altinha & Futevôlei' : 'Debate: Corpo e Mídia'}</h1>
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">slide {currentSlide + 1} / {slides.length}</span>
            <button onClick={onClose} className="p-2 hover:bg-[#81d4fa] rounded-full"><X/></button>
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 overflow-hidden p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full flex items-center justify-center"
          >
            <div className="w-full h-full bg-white p-12 rounded-xl shadow-lg border border-slate-200 overflow-y-auto">
              <h2 className="text-5xl font-bold mb-8 text-[#006064] uppercase">{slide.title}</h2>
              {slide.subtitle && <p className="text-3xl mb-8 text-[#00838f]">{slide.subtitle}</p>}
              {slide.content && <p className="text-2xl leading-relaxed text-slate-800">{slide.content}</p>}
              {slide.points && (
                <ul className="space-y-6">
                  {slide.points.map((p, i) => {
                    // Splits on the first colon, bolding the part before it
                    const firstColonIndex = p.indexOf(':');
                    if (firstColonIndex !== -1) {
                         const boldPart = p.substring(0, firstColonIndex).replace(/\*\*/g, '');
                         const rest = p.substring(firstColonIndex + 1);
                         return (
                            <li key={i} className="text-2xl text-slate-800 list-disc ml-8">
                                <strong className="font-bold">{boldPart}:</strong>{rest}
                            </li>
                         );
                    }
                    return (
                        <li key={i} className="text-2xl text-slate-800 list-disc ml-8">
                          {p}
                        </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prev} disabled={currentSlide === 0} className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/90 rounded-full hover:bg-white disabled:opacity-30 z-[100] border border-slate-300 shadow-lg"><ArrowLeft size={48}/></button>
      <button onClick={next} disabled={currentSlide === slides.length - 1} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/90 rounded-full hover:bg-white disabled:opacity-30 z-[100] border border-slate-300 shadow-lg"><ArrowRight size={48}/></button>
    </div>
  );
};

