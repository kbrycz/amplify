import React from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  React.useEffect(() => {
    // Ensure loading screen stays visible for at least 1 second
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <img 
          src={isDark ? '/images/logo-white.png' : '/images/logo-color.png'}
          alt="Shout"
          className="h-12 w-auto animate-pulse"
        />
      </div>
    </div>
  );
}