export enum Role {
  ADMIN = 'ADMIN',
  PHARMACIST = 'PHARMACIST',
  STAFF = 'STAFF'
}

export interface User {
  username: string;
  password: string;
  name: string;
  role: Role;
}

export interface AppSettings {
  pharmacyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  currencySymbol: string;
  taxRate: number;
  enableExpiryEmailAlerts: boolean;
  expiryAlertThresholdDays: number;
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  price: number; // In GHS
  category: string;
  description?: string;
}

export interface CartItem extends Drug {
  cartQuantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  totalAmount: number;
  timestamp: number;
  customerName?: string;
  paymentMethod: 'CASH' | 'MOMO' | 'CARD';
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  image?: string; // Base64 string for display
  isError?: boolean;
}

export type ViewState = 'DASHBOARD' | 'INVENTORY' | 'POS' | 'ANALYTICS' | 'AZARA' | 'SETTINGS';

// Chart Data Types
export interface SalesDataPoint {
  name: string;
  sales: number;
  profit: number;
}

// PWA Install Prompt Event
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}