import Balancer from 'react-wrap-balancer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formattedText } from '@/lib/utils';

interface ChatLineProps extends Partial<Message> {}

export function ChatLine({ role = 'assistant', content }: ChatLineProps) {
  if (!content) {
    return (
      <div>
        <Card className='mb-2'>
          <CardHeader>
            <CardTitle
              className={
                role !== 'assistant'
                  ? 'text-amber-500 dark:text-amber-200'
                  : 'text-blue-500 dark:text-blue-200'
              }
            >
              {role === 'assistant' ? 'JEMPOL' : 'Anda'}
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm break-words whitespace-pre-wrap overflow-auto'>
            <Balancer>
              <p>
                Alamak token gw habis, kalau mau donasi silahkah di bawah ini cuy :D
              </p>
              <p>https://saweria.co/SideID</p>
            </Balancer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className='mb-2'>
        <CardHeader>
          <CardTitle
            className={
              role !== 'assistant'
                ? 'text-amber-500 dark:text-amber-200'
                : 'text-blue-500 dark:text-blue-200'
            }
          >
            {role === 'assistant' ? 'JEMPOL' : 'Anda'}
          </CardTitle>
        </CardHeader>
        <CardContent className='text-sm break-words whitespace-pre-wrap overflow-auto'>
          <Balancer>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              linkTarget='_blank'
              components={{
                code({ node, inline, className, children, ...props }) {
                  return inline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <span className={className} {...props}>
                      {children}
                    </span>
                  );
                },
                pre({ children }) {
                  return <span>{children}</span>;
                },
                table({ children }) {
                  return (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full border-collapse border border-gray-200'>
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className='border border-gray-200 px-4 py-2 bg-gray-100 text-left'>
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className='border border-gray-200 px-4 py-2'>
                      {children}
                    </td>
                  );
                },
              }}
            >
              {formattedText(content)}
            </ReactMarkdown>
          </Balancer>
        </CardContent>

        
        {/* <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length ? (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown linkTarget="_blank">
                        {formattedText(source)}
                      </ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <></>
            )}
          </CardDescription>
        </CardFooter> */}
      </Card>
    </div>
  );
}
