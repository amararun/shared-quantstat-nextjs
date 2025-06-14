import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tagged interface for Message
export interface Message {
  type: 'message';
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Tagged interface for Log
export interface Log {
  type: 'log';
  level: 'info' | 'error' | 'warn';
  message: string;
  timestamp: string;
}

// Type guard for Message
export function isMessage(item: any): item is Message {
  return item.type === 'message';
}

// Type guard for Log
export function isLog(item: any): item is Log {
  return item.type === 'log';
}
