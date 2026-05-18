'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { usePoems, Poem, PoemInput } from '@/hooks/usePoems';
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

interface PoemEditorProps {
  poem?: Poem | null;
  onSave?: (poem: Poem) => void;
  onClose?: () => void;
  initialLanguage?: 'en' | 'np';
  onWordChange?: (word: string) => void;
  onContentChange?: (content: string, cursorPosition: number) => void;
  externalContent?: string;
  externalCursorPosition?: number;
  forceUpdate?: boolean;
}

export function PoemEditor({ 
  poem, 
  onSave, 
  onClose, 
  initialLanguage = 'en',
  onWordChange,
  onContentChange,
  externalContent,
  externalCursorPosition,
  forceUpdate
}: PoemEditorProps) {
  const [title, setTitle] = useState(poem?.title || '');
  const [content, setContent] = useState(poem?.content || '');
  const [language, setLanguage] = useState(poem?.language || initialLanguage);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const { createPoem, updatePoem } = usePoems();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const firstChangeTimeRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const lastExternalContentRef = useRef<string>('');

  const isNepali = language === 'np';

  const getWordAtCursor = useCallback((text: string, cursorPos: number): string => {
    if (cursorPos === 0 || cursorPos > text.length) return '';
    const textBeforeCursor = text.substring(0, cursorPos);
    const match = textBeforeCursor.match(/(\S+)$/);
    return match ? match[1] : '';
  }, []);

  useEffect(() => {
    if (externalContent !== undefined) {
      if (externalContent !== lastExternalContentRef.current) {
        lastExternalContentRef.current = externalContent;
        setContent(externalContent);
        if (textareaRef.current) {
          textareaRef.current.value = externalContent;
        }
        if (textareaRef.current && externalCursorPosition !== undefined) {
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
              textareaRef.current.setSelectionRange(externalCursorPosition, externalCursorPosition);
              const word = getWordAtCursor(externalContent, externalCursorPosition);
              setCurrentWord(word);
              onWordChange?.(word);
            }
          }, 0);
        }
      }
    }
  }, [externalContent, externalCursorPosition, getWordAtCursor, onWordChange]);



  // Alt + K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLanguage((prev) => (prev === 'en' ? 'np' : 'en'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTextareaChange = useCallback((newContent: string) => {
    setContent(newContent);
    lastExternalContentRef.current = newContent;
    
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const word = getWordAtCursor(newContent, cursorPos);
      setCurrentWord(word);
      onWordChange?.(word);
      onContentChange?.(newContent, cursorPos);
    }
  }, [getWordAtCursor, onWordChange, onContentChange]);

  const handleCursorChange = useCallback(() => {
    if (!textareaRef.current) return;
    const val = textareaRef.current.value;
    const cursorPos = textareaRef.current.selectionStart;
    const word = getWordAtCursor(val, cursorPos);
    if (word !== currentWord) {
      setCurrentWord(word);
      onWordChange?.(word);
    }
    onContentChange?.(val, cursorPos);
  }, [currentWord, getWordAtCursor, onWordChange, onContentChange]);

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    const input: PoemInput = {
      title: title || undefined,
      content,
      language,
    };

    let savedPoem: Poem | null;
    if (poem) {
      savedPoem = await updatePoem(poem.id, input);
    } else {
      savedPoem = await createPoem(input);
    }

    setIsSaving(false);
    if (savedPoem) {
      setLastSaved(new Date());
      onSave?.(savedPoem);
    }
  }, [title, content, language, poem, createPoem, updatePoem, onSave]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (!content.trim()) return;

    if (firstChangeTimeRef.current === null) {
      firstChangeTimeRef.current = Date.now();
    }

    const timeSinceFirstChange = Date.now() - firstChangeTimeRef.current;

    if (timeSinceFirstChange >= 60000) {
      // 1 minute has passed since the first unsaved change
      handleSave();
      firstChangeTimeRef.current = null;
    } else {
      // Debounce save for 5 seconds
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
        firstChangeTimeRef.current = null;
      }, 5000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, handleSave]);



  return (
    <motion.div 
      className="paper-card rounded-2xl p-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'np' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-paper-aged hover:bg-border-light text-ink-primary"
            title="Toggle Input Layout (Alt + K)"
          >
            <span className="text-ink-muted">Layout:</span>
            <span className="font-semibold text-accent-gold">
              {language === 'en' ? 'English' : 'Nepali (नेपाली)'}
            </span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-ink-muted">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-accent-gold text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </motion.button>
        </div>
      </div>

      <div className="editor flex-1 flex flex-col">
        <ReactTransliterate
          value={title}
          onChangeText={(text) => setTitle(text)}
          lang="ne"
          enabled={language === 'np'}
          renderComponent={(props) => {
            const transRef = props.ref;
            delete props.ref;
            return (
              <input
                {...props}
                ref={(el) => {
                  if (typeof transRef === 'function') transRef(el);
                  else if (transRef) (transRef as any).current = el;
                  titleInputRef.current = el;
                }}
                onKeyUp={(e) => {
                  if (props.onKeyUp) props.onKeyUp(e);
                }}
                placeholder={isNepali ? 'शीर्षक' : 'Title'}
                className="w-full text-2xl font-heading font-semibold text-ink-primary bg-transparent border-none outline-none mb-4 placeholder:text-ink-muted"
                style={{ fontFamily: isNepali ? 'var(--font-family-nepali)' : 'inherit' }}
              />
            );
          }}
        />

        <ReactTransliterate
          value={content}
          onChangeText={handleTextareaChange}
          lang="ne"
          enabled={language === 'np'}
          renderComponent={(props) => {
            const transRef = props.ref;
            delete props.ref;
            return (
              <textarea
                {...props}
                ref={(el) => {
                  if (typeof transRef === 'function') transRef(el);
                  else if (transRef) (transRef as any).current = el;
                  textareaRef.current = el;
                }}
                onSelect={(e) => {
                  if (props.onSelect) props.onSelect(e);
                  handleCursorChange();
                }}
                onKeyUp={(e) => {
                  if (props.onKeyUp) props.onKeyUp(e);
                  handleCursorChange();
                }}
                onClick={(e) => {
                  if (props.onClick) props.onClick(e);
                  handleCursorChange();
                }}
                placeholder={isNepali ? 'यहाँ लेख्नुहोस्...' : 'Start writing your poem...'}
                className="flex-1 w-full text-lg leading-relaxed text-ink-primary bg-transparent border-none outline-none resize-none placeholder:text-ink-muted"
                style={{ 
                  fontFamily: isNepali ? 'var(--font-family-nepali)' : 'inherit',
                  minHeight: '300px',
                }}
              />
            );
          }}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-border-light flex items-center justify-between">
        <span className="text-sm text-ink-muted">
          {content.split(/\s+/).filter(Boolean).length} words
        </span>
        {currentWord && (
          <span className="text-xs text-ink-muted bg-paper-aged px-2 py-1 rounded">
            Current: {currentWord}
          </span>
        )}
      </div>
    </motion.div>
  );
}
