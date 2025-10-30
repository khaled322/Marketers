import type * as React from 'react';

export type Theme = 'light' | 'dark';

export type UserType = 'merchant' | 'confirmer' | 'freelancer' | 'admin';

export type DashboardView = 'home' | 'offers' | 'messages' | 'marketplace' | 'notifications' | 'menu' | 'statistics' | 'settings' | 'site_services' | 'wallet' | 'my_services' | 'create_ad_campaign' | 'offer_details' | 'admin_panel' | 'search';

export type ServiceCategory = 'confirmation' | 'design' | 'video' | 'marketing' | 'writing' | 'development';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  type: UserType;
  status?: 'active' | 'suspended';
  walletBalance: number;
  badges?: string[];
  state?: string; // Wilaya, for confirmers
  skills?: string[]; // For freelancers
  avgRating?: number;
  ratingsReceived?: Rating[];
}

export interface ServiceListing {
    id: string;
    userId: string;
    title: string;
    category: ServiceCategory;
    description: string;
    price: number;
    priceType: 'per_order' | 'fixed';
    imageUrl: string;
    deliveryTimeDays?: number;
    isPinned?: boolean;
}

export interface ConfirmerProfile { // Used for HomePage, derived from User + ServiceListing
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  specialties: string[];
  ratePerOrder: number;
  state: string; // Wilaya
}

export interface FreelancerProfile { // Used for HomePage, derived from User + ServiceListing
  id:string;
  name: string;
  avatarUrl: string;
  rating: number;
  skills: string[];
  description: string;
}

export interface Offer {
    id: string;
    fromUserId: string;
    toUserId: string;
    serviceId?: string; // Optional: if the offer is for a specific service listing
    details: string;
    price: number;
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'delivered' | 'modification_requested';
    createdAt: string;
    isRated: boolean;
}

export interface Rating {
    id: string;
    offerId: string;
    fromUserId: string;
    toUserId: string;
    stars: number; // 1 to 5
    comment: string;
    createdAt: string;
}


export interface AdAccount {
    id: string;
    platform: 'Facebook' | 'Google' | 'TikTok';
    name: string;
    spendingLimit: number;
    price: number;
    imageUrl: string;
}

export interface SiteService {
    id: string;
    title: string;
    description: string;
    provider: string;
    icon: React.ElementType;
    price: number;
    category: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'earning';
}

export interface Notification {
    id: string;
    userId: string;
    text: string;
    type: 'offer' | 'message' | 'system' | 'badge';
    link: { view: DashboardView, params?: any };
    isRead: boolean;
    timestamp: string;
}

export interface AdCampaign {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageUrl?: string;
  adLink?: string;
  postLink?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'running' | 'completed';
  createdAt: string;
}

export interface AppDatabase {
    users: User[];
    serviceListings: ServiceListing[];
    offers: Offer[];
    messages: { [conversationId: string]: { participants: string[], messages: Message[] } };
    transactions: Transaction[];
    ratings: Rating[];
    siteServices: SiteService[];
    notifications: Notification[];
    adCampaigns: AdCampaign[];
}