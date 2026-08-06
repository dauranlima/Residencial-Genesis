export type UserRole = 'resident' | 'merchant' | 'admin';

export interface Profile {
  id: string;
  fullName: string;
  phone: string;
  block?: string;
  unit: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type ClassifiedStatus = 'available' | 'reserved' | 'sold' | 'cancelled';

export interface CurrentUser {
  name: string;
  block: string;
  unit: string;
  phone: string;
}

export interface ClassifiedItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: ClassifiedStatus;
  createdAt: string;
  sellerName: string;
  sellerUnit: string;
  sellerBlock?: string;
  whatsapp: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  category: string;
  description?: string;
  responsibleName?: string;
  address?: string;
  logoUrl?: string;
  whatsapp: string;
  accessCode?: string; // Código de acesso de 8 dígitos
}

export interface Coupon {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantCategory: string;
  merchantWhatsapp: string;
  merchantAddress?: string;
  title: string;
  description: string;
  discountValue: string;
  totalQuantity: number;
  remainingQuantity: number;
  expiresAt: string; // ISO string
  imageUrl?: string;
  isActive: boolean;
}

export interface CouponRedemption {
  id: string;
  couponTitle: string;
  merchantName: string;
  code: string;
  discountValue: string;
  redeemedAt: string;
}

export interface DatabaseCouponRedemption {
  id: string;
  couponId: string;
  residentName: string;
  residentPhone: string;
  residentUnit: string;
  residentBlock?: string;
  redeemedAt: string;
}
