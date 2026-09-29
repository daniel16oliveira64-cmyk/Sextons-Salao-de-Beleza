import { MessageCircle } from 'lucide-react';
import { useSalon } from '@/store';
import { buildWhatsAppUrl, whatsappGenericMessage } from '@/utils';

export function WhatsAppFloat() {
  const { config } = useSalon();
  const url = buildWhatsAppUrl(config.whatsapp, whatsappGenericMessage());

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      aria-label="Falar no WhatsApp"
    >
      <span className="hidden sm:inline-block bg-white text-ink-800 text-sm font-medium px-4 py-2 rounded-full shadow-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Falar no WhatsApp
      </span>
      <span className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
        <span className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 text-white relative z-10" />
      </span>
    </a>
  );
}
