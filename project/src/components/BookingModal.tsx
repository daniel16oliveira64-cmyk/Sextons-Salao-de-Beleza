import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Check, ChevronRight, ChevronLeft, MessageCircle, Scissors } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useSalon } from '@/store';
import { CATEGORY_LABELS } from '@/types';
import {
  formatPrice,
  formatDuration,
  formatDateBR,
  formatDateLong,
  formatDateISO,
  todayStr,
  generateTimeSlotsWithContext,
  getFirstAvailableDate,
  buildWhatsAppUrl,
  whatsappScheduleMessage,
  isSalonOpen,
} from '@/utils';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialProfessionalId?: string;
}

type Step = 'service' | 'professional' | 'date' | 'time' | 'details' | 'success';

export function BookingModal({ open, onClose, initialServiceId, initialProfessionalId }: BookingModalProps) {
  const { services, professionals, appointments, timeBlocks, config, addAppointment } = useSalon();

  const [step, setStep] = useState<Step>('service');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<{ id: string; serviceId: string; professionalId: string; date: string; time: string; clientName: string } | null>(null);

  useEffect(() => {
    if (open) {
      setStep('service');
      setSelectedTime('');
      setClientName('');
      setClientPhone('');
      setCreatedAppointment(null);
      if (initialServiceId) {
        setSelectedServiceId(initialServiceId);
        if (initialProfessionalId) {
          setSelectedProfessionalId(initialProfessionalId);
          setStep('date');
        } else {
          setStep('professional');
        }
      } else if (initialProfessionalId) {
        setSelectedProfessionalId(initialProfessionalId);
        setStep('service');
      } else {
        setSelectedServiceId('');
        setSelectedProfessionalId('');
      }
    }
  }, [open, initialServiceId, initialProfessionalId]);

  const activeServices = services.filter((s) => s.active);
  const activeProfessionals = professionals.filter((p) => p.active);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId);

  const availableProfessionals = useMemo(() => {
    if (!selectedServiceId) return activeProfessionals;
    return activeProfessionals.filter((p) => p.serviceIds.includes(selectedServiceId));
  }, [selectedServiceId, activeProfessionals]);

  const availableServices = useMemo(() => {
    if (!selectedProfessionalId) return activeServices;
    return activeServices.filter((s) => s.professionalIds.includes(selectedProfessionalId));
  }, [selectedProfessionalId, activeServices]);

  const slots = useMemo(() => {
    if (!selectedService || !selectedProfessional || !selectedDate) return [];
    return generateTimeSlotsWithContext(
      selectedDate,
      selectedProfessional,
      selectedService,
      appointments,
      timeBlocks,
      services,
    );
  }, [selectedService, selectedProfessional, selectedDate, appointments, timeBlocks, services]);

  const steps: { key: Step; label: string }[] = [
    { key: 'service', label: 'Serviço' },
    { key: 'professional', label: 'Profissional' },
    { key: 'date', label: 'Data' },
    { key: 'time', label: 'Horário' },
    { key: 'details', label: 'Seus dados' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    if (!selectedProfessionalId || !services.find((s) => s.id === id)?.professionalIds.includes(selectedProfessionalId)) {
      setSelectedProfessionalId('');
      setStep('professional');
    } else {
      setStep('date');
    }
  };

  const handleSelectProfessional = (id: string) => {
    setSelectedProfessionalId(id);
    setSelectedDate('');
    setSelectedTime('');
    setStep('date');
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep('time');
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleConfirm = () => {
    if (!selectedServiceId || !selectedProfessionalId || !selectedDate || !selectedTime || !clientName.trim() || !clientPhone.trim()) return;
    const apt = addAppointment({
      serviceId: selectedServiceId,
      professionalId: selectedProfessionalId,
      date: selectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      status: 'pendente',
    });
    setCreatedAppointment({
      id: apt.id,
      serviceId: apt.serviceId,
      professionalId: apt.professionalId,
      date: apt.date,
      time: apt.time,
      clientName: apt.clientName,
    });
    setStep('success');
  };

  const canGoBack = step !== 'service' && step !== 'success';
  const goBack = () => {
    if (step === 'professional') setStep('service');
    else if (step === 'date') setStep('professional');
    else if (step === 'time') setStep('date');
    else if (step === 'details') setStep('time');
  };

  // Generate next 14 days for date selection
  const upcomingDays = useMemo(() => {
    const days: { date: string; label: string; dayName: string; dayNum: string; month: string; available: boolean }[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = formatDateISO(d);
      const prof = professionals.find((p) => p.id === selectedProfessionalId);
      const isOpen = isSalonOpen(dateStr);
      const profWorks = prof ? prof.workingDays.includes(d.getDay()) : false;
      days.push({
        date: dateStr,
        label: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : formatDateBR(dateStr),
        dayName: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()],
        dayNum: String(d.getDate()),
        month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()],
        available: isOpen && profWorks,
      });
    }
    return days;
  }, [selectedProfessionalId, professionals]);

  const successService = createdAppointment ? services.find((s) => s.id === createdAppointment.serviceId) : null;
  const successProfessional = createdAppointment ? professionals.find((p) => p.id === createdAppointment.professionalId) : null;

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink-900">Agendar Horário</h2>
            <p className="text-sm text-ink-500">Reserve seu momento de beleza</p>
          </div>
        </div>
      </div>

      {step !== 'success' && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {steps.map((s, idx) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${idx <= currentStepIndex ? 'text-gold-700' : 'text-ink-300'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${idx < currentStepIndex ? 'bg-gold-500 text-ink-900' : idx === currentStepIndex ? 'bg-gold-500/20 text-gold-700 border-2 border-gold-400' : 'bg-ink-100 text-ink-300'}`}>
                    {idx < currentStepIndex ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                </div>
                {idx < steps.length - 1 && <div className={`h-px flex-1 mx-2 ${idx < currentStepIndex ? 'bg-gold-400' : 'bg-ink-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 pb-6 max-h-[50vh] overflow-y-auto">
        {/* Step: Service */}
        {step === 'service' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-500 mb-4">Escolha o serviço que deseja agendar:</p>
            {availableServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-gold-300 hover:shadow-soft ${selectedServiceId === service.id ? 'border-gold-400 bg-gold-50' : 'border-ink-100 bg-white'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-lg text-ink-900">{service.name}</span>
                      <span className="text-xs text-nude-600 bg-nude-50 px-2 py-0.5 rounded-full">{CATEGORY_LABELS[service.category]}</span>
                    </div>
                    <p className="text-xs text-ink-500 leading-relaxed mb-2">{service.description}</p>
                    <div className="flex items-center gap-3 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(service.durationMin)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-serif text-xl text-ink-900 font-semibold">{formatPrice(service.price)}</div>
                    <ChevronRight className="w-5 h-5 text-ink-300 ml-auto mt-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step: Professional */}
        {step === 'professional' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-500 mb-4">Escolha o profissional para seu atendimento:</p>
            {availableProfessionals.length === 0 && (
              <div className="text-center py-8 text-ink-400">
                <p>Nenhum profissional disponível para este serviço.</p>
              </div>
            )}
            {availableProfessionals.map((prof) => (
              <button
                key={prof.id}
                onClick={() => handleSelectProfessional(prof.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-gold-300 hover:shadow-soft flex items-center gap-4 ${selectedProfessionalId === prof.id ? 'border-gold-400 bg-gold-50' : 'border-ink-100 bg-white'}`}
              >
                <img src={prof.photo} alt={prof.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-serif text-lg text-ink-900">{prof.name}</div>
                  <div className="text-sm text-gold-600">{prof.specialty}</div>
                  <div className="text-xs text-ink-400 mt-1">{prof.workingStart} — {prof.workingEnd}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-ink-300 flex-shrink-0" />
              </button>
            ))}
            <button onClick={() => setStep('service')} className="w-full text-center text-sm text-ink-400 hover:text-ink-700 py-2 mt-2">
              Voltar para serviços
            </button>
          </div>
        )}

        {/* Step: Date */}
        {step === 'date' && selectedProfessional && (
          <div>
            <p className="text-sm text-ink-500 mb-4">Escolha a data do seu atendimento com <strong className="text-ink-800">{selectedProfessional.name}</strong>:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {upcomingDays.map((day) => (
                <button
                  key={day.date}
                  onClick={() => day.available && handleSelectDate(day.date)}
                  disabled={!day.available}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${!day.available ? 'border-ink-100 bg-ink-50 text-ink-300 cursor-not-allowed' : selectedDate === day.date ? 'border-gold-400 bg-gold-50' : 'border-ink-100 bg-white hover:border-gold-300 hover:shadow-soft'}`}
                >
                  <div className="text-xs text-ink-400 uppercase">{day.dayName}</div>
                  <div className="font-serif text-xl text-ink-900 my-1">{day.dayNum}</div>
                  <div className="text-xs text-ink-500">{day.month}</div>
                  {!day.available && <div className="text-[10px] text-ink-300 mt-1">Indisponível</div>}
                </button>
              ))}
            </div>
            {canGoBack && (
              <button onClick={goBack} className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700 py-2 mt-4">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            )}
          </div>
        )}

        {/* Step: Time */}
        {step === 'time' && selectedService && selectedProfessional && selectedDate && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-ink-500">
                Horários para <strong className="text-ink-800">{formatDateLong(selectedDate)}</strong>
              </p>
            </div>
            {slots.length === 0 ? (
              <div className="text-center py-8 text-ink-400">
                <Clock className="w-10 h-10 mx-auto mb-3 text-ink-200" />
                <p>Não há horários disponíveis para esta data.</p>
                <button onClick={goBack} className="text-sm text-gold-600 hover:text-gold-700 mt-3">Escolher outra data</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && handleSelectTime(slot.time)}
                      disabled={!slot.available}
                      className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all ${!slot.available ? 'bg-ink-100 text-ink-300 cursor-not-allowed line-through' : selectedTime === slot.time ? 'bg-gold-500 text-ink-900' : 'bg-white border border-ink-200 text-ink-700 hover:border-gold-300 hover:bg-gold-50'}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-ink-200" /> Disponível</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-ink-100" /> Indisponível</div>
                </div>
                {canGoBack && (
                  <button onClick={goBack} className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700 py-2 mt-4">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step: Details */}
        {step === 'details' && selectedService && selectedProfessional && (
          <div className="space-y-5">
            <div className="bg-nude-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Serviço</span>
                <span className="font-medium text-ink-900">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Profissional</span>
                <span className="font-medium text-ink-900">{selectedProfessional.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Data</span>
                <span className="font-medium text-ink-900">{formatDateBR(selectedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Horário</span>
                <span className="font-medium text-ink-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-nude-200">
                <span className="text-ink-500">Valor</span>
                <span className="font-serif text-lg font-semibold text-ink-900">{formatPrice(selectedService.price)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Seu nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-ink-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(47) 90000-0000"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-ink-900"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {canGoBack && (
                <Button variant="outline" size="md" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleConfirm}
                disabled={!clientName.trim() || !clientPhone.trim()}
              >
                Confirmar Agendamento <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && createdAppointment && successService && successProfessional && (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-serif text-3xl text-ink-900 mb-2">Agendamento realizado com sucesso!</h3>
            <p className="text-ink-500 mb-6">Seu horário foi reservado. Confirme pelo WhatsApp para garantir.</p>

            <div className="bg-nude-50 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Serviço</span>
                <span className="font-medium text-ink-900">{successService.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Profissional</span>
                <span className="font-medium text-ink-900">{successProfessional.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Data</span>
                <span className="font-medium text-ink-900">{formatDateBR(createdAppointment.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Horário</span>
                <span className="font-medium text-ink-900">{createdAppointment.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Cliente</span>
                <span className="font-medium text-ink-900">{createdAppointment.clientName}</span>
              </div>
            </div>

            <a
              href={buildWhatsAppUrl(config.whatsapp, whatsappScheduleMessage(
                successService.name,
                successProfessional.name,
                createdAppointment.date,
                createdAppointment.time,
                createdAppointment.clientName,
              ))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-[#1da851] transition-all active:scale-95 mb-3"
            >
              <MessageCircle className="w-5 h-5" />
              Confirmar pelo WhatsApp
            </a>

            <button
              onClick={onClose}
              className="block w-full text-center text-sm text-ink-400 hover:text-ink-700 py-2"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
