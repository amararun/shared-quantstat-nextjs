'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  ExternalLink,
  Database,
  Globe,
  FileText,
  FileDown,
  FileUp,
  ChartBar,
  Brain,
  FileCode,
  File as FilePdf,
  LineChart,
  RefreshCcw,
  Network,
  Share2,
  SplitSquareHorizontal,
  RefreshCw,
  Repeat,
  ArrowRightLeft,
  RotateCcw,
  RotateCw,
  HelpCircle,
  ChevronRight,
  Github,
  type LucideProps
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';


// Add this constant at the top level
const SHOW_WEBHOOK_CONFIG = false; // Set to true when you want to show it again

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

interface Tool {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  href: string;
  description: string;
}

const tools: Tool[] = [
  { 
    id: 'form', 
    name: 'Go to Suite', 
    shortName: 'Go to Suite', 
    icon: LineChart, 
    color: 'text-emerald-600',
    href: 'https://rex.tigzig.com/portfolio-analysis-form',
    description: 'Form Based Analysis'
  },
  { 
    id: 'chatgpt', 
    name: 'Talk to GPT', 
    shortName: 'Talk to GPT', 
    icon: RefreshCcw, 
    color: 'text-green-600',
    href: 'https://chatgpt.com/g/g-680a0fba9cd481919073d474bee520fb-portfolio-analytics-quantstats-technicals-fin',
    description: 'AI Powered Chat'
  }
];

export default function TopNavigation() {
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Add global styles for scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getButtonStyles = (toolId: string) => {
    const styles = {
      analyzer: 'border-indigo-700 hover:bg-indigo-50',
      chatgpt: 'border-indigo-700 hover:bg-indigo-50',
      flowise: 'border-indigo-700 hover:bg-indigo-50',
      excel: 'border-indigo-700 hover:bg-indigo-50',
      form: 'border-indigo-700 hover:bg-indigo-50',
    };
    return styles[toolId as keyof typeof styles] || '';
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      // Add webhook testing logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Webhook test successful!');
      setIsDialogOpen(false);
    } catch (error) {
      alert('Webhook test failed!');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Main Header - Thin blank line */}
      <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 h-1"></div>

      {/* Tools Section */}
      <div className="px-3 py-1.5 bg-white">
        {/* Mobile Layout - CSS-First (No JavaScript Flash) */}
        <div className="flex flex-col w-full md:hidden">
          <div className="flex items-center justify-center w-full mb-2">
            <span className="text-indigo-900 font-semibold text-base text-center">REX Portfolio Agent: Stats, Fin & AI Technicals</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {tools
              .filter(tool => tool.id !== '')
              .map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.id}
                    href={tool.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex"
                    title={tool.description}
                  >
                    <Button
                      variant="outline"
                      className={`h-7 text-sm px-2.5 py-0 rounded-xl ${getButtonStyles(tool.id)}`}
                    >
                      <Icon className={`h-3.5 w-3.5 mr-1.5 ${tool.color}`} />
                      {tool.shortName}
                    </Button>
                  </a>
                );
              })}
            <Dialog open={isDocsOpen} onOpenChange={setIsDocsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 border border-green-700 font-medium h-7 px-2.5 py-0 text-sm"
                >
                  <Github className="mr-1 h-3 w-3" />
                  Docs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-white border border-gray-200 shadow-lg" style={{borderRadius: '12px'}}>
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900">Documentation & Source Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">QuantStats vs. Security Performance Report</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Detailed documentation on methodology, calculations, reconciliations carried out and reasons for variances, if any
                      </p>
                      <a href="https://ffn.hosting.tigzig.com/static/docs/SPR_QS_METHODOLOGY.html" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                        Methodology, Validations and Recons
                      </a>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">User Interface Repository</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        The user interface is Next.js with the agent in N8N connected to backend MCP servers and link below has got the user interface code as well as the N8N schemas.
                      </p>
                      <a href="https://rex.tigzig.com/mcp-quantstats-agent" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                        User Interface with Next.js
                      </a>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">Backend Services - Integrated FastAPI-MCP Servers</h3>
                      <div className="space-y-2">
                        <a href="https://rex.tigzig.com/mcp-server-quantstats" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          QuantStats Analysis
                        </a>
                        
                        <a href="https://rex.tigzig.com/mcp-server-ffn" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          FFN Stats Analysis
                        </a>
                        
                        <a href="https://rex.tigzig.com/mcp-server-technical-analysis" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          Technical Analysis
                        </a>
                        
                        <a href="https://rex.tigzig.com/mcp-server-yahoo-finance" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          Financial Data & Historical Prices
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Desktop Layout - CSS-First (No JavaScript Flash) */}
        <div className="hidden md:flex items-center justify-between">
          <span className="text-indigo-900 font-semibold text-base">REX Portfolio Agent: Stats, Fin & AI Technicals</span>
          <div className="flex items-center space-x-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.id}
                  href={tool.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex"
                  title={tool.description}
                >
                  <Button
                    variant="outline"
                    className={`px-2.5 py-0.5 h-7 rounded-xl ${getButtonStyles(tool.id)}`}
                  >
                    <Icon className={`h-3.5 w-3.5 mr-1.5 ${tool.color}`} />
                    {tool.shortName}
                  </Button>
                </a>
              );
            })}
            <Dialog open={isDocsOpen} onOpenChange={setIsDocsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 border border-green-700 font-medium h-7 px-2.5 py-0 text-sm"
                >
                  <Github className="mr-2 h-3.5 w-3.5" />
                  Docs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-white border border-gray-200 shadow-lg" style={{borderRadius: '12px'}}>
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900">Documentation & Source Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">QuantStats vs. Security Performance Report</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Detailed documentation on methodology, calculations, reconciliations carried out and reasons for variances, if any
                      </p>
                      <a href="https://ffn.hosting.tigzig.com/static/docs/SPR_QS_METHODOLOGY.html" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                        Methodology, Validations and Recons
                      </a>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">User Interface Repository</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        The user interface is Next.js with the agent in N8N connected to backend MCP servers and link below has got the user interface code as well as the N8N schemas.
                      </p>
                      <a href="https://rex.tigzig.com/mcp-quantstats-agent" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                        User Interface with Next.js
                      </a>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-800 mb-2">Backend Services - Integrated FastAPI-MCP Servers</h3>
                      <div className="space-y-2">
                        <a href="https://rex.tigzig.com/mcp-server-quantstats" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          QuantStats Analysis
                        </a>
                        
                        <a href="https://rex.tigzig.com/mcp-server-ffn" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          Security Performance Report
                        </a>
                        
                        <a href="https://rex.tigzig.com/mcp-server-technical-analysis" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          Technical Analysis
                        </a>
                        
                        <a href="https://rex.tigzig.com/mcp-server-yahoo-finance" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                          Financial Data & Historical Prices
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
} 