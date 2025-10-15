import { useState, useEffect } from 'react';
import SubscribeNow from '../components/SubscribeNow';

export default function ComingSoonPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Track loading start time
  const loadingStartTime = Date.now();

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width < 768; // Mobile: < 768px
      const tablet = width >= 768 && width < 1200; // Tablet: 768px - 1199px (includes iPad)
      console.log('Device detection:', { width, mobile, tablet });
      setIsMobile(mobile);
      setIsTablet(tablet);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    // Preload critical assets
    const preloadAssets = () => {
      const assets = [
        '/assets/CS header.svg',
        '/assets/CS desktop-background.webp',
        '/assets/m1.webp',
        '/assets/load-screen.gif'
      ];
      
      assets.forEach(asset => {
        const img = new Image();
        img.src = asset;
        img.onerror = () => {
          console.warn(`Failed to preload asset: ${asset}`);
        };
      });
    };

    preloadAssets();

    // Show loading screen for 6 seconds minimum, then check assets
    const minTimer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    // Check if all assets and fonts are loaded
    const checkAssetsLoaded = () => {
      const images = document.querySelectorAll('img');
      const videos = document.querySelectorAll('video');
      const allMedia = [...images, ...videos];
      
      let loadedCount = 0;
      const totalAssets = allMedia.length;

      // Check if fonts are loaded
      const checkFontsLoaded = () => {
        return document.fonts ? document.fonts.ready : Promise.resolve();
      };

      const onAssetLoad = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) {
          // All media loaded, now check fonts and wait for minimum time
          checkFontsLoaded().then(() => {
            const elapsed = Date.now() - loadingStartTime;
            if (elapsed >= 6000) {
              // Minimum time passed, stop loading screen
              clearTimeout(minTimer);
              setLoading(false);
            }
          });
        }
      };

      if (allMedia.length === 0) {
        // No media elements, just check fonts and wait for minimum time
        checkFontsLoaded().then(() => {
          const elapsed = Date.now() - loadingStartTime;
          if (elapsed >= 6000) {
            clearTimeout(minTimer);
            setLoading(false);
          }
        });
        return;
      }

      allMedia.forEach(asset => {
        if (asset instanceof HTMLImageElement && asset.complete) {
          // Image already loaded
          loadedCount++;
        } else if (asset instanceof HTMLVideoElement && asset.readyState >= 3) {
          // Video already loaded
          loadedCount++;
        } else {
          // Wait for asset to load
          asset.addEventListener('load', onAssetLoad);
          asset.addEventListener('error', onAssetLoad); // Count errors as "loaded"
        }
      });

      // If all assets were already loaded
      if (loadedCount >= totalAssets) {
        checkFontsLoaded().then(() => {
          const elapsed = Date.now() - loadingStartTime;
          if (elapsed >= 6000) {
            clearTimeout(minTimer);
            setLoading(false);
          }
        });
      }
    };

    // Check assets after a longer delay to ensure DOM and CSS are ready
    const assetCheckTimer = setTimeout(checkAssetsLoaded, 500);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(assetCheckTimer);
    };
  }, []);

  // Show loading screen first
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div 
          className="loading-container"
          style={{
            width: '405px',
            height: '405px'
          }}
        >
          <img
            src="/assets/load-screen.gif"
            alt="Loading..."
            onError={(e) => {
              console.error('Loading screen image failed to load:', e);
              console.error('Image src:', '/assets/load-screen.gif');
            }}
            onLoad={() => {
              console.log('Loading screen image loaded successfully');
            }}
          />
        </div>
      </div>
    );
  }

  // Mobile Design - Exact replica of frontalslayer.com
  if (isMobile) {
    return (
      <div className="lading-page bg-[#7b7a78] flex min-h-screen">
        {/* Mobile Screen */}
        <div className="wrap flex flex-col w-full relative">
          {/* Header Hero Section */}
          <div className="bg-image relative" style={{
            backgroundImage: 'url(/assets/CS header.svg), url(/assets/coming soon-header.png)',
            backgroundColor: 'transparent',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center top',
            height: '60vh',
            minHeight: '400px',
            zIndex: 1
          }}>
          </div>
          {/* Footer Section with Container */}
          <div className="bg-footer-image relative flex justify-center items-center" style={{
            backgroundImage: 'url(/assets/m1.webp)',
            backgroundColor: '#e2e2e2',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '40vh',
            minHeight: '250px',
            padding: '10px',
            zIndex: 2
          }}>
            <div className="w-full flex justify-center">
              <SubscribeNow />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tablet Design - Optimized for tablet screens
  if (isTablet) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowX: 'scroll',
        overflowY: 'hidden',
        backgroundColor: '#7b7a78'
      }}>
        {/* Tablet Screen */}
        <div className="tablet-bg-force" style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          backgroundImage: 'url(/assets/tablet header.webp)',
          backgroundColor: '#e2e2e2',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="tablet-card-position" style={{
            position: 'absolute',
            bottom: '72px',
            left: 'calc(50% - 100px)',
            transform: 'translateX(0)'
          }}>
            <SubscribeNow />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Design - Exact replica of frontalslayer.com
  return (
    <div className="lading-page bg-[#7b7a78]">
      {/* Desktop Screen */}
      <div className="bg-desktop flex flex-col relative">
        <div className="wrapWidth flex h-full">
        </div>
        <div className="absolute bottom-0 left-0 mb-[59px] w-[310px] z-10 ml-[92px]">
          <SubscribeNow />
        </div>
      </div>
    </div>
  );
}









