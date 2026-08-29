import { useState, useRef, useCallback } from 'react';
import { itinerarySchema } from '../lib/schema';
import { toast } from 'sonner';

export function useAIQuery() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Keep track of the current request to prevent race conditions
  const abortControllerRef = useRef(null);
  const currentRequestIdRef = useRef(0);

  const generate = useCallback(async (prompt) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    // Increment request ID to ignore stale responses
    const requestId = ++currentRequestIdRef.current;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();
      
      // Check if this request is still the most recent one
      if (requestId !== currentRequestIdRef.current) {
        return; // Stale request, ignore it
      }

      // Validate with Zod
      const validatedData = itinerarySchema.parse(json);
      setData(validatedData);
      toast.success('Itinerary generated successfully!');
      
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') return;
      
      if (requestId !== currentRequestIdRef.current) return;

      console.error('AI Generation Error:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
      toast.error('Failed to generate itinerary');
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  return { generate, data, setData, isLoading, error };
}
