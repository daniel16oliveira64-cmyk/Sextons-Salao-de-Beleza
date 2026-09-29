import { Clock, Tag, Calendar } from 'lucide-react';
import { useSalon } from '@/store';
import { CATEGORY_LABELS } from '@/types';
import { formatPrice, formatDuration, buildWhatsAppUrl, whatsappServiceMessage } from '@/utils';
import { Reveal } from './Reveal';
import { useReveal } from './Reveal';

interface ServicesProps {
  onBook: (serviceId?: string) => void;
}

export function Services({ onBook }: ServicesProps) {
  const { services, config } = useSalon();
  const ref = useReveal<HTMLDivElement>();
  const activeServices = services.filter((s) => s.active);

  const categories = Array.from(new Set(activeServices.map((s) => s.category)));

  return (
    <section id="servicos" ref={ref} className="py-24 bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
            Nossos Serviços
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink-900 mt-3 mb-4">
            Tratamentos pensados para você
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Uma seleção completa de serviços de beleza e bem-estar, realizados por
            profissionais especializados em um ambiente acolhedor.
          </p>
        </Reveal>

        {categories.map((cat) => (
          <div key={cat} className="mb-12">
            <Reveal>
              <h3 className="font-serif text-2xl text-ink-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold-400" />
                {CATEGORY_LABELS[cat]}
              </h3>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeServices.filter((s) => s.category === cat).map((service, idx) => (
                <Reveal key={service.id} delay={idx * 80}>
                  <div className="group bg-white rounded-2xl border border-ink-100 p-6 hover:shadow-card hover:border-gold-200 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-serif text-xl text-ink-900 group-hover:text-gold-700 transition-colors">
                        {service.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs text-nude-600 bg-nude-50 px-2 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        {CATEGORY_LABELS[service.category]}
                      </span>
                    </div>

                    <p className="text-sm text-ink-500 leading-relaxed mb-5 flex-grow">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-ink-600 mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gold-500" />
                        {formatDuration(service.durationMin)}
                      </span>
                      <span className="font-serif text-2xl text-ink-900 font-semibold">
                        {formatPrice(service.price)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onBook(service.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-ink-900 text-nude-50 py-2.5 rounded-lg text-sm font-medium hover:bg-ink-800 transition-all active:scale-95"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar
                      </button>
                      <a
                        href={buildWhatsAppUrl(config.whatsapp, whatsappServiceMessage(service.name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-[#25D366] text-white px-3 py-2.5 rounded-lg hover:bg-[#1da851] transition-all active:scale-95"
                        aria-label="WhatsApp"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.882 11.882 0 005.737 1.456h.005c6.582 0 11.94-5.359 11.943-11.892a11.821 11.821 0 00-3.479-8.461"/></svg>
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
