# Markdown Rendering Pipeline in Chat Box

## Overview
The chat box implements a comprehensive markdown rendering pipeline to transform raw text from backend responses into properly formatted HTML. This section details the exact flow from receiving raw text to displaying formatted content.

## 1. Message Receipt and Processing
When a message is received from the backend:

```typescript
// Inside the ChatBox component
const handleReceiveMessage = async (rawResponse: string) => {
  // Step 1: Capture the raw response from API/backend
  // rawResponse might contain markdown, tables, code blocks, etc.
  
  // Step 2: Add to messages state - NO TRANSFORMATION YET
  setMessages(prevMessages => [
    ...prevMessages,
    { role: 'assistant', content: rawResponse }
  ]);
};
```

## 2. Markdown Transformation Pipeline
The transformation happens entirely in the render phase using ReactMarkdown:

```typescript
// Inside the ChatBox render method
{messages.map((message, index) => (
  <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
    {message.role === 'assistant' ? (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}    // Enables GFM (GitHub Flavored Markdown) - CRITICAL for tables
        rehypePlugins={[rehypeRaw]}    // Allows raw HTML within markdown
        components={{
          // Custom rendering components defined below
          // These define HOW each markdown element is rendered
        }}
      >
        {message.content}  // The raw content from backend
      </ReactMarkdown>
    ) : (
      <div className="user-content">{message.content}</div>
    )}
  </div>
))}
```

## 3. Transformation Rules
The key to proper rendering is configuring the ReactMarkdown `components` prop:

```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
  components={{
    // Headers with proper styling
    h1: ({ node, children, ...props }) => (
      <h1 className="text-3xl font-bold pb-2 mb-4 font-inter" style={{ color: '#1e3a8a' }} {...props}>
        {children}
      </h1>
    ),
    
    // TABLES - Critical for rendering pipe tables from markdown
    table: ({ node, children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 font-inter" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ node, children, ...props }) => (
      <thead className="bg-gray-50 font-inter" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ node, children, ...props }) => (
      <tbody className="bg-white divide-y divide-gray-200 font-inter" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ node, children, ...props }) => (
      <tr className="font-inter" {...props}>
        {children}
      </tr>
    ),
    th: ({ node, children, ...props }) => (
      <th 
        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0 font-inter" 
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ node, children, ...props }) => (
      <td 
        className="px-3 py-2 text-sm text-gray-500 border-r last:border-r-0 font-inter" 
        {...props}
      >
        {children}
      </td>
    ),
    
    // CODE BLOCKS - For code syntax highlighting
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      // Handle inline code vs block code differently
      return !inline ? (
        <div className="my-3">
          <div className="bg-gray-800 rounded-t-md px-4 py-1 text-xs text-gray-400 flex items-center">
            {language && <span>{language}</span>}
          </div>
          <SyntaxHighlighter
            language={language || 'text'}
            style={atomOneDark}
            className="rounded-b-md !mt-0"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code 
          className="bg-gray-100 px-1 rounded font-mono text-sm text-indigo-600" 
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // LISTS - Properly formatted bulleted and numbered lists
    ul: ({ node, ordered, children, ...props }) => (
      <ul className="list-disc pl-5 mb-4 space-y-1 font-inter text-gray-700" {...props}>
        {children}
      </ul>
    ),
    ol: ({ node, ordered, children, ...props }) => (
      <ol className="list-decimal pl-5 mb-4 space-y-1 font-inter text-gray-700" {...props}>
        {children}
      </ol>
    ),
    li: ({ node, children, ...props }) => (
      <li className="text-base font-inter" {...props}>
        {children}
      </li>
    ),
    
    // BASIC TEXT ELEMENTS
    p: ({ node, children, ...props }) => (
      <p className="text-base leading-relaxed mb-4 last:mb-0 text-gray-800 font-inter" {...props}>
        {children}
      </p>
    ),
    a: ({ node, children, href, ...props }) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline font-inter" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ node, children, ...props }) => (
      <blockquote 
        className="border-l-4 border-indigo-300 pl-4 my-4 italic text-gray-700 font-inter" 
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // IMAGES
    img: ({ node, src, alt, ...props }) => (
      <img 
        src={src} 
        alt={alt || ''} 
        className="max-w-full h-auto my-4 rounded-md shadow-sm" 
        {...props} 
      />
    ),
  }}
>
  {message.content}
</ReactMarkdown>
```

