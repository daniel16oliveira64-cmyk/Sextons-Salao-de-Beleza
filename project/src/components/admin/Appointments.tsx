import { useState, useMemo } from 'react';
import { Search, X, Eye, Ban } from 'lucide-react';
import { useSalon } from '@/store';
import { STATUS_COLORS, STATUS_LABELS, type AppointmentStatus } from '@/types';
import { formatDateBR, formatPrice, formatDuration } from '@/utils';
import { Modal } from '../Modal';

export function Appointments() {
  const { appointments, services, professionals, cancelAppointment, updateAppointment } = useSalon();
  const [filterDate, setFilterDate] = useState('');
  const [filterProf, setFilterProf] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => {
        if (filterDate && a.date !== filterDate) return false;
        if (filterProf && a.professionalId !== filterProf) return false;
        if (filterService && a.serviceId !== filterService) return false;
        if (filterStatus && a.status !== filterStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!a.clientName.toLowerCase().includes(q) && !a.clientPhone.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [appointments, filterDate, filterProf, filterService, filterStatus, search]);

  const detailApt = detailId ? appointments.find((a) => a.id === detailId) : null;
  const detailSvc = detailApt ? services.find((s) => s.id === detailApt.serviceId) : null;
  const detailProf = detailApt ? professionals.find((p) => p.id === detailApt.professionalId) : null;

  const clearFilters = () => {
    setFilterDate('');
    setFilterProf('');
    setFilterService('');
    setFilterStatus('');
    setSearch('');
  };

  const hasFilters = filterDate || filterProf || filterService || filterStatus || search;

  const statusOptions: (AppointmentStatus | '')[] = ['', 'pendente', 'confirmado', 'cancelado', 'concluido'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ink-900">Agendamentos</h1>
        <p className="text-ink-500 text-sm mt-1">{filtered.length} agendamentos encontrados</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-ink-100 p-4 space-y-3">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-ink-400 mb-1">Data</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm focus:border-gold-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-400 mb-1">Profissional</label>
            <select
              value={filterProf}
              onChange={(e) => setFilterProf(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm focus:border-gold-400 focus:outline-none bg-white"
            >
              <option value="">Todos</option>
              {professionals.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink-400 mb-1">Serviço</label>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm focus:border-gold-400 focus:outline-none bg-white"
            >
              <option value="">Todos</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm focus:border-gold-400 focus:outline-none bg-white"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === '' ? 'Todos' : STATUS_LABELS[s as AppointmentStatus]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink-400 mb-1">Buscar cliente</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome ou telefone"
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-ink-200 text-sm focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-ink-500 hover:text-ink-800 flex items-center gap-1">
            <X className="w-3 h-3" /> Limpar filtros
          </button>
        )}
      </div>

      {/* Table - desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Cliente</th>
              <th className="text-left px-4 py-3 font-medium">Serviço</th>
              <th className="text-left px-4 py-3 font-medium">Profissional</th>
              <th className="text-left px-4 py-3 font-medium">Data</th>
              <th className="text-left px-4 py-3 font-medium">Horário</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-6 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filtered.map((apt) => {
              const svc = services.find((s) => s.id === apt.serviceId);
              const prof = professionals.find((p) => p.id === apt.professionalId);
              return (
                <tr key={apt.id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ink-900">{apt.clientName}</div>
                    <div className="text-xs text-ink-400">{apt.clientPhone}</div>
                  </td>
                  <td className="px-4 py-4 text-ink-700">{svc?.name || '—'}</td>
                  <td className="px-4 py-4 text-ink-700">{prof?.name || '—'}</td>
                  <td className="px-4 py-4 text-ink-700">{formatDateBR(apt.date)}</td>
                  <td className="px-4 py-4 text-ink-700 font-medium">{apt.time}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[apt.status]}`}>
                      {STATUS_LABELS[apt.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetailId(apt.id)}
                        className="p-2 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {apt.status !== 'cancelado' && apt.status !== 'concluido' && (
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Cancelar"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink-400">
            <p>Nenhum agendamento encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Cards - mobile */}
      <div className="lg:hidden space-y-3">
        {filtered.map((apt) => {
          const svc = services.find((s) => s.id === apt.serviceId);
          const prof = professionals.find((p) => p.id === apt.professionalId);
          return (
            <div key={apt.id} className="bg-white rounded-2xl border border-ink-100 p-4" onClick={() => setDetailId(apt.id)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-ink-900">{apt.clientName}</div>
                  <div className="text-xs text-ink-400">{apt.clientPhone}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[apt.status]}`}>
                  {STATUS_LABELS[apt.status]}
                </span>
              </div>
              <div className="text-sm text-ink-600">{svc?.name} — {prof?.name}</div>
              <div className="text-sm text-ink-500 mt-1">{formatDateBR(apt.date)} às {apt.time}</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink-400 bg-white rounded-2xl border border-ink-100">
            <p>Nenhum agendamento encontrado.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detailApt} onClose={() => setDetailId(null)} title="Detalhes do Agendamento" size="sm">
        {detailApt && detailSvc && detailProf && (
          <div className="space-y-4">
            <div className="bg-nude-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Cliente</span>
                <span className="font-medium text-ink-900">{detailApt.clientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Telefone</span>
                <span className="font-medium text-ink-900">{detailApt.clientPhone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Serviço</span>
                <span className="font-medium text-ink-900">{detailSvc.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Profissional</span>
                <span className="font-medium text-ink-900">{detailProf.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Data</span>
                <span className="font-medium text-ink-900">{formatDateBR(detailApt.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Horário</span>
                <span className="font-medium text-ink-900">{detailApt.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Duração</span>
                <span className="font-medium text-ink-900">{formatDuration(detailSvc.durationMin)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-nude-200">
                <span className="text-ink-500">Valor</span>
                <span className="font-serif text-lg font-semibold text-ink-900">{formatPrice(detailSvc.price)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-500">Status:</span>
              <div className="flex gap-2">
                {(['pendente', 'confirmado', 'concluido'] as AppointmentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => { updateAppointment(detailApt.id, { status: st }); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${detailApt.status === st ? STATUS_COLORS[st] : 'border-ink-200 text-ink-400 hover:border-ink-300'}`}
                  >
                    {STATUS_LABELS[st]}
                  </button>
                ))}
              </div>
            </div>

            {detailApt.status !== 'cancelado' && (
              <button
                onClick={() => { cancelAppointment(detailApt.id); setDetailId(null); }}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Ban className="w-4 h-4" /> Cancelar agendamento
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
