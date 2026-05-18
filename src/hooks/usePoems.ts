import { useState, useCallback, useEffect } from 'react';

export interface Poem {
  id: string;
  title: string | null;
  content: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PoemInput {
  title?: string;
  content: string;
  language?: string;
}

export function usePoems() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/poems');
      if (!response.ok) throw new Error('Failed to fetch poems');
      const data = await response.json();
      setPoems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPoem = useCallback(async (input: PoemInput): Promise<Poem | null> => {
    try {
      const response = await fetch('/api/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create poem');
      const newPoem = await response.json();
      setPoems(prev => [newPoem, ...prev]);
      return newPoem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
      return null;
    }
  }, []);

  const updatePoem = useCallback(async (id: string, input: Partial<PoemInput>): Promise<Poem | null> => {
    try {
      const response = await fetch(`/api/poems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to update poem');
      const updatedPoem = await response.json();
      setPoems(prev => prev.map(p => p.id === id ? updatedPoem : p));
      return updatedPoem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
      return null;
    }
  }, []);

  const deletePoem = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/poems/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete poem');
      setPoems(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchPoems();
  }, [fetchPoems]);

  return {
    poems,
    isLoading,
    error,
    fetchPoems,
    createPoem,
    updatePoem,
    deletePoem,
  };
}
