import type { SalonConfig, Service, Professional, Appointment, TimeBlock } from './types';

export const salonConfig: SalonConfig = {
  name: 'SEXTons',
  tagline: 'Salão de Beleza',
  city: 'Balneário Camboriú',
  state: 'SC',
  address: 'Av. Central, 000 — Centro, Balneário Camboriú — SC',
  phone: '(47) 3000-0000',
  whatsapp: '5547900000000',
  instagram: '@sextons.salao',
  email: 'contato@sextons.com.br',
  adminEmail: 'admin@sextons.com.br',
  adminPassword: 'sextons2026',
  workingHours: [
    { day: 0, enabled: false, start: '09:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    { day: 1, enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    { day: 2, enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    { day: 3, enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    { day: 4, enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    { day: 5, enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    { day: 6, enabled: true, start: '08:00', end: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
  ],
};

export const seedServices: Service[] = [
  {
    id: 'svc-1',
    name: 'Corte Feminino',
    description: 'Corte personalizado com finalização, adaptado ao seu estilo e tipo de cabelo.',
    durationMin: 60,
    price: 120,
    category: 'cabelo',
    active: true,
    professionalIds: ['prof-1', 'prof-2'],
  },
  {
    id: 'svc-2',
    name: 'Escova',
    description: 'Finalização com escova modeladora para um acabamento liso e volumoso.',
    durationMin: 45,
    price: 80,
    category: 'cabelo',
    active: true,
    professionalIds: ['prof-1', 'prof-2', 'prof-3'],
  },
  {
    id: 'svc-3',
    name: 'Coloração',
    description: 'Coloração global com produtos de alta qualidade para cobertura e brilho.',
    durationMin: 120,
    price: 280,
    category: 'coloracao',
    active: true,
    professionalIds: ['prof-1', 'prof-2'],
  },
  {
    id: 'svc-4',
    name: 'Mechas',
    description: 'Mechas luminosas para iluminar e dar dimensão ao seu visual.',
    durationMin: 180,
    price: 450,
    category: 'coloracao',
    active: true,
    professionalIds: ['prof-1'],
  },
  {
    id: 'svc-5',
    name: 'Tratamento Capilar',
    description: 'Reconstrução profunda para devolver força, hidratação e brilho aos fios.',
    durationMin: 60,
    price: 150,
    category: 'tratamento',
    active: true,
    professionalIds: ['prof-1', 'prof-2'],
  },
  {
    id: 'svc-6',
    name: 'Design de Sobrancelhas',
    description: 'Design personalizado com técnicas de henna para valorizar o olhar.',
    durationMin: 30,
    price: 60,
    category: 'sobrancelha',
    active: true,
    professionalIds: ['prof-3'],
  },
  {
    id: 'svc-7',
    name: 'Manicure',
    description: 'Cuidado completo das unhas das mãos com esmaltação premium.',
    durationMin: 45,
    price: 55,
    category: 'unhas',
    active: true,
    professionalIds: ['prof-3'],
  },
  {
    id: 'svc-8',
    name: 'Pedicure',
    description: 'Tratamento completo para os pés com esmaltação e hidratação.',
    durationMin: 60,
    price: 70,
    category: 'unhas',
    active: true,
    professionalIds: ['prof-3'],
  },
  {
    id: 'svc-9',
    name: 'Limpeza de Pele',
    description: 'Limpeza facial profunda para renovar e revitalizar a pele.',
    durationMin: 75,
    price: 180,
    category: 'estetica',
    active: true,
    professionalIds: ['prof-2'],
  },
];

export const seedProfessionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Mariana Lopes',
    specialty: 'Hair Stylist & Colorista',
    bio: 'Especialista em cortes femininos e coloração, com mais de 8 anos de experiência transformando looks.',
    photo: 'https://images.pexels.com/photos/3993458/pexels-photo-3993458.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    active: true,
    serviceIds: ['svc-1', 'svc-2', 'svc-3', 'svc-4', 'svc-5'],
    workingDays: [1, 2, 3, 4, 5, 6],
    workingStart: '08:00',
    workingEnd: '18:00',
  },
  {
    id: 'prof-2',
    name: 'Juliana Ferreira',
    specialty: 'Colorista & Esteticista',
    bio: 'Apaixonada por beleza e estética, combina técnicas modernas com cuidado personalizado para cada cliente.',
    photo: 'https://images.pexels.com/photos/3993302/pexels-photo-3993302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    active: true,
    serviceIds: ['svc-1', 'svc-2', 'svc-3', 'svc-5', 'svc-9'],
    workingDays: [1, 2, 3, 4, 5],
    workingStart: '09:00',
    workingEnd: '18:00',
  },
  {
    id: 'prof-3',
    name: 'Camila Souza',
    specialty: 'Sobrancelhas & Unhas',
    bio: 'Designer de sobrancelhas e especialista em unhas, dedicada a realçar a beleza natural de cada cliente.',
    photo: 'https://images.pexels.com/photos/3992860/pexels-photo-3992860.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    active: true,
    serviceIds: ['svc-2', 'svc-6', 'svc-7', 'svc-8'],
    workingDays: [2, 3, 4, 5, 6],
    workingStart: '08:00',
    workingEnd: '17:00',
  },
];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getSeedAppointments(): Appointment[] {
  const today = new Date();
  const appointments: Appointment[] = [];

  const todayStr = formatDate(today);
  appointments.push(
    {
      id: 'apt-seed-1',
      serviceId: 'svc-1',
      professionalId: 'prof-1',
      date: todayStr,
      time: '09:00',
      clientName: 'Beatriz Almeida',
      clientPhone: '(47) 98888-1111',
      status: 'confirmado',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-seed-2',
      serviceId: 'svc-3',
      professionalId: 'prof-1',
      date: todayStr,
      time: '14:00',
      clientName: 'Patrícia Rocha',
      clientPhone: '(47) 97777-2222',
      status: 'pendente',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-seed-3',
      serviceId: 'svc-7',
      professionalId: 'prof-3',
      date: todayStr,
      time: '10:00',
      clientName: 'Fernanda Lima',
      clientPhone: '(47) 96666-3333',
      status: 'confirmado',
      createdAt: new Date().toISOString(),
    },
  );

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  appointments.push(
    {
      id: 'apt-seed-4',
      serviceId: 'svc-4',
      professionalId: 'prof-1',
      date: formatDate(tomorrow),
      time: '09:00',
      clientName: 'Carla Mendes',
      clientPhone: '(47) 95555-4444',
      status: 'confirmado',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-seed-5',
      serviceId: 'svc-6',
      professionalId: 'prof-3',
      date: formatDate(tomorrow),
      time: '11:00',
      clientName: 'Aline Costa',
      clientPhone: '(47) 94444-5555',
      status: 'pendente',
      createdAt: new Date().toISOString(),
    },
  );

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  appointments.push(
    {
      id: 'apt-seed-6',
      serviceId: 'svc-2',
      professionalId: 'prof-2',
      date: formatDate(dayAfter),
      time: '15:00',
      clientName: 'Renata Silva',
      clientPhone: '(47) 93333-6666',
      status: 'confirmado',
      createdAt: new Date().toISOString(),
    },
  );

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 3);
  appointments.push(
    {
      id: 'apt-seed-7',
      serviceId: 'svc-5',
      professionalId: 'prof-1',
      date: formatDate(pastDate),
      time: '10:00',
      clientName: 'Daniela Souza',
      clientPhone: '(47) 92222-7777',
      status: 'concluido',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-seed-8',
      serviceId: 'svc-8',
      professionalId: 'prof-3',
      date: formatDate(pastDate),
      time: '14:00',
      clientName: 'Marina Ribeiro',
      clientPhone: '(47) 91111-8888',
      status: 'concluido',
      createdAt: new Date().toISOString(),
    },
  );

  return appointments;
}

