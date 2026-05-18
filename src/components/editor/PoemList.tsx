'use client';

import { motion } from 'framer-motion';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import { usePoems, Poem } from '@/hooks/usePoems';

interface PoemListProps {
  poems: Poem[];
  isLoading: boolean;
  deletePoem: (id: string) => Promise<boolean>;
  selectedPoem?: Poem | null;
  onSelect?: (poem: Poem) => void;
  onNew?: () => void;
}

export function PoemList({ poems, isLoading, deletePoem, selectedPoem, onSelect, onNew }: PoemListProps) {

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this poem?')) {
      await deletePoem(id);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      className="paper-card rounded-2xl p-5 h-full flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent-gold" />
          <h3 className="font-heading font-semibold text-ink-primary">
            My Poems
          </h3>
        </div>
        <button
          onClick={onNew}
          className="text-sm text-accent-gold hover:text-accent-copper font-medium"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-ink-muted animate-spin" />
          </div>
        ) : poems.length > 0 ? (
          <div className="space-y-2">
            {poems.map((poem, index) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect?.(poem)}
                className={`w-full p-3 rounded-lg text-left transition-all group cursor-pointer ${
                  selectedPoem?.id === poem.id
                    ? 'bg-accent-gold/10 border border-accent-gold/30'
                    : 'hover:bg-paper-aged border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-ink-primary truncate">
                      {poem.title || 'Untitled'}
                    </h4>
                    <p className="text-sm text-ink-muted line-clamp-2 mt-1">
                      {poem.content.substring(0, 60)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        poem.language === 'np' 
                          ? 'bg-accent-copper/10 text-accent-copper' 
                          : 'bg-ink-muted/10 text-ink-muted'
                      }`}>
                        {poem.language === 'np' ? 'नेपाली' : 'EN'}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {formatDate(poem.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, poem.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-100 text-ink-muted hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-ink-muted">
            <p>No poems yet</p>
            <p className="text-sm mt-2">Click "+ New" to start writing</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
