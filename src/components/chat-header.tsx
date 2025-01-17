import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';

export function ChatHeader({
  isExpanded,
  toggleExpand,
}: {
  isExpanded: boolean;
  toggleExpand: () => void;
}) {
  return (
    <motion.div
      layout
      className='p-4 border-b backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-t-2xl'
    >
      <div className='flex items-center gap-3'>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-l from-blue-50 to-blue-100 text-white shadow-inner'
        >
          <Image
            src='/logo-jempol.png'
            alt='Assistant Logo'
            width={40}
            height={40}
          />
        </motion.div>
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
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <Minimize2 className='w-4 h-4' />
            ) : (
              <Maximize2 className='w-4 h-4' />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
