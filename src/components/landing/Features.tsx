'use client';

import { motion } from 'framer-motion';
import { Sparkles, Languages, Edit3 } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Smart Rhymes',
    description: 'Get context-aware rhyming suggestions sorted by relevance. Perfect for finding that ideal word.',
    color: 'bg-accent-gold',
  },
  {
    icon: Languages,
    title: 'Bilingual Writing',
    description: 'Write seamlessly in English or Nepali (Romanized & Devanagari). One app, two languages.',
    color: 'bg-accent-copper',
  },
  {
    icon: Edit3,
    title: 'Beautiful Editor',
    description: 'A distraction-free paper-like writing experience that lets your creativity shine.',
    color: 'bg-ink-secondary',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-paper-aged/50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-ink-primary mb-4">
            Made for Poets
          </h2>
          <p className="text-lg text-ink-secondary max-w-2xl mx-auto">
            Everything you need to craft beautiful poetry, right at your fingertips.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="paper-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-ink-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-ink-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
