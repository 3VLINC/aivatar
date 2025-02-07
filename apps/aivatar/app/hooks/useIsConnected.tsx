import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export const useIsConnected = (fid: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setIsLoading] = useState(true);

  const checkIsConnected = useCallback(async () => {
    if (!fid) {
      return;
    }
    setIsLoading(true);
    return axios
      .post('/api/isConnected', {
        fid,
      })
      .then((res) => {
        setIsConnected(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fid]);

  useEffect(() => {
    checkIsConnected();
  }, [checkIsConnected]);

  return { data: isConnected, loading, refetch: checkIsConnected };
};
