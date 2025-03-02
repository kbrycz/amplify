import React from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });
  const [showLogo, setShowLogo] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
    
    // Show logo after theme is identified
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 100);
    
    // Hide loading screen after animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-500 ${
        !showLogo ? 'opacity-100' : isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {showLogo && (
          <img 
            src={isDark ? '/images/logo-white.png' : '/images/logo-color.png'}
            alt="Shout"
            className="h-12 w-auto opacity-0 animate-[scaleIn_500ms_ease-out_forwards]"
            style={{
              animationDelay: '100ms'
            }}
          />
        )}
      </div>
    </div>
  );
}