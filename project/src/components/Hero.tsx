import { Calendar, MessageCircle, Check } from 'lucide-react';
import { useSalon } from '@/store';
import { buildWhatsAppUrl, whatsappGenericMessage } from '@/utils';
import { heroImage } from '@/data';

interface HeroProps {
  onBook: () => void;
}

export function Hero({ onBook }: HeroProps) {
  const { config } = useSalon();
  const whatsappUrl = buildWhatsAppUrl(config.whatsapp, whatsappGenericMessage());

  const trustItems = [
    'Atendimento personalizado',
    'Profissionais especializados',
    'Agendamento online',
  ];

  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ink" />
      <div className="absolute inset-0 opacity-20">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gold-300 text-xs font-medium tracking-wider uppercase">
                {config.city} — {config.state}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-6 animate-fade-up">
              Sua beleza merece<br />
              <span className="text-gradient-gold italic">um momento só seu.</span>
            </h1>

            <p className="text-nude-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Cuidados, beleza e bem-estar em um só lugar, com profissionais preparados para
              transformar seu momento de autocuidado em uma experiência especial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <button
                onClick={onBook}
                className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-ink-900 px-8 py-4 rounded-xl text-sm font-semibold hover:shadow-gold hover:brightness-105 transition-all duration-300 active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                Agendar meu horário
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-nude-200/30 text-nude-100 px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white/10 hover:border-nude-200/60 transition-all duration-300 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Falar pelo WhatsApp
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '300ms' }}>
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-nude-300 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-500/20">
                    <Check className="w-3 h-3 text-gold-300" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Salão de beleza Sextons"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card p-5 max-w-[200px]">
              <div className="text-3xl font-serif text-gradient-gold font-bold">100%</div>
              <div className="text-xs text-ink-600 mt-1 leading-snug">
                Foco na sua beleza e bem-estar
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-gold-500 rounded-2xl shadow-gold p-4 text-ink-900">
              <div className="text-2xl font-serif font-bold">Premium</div>
              <div className="text-[10px] uppercase tracking-wider">Experiência</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-50 to-transparent" />
    </section>
  );
}
