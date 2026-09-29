import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Ban, CalendarOff, X, Plus, Clock } from 'lucide-react';
import { useSalon } from '@/store';
import { DAY_SHORT, STATUS_COLORS, STATUS_LABELS } from '@/types';
import {
  formatDateISO,
  formatDateBR,
  todayStr,
  isToday,
  isPastDate,
  getWorkingHoursForDate,
} from '@/utils';
import { Modal } from '../Modal';

export function Agenda() {
  const { appointments, services, professionals, timeBlocks, addTimeBlock, removeTimeBlock, cancelAppointment } = useSalon();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockType, setBlockType] = useState<'horario' | 'dia'>('horario');
  const [blockProfId, setBlockProfId] = useState<string>('all');
  const [blockStart, setBlockStart] = useState('14:00');
  const [blockEnd, setBlockEnd] = useState('15:00');
  const [blockReason, setBlockReason] = useState('');

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const days: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(formatDateISO(new Date(year, month, d)));
    }
    return days;
  }, [currentDate]);

  const monthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const getAppointmentsForDate = (date: string) =>
    appointments.filter((a) => a.date === date && a.status !== 'cancelado');

  const getBlocksForDate = (date: string) =>
    timeBlocks.filter((b) => b.date === date);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time)) : [];
  const selectedBlocks = selectedDate ? getBlocksForDate(selectedDate) : [];
  const selectedWorkingHours = selectedDate ? getWorkingHoursForDate(selectedDate) : null;

  const handleBlock = () => {
    if (!selectedDate) return;
    addTimeBlock({
      professionalId: blockProfId,
      date: selectedDate,
      startTime: blockType === 'horario' ? blockStart : undefined,
      endTime: blockType === 'horario' ? blockEnd : undefined,
      type: blockType,
      reason: blockReason || undefined,
    });
    setBlockModalOpen(false);
    setBlockReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink-900">Agenda</h1>
          <p className="text-ink-500 text-sm mt-1">Gerencie horários e bloqueios</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-ink-200 hover:bg-ink-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-serif text-xl text-ink-900 capitalize min-w-[180px] text-center">{monthLabel}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-ink-200 hover:bg-ink-50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-ink-100 p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {DAY_SHORT.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-ink-400 py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((date, idx) => {
              if (!date) return <div key={idx} />;
              const apts = getAppointmentsForDate(date);
              const blocks = getBlocksForDate(date);
              const dayBlocked = blocks.some((b) => b.type === 'dia');
              const isCurrent = isToday(date);
              const isPast = isPastDate(date);
              const wh = getWorkingHoursForDate(date);
              const isClosed = !wh;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square sm:min-h-[70px] p-1 sm:p-2 rounded-lg border-2 text-left transition-all relative ${
                    selectedDate === date
                      ? 'border-gold-400 bg-gold-50'
                      : isCurrent
                      ? 'border-gold-300 bg-white'
                      : 'border-ink-100 bg-white hover:border-ink-200'
                  }`}
                >
                  <div className={`text-xs sm:text-sm font-medium ${isPast ? 'text-ink-300' : 'text-ink-700'}`}>
                    {parseInt(date.split('-')[2])}
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
                    {dayBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                    {isClosed && !dayBlocked && <span className="w-1.5 h-1.5 rounded-full bg-ink-200" />}
                    {apts.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                    {blocks.some((b) => b.type === 'horario') && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                  </div>
                  {apts.length > 0 && (
                    <div className="hidden sm:block text-[10px] text-ink-400 mt-0.5">{apts.length} ag.</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div className="bg-white rounded-2xl border border-ink-100 p-5">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl text-ink-900 capitalize">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
                </h2>
              </div>

              {selectedWorkingHours ? (
                <div className="text-xs text-ink-500 mb-4 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  Funcionamento: {selectedWorkingHours.start} — {selectedWorkingHours.end}
                </div>
              ) : (
                <div className="text-xs text-red-500 mb-4 bg-red-50 rounded-lg px-3 py-2">Salão fechado neste dia</div>
              )}

              <div className="space-y-2 mb-4">
                <button
                  onClick={() => { setBlockType('horario'); setBlockModalOpen(true); }}
                  className="w-full flex items-center gap-2 bg-nude-50 text-nude-700 py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-nude-100 transition-colors"
                >
                  <Ban className="w-4 h-4" /> Bloquear horário
                </button>
                <button
                  onClick={() => { setBlockType('dia'); setBlockModalOpen(true); }}
                  className="w-full flex items-center gap-2 bg-red-50 text-red-600 py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <CalendarOff className="w-4 h-4" /> Bloquear dia inteiro
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-ink-400 font-medium">Agendamentos</h3>
                {selectedAppointments.length === 0 ? (
                  <p className="text-sm text-ink-400 py-3">Nenhum agendamento.</p>
                ) : (
                  selectedAppointments.map((apt) => {
                    const svc = services.find((s) => s.id === apt.serviceId);
                    const prof = professionals.find((p) => p.id === apt.professionalId);
                    return (
                      <div key={apt.id} className="bg-nude-50 rounded-xl p-3 group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif text-lg text-ink-900">{apt.time}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[apt.status]}`}>
                            {STATUS_LABELS[apt.status]}
                          </span>
                        </div>
                        <div className="text-sm text-ink-700">{apt.clientName}</div>
                        <div className="text-xs text-ink-500">{svc?.name} — {prof?.name}</div>
                        <div className="text-xs text-ink-400">{apt.clientPhone}</div>
                        {apt.status !== 'cancelado' && (
                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" /> Cancelar
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {selectedBlocks.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-ink-400 font-medium">Bloqueios</h3>
                  {selectedBlocks.map((block) => {
                    const prof = block.professionalId === 'all' ? null : professionals.find((p) => p.id === block.professionalId);
                    return (
                      <div key={block.id} className="bg-red-50 rounded-xl p-3 group">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-red-700">
                              {block.type === 'dia' ? 'Dia inteiro bloqueado' : `${block.startTime} — ${block.endTime}`}
                            </div>
                            <div className="text-xs text-red-500">
                              {prof ? prof.name : 'Todos os profissionais'}
                              {block.reason && ` — ${block.reason}`}
                            </div>
                          </div>
                          <button
                            onClick={() => removeTimeBlock(block.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-ink-400">
              <CalendarOff className="w-10 h-10 mx-auto mb-3 text-ink-200" />
              <p>Selecione um dia no calendário</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={blockModalOpen} onClose={() => setBlockModalOpen(false)} title={blockType === 'dia' ? 'Bloquear Dia Inteiro' : 'Bloquear Horário'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">Profissional</label>
            <select
              value={blockProfId}
              onChange={(e) => setBlockProfId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
            >
              <option value="all">Todos os profissionais</option>
              {professionals.filter((p) => p.active).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {blockType === 'horario' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Início</label>
                <input
                  type="time"
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Fim</label>
                <input
                  type="time"
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">Motivo (opcional)</label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Almoço, compromisso, etc."
              className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="bg-nude-50 rounded-lg px-3 py-2 text-xs text-ink-500">
            Data: <strong>{selectedDate && formatDateBR(selectedDate)}</strong>
          </div>

          <button
            onClick={handleBlock}
            className="w-full bg-ink-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-ink-800 transition-all active:scale-95"
          >
            Confirmar bloqueio
          </button>
        </div>
      </Modal>
    </div>
  );
}

import { CalendarOff as CalendarOffIcon } from 'lucide-react';
void CalendarOffIcon;
void Plus;
