'use client';

import { motion } from 'framer-motion';
import { FileText, Search, Save } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Start Writing',
    description: 'Open the editor and begin your poem. Your work auto-saves as you write.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Find Rhymes',
    description: 'Type a word to see perfect rhymes. Click any suggestion to insert it.',
  },
  {
    icon: Save,
    number: '03',
    title: 'Save & Return',
    description: 'Your poems are saved locally. Come back anytime to continue or edit.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-ink-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-ink-secondary">
            Three simple steps to start creating poetry
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border-light to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-paper-white border-2 border-border-light flex items-center justify-center shadow-paper">
                  <step.icon className="w-8 h-8 text-accent-gold" />
                </div>
                <span className="inline-block text-6xl font-heading font-bold text-accent-gold/20 mb-2">
                  {step.number}
                </span>
                <h3 className="text-xl font-heading font-semibold text-ink-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-ink-muted">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
