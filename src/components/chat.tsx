'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import { Loader2 } from 'lucide-react';
import MarkdownRenderer from '@/components/ui/markdown-renderer';
import { useLogger } from '@/providers/log-provider';
import { LogLevel } from '@/lib/log-service';
import { v4 as uuidv4 } from 'uuid';


// Footer component removed - now using AppFooter in main layout

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function Chat() {
  const { logs, addLog } = useLogger();
  const [expandedLogIndexes, setExpandedLogIndexes] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [activeTab, setActiveTab] = useState('analyst');
  const [showMorePrompts, setShowMorePrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick prompts for common actions
  const quickPrompts = [
    { text: "Quantstats:Nifty 50 vs S&P 500", description: "Quantstats" },
    { text: "SPR: Nifty 50, S&P500, FTSE100", description: "SPR" },
    { text: "Analyze HDFC Bank", description: "Analyze" },
    { text: "Technicals-  Google", description: "Technical Analysis" },
    { text: "What all can you do?", description: "Learn about capabilities" },
    { text: "P&L- GOOG - key items as table", description: "Data analysis help" }
  ];

  // Handle quick prompt selection
  const handleQuickPrompt = async (promptText: string) => {
    if (isLoading) return;
    
    // Auto-collapse prompts on mobile after clicking any expanded prompt
    // Check if on mobile using window width (only when window is available)
    if (typeof window !== 'undefined' && window.innerWidth <= 768 && showMorePrompts) {
      setShowMorePrompts(false);
    }
    
    setIsLoading(true);
    const timestamp = new Date().toISOString();

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: promptText,
      timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Log that we're sending a message using the context
    addLog('info', `Sending message: "${promptText.length > 50 ? promptText.substring(0, 50) + '...' : promptText}"`);

    try {
      // Prepare the request payload according to the specified format
      const payload = {
        sessionId: sessionId,
        action: 'sendMessage',
        chatInput: promptText
      };
      
      // Log the request payload using the context
      addLog('debug', 'Request payload:', payload);

      // Call our Next.js API route instead of n8n directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        addLog('error', `API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to get response: ${errorText}`);
      }

      const data = await response.json();
      
      // Log the successful API response using the context
      addLog('debug', 'API response received:', {
        status: response.status,
        data: typeof data === 'object' ? 
          (data.output ? { output: data.output.substring(0, 510) + '...' } : data) : 
          data
      });

      // Add assistant message from the response
      const output = Array.isArray(data) ? data[0].output : data.output;
      const assistantMessage: Message = {
        role: 'assistant',
        content: output,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Add success log using the context
      addLog('info', 'Successfully received response', { 
        responseLength: output.length,
        timeMs: new Date().getTime() - new Date(timestamp).getTime()
      });
      
    } catch (error) {
      // Add error log using the context
      addLog('error', error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  // Initialize session ID and add initial log
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    // We don't need to set logs here since it's handled by the LogProvider
    // The provider already adds initial logs
  }, []);

  // Simple and reliable scroll function for iframe safety
  const scrollToBottom = (containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      // Find the scrollable container - either the ref itself or its parent
      const scrollableContainer = containerRef.current.closest('.overflow-y-auto') as HTMLElement;
      if (scrollableContainer) {
        // Use requestAnimationFrame for smooth scrolling without affecting parent
        requestAnimationFrame(() => {
          scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
        });
      }
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) { // Scroll for any messages (including initial welcome)
      scrollToBottom(messagesContainerRef);
    }
  }, [messages]);

  // Auto-scroll when loading state changes (for loading indicator)
  useEffect(() => {
    if (isLoading) {
      // Small delay to ensure loading indicator is rendered
      setTimeout(() => scrollToBottom(messagesContainerRef), 50);
    }
  }, [isLoading]);
  
  // Auto-scroll when logs change
  useEffect(() => {
    if (logs.length > 0 && activeTab === 'logs') { // Only scroll logs when logs tab is active
      scrollToBottom(logsContainerRef);
    }
  }, [logs, activeTab]);

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = '40px'; // Reset to min-height
    }
  }, [input]);

  // Toggle log details expansion
  const toggleLogExpansion = (index: number) => {
    setExpandedLogIndexes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Reset textarea height IMMEDIATELY on submit, before any processing
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }

    setIsLoading(true);
    const timestamp = new Date().toISOString();

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Log that we're sending a message using the context
    addLog('info', `Sending message: "${input.length > 50 ? input.substring(0, 50) + '...' : input}"`);

    try {
      // Prepare the request payload according to the specified format
      const payload = {
        sessionId: sessionId,
        action: 'sendMessage',
        chatInput: input
      };
      
      // Log the request payload using the context
      addLog('debug', 'Request payload:', payload);

      // Call our Next.js API route instead of n8n directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        addLog('error', `API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to get response: ${errorText}`);
      }

      const data = await response.json();
      
      // Log the successful API response using the context
      addLog('debug', 'API response received:', {
        status: response.status,
        data: typeof data === 'object' ? 
          (data.output ? { output: data.output.substring(0, 510) + '...' } : data) : 
          data
      });

      // Add assistant message from the response
      const output = Array.isArray(data) ? data[0].output : data.output;
      const assistantMessage: Message = {
        role: 'assistant',
        content: output,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Add success log using the context
      addLog('info', 'Successfully received response', { 
        responseLength: output.length,
        timeMs: new Date().getTime() - new Date(timestamp).getTime()
      });
      
    } catch (error) {
      // Add error log using the context
      addLog('error', error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setInput('');
      setIsLoading(false);
      // Reset textarea height immediately after clearing input
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px';
      }
    }
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return '🔵';
      case 'error':
        return '🔴';
      case 'warn':
        return '🟠';
      case 'debug':
        return '🟣';
      default:
        return 'ℹ️';
    }
  };

  // Add a sample welcome message for demonstration
  useEffect(() => {
    // Add a welcome message
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! How can I assist you today?',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [messages.length]);

  // Log a debug message for reference
  useEffect(() => {
    console.log(`Chat component mounted, activeTab: ${activeTab}, logs count: ${logs.length}`);
  }, [activeTab, logs.length]);
  
  // Log when the logs array changes
  useEffect(() => {
    console.log(`Logs updated in Chat component, count: ${logs.length}`);
  }, [logs.length]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 h-[calc(100vh-155px)] md:h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Professional tab interface more like the reference UI */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex px-6 py-0 justify-between items-center">
            <div className="flex">
              <button
                onClick={() => setActiveTab('analyst')}
                className={`py-1 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analyst' 
                    ? 'text-indigo-600 border-indigo-600' 
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Research Analyst
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-1 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'logs' 
                    ? 'text-indigo-600 border-indigo-600' 
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Logs ({logs.length})
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-2 flex-1 overflow-hidden">
          {/* Analyst Tab Content */}
          {activeTab === 'analyst' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
                <div className="space-y-3 pb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`${
                          message.role === 'user'
                            ? 'max-w-[80%] bg-indigo-600 text-white rounded-tr-none'
                            : 'max-w-[95%] bg-white shadow-sm text-gray-800 border border-gray-100 rounded-tl-none'
                        } rounded-2xl px-4 py-3`}
                      >
                        {message.role === 'assistant' ? (
                          <MarkdownRenderer 
                            content={message.content}
                            className={'px-0'}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[95%] bg-white shadow-sm text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                          <span>Pls. wait... doing n8n and MCP stuff...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="pt-4 mt-auto">
                {/* Quick Prompt Buttons - CSS-First Responsive (No JavaScript Flash) */}
                
                {/* Mobile Layout - Show first prompt + More button, hidden on desktop */}
                <div className="mb-4 md:hidden">
                  <div className="flex gap-2 flex-wrap">
                    {/* Always show first prompt */}
                    <Button
                      key={0}
                      variant="outline"
                      size="sm"
                      className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 rounded-full"
                      onClick={() => handleQuickPrompt(quickPrompts[0].text)}
                      disabled={isLoading}
                      title={quickPrompts[0].description}
                    >
                      {quickPrompts[0].text}
                    </Button>
                    
                    {/* Show more button or expanded prompts */}
                    {!showMorePrompts ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-500 border-gray-200 hover:bg-gray-50 rounded-full"
                        onClick={() => setShowMorePrompts(true)}
                        disabled={isLoading}
                      >
                        More...
                      </Button>
                    ) : (
                      <>
                        {quickPrompts.slice(1).map((prompt, index) => (
                          <Button
                            key={index + 1}
                            variant="outline"
                            size="sm"
                            className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 rounded-full"
                            onClick={() => handleQuickPrompt(prompt.text)}
                            disabled={isLoading}
                            title={prompt.description}
                          >
                            {prompt.text}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-500 border-gray-200 hover:bg-gray-50 rounded-full"
                          onClick={() => setShowMorePrompts(false)}
                          disabled={isLoading}
                        >
                          Less...
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Desktop Layout - Show all prompts, hidden on mobile */}
                <div className="hidden md:flex gap-2 mb-4 flex-wrap">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 rounded-full"
                      onClick={() => handleQuickPrompt(prompt.text)}
                      disabled={isLoading}
                      title={prompt.description}
                    >
                      {prompt.text}
                    </Button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 text-sm border-2 border-slate-800 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none overflow-y-auto transition-colors duration-200 shadow-md"
                    style={{
                      lineHeight: '1.5',
                      height: '40px'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = '40px'; // Reset to minimum first
                      target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  >
                    <IconArrowUp className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Logs Tab Content */}
          {activeTab === 'logs' && (
            <div className="h-full overflow-y-auto" ref={logsContainerRef}>
              {/* Simple log header */}
              <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
                <p className="font-medium text-blue-700">Log Status: {logs.length} logs available</p>
                <p className="text-sm text-blue-600 opacity-80">
                  First log: {logs.length > 0 ? logs[0].message : 'No logs'}
                </p>
              </div>
              
              {/* Log entries */}
              <div className="space-y-2 pb-4">
                {logs.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-400 bg-gray-50 rounded-lg">
                    No logs available
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg text-sm mb-2 border ${
                        log.level === 'error' ? 'bg-red-50 text-red-700 border-red-100' :
                        log.level === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        log.level === 'debug' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-1">
                          {log.level === 'error' ? '🔴' : 
                           log.level === 'warn' ? '🟠' : 
                           log.level === 'debug' ? '🟣' : '🔵'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{log.message}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                          
                          {log.details && (
                            <div className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                              <pre className="whitespace-pre-wrap">
                                {typeof log.details === 'string' 
                                  ? log.details 
                                  : JSON.stringify(log.details, null, 2)
                                }
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}
        </div>
        
        {/* Footer moved to main layout */}
      </div>
    </div>
  );
}
