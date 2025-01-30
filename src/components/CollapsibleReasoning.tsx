// import React, { useState } from 'react';
// import { ChevronDown, ChevronRight } from 'lucide-react';

// const CollapsibleReasoning = ({ content }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className='my-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50'>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className='w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors'
//       >
//         {isOpen ? (
//           <ChevronDown className='w-4 h-4' />
//         ) : (
//           <ChevronRight className='w-4 h-4' />
//         )}
//         <span className='font-medium'>
//           {isOpen ? 'Hide Reasoning' : 'Show Reasoning'}
//         </span>
//       </button>

//       {isOpen && (
//         <div className='px-4 py-3 text-sm'>
//           <blockquote className='italic text-gray-600 dark:text-gray-400 border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-2'>
//             {content}
//           </blockquote>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollapsibleReasoning;
