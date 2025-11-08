import { User, Class, Instructor, Reward, Advertisement, ChatThread, Pricing, BankAccount, PaymentRecord, Bike } from './types';

export const sampleUsers: User[] = [
  {
    id: 'user_alex_morgan',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    level: 'Intermedio',
    classesCompleted: 23,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
  },
  {
    id: 'user_carlos_g',
    name: 'Carlos G.',
    email: 'carlos.g@example.com',
    level: 'Principiante',
    classesCompleted: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80',
  },
  {
    id: 'user_sofia_l',
    name: 'Sofia L.',
    email: 'sofia.l@example.com',
    level: 'Avanzado',
    classesCompleted: 52,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
  }
];

export const sampleInstructors: Instructor[] = [
  {
    id: 'isabella_r',
    name: 'Isabella Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80',
    bio: 'Apasionada por el ciclismo y el fitness. Mis clases están llenas de energía y buena música para que superes tus límites.',
    rating: 4.9,
    reviews: [
        { userName: 'Carlos G.', rating: 5, comment: '¡La mejor clase! Isabella tiene una energía increíble.' },
        { userName: 'Ana P.', rating: 5, comment: 'Música genial y una instructora que te motiva a darlo todo.' },
    ]
  },
  {
    id: 'javier_m',
    name: 'Javier Moreno',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    bio: 'Con más de 10 años de experiencia, me enfoco en la técnica y la resistencia. Prepárate para sudar y sentirte más fuerte que nunca.',
    rating: 4.8,
    reviews: [
        { userName: 'Sofia L.', rating: 4, comment: 'Clase muy retadora pero vale la pena.' },
    ]
  },
];

export const sampleClasses: Class[] = [
  { id: 1, name: 'Morning Ride', instructorId: 'isabella_r', time: '07:00 AM', duration: 45, spotsLeft: 3 },
  { id: 2, name: 'Endurance Pro', instructorId: 'javier_m', time: '06:00 PM', duration: 60, spotsLeft: 5 },
  { id: 3, name: 'Sunset Flow', instructorId: 'isabella_r', time: '07:30 PM', duration: 45, spotsLeft: 2 },
];

export const rewards: Reward[] = [
  { id: 1, title: 'Club de los 10', description: 'Completa 10 clases', requiredClasses: 10 },
  { id: 2, title: 'Guerrero del Pedal', description: 'Completa 25 clases', requiredClasses: 25 },
  { id: 3, title: 'Leyenda del Ciclismo', description: 'Completa 50 clases', requiredClasses: 50 },
];

export const sampleAdvertisements: Advertisement[] = [
  { 
    id: 1, 
    type: 'video', 
    title: 'Nueva Clase: Power Beats', 
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg'
  },
  {
    id: 2,
    type: 'image',
    title: 'Promo 2x1 este Verano',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  }
];

export const sampleChatThread: ChatThread = {
    userId: 'user_alex_morgan',
    userName: 'Alex Morgan',
    unread: true,
    messages: [
        { id: 'm1', sender: 'user', text: 'Hola, tengo una pregunta sobre mi reserva.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { id: 'm2', sender: 'admin', text: '¡Hola Alex! Claro, dime en qué puedo ayudarte.', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
        { id: 'm3', sender: 'user', text: 'Realicé el pago por transferencia, aquí está el comprobante.', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    ]
};

export const pricing: Pricing = {
    individual: 15,
    group2: 13,
    group3: 11,
};

export const initialBankAccounts: BankAccount[] = [
    { id: 1, bankName: 'Banco Ficticio', identificationType: 'ruc', identificationNumber: 'J-123456789', accountType: 'corriente', accountNumber: '0102-0123-4567-8901-2345' },
    { id: 2, bankName: 'NeoBank Digital', identificationType: 'cédula', identificationNumber: 'V-12345678', accountType: 'ahorro', accountNumber: '0168-0987-6543-2109-8765' }
];

export const samplePayments: PaymentRecord[] = [
    { id: 'pay1', userName: 'Carlos G.', className: 'Morning Ride', amount: 15, method: 'card', status: 'completed', date: '2024-07-28' },
    { id: 'pay2', userName: 'Ana P.', className: 'Morning Ride', amount: 26, method: 'transfer', status: 'pending', date: '2024-07-28' },
];

export const generateBikeLayout = (count: number): Bike[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: String(i + 1),
        status: 'available',
    }));
};