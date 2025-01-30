import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { Chat } from '@/components/chat';
import PopupDialog from '@/components/popup-dialog';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='relative md:container flex min-h-screen flex-col'>
      <PopupDialog />
      <div className='p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full bg-background/95 backdrop-blur'>
        <a
          href='https://pintu.polije.ac.id/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            src='/polije.svg'
            alt='JEMPOL'
            width={125}
            height={125}
            loading='lazy'
          />
        </a>
        <DarkModeToggle />
      </div>
      <div className='flex flex-1 py-4'>
        <div className='w-full max-w-4xl mx-auto'>
          <Chat />
        </div>
      </div>
      <footer className='py-4 text-center text-sm bg-background copyright'>
        <a
          href='https://www.side.my.id'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          &copy; 2024 Side ID. All rights reserved.
        </a>
      </footer>
    </main>
  );
}
