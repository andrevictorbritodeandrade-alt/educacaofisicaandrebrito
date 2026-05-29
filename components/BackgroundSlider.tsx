import React, { useState, useEffect } from 'react';
import { BACKGROUND_IMAGES } from '../constants';

export const BackgroundSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#111]">
      {BACKGROUND_IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === currentIndex ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.3) saturate(0.8)',
            transform: 'scale(1.05)',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[#111]/70 backdrop-blur-sm" />
    </div>
  );
};