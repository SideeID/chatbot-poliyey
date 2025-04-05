import '@/app/globals.css';
import { initializeServices } from '@/services/init-service';

if (typeof window === 'undefined') {
  try {
    console.log('Initializing background services...');
    initializeServices();
  } catch (error) {
    console.error('Failed to initialize background services:', error);
  }
}

export {};
