import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { URLContextType } from '../types';
import { urlService } from '../lib/urlService';
import { logger } from '../lib/logger';

const URLContext = createContext<URLContextType | undefined>(undefined);

export const useURL = () => {
  const context = useContext(URLContext);
  if (!context) {
    throw new Error('useURL must be used within a URLProvider');
  }
  return context;
};

export const URLProvider = ({ children }: { children: React.ReactNode }) => {
  const [urls, setUrls] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUrls: 0,
    activeUrls: 0,
    expiredUrls: 0,
    totalClicks: 0
  });
  const [loading, setLoading] = useState(false);
  const clickTracker = useRef<Set<string>>(new Set()); 

  const refreshData = useCallback(() => {
    try {
      const allUrls = urlService.getAllUrls();
      const currentStats = urlService.getStats();
      
      setUrls(allUrls);
      setStats(currentStats);
      
      logger.info('Data refreshed successfully', { 
        urlCount: allUrls.length, 
        stats: currentStats 
      });
    } catch (error: any) {
      logger.error('Failed to refresh data', { error: error.message });
    }
  }, []);

  const createShortUrl = useCallback(async (originalUrl: string, expiryMinutes: number, customShortcode?: string) => {
    setLoading(true);
    try {
      const result = urlService.createShortUrl(originalUrl, expiryMinutes, customShortcode);
      refreshData();
      return result;
    } catch (error: any) {
      logger.error('Failed to create short URL', { 
        originalUrl, 
        error: error.message 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  const deleteUrl = useCallback(async (shortcode: string) => {
    setLoading(true);
    try {
      const success = urlService.deleteUrl(shortcode);
      if (success) {
        refreshData();
      }
      return success;
    } catch (error: any) {
      logger.error('Failed to delete URL', { shortcode, error: error.message });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  const recordClick = useCallback((shortcode: string, clickData?: any) => {
    try {
      const sessionKey = `${shortcode}-${Math.floor(Date.now() / 1000)}`;
      
      if (clickTracker.current.has(sessionKey)) {
        logger.warn('Click already recorded for this shortcode in current session', { shortcode, sessionKey });
        return false;
      }

      const success = urlService.recordClick(shortcode, clickData);
      if (success) {
        clickTracker.current.add(sessionKey);
        
        if (clickTracker.current.size > 100) {
          const entries = Array.from(clickTracker.current);
          clickTracker.current.clear();
          entries.slice(-50).forEach(entry => clickTracker.current.add(entry));
        }
        
        refreshData();
      }
      return success;
    } catch (error: any) {
      logger.error('Failed to record click', { shortcode, error: error.message });
      return false;
    }
  }, [refreshData]);

  const getUrlByShortcode = useCallback((shortcode: string) => {
    return urlService.getUrlByShortcode(shortcode);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    urls,
    stats,
    loading,
    createShortUrl,
    deleteUrl,
    recordClick,
    getUrlByShortcode,
    refreshData
  };

  return (
    <URLContext.Provider value={value}>
      {children}
    </URLContext.Provider>
  );
};
