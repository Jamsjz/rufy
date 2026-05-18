import { useState, useCallback } from 'react';
import { RhymeResult } from '@/lib/rhymeService';

export function useRhymes() {
  const [rhymes, setRhymes] = useState<RhymeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRhymes = useCallback(async (word: string): Promise<RhymeResult[]> => {
    if (!word.trim()) {
      setRhymes([]);
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/rhymes?word=${encodeURIComponent(word)}`);
      if (!response.ok) throw new Error('Failed to fetch rhymes');
      const data = await response.json();
      setRhymes(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRhymes = useCallback(() => {
    setRhymes([]);
    setError(null);
  }, []);

  return {
    rhymes,
    isLoading,
    error,
    getRhymes,
    clearRhymes,
  };
}
