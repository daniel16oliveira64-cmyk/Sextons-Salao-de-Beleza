import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Service, Professional, Appointment, TimeBlock, SalonConfig } from './types';
import {
  seedServices,
  seedProfessionals,
  seedAppointments,
  seedTimeBlocks,
  salonConfig as initialConfig,
} from './data';

const STORAGE_KEY = 'sextons-salon-data-v1';

interface SalonData {
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  config: SalonConfig;
}

interface SalonContextValue extends SalonData {
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  removeTimeBlock: (id: string) => void;
  addService: (svc: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addProfessional: (prof: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, updates: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  updateConfig: (updates: Partial<SalonConfig>) => void;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
}

const SalonContext = createContext<SalonContextValue | null>(null);

function loadData(): SalonData {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SalonData;
        if (parsed.services && parsed.professionals && parsed.config) {
          return parsed;
        }
      } catch {
        // fall through to defaults
      }
    }
  }
  return {
    services: seedServices,
    professionals: seedProfessionals,
    appointments: seedAppointments,
    timeBlocks: seedTimeBlocks,
    config: initialConfig,
  };
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function SalonProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SalonData>(loadData);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addAppointment: SalonContextValue['addAppointment'] = (apt) => {
    const newApt: Appointment = {
      ...apt,
      id: generateId('apt'),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, appointments: [...prev.appointments, newApt] }));
    return newApt;
  };

  const updateAppointment: SalonContextValue['updateAppointment'] = (id, updates) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const cancelAppointment: SalonContextValue['cancelAppointment'] = (id) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelado' as const } : a,
      ),
    }));
  };

  const deleteAppointment: SalonContextValue['deleteAppointment'] = (id) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((a) => a.id !== id),
    }));
  };

  const addTimeBlock: SalonContextValue['addTimeBlock'] = (block) => {
    setData((prev) => ({
      ...prev,
      timeBlocks: [...prev.timeBlocks, { ...block, id: generateId('blk') }],
    }));
  };

  const removeTimeBlock: SalonContextValue['removeTimeBlock'] = (id) => {
    setData((prev) => ({
      ...prev,
      timeBlocks: prev.timeBlocks.filter((b) => b.id !== id),
    }));
  };

  const addService: SalonContextValue['addService'] = (svc) => {
    setData((prev) => ({
      ...prev,
      services: [...prev.services, { ...svc, id: generateId('svc') }],
    }));
  };

  const updateService: SalonContextValue['updateService'] = (id, updates) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteService: SalonContextValue['deleteService'] = (id) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  const addProfessional: SalonContextValue['addProfessional'] = (prof) => {
    setData((prev) => ({
      ...prev,
      professionals: [...prev.professionals, { ...prof, id: generateId('prof') }],
    }));
  };

  const updateProfessional: SalonContextValue['updateProfessional'] = (id, updates) => {
    setData((prev) => ({
      ...prev,
      professionals: prev.professionals.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deleteProfessional: SalonContextValue['deleteProfessional'] = (id) => {
    setData((prev) => ({
      ...prev,
      professionals: prev.professionals.filter((p) => p.id !== id),
    }));
  };

  const updateConfig: SalonContextValue['updateConfig'] = (updates) => {
    setData((prev) => ({ ...prev, config: { ...prev.config, ...updates } }));
  };

  const adminLogin: SalonContextValue['adminLogin'] = (email, password) => {
    if (email.trim().toLowerCase() === data.config.adminEmail.toLowerCase() && password === data.config.adminPassword) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => setIsAdminLoggedIn(false);

  const value: SalonContextValue = {
    ...data,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    addTimeBlock,
    removeTimeBlock,
    addService,
    updateService,
    deleteService,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    updateConfig,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  };

  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>;
}

export function useSalon() {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error('useSalon must be used within SalonProvider');
  return ctx;
}
