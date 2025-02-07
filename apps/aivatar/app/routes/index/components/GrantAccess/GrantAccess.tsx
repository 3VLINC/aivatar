import { Button } from '@heroui/react';
import { DisplayConnector } from './components/DisplayConnector';
import { useGetSignerPoller } from './hooks/useGetSignerPoller';
import { useGenerateSigner } from './hooks/useGenerateSigner';
import { useCallback } from 'react';
import axios from 'axios';
import type { Signer } from '@neynar/nodejs-sdk/build/api';

export type GrantAccessProps = {
  onStored: (user: Signer) => void;
};
export function GrantAccess({ onStored }: GrantAccessProps) {
  const { signer, loading, generate, reset } = useGenerateSigner();

  const onApproved = useCallback(
    (result: Signer) => {
      axios
        .post('/api/storeSigner', {
          signerUuid: result.signer_uuid,
        })
        .then(() => {
          onStored(result);
        });
    },
    [signer, onStored]
  );

  useGetSignerPoller({ signer, onApproved });

  return signer && signer.status !== 'approved' ? (
    <DisplayConnector signer={signer} onClose={reset} />
  ) : (
    <div>
      <Button onPress={generate} disabled={loading}>
        {loading ? 'Loading...' : 'Connect Farcaster with AIVATAR'}
      </Button>
    </div>
  );
}
