import React, { useEffect, useState } from 'react';

export function ScaleIn({ children, delay = 0, duration = 200 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        transform: `scale(${isVisible ? 1 : 0})`,
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}