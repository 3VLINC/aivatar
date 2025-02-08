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
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>

      <div>
        <h2 className="font-2xl font-bold">Wallet</h2>

        <p>Address: {address}</p>

        {!result ? (
          <Button onPress={handleMint} className="w-full mt-2">
            Mint
          </Button>
        ) : (
          <p>Congrats! You've minted your aivatar</p>
        )}
      </div>
    </div>
  );
}
