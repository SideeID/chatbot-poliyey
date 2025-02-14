import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Github, Instagram, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t'>
      <div className='container flex flex-col gap-4 py-6 md:h-auto md:flex-row md:items-center md:justify-between md:py-4'>
        <div className='flex flex-1 items-center justify-center gap-4 md:justify-start'>
          <Link
            href='/about'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            Tentang JEMPOL
          </Link>
          <Separator orientation='vertical' className='h-4 w-[2px]' />
          <a
            href='https://www.side.my.id'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            &copy; {new Date().getFullYear()} Side ID
          </a>
        </div>
        <div className='flex flex-col items-center gap-2 md:items-end'>
          <div className='flex items-center justify-center gap-4'>
            <a
              href='https://github.com/SideeID'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground'
            >
              <Github className='h-5 w-5' />
              <span className='sr-only'>GitHub</span>
            </a>
            <a
              href='https://www.instagram.com/side__id/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground'
            >
              <Instagram className='h-5 w-5' />
              <span className='sr-only'>Instagram</span>
            </a>
          </div>
          <div className='flex items-center text-sm text-muted-foreground'>
            Made with{' '}
            <Heart className='mx-1 h-4 w-4 text-red-500' fill='currentColor' />{' '}
            by Side ID
          </div>
        </div>
      </div>
    </footer>
  );
}
