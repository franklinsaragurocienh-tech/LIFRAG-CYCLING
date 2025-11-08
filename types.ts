export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  classesCompleted: number;
  avatarUrl: string;
}

export interface Review {
  userName: string;
  rating: number;
  comment: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  rating: number;
  reviews: Review[];
}

export interface Class {
  id: number;
  name: string;
  instructorId: string;
  time: string;
  duration: number;
  spotsLeft: number;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  requiredClasses: number;
}

export interface Advertisement {
  id: number;
  type: 'video' | 'image';
  title: string;
  mediaUrl: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'payment-proof';
    url: string;
    fileName?: string;
  }
}

export interface ChatThread {
  userId: string;
  userName: string;
  unread: boolean;
  messages: Message[];
}

export interface Pricing {
  individual: number;
  group2: number;
  group3: number;
}

export interface BankAccount {
  id: number;
  bankName: string;
  identificationType: 'ruc' | 'cédula';
  identificationNumber: string;
  accountType: 'corriente' | 'ahorro';
  accountNumber: string;
}

export interface PaymentRecord {
  id: string;
  userName: string;
  className: string;
  amount: number;
  method: 'card' | 'transfer';
  status: 'completed' | 'pending' | 'rejected';
  date: string;
}

export type BikeStatus = 'available' | 'taken' | 'selected' | 'maintenance';

export interface Bike {
  id: string;
  status: BikeStatus;
}