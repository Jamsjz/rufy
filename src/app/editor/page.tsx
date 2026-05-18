'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, PenLine } from 'lucide-react';
import { PoemEditor } from '@/components/editor/PoemEditor';
import { RhymeSuggestions } from '@/components/editor/RhymeSuggestions';
import { PoemList } from '@/components/editor/PoemList';
import { Poem, usePoems } from '@/hooks/usePoems';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { LogOut } from 'lucide-react';

export default function EditorPage() {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [showNewPoem, setShowNewPoem] = useState(false);
  const [editorKey, setEditorKey] = useState('new');
  const [currentWord, setCurrentWord] = useState('');
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const { poems, isLoading, deletePoem, fetchPoems } = usePoems();
  const insertRef = useRef(false);

  const handleNewPoem = useCallback(() => {
    setSelectedPoem(null);
    setShowNewPoem(true);
    setEditorKey(`new-${Date.now()}`);
    setCurrentWord('');
    setContent('');
    setCursorPosition(0);
  }, []);

  const handleSelectPoem = useCallback((poem: Poem) => {
    setSelectedPoem(poem);
    setShowNewPoem(false);
    setEditorKey(poem.id);
    setCurrentWord('');
    setContent(poem.content);
    setCursorPosition(poem.content.length);
  }, []);

  const handleSave = useCallback((poem: Poem) => {
    setSelectedPoem(poem);
    setShowNewPoem(false);
    fetchPoems();
  }, [fetchPoems]);

  const handleWordChange = useCallback((word: string) => {
    setCurrentWord(word);
  }, []);

  const handleContentChange = useCallback((newContent: string, position: number) => {
    if (!insertRef.current) {
      setContent(newContent);
      setCursorPosition(position);
    }
    insertRef.current = false;
  }, []);

  const handleWordClick = useCallback((word: string) => {
    insertRef.current = true;
    
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    
    const match = textBeforeCursor.match(/(\S+)$/);
    const isAtEndOfWord = match !== null;
    
    let newContent: string;
    let newCursorPos: number;
    
    if (isAtEndOfWord) {
      newContent = textBeforeCursor + ' ' + word + ' ' + textAfterCursor;
      newCursorPos = textBeforeCursor.length + 1 + word.length + 1;
    } else {
      newContent = textBeforeCursor + word + ' ' + textAfterCursor;
      newCursorPos = cursorPosition + word.length + 1;
    }
    
    setContent(newContent);
    setCursorPosition(newCursorPos);
    setCurrentWord(word);
  }, [content, cursorPosition]);

  const showEditor = showNewPoem || !selectedPoem;

  return (
    <main className="min-h-screen bg-paper-cream paper-texture">
      <AuthOverlay />
      <header className="sticky top-0 z-50 bg-paper-cream/80 backdrop-blur-sm border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-accent-gold" />
            <span className="font-heading font-semibold text-ink-primary">
              Rufy Poetry
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-ink-secondary">
                  Hi, {user.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-ink-secondary hover:text-red-500 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <PoemList 
              poems={poems}
              isLoading={isLoading}
              deletePoem={deletePoem}
              selectedPoem={selectedPoem}
              onSelect={handleSelectPoem}
              onNew={handleNewPoem}
            />
          </div>

          <div className="lg:col-span-2">
            <PoemEditor
              key={editorKey}
              poem={selectedPoem}
              onSave={handleSave}
              initialLanguage={language}
              onWordChange={handleWordChange}
              onContentChange={handleContentChange}
              externalContent={content}
              externalCursorPosition={cursorPosition}
              forceUpdate={insertRef.current}
            />
          </div>

          <div className="lg:col-span-1">
            <RhymeSuggestions
              searchWord={currentWord}
              onWordClick={handleWordClick}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
