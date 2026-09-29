import { MapPin, Phone, MessageCircle, Instagram, Clock } from 'lucide-react';
import { useSalon } from '@/store';
import { buildWhatsAppUrl, whatsappGenericMessage } from '@/utils';
import { DAY_LABELS } from '@/types';
import { Reveal, useReveal } from './Reveal';

export function Contact() {
  const { config } = useSalon();
  const ref = useReveal<HTMLDivElement>();
  const whatsappUrl = buildWhatsAppUrl(config.whatsapp, whatsappGenericMessage());

  return (
    <section id="contato" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
            Contato
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink-900 mt-3 mb-4">
            Venha nos visitar
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Estamos em Balneário Camboriú, prontas para receber você. Agende seu horário
            ou venha conhecer nosso espaço.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12">
          <Reveal>
            <div className="bg-nude-50 rounded-2xl p-8 h-full">
              <h3 className="font-serif text-2xl text-ink-900 mb-6">Sextons Salão de Beleza</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">Endereço</div>
                    <div className="text-ink-700">{config.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">Telefone</div>
                    <div className="text-ink-700">{config.phone}</div>
                  </div>
                </div>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">WhatsApp</div>
                    <div className="text-ink-700 group-hover:text-[#25D366] transition-colors">{config.whatsapp}</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">Instagram</div>
                    <div className="text-ink-700">{config.instagram}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gold-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs text-ink-400 uppercase tracking-wider mb-2">Horário de funcionamento</div>
                    <div className="space-y-1">
                      {config.workingHours.map((wh) => (
                        <div key={wh.day} className="flex justify-between text-sm text-ink-600">
                          <span>{DAY_LABELS[wh.day]}</span>
                          <span>
                            {wh.enabled ? `${wh.start} — ${wh.end}` : 'Fechado'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1da851] transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-2xl overflow-hidden h-full min-h-[400px] relative bg-ink-100">
              <iframe
                title="Mapa — Balneário Camboriú"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-48.7000%2C-26.6800%2C-48.5800%2C-26.5800&layer=mapnik&marker=-26.6300%2C-48.6400"
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-soft max-w-[220px]">
                <div className="font-serif text-lg text-ink-900">Sextons Salão</div>
                <div className="text-xs text-ink-500">{config.city} — {config.state}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
