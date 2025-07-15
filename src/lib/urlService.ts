import { URLStats, ClickData } from '../types';
import { logger } from './logger';

export class URLService {
  private storageKey: string;
  private baseUrl: string;

  constructor() {
    this.storageKey = 'urlShortenerData';
    this.baseUrl = 'http://localhost:3000';
  }

  private loadData(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error: any) {
      logger.error('Failed to load URL data from localStorage', { error: error.message });
      return {};
    }
  }

  private saveData(data: Record<string, any>): boolean {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error: any) {
      logger.error('Failed to save URL data to localStorage', { error: error.message });
      return false;
    }
  }

  private generateShortcode(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private validateShortcode(shortcode: string): boolean {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(shortcode) && shortcode.length >= 3 && shortcode.length <= 20;
  }

  private isExpired(expiryTimestamp: number): boolean {
    return Date.now() > expiryTimestamp;
  }

  createShortUrl(originalUrl: string, expiryMinutes: number = 30, customShortcode: string | null = null) {
        if (!this.validateUrl(originalUrl)) {
      logger.error('Invalid URL provided', { originalUrl });
      throw new Error('Invalid URL format');
    }

    const data = this.loadData();
    let shortcode: string = customShortcode || '';

    if (!shortcode) {
      do {
        shortcode = this.generateShortcode();
      } while (data[shortcode]);
    } else {
      if (!this.validateShortcode(shortcode)) {
        logger.error('Invalid shortcode format', { shortcode });
        throw new Error('Shortcode must be alphanumeric and 3-20 characters long');
      }

      if (data[shortcode]) {
        logger.error('Shortcode already exists', { shortcode });
        throw new Error('Shortcode already exists. Please choose a different one.');
      }
    }

    const now = Date.now();
    const expiryTimestamp = now + (expiryMinutes * 60 * 1000);

    const urlData = {
      id: now,
      originalUrl,
      shortcode,
      shortUrl: `${this.baseUrl}/${shortcode}`,
      createdAt: now,
      expiryAt: expiryTimestamp,
      expiryMinutes,
      clickCount: 0,
      clickLogs: []
    };

    data[shortcode] = urlData;
    
    if (this.saveData(data)) {
      logger.success('URL shortened successfully', { 
        shortcode, 
        originalUrl, 
        expiryMinutes 
      });
      return urlData;
    } else {
      throw new Error('Failed to save URL data');
    }
  }

  getUrlByShortcode(shortcode: string) {
    const data = this.loadData();
    const urlData = data[shortcode];

    if (!urlData) {
      logger.warn('Shortcode not found', { shortcode });
      return null;
    }

    if (this.isExpired(urlData.expiryAt)) {
      logger.warn('URL has expired', { shortcode, expiryAt: urlData.expiryAt });
      return null;
    }

    return urlData;
  }

  recordClick(shortcode: string, clickData: Partial<ClickData> = {}) {
    const data = this.loadData();
    const urlData = data[shortcode];

    if (!urlData) {
      logger.error('Cannot record click: shortcode not found', { shortcode });
      return false;
    }

    if (this.isExpired(urlData.expiryAt)) {
      logger.error('Cannot record click: URL has expired', { shortcode });
      return false;
    }

    const clickLog = {
      timestamp: Date.now(),
      source: clickData.source || 'Direct',
      location: clickData.location || this.getRandomLocation(),
      userAgent: clickData.userAgent || navigator.userAgent
    };

    urlData.clickCount++;
    urlData.clickLogs.push(clickLog);

    if (this.saveData(data)) {
      logger.info('Click recorded successfully', { shortcode, clickCount: urlData.clickCount });
      return true;
    } else {
      logger.error('Failed to record click', { shortcode });
      return false;
    }
  }

  getAllUrls() {
    const data = this.loadData();
    return Object.values(data).sort((a: any, b: any) => b.createdAt - a.createdAt);
  }

  deleteUrl(shortcode: string): boolean {
    const data = this.loadData();
    
    if (!data[shortcode]) {
      logger.warn('Cannot delete: shortcode not found', { shortcode });
      return false;
    }

    delete data[shortcode];
    
    if (this.saveData(data)) {
      logger.success('URL deleted successfully', { shortcode });
      return true;
    } else {
      logger.error('Failed to delete URL', { shortcode });
      return false;
    }
  }

  private getRandomLocation(): string {
    const locations = [
      'Mumbai, India',
      'Delhi, India',
      'Bangalore, India',
      'Chennai, India',
      'Kolkata, India',
      'Hyderabad, India',
      'Pune, India',
      'Ahmedabad, India'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  getStats(): URLStats {
    const urls = this.getAllUrls();
    const totalClicks = urls.reduce((sum: number, url: any) => sum + url.clickCount, 0);
    const activeUrls = urls.filter((url: any) => !this.isExpired(url.expiryAt)).length;
    const expiredUrls = urls.length - activeUrls;

    return {
      totalUrls: urls.length,
      activeUrls,
      expiredUrls,
      totalClicks
    };
  }
}

export const urlService = new URLService();
