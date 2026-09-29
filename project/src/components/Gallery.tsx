import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '@/data';
import { Reveal, useReveal } from './Reveal';

export function Gallery() {
  const ref = useReveal<HTMLDivElement>();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length));
  const next = () => setLightbox((prev) => (prev === null ? null : (prev + 1) % galleryImages.length));

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
            Galeria
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink-900 mt-3 mb-4">
            Inspirações e resultados
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Um olhar sobre nosso ambiente, tratamentos e a beleza que criamos todos os dias.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {galleryImages.map((img, idx) => (
            <Reveal
              key={idx}
              delay={(idx % 4) * 80}
              className={idx % 5 === 0 ? 'col-span-2 row-span-2' : ''}
            >
              <button
                onClick={() => openLightbox(idx)}
                className="group relative w-full h-full min-h-[150px] sm:min-h-[200px] rounded-xl overflow-hidden block"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-5 h-5 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-ink-950/90 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 rounded-full text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 p-3 rounded-full text-white hover:bg-white/10 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={galleryImages[lightbox].src}
            alt={galleryImages[lightbox].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 p-3 rounded-full text-white hover:bg-white/10 transition-colors"
            aria-label="Próxima"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm">
            {galleryImages[lightbox].alt} — {lightbox + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
