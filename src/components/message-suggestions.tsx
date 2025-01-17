import { Button } from './ui/button';

export function MessageSuggestions({
  suggestions,
  onSuggestionClick,
}: {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-2 mt-4'>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant='outline'
          size='sm'
          onClick={() => onSuggestionClick(suggestion)}
          className='text-xs bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors duration-200'
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
