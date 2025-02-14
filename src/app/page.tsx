import Link from 'next/link';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { Chat } from '@/components/chat';
import PopupDialog from '@/components/popup-dialog';
import Image from 'next/image';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className='relative flex min-h-screen flex-col'>
      <PopupDialog />
      <div className='sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60'>
        <div className='container px-4 flex h-14 items-center justify-between'>
          <Link
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
              className='max-w-[100px] md:max-w-none'
            />
          </Link>
          <DarkModeToggle />
        </div>
      </div>
      <div className='flex flex-1 py-2 md:py-4'>
        <div className='w-full px-1 md:px-0 md:container md:max-w-4xl'>
          <Chat />
        </div>
      </div>
      <Footer />
    </main>
  );
}
