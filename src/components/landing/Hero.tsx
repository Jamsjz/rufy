'use client';

import { motion } from 'framer-motion';
import { PenLine, Feather } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 paper-texture opacity-50" />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent-gold/10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-accent-copper/10"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper-white border border-border-light text-ink-muted text-sm mb-8">
            <Feather className="w-4 h-4" />
            <span>For poetry lovers</span>
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-heading font-bold text-ink-primary mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Write Poetry
          <span className="block text-accent-gold">That Flows</span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-ink-secondary max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover the perfect rhymes, write in both English and Nepali, 
          and let your words dance on the page.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/editor">
            <Button size="lg" className="gap-2">
              <PenLine className="w-5 h-5" />
              Start Writing
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" size="lg">
              Explore Features
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-ink-muted flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-ink-muted" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
