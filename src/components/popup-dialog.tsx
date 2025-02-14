'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function PopupDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleClose = () => {
    setOpen(false);

    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');

    if (!hasSeenTutorial) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: '.chat-container',
            popover: {
              title: '✨ Selamat Datang di Chatbot JEMPOL!',
              description:
                'Area chat yang elegan untuk komunikasi yang nyaman.',
              side: 'left',
              align: 'start',
            },
          },
          {
            element: '.input-field',
            popover: {
              title: '💭 Mulai Percakapan',
              description: 'Ketikkan pertanyaan atau pesan Anda di sini.',
              side: 'bottom',
              align: 'start',
            },
          },
        ],
        onCloseClick: () => {
          localStorage.setItem('hasSeenTutorial', 'true');
        },
      });

      driverObj.drive();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Chatbot dalam Masa Pengembangan</DialogTitle>
          <DialogDescription>
            Chatbot ini masih dalam masa pengembangan. Beberapa fitur mungkin
            belum berfungsi dengan sempurna. Terima kasih atas pengertiannya 😘
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
