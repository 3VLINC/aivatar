import { getChainByIdentifier, getContracts } from '@aivatar/contracts';
import { getWallet } from '../utils/getWallet';
import { db, users } from '@aivatar/drizzle';
import { getNeynarClient } from '~/clients/getNeynarSdk';
import { eq } from 'drizzle-orm';
import { getSentiment } from '../utils/getSentiment';

export async function invokeSentimentAgent(
  fid: string,
  tokenId: bigint,
  message: string,
  hash: string
) {
  try {
    const { wallet } = await getWallet();

    const expression = await getSentiment(message);

    const { aivatar } = getContracts(
      getChainByIdentifier(wallet.getNetworkId())
    );

    const contractInvocation = await wallet.invokeContract({
      abi: aivatar.abi,
      contractAddress: aivatar.address,
      method: 'agenticUpdate',
      args: { tokenId: tokenId.toString(), expression: expression.toString() },
    });

    console.log('tx hash', contractInvocation.getTransactionHash());
    await contractInvocation
      .wait({
        intervalSeconds: 5,
        timeoutSeconds: 60,
      })
      .catch((err) => console.error(err));

    const result = await db
      .select()
      .from(users)
      .where(eq(users.fid, BigInt(fid)))
      .limit(1)
      .then((result) => result[0]);

    if (!result || !result.signerUuid) {
      throw new Error(`couldn't find user: ${fid}`);
    }

    const neynar = await getNeynarClient();

    const pfpUrl = `https://aivatar.3vl.ca/erc721/AIVATAR/image/${tokenId}.png?hash=${hash}`;

    console.log(pfpUrl);

    await neynar
      .updateUser({
        signerUuid: result.signerUuid,
        pfpUrl,
      })
      .then((result) => {
        console.log('success', result.message);
      })
      .catch((err) => {
        console.error('error', err.message);
      });

    return `The contract call was invoked updating tokenId: ${tokenId} with expression: ${expression}\n tx: ${contractInvocation.getTransactionHash()}`;
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
