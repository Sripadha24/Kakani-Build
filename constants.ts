import { BusinessData } from './types';

export const APP_NAME = "Kakani Build";
export const LOCAL_STORAGE_KEY = "kakanibuild_unlocked";

export const DEFAULT_BUSINESS_DATA: BusinessData = {
  name: "Green Valley Cafe",
  description: "Experience the finest organic coffee and handcrafted pastries in the heart of the city. We pride ourselves on sourcing local ingredients and creating a cozy atmosphere for all our neighbors.",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: "123 Garden Street, Eco Park, Bangalore - 560001",
  services: [
    { id: '1', title: "Specialty Coffee", description: "Sourced from high-altitude estates, roasted to perfection.", icon: "fa-coffee" },
    { id: '2', title: "Artisan Bakery", description: "Freshly baked bread and pastries made daily with love.", icon: "fa-bread-slice" },
    { id: '3', title: "Vegan Breakfast", description: "Delicious plant-based meals to start your morning right.", icon: "fa-leaf" }
  ],
  themeColor: "#16a34a",
  themeId: 'modern',
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com"
  },
  seoKeywords: "organic cafe, specialty coffee, bakery near me",
  fontStyle: 'sans'
};