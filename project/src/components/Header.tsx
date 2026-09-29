import { useEffect, useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';

interface HeaderProps {
  onNavigate: (id: string) => void;
  onBook: () => void;
}

const navItems = [
  { id: 'inicio', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'profissionais', label: 'Profissionais' },
  { id: 'sobre', label: 'Sobre nós' },
  { id: 'contato', label: 'Contato' },
];

export function Header({ onNavigate, onBook }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-50/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => handleNav('inicio')} className="flex flex-col items-start leading-none">
            <span
              className={`font-serif text-2xl tracking-wide transition-colors ${
                scrolled ? 'text-ink-900' : 'text-ink-900'
              }`}
            >
              <span className="text-gradient-gold">SEX</span>tons
            </span>
            <span className={`text-[10px] tracking-[0.25em] uppercase mt-0.5 ${scrolled ? 'text-ink-500' : 'text-ink-600'}`}>
              Salão de Beleza
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-ink-100 ${
                  scrolled ? 'text-ink-700 hover:text-gold-700' : 'text-ink-700 hover:text-gold-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-2 bg-gradient-gold text-ink-900 px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-gold hover:brightness-105 transition-all duration-300 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              Agendar Horário
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-ink-800 hover:bg-ink-100 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-ink-100 animate-slide-down">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="px-4 py-3 text-left text-sm font-medium text-ink-700 rounded-lg hover:bg-ink-100 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                onBook();
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-gold text-ink-900 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              <Calendar className="w-4 h-4" />
              Agendar Horário
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
