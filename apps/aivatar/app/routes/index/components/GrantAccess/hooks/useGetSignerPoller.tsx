import type { Signer } from '@neynar/nodejs-sdk/build/api';
import axios from 'axios';
import { useEffect } from 'react';

export type UseGetSignerPollerProps = {
  signer: Signer | null;
  onApproved: (user: Signer) => void;
};

export const useGetSignerPoller = ({
  signer,
  onApproved,
}: UseGetSignerPollerProps) => {
  useEffect(() => {
    if (signer && signer.status === 'pending_approval') {
      let intervalId: NodeJS.Timeout;

      const startPolling = () => {
        intervalId = setInterval(async () => {
          try {
            const response = await axios.post(`/api/storeSigner`, {
              signerUuid: signer.signer_uuid,
            });
            const user = response.data as Signer;

            if (user?.status === 'approved' && user?.fid) {
              onApproved(user);
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
};
