import { getChainByIdentifier, getContracts } from '@aivatar/contracts';
import type { Hex } from 'viem';
import { getWallet } from '~/clients/agents/utils/getWallet';
import type { Route } from './+types/mint';

export type MintResponse = {
  success: boolean;
};
export async function action({
  request,
}: Route.ActionArgs): Promise<MintResponse> {
  const json = await request.json();

  if (!json.address) {
    throw new Error('address is required');
  }

  const address = json.address as Hex;

  const { wallet } = await getWallet();
  const { aivatar } = getContracts(getChainByIdentifier(wallet.getNetworkId()));

  // TODO: only allow free minting one per wallet.
  return wallet
    .invokeContract({
      abi: aivatar.abi,
      contractAddress: aivatar.address,
      method: 'mint',
      args: {
        to: address,
        data: '0x',
      },
    })
    .then((invocation) =>
      invocation.wait({
        intervalSeconds: 5,
        timeoutSeconds: 60,
      })
    )
    .then(() => ({ success: true }))
    .catch(() => ({ success: false }));
}
