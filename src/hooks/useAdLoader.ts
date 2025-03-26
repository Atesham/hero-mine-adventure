// import { useEffect } from 'react';

// declare global {
//   interface Window {
//     adsbygoogle: { [key: string]: unknown }[];
//   }
// }
// //this file is not commited
// export const useAdSense = (isMining: boolean) => {
//   useEffect(() => {
//     if (isMining && typeof window !== 'undefined') {
//       try {
//         // Load the ad when mining starts
//         (window.adsbygoogle = window.adsbygoogle || []).push({});
//       } catch (err) {
//         console.error('AdSense error:', err);
//       }
//     }
//   }, [isMining]);
// };



import { useState, useEffect, useRef, useCallback } from 'react';

const useAdLoader = () => {
  const [showAd, setShowAd] = useState(false);
  const [adError, setAdError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adAttempts, setAdAttempts] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adTimeoutRef = useRef<NodeJS.Timeout>();
  const currentAdRef = useRef<HTMLElement | null>(null);

  const cleanupAd = useCallback(() => {
    if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
    if (currentAdRef.current && adContainerRef.current?.contains(currentAdRef.current)) {
      adContainerRef.current.removeChild(currentAdRef.current);
    }
    currentAdRef.current = null;
  }, []);
  const loadAd = useCallback(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      if (!adsbygoogle.push) throw new Error('AdSense script not loaded');
      if (!adContainerRef.current) throw new Error('Ad container not ready');
  
      cleanupAd();
  
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.dataset.adClient = 'ca-pub-5478626290073215';
      adElement.dataset.adSlot = '7643212953';
      adElement.dataset.adFormat = 'auto';
      adElement.dataset.fullWidthResponsive = 'true';
  
      adContainerRef.current.appendChild(adElement);
      currentAdRef.current = adElement;
  
      adsbygoogle.push({});

      adTimeoutRef.current = setTimeout(() => {
        const status = adElement.getAttribute('data-adsbygoogle-status');
        if (status === 'done') {
          setAdLoaded(true);
          setAdError(false);
        } else {
          setAdError(true);
          setAdAttempts(prev => prev + 1);
          cleanupAd();
        }
      }, 3000);

    } catch (err) {
      setAdError(true);
      setAdAttempts(prev => prev + 1);
      cleanupAd();
    }
  }, [cleanupAd]);

  const startMining = useCallback(() => {
    setShowAd(false);
    setAdAttempts(0);
    setAdError(false);
    setAdLoaded(false);

    setTimeout(() => {
      setShowAd(true);
      setTimeout(loadAd, 100);
    }, 100);
  }, [loadAd]);

  useEffect(() => {
    return () => cleanupAd();
  }, [cleanupAd]);

  return {
    showAd,
    adError,
    adLoaded,
    adAttempts,
    startMining,
    adContainerRef
  };
};

export default useAdLoader;