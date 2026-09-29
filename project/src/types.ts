export type ServiceCategory =
  | 'cabelo'
  | 'coloracao'
  | 'tratamento'
  | 'sobrancelha'
  | 'unhas'
  | 'estetica';

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  category: ServiceCategory;
  active: boolean;
  professionalIds: string[];
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photo: string;
  active: boolean;
  serviceIds: string[];
  workingDays: number[];
  workingStart: string;
  workingEnd: string;
}

export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado' | 'concluido';

export interface Appointment {
  id: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  status: AppointmentStatus;
  createdAt: string;
}

export type BlockType = 'horario' | 'dia';

export interface TimeBlock {
  id: string;
  professionalId: string | 'all';
  date: string;
  startTime?: string;
  endTime?: string;
  type: BlockType;
  reason?: string;
}

export interface WorkingHours {
  day: number;
  enabled: boolean;
  start: string;
  end: string;
  lunchStart: string;
  lunchEnd: string;
}

export interface SalonConfig {
  name: string;
  tagline: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  email: string;
  workingHours: WorkingHours[];
  adminEmail: string;
  adminPassword: string;
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  cabelo: 'Cabelo',
  coloracao: 'Coloração',
  tratamento: 'Tratamento',
  sobrancelha: 'Sobrancelha',
  unhas: 'Unhas',
  estetica: 'Estética',
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
};

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pendente: 'bg-gold-100 text-gold-800 border-gold-300',
  confirmado: 'bg-green-100 text-green-700 border-green-300',
  cancelado: 'bg-red-100 text-red-700 border-red-300',
  concluido: 'bg-blue-100 text-blue-700 border-blue-300',
};

export const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
