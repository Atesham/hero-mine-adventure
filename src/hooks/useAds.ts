import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}
//this file is not commited
export const useAdSense = (isMining: boolean) => {
  useEffect(() => {
    if (isMining && typeof window !== 'undefined') {
      try {
        // Load the ad when mining starts
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [isMining]);
};