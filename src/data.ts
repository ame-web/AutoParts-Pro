export interface Vehicle {
  plate: string;
  model: string;
  icon: string;
  status: 'Bound' | 'Exp. soon';
  registrationDate: string;
  annualInspection: string;
  insuranceExpiry: string;
  planRemainingMonths: number;
}

export interface Incident {
  id: string;
  descriptionKey?: string; // used for looking up translation or dynamic string
  description: string;
  vehiclePlate: string;
  date: string;
  status: 'Closed' | 'Processing' | 'Under Review';
}

export interface Customer {
  id: string;
  name: string;
  tier: 'Enterprise' | 'Pro' | 'Basic';
  orders: number;
  status: 'Active' | 'Pending' | 'Frozen';
}

export interface Part {
  id: string;
  name: string;
  model: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Order {
  id: string;
  packageName: string;
  amount: number;
  status: 'Active' | 'Pending' | 'Expired';
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  ordersCount: number;
  earnings: number;
  tier: 'Enterprise' | 'Pro' | 'Basic' | 'Ent.';
}

export const initialOrders: Order[] = [
  { id: '#4821', packageName: 'Basic', amount: 29, status: 'Active' },
  { id: '#4820', packageName: 'Pro', amount: 79, status: 'Active' },
  { id: '#4819', packageName: 'Enterprise', amount: 199, status: 'Pending' },
  { id: '#4818', packageName: 'Basic', amount: 29, status: 'Expired' },
];

export const initialVehicles: Vehicle[] = [
  {
    plate: '70 A 123 AA',
    model: 'Toyota Camry 2022 · VIN: JT2BF22K1W0123456',
    icon: '🚗',
    status: 'Bound',
    registrationDate: '2022-03-14',
    annualInspection: '2025-03-14',
    insuranceExpiry: '2025-12-31',
    planRemainingMonths: 8,
  },
  {
    plate: '01 B 456 BB',
    model: 'Chevrolet Malibu 2020 · VIN: 1G1ZD5ST4LF012345',
    icon: '🚙',
    status: 'Bound',
    registrationDate: '2020-05-18',
    annualInspection: '2025-05-18',
    insuranceExpiry: '2026-02-15',
    planRemainingMonths: 11,
  },
  {
    plate: '40 C 789 CC',
    model: 'Mercedes Sprinter 2019 · VIN: WD3PE8CD9JP012345',
    icon: '🚐',
    status: 'Exp. soon',
    registrationDate: '2019-11-20',
    annualInspection: '2025-01-10',
    insuranceExpiry: '2025-07-22',
    planRemainingMonths: 1,
  },
];

export const initialIncidents: Incident[] = [
  {
    id: '#INC-091',
    description: 'Front bumper collision damage',
    descriptionKey: 'inc1-desc',
    vehiclePlate: '70 A 123 AA',
    date: '2026-06-01',
    status: 'Closed',
  },
  {
    id: '#INC-092',
    description: 'Engine oil leak reported',
    descriptionKey: 'inc2-desc',
    vehiclePlate: '01 B 456 BB',
    date: '2026-06-04',
    status: 'Processing',
  },
  {
    id: '#INC-093',
    description: 'Brake pad replacement urgent',
    descriptionKey: 'inc3-desc',
    vehiclePlate: '40 C 789 CC',
    date: '2026-06-07',
    status: 'Under Review',
  },
];

export const initialCustomers: Customer[] = [
  { id: '1', name: 'Kamilov Xojiakbar', tier: 'Enterprise', orders: 41, status: 'Active' },
  { id: '2', name: 'Sara Mitchell', tier: 'Pro', orders: 17, status: 'Active' },
  { id: '3', name: 'David Lee', tier: 'Basic', orders: 5, status: 'Pending' },
  { id: '4', name: 'Maria Garcia', tier: 'Enterprise', orders: 88, status: 'Active' },
  { id: '5', name: 'Wei Zhang', tier: 'Pro', orders: 23, status: 'Frozen' },
];

export const initialParts: Part[] = [
  { id: '1', name: 'Brake Pad Set', model: 'Toyota Camry', stock: 142, price: 45, status: 'In Stock' },
  { id: '2', name: 'Air Filter', model: 'Universal', stock: 89, price: 12, status: 'In Stock' },
  { id: '3', name: 'Oil Filter', model: 'Chevrolet', stock: 11, price: 8, status: 'Low Stock' },
  { id: '4', name: 'Timing Belt', model: 'Mercedes', stock: 0, price: 120, status: 'Out of Stock' },
];

export const initialTeamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', initials: 'JD', ordersCount: 23, earnings: 340, tier: 'Pro' },
  { id: '2', name: 'Sara Mitchell', initials: 'SM', ordersCount: 17, earnings: 210, tier: 'Basic' },
  { id: '3', name: 'Kamilov Xojiakbar', initials: 'KX', ordersCount: 41, earnings: 680, tier: 'Ent.' },
];

export interface FAQItem {
  id: string;
  qKey: string;
  aKey: string;
}

export const faqs: FAQItem[] = [
  { id: '1', qKey: 'faq1q', aKey: 'faq1a' },
  { id: '2', qKey: 'faq2q', aKey: 'faq2a' },
];

export const supportFaqs: FAQItem[] = [
  { id: 'sf1', qKey: 'sf1q', aKey: 'sf1a' },
  { id: 'sf2', qKey: 'sf2q', aKey: 'sf2a' },
  { id: 'sf3', qKey: 'sf3q', aKey: 'sf3a' },
];
