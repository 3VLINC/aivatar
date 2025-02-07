import type { Signer } from '@neynar/nodejs-sdk/build/api';
import axios from 'axios';
import { useCallback, useState } from 'react';

export const useGenerateSigner = () => {
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const reset = useCallback(() => setSigner(null), []);
  const generate = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/generateSigner');
      if (response.status === 200) {
        const data: Signer = response.data;
        setSigner(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('API Call failed', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { signer, generate, loading, reset };
};
