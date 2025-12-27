export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
}

export interface CartItem {
  id: string; // unique for cart (e.g. menuItem.id + options)
  menuItem: MenuItem;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';

export interface OrderFeedback {
  rating: number; // 1-5
  comment: string;
  submittedAt: string;
}

export interface Order {
  orderId: string; // UUID
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  paymentType: 'COD' | 'Easypaisa' | 'JazzCash' | 'BankTransfer' | 'Digital';
  status: OrderStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  feedback?: OrderFeedback;
}

export interface Profile {
  name: string;
  phone: string;
  address: string;
  email: string;
}

export interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  biometricEnabled: boolean;
}
