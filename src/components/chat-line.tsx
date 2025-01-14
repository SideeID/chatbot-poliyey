import { User, Check, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formattedText } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatLineProps extends Partial<Message> {}

export function ChatLine({ role = 'assistant', content }: ChatLineProps) {
  if (!content) {
    return null;
  }
  const isAssistant = role === 'assistant';
  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full ${
          isAssistant
            ? 'bg-muted'
            : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
        } shadow-lg relative overflow-hidden`}
      >
        {isAssistant ? (
          <Image
            src='/logo-jempol.png'
            alt='Assistant Logo'
            width={40}
            height={40}
          />
        ) : (
          <User className='w-6 h-6' />
        )}
      </motion.div>
      <div className='flex-1 space-y-2'>
        <Card
          className={`p-4 max-w-[85%] ${
            isAssistant
              ? 'ml-0 mr-auto bg-white dark:bg-gray-900'
              : 'ml-auto mr-0 bg-amber-50 dark:bg-amber-900/20'
          } backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-200`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            linkTarget='_blank'
            className='prose dark:prose-invert max-w-none text-sm'
            components={{
              code({ node, inline, className, children, ...props }) {
                return inline ? (
                  <code
                    className='px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono'
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <pre className='p-4 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-x-auto'>
                    <code className='text-sm font-mono' {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              table({ children }) {
                return (
                  <div className='overflow-x-auto rounded-lg border dark:border-gray-700'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className='px-4 py-2 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return <td className='px-4 py-2 text-sm'>{children}</td>;
              },
            }}
          >
            {formattedText(content)}
          </ReactMarkdown>
        </Card>
        {!isAssistant && (
          <div className='flex items-center justify-end gap-1 text-xs text-muted-foreground pr-2'>
            <span>Terkirim</span>
            <CheckCheck className='w-4 h-4' />
          </div>
        )}
      </div>
    </div>
  );
}
