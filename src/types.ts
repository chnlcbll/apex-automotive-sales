export interface AddOn {
  id: string;
  name: string;
  price: number;
  discountPercent?: number;
}

export interface Vehicle {
  name: string;
  price: number;
  year: string;
  colors: string[];
  description?: string;
  imageUrl?: string;
  seats?: number;
  type?: string;
  transmission?: string;
}

export interface Order {
  id: string;
  transactionNumber: string;
  carName: string;
  carPrice: number;
  yearModel: string;
  color: string;
  discountPercent: number;
  addOns: AddOn[];
  pickupDate?: string; // ISO string
  note?: string;
  totalPrice: number;
  status: 'completed' | 'pending';
  createdAt: number;
  imageUrl: string;
}
