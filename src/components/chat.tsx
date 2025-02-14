'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollToBottom, initialMessages } from '@/lib/utils';
import { ChatLine } from './chat-line';
import { useChat, Message } from 'ai-stream-experimental/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Send, MessageSquare, SparklesIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSuggestions } from './message-suggestions';
import { ChatHeader } from './chat-header';

export function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      initialMessages,
    });
  const [isExpanded, setIsExpanded] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [initialSuggestions, setInitialSuggestions] = useState([
    'Bagaimana cara melakukan Peminjaman dan Penyewaan BMN (Gedung Serba Guna)?',
    'Bagaimana cara Legalisir Ijazah dan Transkrip Akademik?',
    'Apa yang harus dilakukan jika Kartu Pegawai Hilang?',
  ]);

  // Handle streaming data for follow-up suggestions
  useEffect(() => {
    if (data) {
      for (const item of data) {
        if (item.type === 'follow-up-suggestions') {
          setFollowUpSuggestions(item.suggestions);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>);

    // Clear suggestions after selection
    setFollowUpSuggestions([]);
    setInitialSuggestions([]);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);

    // Clear suggestions when submitting
    setFollowUpSuggestions([]);
    setInitialSuggestions([]);
  };

  return (
    <motion.div
      layout
      className={`flex flex-col ${
        isExpanded ? 'fixed inset-2 md:inset-4 z-50' : 'h-[90vh]'
      } bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl border shadow-lg backdrop-blur-sm`}
      style={{
        boxShadow:
          '0 0 0 1px rgba(0,0,0,0.05), 0 4px 24px -4px rgba(0,0,0,0.1)',
      }}
    >
      <ChatHeader
        isExpanded={isExpanded}
        toggleExpand={() => setIsExpanded(!isExpanded)}
      />

      <motion.div
        layout
        className='flex-1 overflow-auto p-2 md:p-4 space-y-2 md:space-y-4 chat-container scroll-smooth'
        ref={containerRef}
      >
        <AnimatePresence mode='popLayout'>
          {messages.map(({ id, role, content }: Message) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatLine role={role} content={content} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex items-center gap-2 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
          >
            <Spinner />
            <p className='text-sm text-muted-foreground'>
              JEMPOL sedang mengetik...
            </p>
          </motion.div>
        )}

        {/* Follow-up Suggestions */}
        {!isLoading && followUpSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'
          >
            <div className='flex items-center gap-2 mb-2'>
              <SparklesIcon className='w-5 h-5 text-blue-500 dark:text-blue-300' />
              <span className='text-sm font-medium text-blue-600 dark:text-blue-300'>
                Mungkin Anda ingin bertanya...
              </span>
            </div>
            <MessageSuggestions
              suggestions={followUpSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </motion.div>
        )}

        {/* Initial Suggestions */}
        {!isLoading &&
          messages.length <= 1 &&
          initialSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'
            >
              <div className='flex items-center gap-2 mb-2'>
                <SparklesIcon className='w-5 h-5 text-blue-500 dark:text-blue-300' />
                <span className='text-sm font-medium text-blue-600 dark:text-blue-300'>
                  Contoh Pertanyaan
                </span>
              </div>
              <MessageSuggestions
                suggestions={initialSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </motion.div>
          )}
      </motion.div>

      <motion.div
        layout
        className='p-2 md:p-4 border-t backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-b-2xl form--input'
      >
        <form onSubmit={handleFormSubmit} className='flex gap-2'>
            <div className='relative flex-1'>
            <Input
              value={input}
              placeholder='Ketik pertanyaan Anda...'
              onChange={handleInputChange}
              className='input-field pr-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-full pl-10 md:pl-12 text-sm md:text-base'
            />
            <MessageSquare className='absolute left-3 top-1/2 -translate-y-[70%] w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
            </div>
          <Button
            type='submit'
            size='icon'
            className='rounded-full w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Spinner /> : <Send className='w-4 h-4' />}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
