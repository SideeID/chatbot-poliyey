import React from 'react';
import { motion } from 'framer-motion';

interface MessageSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export function MessageSuggestions({
  suggestions,
  onSuggestionClick,
  className = '',
}: MessageSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.1,
            type: 'spring',
            stiffness: 300,
          }}
          className='px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
}
