export type LogLevel = 'info' | 'error' | 'warn' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
  expanded?: boolean;
}

export class LogService {
  private static instance: LogService;
  private logs: LogEntry[] = [];

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  public addLog(level: LogLevel, message: string, details?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      expanded: false
    };

    this.logs.push(logEntry);
    this.logToConsole(logEntry);
  }

  private logToConsole(log: LogEntry): void {
    const logMessage = `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`;
    
    switch (log.level) {
      case 'error':
        console.error(logMessage, log.details);
        break;
      case 'warn':
        console.warn(logMessage, log.details);
        break;
      case 'debug':
        console.debug(logMessage, log.details);
        break;
      default:
        console.log(logMessage, log.details);
    }
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }
} 