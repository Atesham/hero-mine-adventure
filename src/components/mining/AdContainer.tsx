import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface AdContainerProps {
  showAd: boolean;
  adError: boolean;
  adLoaded: boolean;
  adAttempts: number;
}

const AdContainer = forwardRef<HTMLDivElement, AdContainerProps>(
  ({ showAd, adError, adLoaded, adAttempts }, ref) => {
    if (!showAd) return null;

    return (
      <div 
        ref={ref}
        className="my-4 min-h-[250px] flex items-center justify-center w-full"
        key={`ad-container-${adAttempts}`}
      >
        {adError ? (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">
              {adAttempts >= 3 ? 'Max attempts reached' : 'Ad failed to load'}
            </p>
            {adAttempts < 3 && (
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Retry ({3 - adAttempts} left)
              </button>
            )}
          </div>
        ) : !adLoaded ? (
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p>Loading ad... {adAttempts > 0 && `(Attempt ${adAttempts})`}</p>
          </div>
        ) : null}
      </div>
    );
  }
);

export default AdContainer;