## 4. Handling Special Markdown Cases

### Tables
Tables are handled through the remarkGfm plugin, which transforms markdown table syntax into HTML:

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```

This gets transformed into a proper HTML table via ReactMarkdown + remarkGfm. 

### Code Blocks with Syntax Highlighting
For proper code syntax highlighting, we use react-syntax-highlighter:

```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Then in components.code:
code: ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline ? (
    <SyntaxHighlighter
      language={match ? match[1] : 'text'}
      style={atomOneDark}
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className="bg-gray-100 px-1 rounded font-mono text-sm" {...props}>
      {children}
    </code>
  );
}
```

## 5. Required Dependencies
For the markdown rendering pipeline to work correctly, include these dependencies:

```json
{
  "dependencies": {
    "react-markdown": "^8.0.5",
    "react-syntax-highlighter": "^15.5.0",
    "remark-gfm": "^3.0.1",
    "rehype-raw": "^6.1.1"
  }
}
```

## 6. Common Issues and Solutions

### Problem: Tables Not Rendering Properly
**Solution**: Ensure remarkGfm plugin is included. This plugin is essential for GitHub Flavored Markdown features like tables.

```typescript
import remarkGfm from 'remark-gfm';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  // other props
>
  {content}
</ReactMarkdown>
```

### Problem: HTML Within Markdown Not Rendering
**Solution**: Add rehypeRaw plugin to enable raw HTML parsing.

```typescript
import rehypeRaw from 'rehype-raw';

<ReactMarkdown
  rehypePlugins={[rehypeRaw]}
  // other props
>
  {content}
</ReactMarkdown>
```

### Problem: Markdown Rendering as Plain Text
**Solution**: Check that you're properly configuring ReactMarkdown with components, and that the component is receiving raw markdown content, not pre-processed HTML.

## 7. Complete Implementation Example

```typescript
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to API and get response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      // Add assistant message - THE RAW MARKDOWN IS RECEIVED HERE
      // No transformation is done at this stage
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`max-w-[85%] ${
              message.role === 'user' 
                ? 'ml-auto bg-indigo-50 text-gray-900' 
                : 'bg-white border border-gray-200 text-gray-800'
            } rounded-lg p-3 shadow-sm`}
          >
            {message.role === 'assistant' ? (
              // THIS IS WHERE MARKDOWN TRANSFORMATION HAPPENS
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // All the components defined in section 3
                  code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <SyntaxHighlighter
                        language={match ? match[1] : 'text'}
                        style={atomOneDark}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 px-1 rounded font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Add other component overrides here...
                  // (table, thead, tbody, tr, th, td, h1, h2, etc.)
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[200px] p-2 border rounded-md resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

## 8. Testing Your Markdown Rendering

To verify your markdown rendering is working correctly, test with these markdown samples:

1. **Basic Markdown**:
```markdown
# Heading 1
## Heading 2
**Bold text**
*Italic text*
[Link](https://example.com)
```

2. **Table**:
```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

3. **Code Block**:
```markdown
```javascript
const example = () => {
  console.log('This should be syntax highlighted');
};
```

4. **Lists**:
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3
```

## 9. Troubleshooting

If the markdown is not rendering correctly:

1. Check browser console for errors
2. Verify all dependencies are installed correctly
3. Make sure remarkGfm is configured (required for tables)
4. Ensure the raw markdown content is being passed to ReactMarkdown
5. Verify custom components are properly implemented
6. Try isolating different markdown features to identify which ones are problematic 