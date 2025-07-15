export interface ShortenedURL {
  id: number;
  originalURL: string;
  shortCode: string;
  shortUrl?: string;
  createdAt: string;
  expiryAt?: number;
  expiryMinutes?: number;
  clickCount: number;
  clicks: ClickData[];
}

export interface URLData {
  id: number;
  originalUrl: string;
  shortcode: string;
  shortUrl: string;
  createdAt: number;
  expiryAt: number;
  expiryMinutes: number;
  clickCount: number;
  clickLogs: ClickLog[];
}

export interface ClickData {
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  source?: string;
  location?: string;
}

export interface ClickLog {
  timestamp: number;
  source: string;
  location: string;
  userAgent?: string;
}

export interface URLStats {
  totalUrls: number;
  activeUrls: number;
  expiredUrls: number;
  totalClicks: number;
}

export interface LogEntry {
  id: string | number;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  data?: any;
}

export interface URLFormData {
  originalUrl: string;
  expiryMinutes: number;
  customShortcode: string;
}

export interface URLContextType {
  urls: any[];
  stats: URLStats;
  loading: boolean;
  createShortUrl: (originalUrl: string, expiryMinutes: number, customShortcode?: string) => Promise<any>;
  deleteUrl: (shortcode: string) => Promise<boolean>;
  recordClick: (shortcode: string, clickData?: any) => boolean;
  getUrlByShortcode: (shortcode: string) => any | null;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface CustomError extends Error {
  message: string;
}