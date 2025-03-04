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
  pulses: number; // Rating/upvotes count
}

export interface User {
  id: string;
  name: string;
  email: string;
  products: Product[];
  role?: 'user' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export type WorkflowStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Workflow extends Omit<Product, 'priceId'> {
  status: WorkflowStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  curatorNotes?: string;
  videoUrl?: string;
  complexity?: 'beginner' | 'medium' | 'advanced';
  integrations?: string[];
  techStack?: string[];
  faq?: { question: string; answer: string }[];
  creatorBio?: string;
  consultationAvailable?: boolean;
  consultationRate?: string;
}

export type NotificationType = 'admin' | 'creator' | 'buyer' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'proposal' | 'system';
  metadata?: {
    price?: number;
    hours?: number;
    description?: string;
    paymentStatus?: 'pending' | 'paid' | 'completed';
    paymentId?: string;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
  productId?: string;
  productTitle?: string;
}

export interface ConsultationOption {
  id: string;
  title: string;
  description: string;
}