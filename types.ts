
export interface BusinessData {
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  services: string[];
  themeColor: string;
  logoUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
}

export interface DeploymentStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  url?: string;
  message?: string;
}

export enum AppRoute {
  LANDING = '/',
  BUILDER = '/builder',
  SUCCESS = '/success'
}
