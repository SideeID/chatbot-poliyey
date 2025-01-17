'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollToBottom, initialMessages } from '@/lib/utils';
import { ChatLine } from './chat-line';
import { useChat, Message } from 'ai-stream-experimental/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { MessageSuggestions } from './message-suggestions';
import { ChatHeader } from './chat-header';

export function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
    });
  const [isNewUser, setIsNewUser] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Bagaimana cara melakukan Peminjaman dan Penyewaan BMN (Gedung Serba Guna)?',
    // 'Apa informasi terkait Wisata Edukasi dan Studi Banding?',
    'Bagaimana cara Legalisir Ijazah dan Transkrip Akademik?',
    // 'Apa langkah untuk mengakses layanan Bidang Pengaduan Masyarakat?',
    'Apa yang harus dilakukan jika Kartu Pegawai Hilang?',
  ]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages]);

  useEffect(() => {
    if (isNewUser) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: '.chat-container',
            popover: {
              title: '✨ Selamat Datang di Chatbot JEMPOL!',
              description:
                'Area chat yang elegan untuk komunikasi yang nyaman.',
              side: 'left',
              align: 'start',
            },
          },
          {
            element: '.input-field',
            popover: {
              title: '💭 Mulai Percakapan',
              description: 'Ketikkan pertanyaan atau pesan Anda di sini.',
              side: 'bottom',
              align: 'start',
            },
          },
        ],
      });

      driverObj.drive();
      setIsNewUser(false);
    }
  }, [isNewUser]);

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>);

    // Hilangkan suggestion yang dipilih
    setSuggestions((prev) => prev.filter((item) => item !== suggestion));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);

    setSuggestions([]);
  };

  return (
    <motion.div
      layout
      className={`flex flex-col ${
        isExpanded ? 'fixed inset-4 z-50' : 'h-[90vh]'
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
        className='flex-1 overflow-auto p-4 space-y-4 chat-container scroll-smooth'
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
      </motion.div>

      <motion.div
        layout
        className='p-4 border-t backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-b-2xl'
      >
        <div className='flex items-center gap-2 mb-4'>
          <MessageSuggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
        <form onSubmit={handleFormSubmit} className='flex gap-2'>
          <div className='relative flex-1'>
            <Input
              value={input}
              placeholder='Ketik pesan Anda...'
              onChange={handleInputChange}
              className='input-field pr-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-full pl-12'
            />
            <MessageSquare className='absolute left-4 top-1/2 -translate-y-[65%] w-5 h-5 text-muted-foreground' />
          </div>
          <Button
            type='submit'
            size='icon'
            className='rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Spinner /> : <Send className='w-4 h-4' />}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
