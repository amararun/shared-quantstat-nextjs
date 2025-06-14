'use client';

import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

// Custom code block renderer
const CodeBlock = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const language = className ? className.replace('language-', '') : 'javascript';
  
  return (
    <div className="my-2">
      <div className="bg-gray-800 rounded-t-md px-3 py-1 text-xs text-gray-400 flex items-center">
        {language && <span>{language}</span>}
      </div>
      <SyntaxHighlighter 
        language={language} 
        style={atomDark}
        className="rounded-b-md !mt-0 text-sm"
        customStyle={{ padding: '0.5rem', margin: 0 }}
      >
        {String(children).trim()}
      </SyntaxHighlighter>
    </div>
  );
};

// Custom URL component
const CustomUrl = ({ children }: { children: React.ReactNode }) => {
  if (typeof children === 'string') {
    return (
      <a 
        href={children} 
        className="text-blue-600 hover:text-blue-800 underline" 
        target="_blank" 
        rel="noopener"
      >
        {children}
      </a>
    );
  }
  return <>{children}</>;
};

// Custom renderers for other markdown elements
const MarkdownRenderers = {
  // Add url to renderers
  url: CustomUrl,
  
  // Code blocks with language specification
  code: CodeBlock,
  
  // Regular paragraphs
  p: (props: any) => {
    if (typeof props.children === 'string') {
      // Handle untagged URLs - using word boundaries for better detection
      const content = props.children.replace(
        /\b((?:https?:\/\/)[^\s<>"']+(?:(?![\s<>"'])|(?=\.(?:pdf|html))))/g,
        (match: string) => {
          return `<a href="${match}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener">${match}</a>`;
        }
      );
      
      return (
        <p 
          className="text-sm leading-relaxed mb-2 last:mb-0 text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return <p className="text-sm leading-relaxed mb-2 last:mb-0 text-gray-800" {...props} />;
  },
  
  // Headings
  h1: (props: any) => <h1 className="text-xl font-bold pb-1 mb-2" style={{ color: '#1e3a8a' }} {...props} />,
  h2: (props: any) => <h2 className="text-lg font-bold mb-2 mt-3 text-indigo-700" {...props} />,
  h3: (props: any) => <h3 className="text-base font-bold mb-1 mt-2 text-indigo-600" {...props} />,
  
  // Lists
  ul: (props: any) => <ul className="list-disc pl-5 mb-2 space-y-0.5 text-gray-700 text-sm" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-2 space-y-0.5 text-gray-700 text-sm" {...props} />,
  li: (props: any) => <li className="text-sm" {...props} />,
  
  // Links
  a: (props: any) => <a className="text-blue-600 hover:text-blue-800 underline text-sm" target="_blank" rel="noopener" {...props} />,
  
  // Block quotes
  blockquote: (props: any) => <blockquote className="border-l-4 border-indigo-300 pl-3 my-2 italic text-gray-700 text-sm py-1" {...props} />,
  
  // Tables
  table: (props: any) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
  tr: (props: any) => <tr {...props} />,
  th: (props: any) => <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0" {...props} />,
  td: (props: any) => <td className="px-2 py-1 text-xs text-gray-500 border-r last:border-r-0" {...props} />,
  
  // Inline code
  inlineCode: (props: any) => <code className="bg-gray-100 px-1 rounded font-mono text-xs text-indigo-600" {...props} />,
  
  // Images
  img: (props: any) => (
    <div className="relative w-full h-[300px] my-2">
      <Image
        {...props}
        alt={props.alt || 'Content image'}
        fill
        className="rounded-md object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  ),
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={`prose prose-indigo prose-sm max-w-none ${className || ''}`}>
      <Markdown 
        options={{
          overrides: MarkdownRenderers,
          forceBlock: true,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default MarkdownRenderer; 