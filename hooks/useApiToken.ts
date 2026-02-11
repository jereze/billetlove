import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

export function useApiToken() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const t = await storage.config.getApiToken();
    setToken(t);
    setIsLoading(false);
  };

  const updateToken = async (newToken: string) => {
    await storage.config.setApiToken(newToken);
    setToken(newToken);
  };

  return { token, isLoading, updateToken };
}
