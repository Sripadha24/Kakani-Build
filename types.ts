export type ThemeId = 'modern' | 'midnight' | 'executive' | 'organic' | 'neobrutalist' | 'luxury' | 'editorial' | 'futuristic' | 'vibrant' | 'vintage';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BusinessData {
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  services: ServiceItem[];
  themeColor: string;
  themeId: ThemeId;
  logoUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  seoKeywords: string;
  fontStyle: 'sans' | 'serif';
}

export interface DeploymentStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  url?: string;
  message?: string;
}

export enum AppRoute {
  LANDING = '/',
  BUILDER = '/builder',
  SUCCESS = '/success',
  LOGIN = '/login',
  REGISTER = '/register',
  README = '/readme'
}