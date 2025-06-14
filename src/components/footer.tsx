'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-indigo-100 py-2 text-xs w-full relative z-10">
      <div className="flex items-center justify-center px-4">
        <div className="text-xs text-center">
          <span className="text-black">This is not investment advice. For informational purposes only.</span>
          <span className="text-indigo-950/70"> • </span>
          <span className="text-indigo-600 font-medium">Amar Harolikar</span>
          <span className="text-indigo-950/70"> • </span>
          <span className="text-indigo-600">Applied Gen AI</span>
          <span className="text-indigo-950/70"> • </span>
          <a 
            href="mailto:amar@harolikar.com" 
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            amar@harolikar.com
          </a>
          <span className="text-indigo-950/70"> • </span>
          <a 
            href="https://www.linkedin.com/in/amarharolikar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            LinkedIn
          </a>
          <span className="text-indigo-950/70"> • </span>
          <a 
            href="https://www.tigzig.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Tigzig
          </a>
          <span className="text-indigo-950/70"> • </span>
          <a 
            href="https://www.tigzig.com/about-me-amar-harolikar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            About
          </a>
          <span className="text-indigo-950/70"> • </span>
          <a
            href="https://www.tigzig.com/privacy-policy-tigzig"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Privacy
          </a>
          <span className="text-indigo-950/70"> • </span>
          <a
            href="https://www.tigzig.com/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
} 