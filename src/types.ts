// Type definitions for the Yad2 Tracker project

export interface AdData {
  id: string;
  title: string;
  link: string;
  price: string;
  location: string;
  description: string;
  timestamp: string;
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
