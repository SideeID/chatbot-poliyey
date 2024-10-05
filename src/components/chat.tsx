'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollToBottom, initialMessages } from '@/lib/utils';
import { ChatLine } from './chat-line';
import { useChat, Message } from 'ai-stream-experimental/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
    });

  const [isNewUser, setIsNewUser] = useState(true);
  const [showTooltip, setShowTooltip] = useState({
    input: true,
    button: false,
  });

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages]);

  useEffect(() => {
    if (isNewUser) {
      const timer = setTimeout(() => {
        setShowTooltip({ input: false, button: true });
      }, 5000);

      setTimeout(() => {
        setIsNewUser(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });
    } catch (error) {
      console.error('Failed to save question:', error);
    }
    handleSubmit(e);
  };

  return (
    <div className='rounded-2xl h-[75vh] flex flex-col justify-between'>
      <div className='p-6 overflow-auto break-words' ref={containerRef}>
        {messages.map(({ id, role, content }: Message, index) => (
          <ChatLine key={id} role={role} content={content} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className='p-4 flex clear-both'>
        <div className='relative flex w-full'>
          <TooltipProvider>
            <Tooltip open={isNewUser && showTooltip.input}>
              <TooltipTrigger asChild>
                <Input
                  value={input}
                  placeholder={'Ajukan pertanyaan anda ...'}
                  onChange={handleInputChange}
                  className='flex-1 pr-24'
                />
              </TooltipTrigger>
              <TooltipContent>Masukkan pertanyaan Anda di sini</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip open={isNewUser && showTooltip.button}>
              <TooltipTrigger asChild>
                <Button
                  type='submit'
                  className='absolute right-0 top-0 h-full w-20 flex items-center justify-center'
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M9.51002 4.23001L18.07 8.51001C21.91 10.43 21.91 13.57 18.07 15.49L9.51002 19.77C3.75002 22.65 1.40002 20.29 4.28002 14.54L5.15002 12.81C5.37002 12.37 5.37002 11.64 5.15002 11.2L4.28002 9.46001C1.40002 3.71001 3.76002 1.35001 9.51002 4.23001Z'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M5.44 12H10.84'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Kirim pertanyaan Anda</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </div>
  );
}
