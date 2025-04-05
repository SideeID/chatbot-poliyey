let isInitialized = false;

export async function ensureInitialization(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (typeof window === 'undefined') {
    try {
      const { initializeServices } = await import('@/services/init-service');
      initializeServices();
      isInitialized = true;
      console.log('Server initialization completed');
    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  }
}

ensureInitialization().catch((err) => {
  console.error('Initialization error:', err);
});
