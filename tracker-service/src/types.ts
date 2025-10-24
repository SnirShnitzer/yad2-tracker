// Type definitions for the Yad2 Tracker project

export interface AdData {
  id: string;
  title: string;
  link: string;
  price: string;
  address: string;
  description?: string;
  timestamp: string;
}

// Yad2 API response types
export interface Yad2ApiResponse {
  data: {
    markers: Yad2Marker[];
  };
  message: string;
}

export interface Yad2Marker {
  address: {
    city: { text: string };
    area: { text: string };
    neighborhood?: { text: string };
    street?: { text: string };
    house: { number?: number; floor: number };
    coords: { lon: number; lat: number };
  };
  subcategoryId: number;
  categoryId: number;
  adType: string;
  price: number;
  token: string;
  additionalDetails: {
    property: { text: string };
    roomsCount: number;
    squareMeter: number;
    propertyCondition: { id: number };
  };
  metaData: {
    coverImage: string;
    images: string[];
    squareMeterBuild?: number;
  };
  customer: {
    agencyName: string;
    agencyLogo: string;
  };
  orderId: number;
  priority: number;
  tags?: Array<{
    name: string;
    id: number;
    priority: number;
  }>;
}

export interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface Yad2TrackerConfig {
  urls: string[];
  seenAdsFile: string;
  filterWords: string[];
  emailConfig: EmailConfig;
}

export interface ParsedAd {
  title: string;
  link: string;
  price: string;
  location: string;
  description: string;
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}
