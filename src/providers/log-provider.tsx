'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { LogLevel } from '@/lib/log-service';

interface Log {
  level: LogLevel;
  message: string;
  timestamp: string;
  details?: any;
}

interface LogContextType {
  logs: Log[];
  addLog: (level: LogLevel, message: string, details?: any) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = useCallback((level: LogLevel, message: string, details?: any) => {
    setLogs(prevLogs => [...prevLogs, {
      level,
      message,
      timestamp: new Date().toISOString(),
      details
    }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogger() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogger must be used within a LogProvider');
  }
  return context;
} 