import { LogEntry } from '../types';

export class Logger {
  private logs: LogEntry[] = [];

  constructor() {
    this.logs = this.loadLogs();
  }

  private loadLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem('urlShortenerLogs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      return [];
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('urlShortenerLogs', JSON.stringify(this.logs));
    } catch (error) {
    }
  }

  log(level: LogEntry['level'], message: string, data: any = {}): LogEntry {
    const logEntry: LogEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logs.push(logEntry);
    this.saveLogs();

    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
      this.saveLogs();
    }

    return logEntry;
  }

  info(message: string, data?: any): LogEntry {
    return this.log('info', message, data);
  }

  warn(message: string, data?: any): LogEntry {
    return this.log('warn', message, data);
  }

  error(message: string, data?: any): LogEntry {
    return this.log('error', message, data);
  }

  success(message: string, data?: any): LogEntry {
    return this.log('success', message, data);
  }

  getLogs(level: LogEntry['level'] | null = null, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    return filteredLogs.slice(-limit).reverse();
  }

  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }
}

export const logger = new Logger();
