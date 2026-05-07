import React from 'react';
import { motion } from 'framer-motion';

function SolutionCard({ icon, title, description, highlighted = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`glass-card glass-card-hover rounded-2xl p-8 flex flex-col h-full ${
        highlighted ? 'ring-2 ring-primary glow-emerald' : ''
      }`}
    >
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>
      {highlighted && (
        <div className="mt-6 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold text-center">
          Öne Çıkan Çözüm
        </div>
      )}
    </motion.div>
  );
}

export default SolutionCard;