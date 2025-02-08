import { Expression, getChainByIdentifier, getContracts } from '@aivatar/contracts';
import { CdpWalletProvider, customActionProvider } from '@coinbase/agentkit';
import { Wallet } from '@coinbase/coinbase-sdk';
import z from 'zod';

const schema = z.object({
  tokenId: z.bigint().describe('The token Id to update'),
  expression: z.nativeEnum(Expression).describe('The expression to update'),
});

export const agenticUpdate = customActionProvider<CdpWalletProvider>({
  // wallet types specify which providers can use this action. It can be as generic as WalletProvider or as specific as CdpWalletProvider
  name: 'agentic_update',
  description: 'Perform an update on the aivatar',
  schema,
  invoke: async (walletProvider, args: z.infer<typeof schema>) => {
    const { tokenId, expression } = args;

    const networkId = walletProvider.getNetwork().networkId;
    if (!networkId) {
      throw new Error('Network id not found');
    }
    const signature = await walletProvider.exportWallet();

    const wallet = await Wallet.createWithSeed({
      seed: signature.seed,
      networkId: signature.networkId,
    });

    const { aivatar } = getContracts(getChainByIdentifier(networkId));

    const contractInvocation = await wallet.invokeContract({
      abi: aivatar.abi,
      contractAddress: aivatar.address,
      method: 'agenticUpdate',
      args: [tokenId, expression],
    });

    await contractInvocation.wait({
      timeoutSeconds: 60
    });

    return `The contract call was invoked updating tokenId: ${tokenId} with expression: ${expression}\n tx: ${contractInvocation.getTransactionHash()}`;
  },
});
