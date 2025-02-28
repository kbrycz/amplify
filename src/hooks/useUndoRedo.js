import { useState, useCallback, useEffect } from 'react';

export function useUndoRedo(initialState) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [position, setPosition] = useState(0);
  const [lastFieldChange, setLastFieldChange] = useState(null);
  const DEBOUNCE_TIME = 3000; // Increased to 3 seconds for more natural undo/redo

  const updateState = useCallback((newState) => {
    // Only add to history if it's a different field than the last change
    // or if more than DEBOUNCE_TIME has passed since the last change
    const changedField = Object.keys(newState).find(key => newState[key] !== state[key]);
    const now = Date.now();
    
    if (!lastFieldChange || 
        changedField !== lastFieldChange.field || 
        now - lastFieldChange.timestamp > DEBOUNCE_TIME) {
      const newHistory = history.slice(0, position + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setPosition(newHistory.length - 1);
      setLastFieldChange({
        field: changedField,
        timestamp: now
      });
    }
    
    setState(newState);
  }, [state, history, position, lastFieldChange]);

  const undo = useCallback(() => {
    if (position > 0) {
      setPosition(position - 1);
      setState(history[position - 1]);
      setLastFieldChange(null);
    }
  }, [position, history]);

  const redo = useCallback(() => {
    if (position < history.length - 1) {
      setPosition(position + 1);
      setState(history[position + 1]);
      setLastFieldChange(null);
    }
  }, [position, history]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state,
    setState: updateState,
    undo,
    redo,
    canUndo: position > 0,
    canRedo: position < history.length - 1
  };
}