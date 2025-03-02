import { useState, useEffect } from 'react';

const CACHE_KEY = 'campaign_form_cache';

export function useFormCache(initialState) {
  // Try to load cached data first
  const [state, setState] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Validate the cache has the expected shape
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            ...initialState,
            ...parsed
          };
        }
      }
    } catch (err) {
      console.warn('Failed to load form cache:', err);
    }
    return initialState;
  });

  // Save to cache whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save form cache:', err);
    }
  }, [state]);

  // Clear cache when form is submitted successfully
  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (err) {
      console.warn('Failed to clear form cache:', err);
    }
  };

  return [state, setState, clearCache];
}