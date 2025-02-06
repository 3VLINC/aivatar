import { Button } from '@heroui/react';
import type { Signer } from '@neynar/nodejs-sdk/build/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FarcasterUser } from '~/interface';
import { useSetUserData } from '~/providers/Auth';
import { DisplayConnector } from './components/DisplayConnector';

export function GrantAccess() {
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<Signer | null>();
  const setUserData = useSetUserData();

  useEffect(() => {
    if (signer && signer.status === 'pending_approval') {
      let intervalId: NodeJS.Timeout;

      const startPolling = () => {
        intervalId = setInterval(async () => {
          try {
            const response = await axios.get(
              `/api/getSigner?signer_uuid=${signer?.signer_uuid}`
            );
            const user = response.data as FarcasterUser;

            if (user?.status === 'approved' && user?.fid) {
              setUserData({
                fid: user.fid,
                signer_uuid: user.signer_uuid,
              });
              clearInterval(intervalId);
            }
          } catch (error) {
            console.error('Error during polling', error);
          }
        }, 2000);
      };

      const stopPolling = () => {
        clearInterval(intervalId);
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopPolling();
        } else {
          startPolling();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Start the polling when the effect runs.
      startPolling();

      // Cleanup function to remove the event listener and clear interval.
      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
        clearInterval(intervalId);
      };
    }
  }, [signer]);

  const handleConnect = async () => {
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
  };

  return signer && signer.status !== 'approved' ? (
    <DisplayConnector signer={signer} />
  ) : (
    <div>
      <Button onPress={handleConnect} disabled={loading}>
        {loading ? 'Loading...' : 'Connect Farcaster with AIVATAR'}
      </Button>
    </div>
  );
}
