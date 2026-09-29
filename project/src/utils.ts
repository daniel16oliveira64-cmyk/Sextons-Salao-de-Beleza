import type { Appointment, Professional, Service, TimeBlock, WorkingHours } from './types';
import { salonConfig } from './data';

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

export function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
}

export function todayStr(): string {
  return formatDateISO(new Date());
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isPastDate(dateStr: string): boolean {
  const today = todayStr();
  return dateStr < today;
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayStr();
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getWorkingHoursForDate(dateStr: string): WorkingHours | null {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  return salonConfig.workingHours.find((wh) => wh.day === day && wh.enabled) ?? null;
}

export function isSalonOpen(dateStr: string): boolean {
  return getWorkingHoursForDate(dateStr) !== null;
}

export interface Slot {
  time: string;
  available: boolean;
  reason?: string;
}

export function generateTimeSlots(
  dateStr: string,
  professional: Professional,
  service: Service,
  appointments: Appointment[],
  timeBlocks: TimeBlock[],
): Slot[] {
  if (isPastDate(dateStr)) return [];

  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();

  if (!professional.workingDays.includes(day)) return [];

  const workingHours = getWorkingHoursForDate(dateStr);
  if (!workingHours) return [];

  const startMin = Math.max(
    timeToMinutes(professional.workingStart),
    timeToMinutes(workingHours.start),
  );
  const endMin = Math.min(
    timeToMinutes(professional.workingEnd),
    timeToMinutes(workingHours.end),
  );
  const lunchStart = timeToMinutes(workingHours.lunchStart);
  const lunchEnd = timeToMinutes(workingHours.lunchEnd);
  const serviceDur = service.durationMin;

  // Check for full-day blocks
  const dayBlocks = timeBlocks.filter(
    (b) => (b.professionalId === professional.id || b.professionalId === 'all') &&
    b.date === dateStr && b.type === 'dia',
  );
  if (dayBlocks.length > 0) {
    return [];
  }

  const hourBlocks = timeBlocks.filter(
    (b) => (b.professionalId === professional.id || b.professionalId === 'all') &&
    b.date === dateStr && b.type === 'horario',
  );

  const dayAppointments = appointments.filter(
    (a) => a.professionalId === professional.id &&
    a.date === dateStr &&
    a.status !== 'cancelado',
  );

  const slots: Slot[] = [];
  const interval = 30;

  for (let t = startMin; t + serviceDur <= endMin; t += interval) {
    const slotTime = minutesToTime(t);
    const slotEnd = t + serviceDur;

    let available = true;
    let reason: string | undefined;

    // Lunch break
    if (slotEnd > lunchStart && t < lunchEnd) {
      available = false;
      reason = 'Intervalo';
    }

    // Time blocks
    if (available) {
      for (const block of hourBlocks) {
        if (!block.startTime || !block.endTime) continue;
        const bStart = timeToMinutes(block.startTime);
        const bEnd = timeToMinutes(block.endTime);
        if (slotEnd > bStart && t < bEnd) {
          available = false;
          reason = block.reason || 'Indisponível';
          break;
        }
      }
    }

    // Existing appointments
    if (available) {
      for (const apt of dayAppointments) {
        const aptService = appointments.length > 0 ? apt : null;
        const aStart = timeToMinutes(apt.time);
        const aService = findServiceForAppointment(apt);
        const aDur = aService?.durationMin ?? 60;
        const aEnd = aStart + aDur;
        if (slotEnd > aStart && t < aEnd) {
          available = false;
          reason = 'Reservado';
          break;
        }
        void aptService;
      }
    }

    slots.push({ time: slotTime, available, reason });
  }

  return slots;
}

function findServiceForAppointment(_apt: Appointment): Service | undefined {
  return undefined;
}

export function generateTimeSlotsWithContext(
  dateStr: string,
  professional: Professional,
  service: Service,
  appointments: Appointment[],
  timeBlocks: TimeBlock[],
  services: Service[],
): Slot[] {
  if (isPastDate(dateStr)) return [];

  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();

  if (!professional.workingDays.includes(day)) return [];

  const workingHours = getWorkingHoursForDate(dateStr);
  if (!workingHours) return [];

  const startMin = Math.max(
    timeToMinutes(professional.workingStart),
    timeToMinutes(workingHours.start),
  );
  const endMin = Math.min(
    timeToMinutes(professional.workingEnd),
    timeToMinutes(workingHours.end),
  );
  const lunchStart = timeToMinutes(workingHours.lunchStart);
  const lunchEnd = timeToMinutes(workingHours.lunchEnd);
  const serviceDur = service.durationMin;

  const dayBlocks = timeBlocks.filter(
    (b) => (b.professionalId === professional.id || b.professionalId === 'all') &&
    b.date === dateStr && b.type === 'dia',
  );
  if (dayBlocks.length > 0) return [];

  const hourBlocks = timeBlocks.filter(
    (b) => (b.professionalId === professional.id || b.professionalId === 'all') &&
    b.date === dateStr && b.type === 'horario',
  );

  const dayAppointments = appointments.filter(
    (a) => a.professionalId === professional.id &&
    a.date === dateStr &&
    a.status !== 'cancelado',
  );

  const slots: Slot[] = [];
  const interval = 30;

  for (let t = startMin; t + serviceDur <= endMin; t += interval) {
    const slotTime = minutesToTime(t);
    const slotEnd = t + serviceDur;

    let available = true;
    let reason: string | undefined;

    if (slotEnd > lunchStart && t < lunchEnd) {
      available = false;
      reason = 'Intervalo';
    }

    if (available) {
      for (const block of hourBlocks) {
        if (!block.startTime || !block.endTime) continue;
        const bStart = timeToMinutes(block.startTime);
        const bEnd = timeToMinutes(block.endTime);
        if (slotEnd > bStart && t < bEnd) {
          available = false;
          reason = block.reason || 'Indisponível';
          break;
        }
      }
    }

    if (available) {
      for (const apt of dayAppointments) {
        const aptService = services.find((s) => s.id === apt.serviceId);
        const aStart = timeToMinutes(apt.time);
        const aDur = aptService?.durationMin ?? 60;
        const aEnd = aStart + aDur;
        if (slotEnd > aStart && t < aEnd) {
          available = false;
          reason = 'Reservado';
          break;
        }
      }
    }

    slots.push({ time: slotTime, available, reason });
  }

  return slots;
}

export function getFirstAvailableDate(professional: Professional): string {
  const date = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    const dateStr = formatDateISO(d);
    const wh = getWorkingHoursForDate(dateStr);
    if (wh && professional.workingDays.includes(d.getDay())) {
      return dateStr;
    }
  }
  return formatDateISO(date);
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function whatsappScheduleMessage(
  serviceName: string,
  professionalName: string,
  dateStr: string,
  time: string,
  clientName: string,
): string {
  return `Olá! Gostaria de confirmar meu agendamento na Sextons Salão de Beleza.\n\nServiço: ${serviceName}\nProfissional: ${professionalName}\nData: ${formatDateBR(dateStr)}\nHorário: ${time}\nCliente: ${clientName}`;
}

export function whatsappGenericMessage(): string {
  return 'Olá! Gostaria de agendar um horário na Sextons Salão de Beleza.';
}

export function whatsappServiceMessage(serviceName: string): string {
  return `Olá! Gostaria de agendar o serviço de ${serviceName} na Sextons Salão de Beleza. Poderia me informar os horários disponíveis?`;
}

export function whatsappProfessionalMessage(professionalName: string): string {
  return `Olá! Gostaria de verificar os horários disponíveis com ${professionalName} na Sextons Salão de Beleza.`;
}
