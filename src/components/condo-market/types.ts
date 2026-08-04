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

export type ClassifiedStatus = 'available' | 'reserved' | 'sold';

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
  description: string;
  logoUrl?: string;
  whatsapp: string;
}

export interface Coupon {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantCategory: string;
  merchantWhatsapp: string;
  title: string;
  description: string;
  discountValue: string;
  totalQuantity: number;
  remainingQuantity: number;
  expiresAt: string; // ISO string
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
