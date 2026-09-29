import { Clock, Calendar } from 'lucide-react';
import { useSalon } from '@/store';
import { buildWhatsAppUrl, whatsappProfessionalMessage } from '@/utils';
import { Reveal, useReveal } from './Reveal';

interface ProfessionalsProps {
  onBook: (serviceId?: string, professionalId?: string) => void;
}

export function Professionals({ onBook }: ProfessionalsProps) {
  const { professionals, services, config } = useSalon();
  const ref = useReveal<HTMLDivElement>();
  const activeProfessionals = professionals.filter((p) => p.active);

  return (
    <section id="profissionais" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
            Nossa Equipe
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink-900 mt-3 mb-4">
            Profissionais que cuidam de você
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Cada profissional da Sextons é especialista em sua área, dedicada a oferecer
            uma experiência única e personalizada.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProfessionals.map((prof, idx) => {
            const profServices = services.filter((s) => prof.serviceIds.includes(s.id) && s.active);
            return (
              <Reveal key={prof.id} delay={idx * 100}>
                <div className="group bg-white rounded-2xl border border-ink-100 overflow-hidden hover:shadow-card transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={prof.photo}
                      alt={prof.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-2xl text-white">{prof.name}</h3>
                      <p className="text-gold-300 text-sm">{prof.specialty}</p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-ink-500 leading-relaxed mb-4">{prof.bio}</p>

                    <div className="mb-4">
                      <div className="text-xs text-ink-400 uppercase tracking-wider mb-2">Especialidades</div>
                      <div className="flex flex-wrap gap-1.5">
                        {profServices.slice(0, 4).map((s) => (
                          <span key={s.id} className="text-xs bg-nude-50 text-nude-700 px-2 py-1 rounded-full">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-ink-500 mb-4">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      {prof.workingStart} — {prof.workingEnd}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => onBook(undefined, prof.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-ink-900 text-nude-50 py-2.5 rounded-lg text-sm font-medium hover:bg-ink-800 transition-all active:scale-95"
                      >
                        <Calendar className="w-4 h-4" />
                        Ver horários
                      </button>
                      <a
                        href={buildWhatsAppUrl(config.whatsapp, whatsappProfessionalMessage(prof.name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-[#25D366] text-white px-3 py-2.5 rounded-lg hover:bg-[#1da851] transition-all active:scale-95"
                        aria-label="WhatsApp"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.882 11.882 0 005.737 1.456h.005c6.582 0 11.94-5.359 11.943-11.892a11.821 11.821 0 00-3.479-8.461"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
