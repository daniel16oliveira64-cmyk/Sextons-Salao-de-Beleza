import { MessageCircle, Instagram, MapPin, Clock } from 'lucide-react';
import { useSalon } from '@/store';
import { buildWhatsAppUrl, whatsappGenericMessage } from '@/utils';
import { DAY_LABELS } from '@/types';

interface FooterProps {
  onNavigate: (id: string) => void;
  onBook: () => void;
}

export function Footer({ onNavigate, onBook }: FooterProps) {
  const { config, services } = useSalon();
  const whatsappUrl = buildWhatsAppUrl(config.whatsapp, whatsappGenericMessage());

  return (
    <footer className="bg-ink-900 text-nude-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <div className="font-serif text-3xl">
                <span className="text-gradient-gold">SEX</span>tons
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-nude-400 mt-0.5">
                Salão de Beleza
              </div>
            </div>
            <p className="text-sm text-nude-300 leading-relaxed mb-6">
              Beleza, cuidado e bem-estar em Balneário Camboriú. Sua experiência premium
              de autocuidado.
            </p>
            <button
              onClick={onBook}
              className="inline-flex items-center gap-2 bg-gradient-gold text-ink-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-gold transition-all active:scale-95"
            >
              Agendar Horário
            </button>
          </div>

          <div>
            <h4 className="font-serif text-lg text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'inicio', label: 'Início' },
                { id: 'servicos', label: 'Serviços' },
                { id: 'profissionais', label: 'Profissionais' },
                { id: 'sobre', label: 'Sobre nós' },
                { id: 'contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-nude-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-white mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              {services.filter((s) => s.active).slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onNavigate('servicos')}
                    className="text-nude-300 hover:text-gold-400 transition-colors text-left"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-white mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-nude-300">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span>{config.address}</span>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nude-300 hover:text-[#25D366] transition-colors">
                  <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-nude-300">
                <Instagram className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{config.instagram}</span>
              </li>
              <li className="flex items-start gap-2 text-nude-300">
                <Clock className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <div>
                  {config.workingHours.filter((wh) => wh.enabled).map((wh) => (
                    <div key={wh.day} className="text-xs">
                      {DAY_LABELS[wh.day]}: {wh.start} — {wh.end}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-nude-400 text-center sm:text-left">
            © 2026 Sextons Salão de Beleza. Todos os direitos reservados.
          </p>
          <button
            onClick={() => onNavigate('inicio')}
            className="text-sm text-nude-400 hover:text-gold-400 transition-colors"
          >
            Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}
