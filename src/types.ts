export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  creator: string;
  category: 'automation' | 'integration' | 'workflow';
  tags: string[];
  priceId?: string; // Stripe price ID
}

export interface User {
  id: string;
  name: string;
  email: string;
  products: Product[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}