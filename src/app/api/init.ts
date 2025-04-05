import { initializeServices } from '@/services/init-service';

if (process.env.NODE_ENV !== 'test') {
  console.log('Initializing background services...');
  initializeServices();
}

export {};