export const seedAppointments: Appointment[] = getSeedAppointments();

export const seedTimeBlocks: TimeBlock[] = [
  {
    id: 'blk-seed-1',
    professionalId: 'prof-1',
    date: formatDate(new Date()),
    startTime: '12:00',
    endTime: '13:00',
    type: 'horario',
    reason: 'Almoço',
  },
  {
    id: 'blk-seed-2',
    professionalId: 'all',
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return formatDate(d);
    })(),
    type: 'dia',
    reason: 'Recesso da equipe',
  },
];

export const galleryImages = [
  { src: 'https://images.pexels.com/photos/3993290/pexels-photo-3993290.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Cabelo sendo estilizado no salão' },
  { src: 'https://images.pexels.com/photos/7195812/pexels-photo-7195812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Interior elegante do salão de beleza' },
  { src: 'https://images.pexels.com/photos/4981476/pexels-photo-4981476.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Coloração capilar profissional' },
  { src: 'https://images.pexels.com/photos/3738377/pexels-photo-3738377.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Manicure no salão' },
  { src: 'https://images.pexels.com/photos/5177990/pexels-photo-5177990.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Design de sobrancelhas' },
  { src: 'https://images.pexels.com/photos/7750124/pexels-photo-7750124.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Salão de beleza moderno e iluminado' },
  { src: 'https://images.pexels.com/photos/3993323/pexels-photo-3993323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Tratamento de coloração' },
  { src: 'https://images.pexels.com/photos/9335967/pexels-photo-9335967.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Tratamento facial e estético' },
  { src: 'https://images.pexels.com/photos/13068377/pexels-photo-13068377.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Ambiente sofisticado do salão' },
  { src: 'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Secagem e finalização de cabelo' },
  { src: 'https://images.pexels.com/photos/7446914/pexels-photo-7446914.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Cuidado com as unhas' },
  { src: 'https://images.pexels.com/photos/37240358/pexels-photo-37240358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Tratamento de estética facial' },
];

export const heroImage = 'https://images.pexels.com/photos/3993290/pexels-photo-3993290.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900';
export const aboutImage = 'https://images.pexels.com/photos/7750108/pexels-photo-7750108.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200';
