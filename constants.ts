import { Drug, AppSettings } from './types';

export const CURRENCY_SYMBOL = '₵';
export const APP_LOGO = '/logo.png';

export const INITIAL_SETTINGS: AppSettings = {
  pharmacyName: 'GiDi Pharmacy',
  address: 'Accra, Ghana',
  phoneNumber: '+233 00 000 0000',
  email: 'contact@gidipharmacy.com',
  currencySymbol: '₵',
  taxRate: 0,
  enableExpiryEmailAlerts: false,
  expiryAlertThresholdDays: 90 // Default alert for drugs expiring in 3 months
};

export const INITIAL_INVENTORY: Drug[] = [
  {
    id: 'd1',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    batchNumber: 'PCM-2024-001',
    expiryDate: '2025-12-31',
    quantity: 500,
    price: 15.00,
    category: 'Pain Relief',
    description: 'Effective pain reliever and fever reducer.'
  },
  {
    id: 'd2',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    batchNumber: 'AMX-2024-055',
    expiryDate: '2024-11-30', // Near expiry
    quantity: 45, // Low stock
    price: 45.50,
    category: 'Antibiotics',
    description: 'Broad-spectrum antibiotic for bacterial infections.'
  },
  {
    id: 'd3',
    name: 'Artemether-Lumefantrine',
    genericName: 'Coartem',
    batchNumber: 'MAL-2024-102',
    expiryDate: '2026-06-15',
    quantity: 120,
    price: 65.00,
    category: 'Antimalarial',
    description: 'Standard treatment for uncomplicated malaria.'
  },
  {
    id: 'd4',
    name: 'Ciprofloxacin 500mg',
    genericName: 'Ciprofloxacin',
    batchNumber: 'CIP-2024-089',
    expiryDate: '2025-08-20',
    quantity: 200,
    price: 32.00,
    category: 'Antibiotics',
    description: 'Antibiotic used to treat a number of bacterial infections.'
  },
  {
    id: 'd5',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    batchNumber: 'IBU-2023-999',
    expiryDate: '2024-01-01', // Expired
    quantity: 10,
    price: 20.00,
    category: 'Pain Relief',
    description: 'Nonsteroidal anti-inflammatory drug (NSAID).'
  }
];

export const AZARA_SYSTEM_INSTRUCTION = `
You are AZARA, an intelligent AI medical assistant integrated into GiDi, a pharmacy management system.
Your role is to assist pharmacists and staff in Ghana.

Guidelines:
1. Provide accurate medical information based on WHO and FDA guidelines.
2. When asked about drug interactions, be thorough and warn about contraindications.
3. Explain complex medical terms simply.
4. If asked about inventory or sales, guide them on how to use the GiDi system (e.g., "You can check stock levels in the Inventory tab").
5. Always include a disclaimer that you are an AI and not a substitute for a doctor's professional diagnosis.
6. Be concise, professional, and empathetic.
7. Default currency is Ghana Cedis (₵).
8. You can analyze images of drug labels or packaging if provided.
`;