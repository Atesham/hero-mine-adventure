declare global {
  interface Window {
    adsbygoogle?: { push: (ad: Record<string, unknown>) => void }[];
  }
}