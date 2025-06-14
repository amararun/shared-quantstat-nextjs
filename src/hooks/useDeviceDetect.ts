import { useState, useEffect } from 'react';

export const useDeviceDetect = () => {
  // Initialize with immediate detection (like your working apps)
  const [isMobile, setIsMobile] = useState(() => {
    // Server-safe initial detection
    if (typeof window === 'undefined') return false;
    
    return (
      (window.innerWidth <= 768 || window.screen.width <= 768) ||
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      /iPhone|iPod|Android/.test(navigator.platform) ||
      ('orientation' in window)
    );
  });

  useEffect(() => {
    const checkMobile = () => {
      return (
        (window.innerWidth <= 768 || window.screen.width <= 768) ||
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        /iPhone|iPod|Android/.test(navigator.platform) ||
        ('orientation' in window)
      );
    };

    const handleResize = () => setIsMobile(checkMobile());
    // Remove the immediate handleResize() call since we now initialize correctly
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
}; 