import React from 'react';
import { User, CheckCheck, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formattedText } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ChatLineProps extends Partial<Message> {}

const CustomAlert = ({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'success' | 'tip';
  children: React.ReactNode;
}) => {
  const alertStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    tip: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
  };

  const alertIcons = {
    info: <Info className='w-5 h-5 mr-2 text-blue-500' />,
    warning: <AlertTriangle className='w-5 h-5 mr-2 text-yellow-500' />,
    success: <CheckCheck className='w-5 h-5 mr-2 text-green-500' />,
    tip: <Lightbulb className='w-5 h-5 mr-2 text-purple-500' />,
  };

  return (
    <div
      className={`flex items-start p-3 rounded-lg border mb-3 ${alertStyles[type]}`}
    >
      {alertIcons[type]}
      <div className='flex-1'>{children}</div>
    </div>
  );
};

export function ChatLine({ role = 'assistant', content }: ChatLineProps) {
  if (!content) {
    return null;
  }
  const isAssistant = role === 'assistant';

  return (
    <div
      className={`flex gap-2 md:gap-3 ${
        isAssistant ? '' : 'flex-row-reverse'
      } mb-4`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`flex h-8 w-8 md:h-10 md:w-10 shrink-0 select-none items-center justify-center rounded-full ${
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
            className='rounded-full'
          />
        ) : (
          <User className='w-6 h-6' />
        )}
      </motion.div>
      <div className='flex-1 space-y-2'>
        <Card
          className={`p-3 md:p-4 max-w-[90%] ${
            isAssistant
              ? 'ml-0 mr-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              : 'ml-auto mr-0 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
          } backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-200 border`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            linkTarget='_blank'
            className='prose dark:prose-invert max-w-none text-sm'
            components={{
              code({ node, inline, className, children, ...props }) {
                if (className === 'language-think') {
                  return (
                    <div className='my-3'>
                      <Accordion type='single' collapsible>
                        <AccordionItem value='think' className='border-none'>
                          <AccordionTrigger className='hover:no-underline py-1 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>
                            <span className='text-sm font-medium flex items-center'>
                              🔍 Proses Penalaran
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className='px-3 pt-2 pb-1'>
                            <div className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line'>
                              {String(children).replace(/\n$/, '')}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  );
                }

                if (inline) {
                  return (
                    <code
                      className='px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-mono'
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <pre className='p-4 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-x-auto mb-4'>
                    <code className='text-sm font-mono' {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              blockquote({ node, ...props }) {
                return (
                  <blockquote
                    className='border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400'
                    {...props}
                  />
                );
              },
              table({ children }) {
                return (
                  <div className='overflow-x-auto rounded-lg border dark:border-gray-700 mb-4'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className='px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className='px-4 py-2 text-sm border-b dark:border-gray-700'>
                    {children}
                  </td>
                );
              },
              // Custom alert parsing
              p(props) {
                const { children } = props;
                // Ensure we're dealing with children as an array
                const childrenArray = React.Children.toArray(children);

                // Check if the first child is a string and starts with the expected patterns
                if (
                  childrenArray.length > 0 &&
                  typeof childrenArray[0] === 'string'
                ) {
                  const firstChild = childrenArray[0] as string;

                  if (firstChild.startsWith('!!! info')) {
                    const content = firstChild.replace('!!! info', '');
                    const restChildren = childrenArray.slice(1);
                    return (
                      <CustomAlert type='info'>
                        {content}
                        {restChildren}
                      </CustomAlert>
                    );
                  }

                  if (firstChild.startsWith('!!! warning')) {
                    const content = firstChild.replace('!!! warning', '');
                    const restChildren = childrenArray.slice(1);
                    return (
                      <CustomAlert type='warning'>
                        {content}
                        {restChildren}
                      </CustomAlert>
                    );
                  }

                  if (firstChild.startsWith('!!! success')) {
                    const content = firstChild.replace('!!! success', '');
                    const restChildren = childrenArray.slice(1);
                    return (
                      <CustomAlert type='success'>
                        {content}
                        {restChildren}
                      </CustomAlert>
                    );
                  }

                  if (firstChild.startsWith('!!! tip')) {
                    const content = firstChild.replace('!!! tip', '');
                    const restChildren = childrenArray.slice(1);
                    return (
                      <CustomAlert type='tip'>
                        {content}
                        {restChildren}
                      </CustomAlert>
                    );
                  }
                }

                return <p {...props}>{children}</p>;
              },
              ul({ children }) {
                return <ul className='list-disc pl-6 mb-4'>{children}</ul>;
              },
              ol({ children }) {
                return <ol className='list-decimal pl-6 mb-4'>{children}</ol>;
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
