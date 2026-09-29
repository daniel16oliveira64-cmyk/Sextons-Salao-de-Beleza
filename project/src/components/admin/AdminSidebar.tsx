import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Scissors,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useSalon } from '@/store';

export type AdminPage = 'dashboard' | 'agenda' | 'agendamentos' | 'profissionais' | 'servicos' | 'configuracoes';

interface SidebarProps {
  current: AdminPage;
  onNavigate: (page: AdminPage) => void;
}

const menuItems: { id: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'agendamentos', label: 'Agendamentos', icon: ClipboardList },
  { id: 'profissionais', label: 'Profissionais', icon: Users },
  { id: 'servicos', label: 'Serviços', icon: Scissors },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function AdminSidebar({ current, onNavigate }: SidebarProps) {
  const { adminLogout, config } = useSalon();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: AdminPage) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-ink-900 text-white px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl">
            <span className="text-gradient-gold">SEX</span>tons
          </span>
          <span className="text-xs text-nude-400">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-ink-900 text-white z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto pt-16 lg:pt-0`}
      >
        <div className="hidden lg:flex items-center gap-2 px-6 h-20 border-b border-ink-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <Scissors className="w-5 h-5 text-ink-900" />
          </div>
          <div>
            <div className="font-serif text-xl">
              <span className="text-gradient-gold">SEX</span>tons
            </div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-nude-400">Admin</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                current === item.id
                  ? 'bg-gold-500/15 text-gold-300 border border-gold-500/20'
                  : 'text-nude-300 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-ink-800">
          <div className="px-4 py-2 mb-2">
            <div className="text-xs text-nude-400">Conectado como</div>
            <div className="text-sm text-white truncate">{config.adminEmail}</div>
          </div>
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-nude-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-ink-950/50" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
