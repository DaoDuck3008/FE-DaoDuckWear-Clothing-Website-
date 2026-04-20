"use client";

import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
];

const AtelierHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center bg-stone-50 pt-20 lg:pt-32 text-center overflow-hidden">
      {/* Slideshow */}
      {HERO_IMAGES.map((src, index) => (
        <div 
          key={src}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            alt={`Fashion Campaign ${index + 1}`}
            className="w-full h-full object-cover object-top scale-105 transition-transform duration-[5000ms] ease-linear"
            src={src}
            style={{
              transform: index === currentIndex ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-black/15"></div>
        </div>
      ))}
      
      {/* Text Overlay */}
      <div className="relative z-10 px-6">
        <h1 className="font-serif text-5xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl opacity-0 animate-fade-in transition-all duration-1000" style={{ opacity: 1 }}>
           THE ATELIER
        </h1>
        <p className="mt-4 text-white/80 text-xs font-sans uppercase tracking-[0.4em] drop-shadow-md">
           Spring Summer 2026 Collection
        </p>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex ? "bg-white w-8" : "bg-white/30 w-4 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Decorative vertical text */}
      <div className="absolute right-8 bottom-12 hidden lg:block z-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50 rotate-90 inline-block origin-right">
          EXTENDED EDITORIAL
        </span>
      </div>
    </section>
  );
};

export default AtelierHero;
