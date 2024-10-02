import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Chat } from "@/components/chat";
import PopupDialog from "@/components/popup-dialog";
import Image from 'next/image';

export default function Home() {
  return (
    <main className='relative md:container flex min-h-screen flex-col'>
      <PopupDialog />
      <div className='p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full bg-background/95 backdrop-blur'>
        <Image
          src='/polije.svg'
          alt='JEMPOL'
          width={125}
          height={125}
          loading='lazy'
        />
        <DarkModeToggle />
      </div>
      <div className='flex flex-1 py-4'>
        <div className='w-full'>
          <Chat />
        </div>
      </div>
      <footer className='py-4 text-center text-sm bg-background copyright'>
        <a
          href='https://github.com/SideeID'
          target='_blank'
          className='hover:underline'
        >
          &copy; 2024 Side ID. All rights reserved.
        </a>
      </footer>
    </main>
  );
}
