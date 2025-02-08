import { useAccount } from 'wagmi';
import { Button } from '@heroui/react';
import axios from 'axios';
import { useCallback, useState } from 'react';
import type { MintResponse } from '~/routes/api/mint';

export function SponsoredMint({ onSuccess }: { onSuccess: () => void }) {
  const { address } = useAccount();

  const [result, setResult] = useState<boolean | null>(null);

  const handleMint = useCallback(() => {
    return axios
      .post<MintResponse>('/api/mint', { address })
      .then((response) => {
        setResult(response.data.success);
        if (response.data.success) {
          onSuccess();
        }
      });
  }, [address]);

  return (
    <div className="flex flex-col gap-8">
      {!result ? (
        <>
          <h1>To activate your AIVATAR, mint him first</h1>
          <Button
            className="uppercase p-4 bg-purple-500 rounded text-lg"
            variant="solid"
            onPress={handleMint}
          >
            Mint
          </Button>
        </>
      ) : (
        <h1>Congrats! You've minted your AIVATAR.</h1>
      )}
    </div>
  );
}
