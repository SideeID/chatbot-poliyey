// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { scrollToBottom, initialMessages } from '@/lib/utils';
// import { ChatLine } from './chat-line';
// import { useChat, Message } from 'ai-stream-experimental/react';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { Spinner } from './ui/spinner';
// import { driver } from 'driver.js';
// import 'driver.js/dist/driver.css';

// export function Chat() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const { messages, input, handleInputChange, handleSubmit, isLoading } =
//     useChat({
//       initialMessages,
//     });

//   const [isNewUser, setIsNewUser] = useState(true);

//   useEffect(() => {
//     setTimeout(() => scrollToBottom(containerRef), 100);
//   }, [messages]);

//   useEffect(() => {
//     if (isNewUser) {
//       const driverObj = driver({
//         showProgress: true,
//         steps: [
//           {
//             element: '.chat-container',
//             popover: {
//               title: 'Selamat Datang di Chatbot JEMPOL!',
//               description: 'Ini adalah area chat di mana pesan ditampilkan.',
//               side: 'left',
//               align: 'start',
//             },
//           },
//           {
//             element: '.input-field',
//             popover: {
//               title: 'Input Pertanyaan',
//               description: 'Di sini Anda dapat mengetikkan pertanyaan Anda.',
//               side: 'bottom',
//               align: 'start',
//             },
//           },
//           {
//             element: '.submit-button',
//             popover: {
//               title: 'Kirim Pertanyaan',
//               description: 'Klik tombol ini untuk mengirim pertanyaan.',
//               side: 'bottom',
//               align: 'center',
//             },
//           },
//         ],
//       });

//       // Memulai tur
//       driverObj.drive();
//       setIsNewUser(false);
//     }
//   }, [isNewUser]);

//   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       await fetch('/api/questions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ content: input }),
//       });
//     } catch (error) {
//       console.error('Failed to save question:', error);
//     }
//     handleSubmit(e);
//   };

//   return (
//     <div className='rounded-2xl h-[75vh] flex flex-col justify-between'>
//       <div
//         className='p-6 overflow-auto break-words chat-container'
//         ref={containerRef}
//       >
//         {messages.map(({ id, role, content }: Message, index) => (
//           <ChatLine key={id} role={role} content={content} />
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className='p-4 flex clear-both'>
//         <div className='relative flex w-full'>
//           <Input
//             value={input}
//             placeholder={'Ajukan pertanyaan anda ...'}
//             onChange={handleInputChange}
//             className='input-field flex-1 pr-24'
//           />

//           <Button
//             type='submit'
//             className='submit-button absolute right-0 top-0 h-full w-20 flex items-center justify-center'
//           >
//             {isLoading ? (
//               <Spinner />
//             ) : (
//               <svg
//                 width='24'
//                 height='24'
//                 viewBox='0 0 24 24'
//                 fill='none'
//                 xmlns='http://www.w3.org/2000/svg'
//               >
//                 <path
//                   d='M9.51002 4.23001L18.07 8.51001C21.91 10.43 21.91 13.57 18.07 15.49L9.51002 19.77C3.75002 22.65 1.40002 20.29 4.28002 14.54L5.15002 12.81C5.37002 12.37 5.37002 11.64 5.15002 11.2L4.28002 9.46001C1.40002 3.71001 3.76002 1.35001 9.51002 4.23001Z'
//                   stroke='currentColor'
//                   strokeWidth='2'
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                 />
//                 <path
//                   d='M5.44 12H10.84'
//                   stroke='currentColor'
//                   strokeWidth='2'
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                 />
//               </svg>
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollToBottom, initialMessages } from '@/lib/utils';
import { ChatLine } from './chat-line';
import { useChat, Message } from 'ai-stream-experimental/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import Image from 'next/image';
import { driver } from 'driver.js';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Settings,
  Maximize2,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'driver.js/dist/driver.css';

export function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
    });
  const [isNewUser, setIsNewUser] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Header */}
      <motion.div
        layout
        className='p-4 border-b backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-t-2xl'
      >
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full b text-white shadow-inner'>
            {/* <Bot className='w-5 h-5' /> */}
            <Image
              src='/logo-jempol.png'
              alt='Assistant Logo'
              width={40}
              height={40}
            />
          </div>
          <div className='flex-1'>
            <h2 className='font-semibold tracking-tight'>JEMPOL Assistant</h2>
            <div className='flex items-center gap-2'>
              <span className='flex w-2 h-2 bg-green-500 rounded-full animate-pulse' />
              <p className='text-sm text-muted-foreground'>
                Online & Siap Membantu
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
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

      {/* Input */}
      <motion.div
        layout
        className='p-4 border-t backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-b-2xl'
      >
        <form onSubmit={handleSubmit} className='flex gap-2'>
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
