import { getChainByIdentifier, getContracts } from '@aivatar/contracts';
import type { Hex } from 'viem';
import { getWallet } from '~/clients/agents/utils/getWallet';
import { db, tokens as tokensDb } from '@aivatar/drizzle';
import { sql } from 'drizzle-orm';
export async function getTokens() {
  const { wallet, walletProvider } = await getWallet();

  const { aivatar } = getContracts(getChainByIdentifier(wallet.getNetworkId()));

  let cntu = true;
  let tokenId = 0n;
  const tokenMap: Array<{ tokenId: bigint; address: Hex; expression: number }> =
    [];

  while (cntu === true) {
    const address = (await walletProvider
      .readContract({
        abi: aivatar.abi,
        address: aivatar.address,
        functionName: 'ownerOf',
        args: [tokenId],
      })
      .catch(() => false)) as Hex | false;

    if (address === false) {
      cntu = false;
      break;
    }

    const expression = (await walletProvider.readContract({
      abi: aivatar.abi,
      address: aivatar.address,
      functionName: 'loadExpression',
      args: [tokenId],
    })) as number;

    tokenMap.push({
      tokenId,
      address,
      expression,
    });

    tokenId++;
  }

  // Update token index
  console.log('updating database with tokens');
  await db
    .insert(tokensDb)
    .values(tokenMap)
    .onConflictDoUpdate({
      target: tokensDb.tokenId,
      set: {
        address: sql.raw(`excluded.${tokensDb.address.name}`),
        expression: sql.raw(`excluded.${tokensDb.expression.name}`),
      },
    });

  return tokenMap;
}
