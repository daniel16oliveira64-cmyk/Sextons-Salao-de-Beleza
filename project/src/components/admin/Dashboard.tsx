import { useMemo } from 'react';
import { Calendar, Clock, TrendingUp, Users, Scissors, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useSalon } from '@/store';
import { STATUS_COLORS, STATUS_LABELS } from '@/types';
import { formatPrice, formatDateBR, todayStr, formatDateISO } from '@/utils';

export function Dashboard() {
  const { appointments, services, professionals } = useSalon();
  const today = todayStr();

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === today && a.status !== 'cancelado'),
    [appointments, today],
  );

  const weekAppointments = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const startStr = formatDateISO(weekStart);
    const endStr = formatDateISO(weekEnd);
    return appointments.filter((a) => a.date >= startStr && a.date <= endStr && a.status !== 'cancelado');
  }, [appointments]);

  const upcomingAppointments = useMemo(
    () => appointments
      .filter((a) => a.date >= today && a.status !== 'cancelado' && a.status !== 'concluido')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 6),
    [appointments, today],
  );

  const totalRevenue = useMemo(
    () => appointments
      .filter((a) => a.status === 'concluido')
      .reduce((sum, a) => {
        const svc = services.find((s) => s.id === a.serviceId);
        return sum + (svc?.price ?? 0);
      }, 0),
    [appointments, services],
  );

  const stats = [
    { label: 'Agendamentos Hoje', value: todayAppointments.length, icon: Calendar, color: 'text-gold-600', bg: 'bg-gold-500/10' },
    { label: 'Agendamentos da Semana', value: weekAppointments.length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Total de Agendamentos', value: appointments.length, icon: ClipboardListIcon, color: 'text-nude-600', bg: 'bg-nude-500/10' },
    { label: 'Receita (Concluídos)', value: formatPrice(totalRevenue), icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-500/10' },
  ];

  const secondaryStats = [
    { label: 'Profissionais Ativos', value: professionals.filter((p) => p.active).length, icon: Users },
    { label: 'Serviços Ativos', value: services.filter((s) => s.active).length, icon: Scissors },
    { label: 'Concluídos', value: appointments.filter((a) => a.status === 'concluido').length, icon: CheckCircle2 },
    { label: 'Pendentes', value: appointments.filter((a) => a.status === 'pendente').length, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ink-900">Dashboard</h1>
        <p className="text-ink-500 text-sm mt-1">Visão geral do seu salão</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-ink-100 hover:shadow-card transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-serif font-bold text-ink-900">{stat.value}</div>
            <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => (
          <div key={stat.label} className="bg-nude-50 rounded-xl p-4 border border-nude-100">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-nude-600" />
              <span className="text-xs text-ink-500">{stat.label}</span>
            </div>
            <div className="text-xl font-serif font-bold text-ink-800">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink-900">Próximos Atendimentos</h2>
          <span className="text-xs text-ink-400">{upcomingAppointments.length} agendamentos</span>
        </div>
        {upcomingAppointments.length === 0 ? (
          <div className="px-6 py-12 text-center text-ink-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-ink-200" />
            <p>Nenhum atendimento próximo.</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-50">
            {upcomingAppointments.map((apt) => {
              const svc = services.find((s) => s.id === apt.serviceId);
              const prof = professionals.find((p) => p.id === apt.professionalId);
              return (
                <div key={apt.id} className="px-6 py-4 flex items-center gap-4 hover:bg-ink-50/50 transition-colors">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xs text-ink-400">{formatDateBR(apt.date).slice(0, 5)}</div>
                    <div className="font-serif text-lg text-ink-900">{apt.time}</div>
                  </div>
                  <div className="w-px h-10 bg-ink-100" />
                  <div className="flex-grow min-w-0">
                    <div className="font-medium text-ink-900 truncate">{apt.clientName}</div>
                    <div className="text-sm text-ink-500 truncate">
                      {svc?.name} — {prof?.name}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[apt.status]}`}>
                    {STATUS_LABELS[apt.status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ClipboardListIcon({ className }: { className: string }) {
  return <ClipboardList className={className} />;
}

import { ClipboardList } from 'lucide-react';
