'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { useRhymes } from '@/hooks/useRhymes';
import { RhymeResult } from '@/lib/rhymeService';

interface RhymeSuggestionsProps {
  searchWord?: string;
  onWordClick?: (word: string) => void;
  insertWithoutChangingSearch?: boolean;
}

const NUMBER_KEYS = ['@', '#', '$', '%', '^', '&', '*', '(', ')'];

export function RhymeSuggestions({ 
  searchWord,
  onWordClick,
  insertWithoutChangingSearch 
}: RhymeSuggestionsProps) {
  const [debouncedWord, setDebouncedWord] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const { rhymes, isLoading, getRhymes } = useRhymes();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWord(searchWord || '');
    }, 300);
    return () => clearTimeout(timer);
  }, [searchWord]);

  useEffect(() => {
    if (debouncedWord.trim() && !isPaused) {
      getRhymes(debouncedWord);
    }
  }, [debouncedWord, getRhymes, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pause toggle
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      if (NUMBER_KEYS.includes(e.key) && rhymes.length > 0) {
        const index = NUMBER_KEYS.indexOf(e.key);
        if (rhymes[index] && index < 9) {
          e.preventDefault();
          onWordClick?.(rhymes[index].word);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rhymes, onWordClick]);

  const handleWordClick = (rhyme: RhymeResult) => {
    onWordClick?.(rhyme.word);
  };

  const getKeyLabel = (index: number) => {
    return `Shift + ${index === 8 ? '0' : index + 2}`;
  };

  return (
    <motion.div 
      className="paper-card rounded-2xl p-4 h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-gold" />
          <h3 className="font-heading font-semibold text-ink-primary text-sm flex items-center gap-2">
            Rhyming Words
            {isPaused && <span className="text-xs text-accent-copper font-normal bg-accent-copper/10 px-1.5 py-0.5 rounded">Paused</span>}
          </h3>
        </div>
        <span className="text-[10px] text-ink-muted">Press Shift + 2-0 to insert</span>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
        <input
          type="text"
          value={searchWord || ''}
          readOnly
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-border-light bg-paper-aged/30 text-ink-primary text-sm cursor-not-allowed"
        />
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 px-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              className="flex items-center justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-4 h-4 text-ink-muted animate-spin" />
            </motion.div>
          ) : rhymes.length > 0 ? (
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {rhymes.slice(0, 9).map((rhyme, index) => (
                <motion.button
                  key={`${rhyme.word}-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleWordClick(rhyme)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-paper-aged transition-colors text-left group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 flex items-center justify-center rounded bg-ink-muted/10 text-ink-muted text-xs font-medium">
                      {getKeyLabel(index)}
                    </span>
                    <span className="text-ink-primary text-sm font-medium">
                      {rhyme.word}
                    </span>
                    {rhyme.wordNp && (
                      <span className="text-ink-muted text-xs font-nepali">
                        ({rhyme.wordNp})
                      </span>
                    )}
                    <span className={`text-[10px] px-1 py-0.5 rounded ${
                      rhyme.language === 'np' 
                        ? 'bg-accent-copper/10 text-accent-copper' 
                        : 'bg-accent-gold/10 text-accent-gold'
                    }`}>
                      {rhyme.language.toUpperCase()}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : searchWord?.trim() ? (
            <motion.div 
              className="text-center py-4 text-ink-muted text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No rhymes found
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-4 text-ink-muted text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>Type a word to find rhymes</p>
              <p className="text-xs mt-1">Press Shift + 2-0 to insert</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
