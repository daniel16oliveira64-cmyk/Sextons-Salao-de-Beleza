import { Star, MessageSquarePlus } from 'lucide-react';
import { Reveal, useReveal } from './Reveal';

export function Testimonials() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="py-24 bg-nude-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
            Depoimentos
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink-900 mt-3 mb-4">
            O que nossas clientes dizem
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Sua opinião é muito importante para nós. Em breve este espaço terá depoimentos
            reais de clientes que confiam na Sextons.
          </p>
        </Reveal>

        <Reveal>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-dashed border-nude-200 p-10 text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-7 h-7 text-gold-300" />
                ))}
              </div>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-nude-100 flex items-center justify-center">
                <MessageSquarePlus className="w-8 h-8 text-nude-400" />
              </div>
              <h3 className="font-serif text-2xl text-ink-800 mb-3">
                Seja a primeira a compartilhar sua experiência
              </h3>
              <p className="text-ink-500 leading-relaxed mb-2">
                Após seu atendimento na Sextons, você poderá deixar seu depoimento aqui.
              </p>
              <p className="text-xs text-nude-400 italic">
                Espaço reservado para depoimentos reais de clientes.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
