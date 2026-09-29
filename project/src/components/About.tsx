import { Sparkles, Heart, Award, Users } from 'lucide-react';
import { Reveal, useReveal } from './Reveal';
import { aboutImage } from '@/data';

export function About() {
  const ref = useReveal<HTMLDivElement>();

  const features = [
    { icon: Heart, title: 'Atendimento Personalizado', text: 'Cada cliente é único. Adaptamos cada serviço ao seu estilo e necessidade.' },
    { icon: Award, title: 'Profissionais Qualificados', text: 'Equipe especializada e em constante atualização com as melhores técnicas.' },
    { icon: Sparkles, title: 'Experiência Premium', text: 'Um ambiente sofisticado pensado para o seu conforto e bem-estar.' },
    { icon: Users, title: 'Confiança e Cuidado', text: 'Relações duradouras construídas com qualidade e dedicação em cada visita.' },
  ];

  return (
    <section id="sobre" ref={ref} className="py-24 bg-nude-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <Reveal>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-card">
                <img src={aboutImage} alt="Interior do salão Sextons" className="w-full h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-ink-900 rounded-2xl p-6 text-center max-w-[180px] hidden sm:block">
                <div className="font-serif text-4xl text-gradient-gold font-bold">8+</div>
                <div className="text-nude-200 text-xs mt-1 uppercase tracking-wider">Anos de experiência</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
              Sobre a Sextons
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink-900 mt-3 mb-6">
              Beleza, cuidado e<br />experiência em um só lugar.
            </h2>
            <div className="space-y-4 text-ink-600 leading-relaxed">
              <p>
                A Sextons Salão de Beleza nasceu do desejo de oferecer um espaço onde beleza e
                bem-estar se encontram. Em Balneário Camboriú, criamos um ambiente acolhedor e
                sofisticado, onde cada detalhe foi pensado para transformar o seu momento de
                autocuidado em uma experiência memorável.
              </p>
              <p>
                Nossa equipe de profissionais especializados combina técnica, criatividade e
                dedicação para realçar a beleza única de cada cliente. Aqui, você encontra
                serviços de cabelo, coloração, estética, sobrancelhas e unhas — tudo em um só
                lugar, com o padrão de qualidade que você merece.
              </p>
              <p className="font-serif text-xl text-gold-700 italic">
                "Sua beleza é nossa paixão. Seu bem-estar, nossa prioridade."
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <Reveal key={f.title} delay={idx * 100}>
              <div className="bg-white rounded-2xl p-6 border border-nude-100 hover:shadow-card transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-serif text-lg text-ink-900 mb-2">{f.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
