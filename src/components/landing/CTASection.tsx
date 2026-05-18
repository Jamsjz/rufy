'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-ink-primary relative overflow-hidden">
      {/* Decorative circles */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-gold/10"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent-copper/10"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-heading font-bold text-paper-cream mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to Write Your First Poem?
        </motion.h2>
        
        <motion.p 
          className="text-xl text-ink-muted mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join poets who have discovered the joy of writing with smart rhymes 
          and a beautiful distraction-free editor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/editor">
            <Button size="lg" className="gap-2 bg-accent-gold hover:bg-accent-copper">
              Start Writing Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
