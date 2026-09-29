import { useState } from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Services } from './Services';
import { Professionals } from './Professionals';
import { About } from './About';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { WhatsAppFloat } from './WhatsAppFloat';
import { BookingModal } from './BookingModal';

export function PublicSite() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialServiceId, setInitialServiceId] = useState<string | undefined>(undefined);
  const [initialProfessionalId, setInitialProfessionalId] = useState<string | undefined>(undefined);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openBooking = (serviceId?: string, professionalId?: string) => {
    setInitialServiceId(serviceId);
    setInitialProfessionalId(professionalId);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Header onNavigate={scrollTo} onBook={() => openBooking()} />
      <Hero onBook={() => openBooking()} />
      <Services onBook={(svcId) => openBooking(svcId)} />
      <Professionals onBook={(_svcId, profId) => openBooking(undefined, profId)} />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer onNavigate={scrollTo} onBook={() => openBooking()} />
      <WhatsAppFloat />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialServiceId={initialServiceId}
        initialProfessionalId={initialProfessionalId}
      />
    </div>
  );
}
