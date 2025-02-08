import type { Route } from '../../+types/root';
import { verifyNeynarWebhook } from '~/utils/verifyNeynarWebhook';
import { type WebhookCastCreated } from '@neynar/nodejs-sdk';
import { casts, db, webhooks, webhookSecrets } from '@aivatar/drizzle';
import { eq, and } from 'drizzle-orm';
import { invokeSentimentAgent } from '~/clients/agents/sentiment/invokeSentimentAgent';
import { getTokens } from '~/clients/agents/utils/getTokens';
import superjson from 'superjson';

export const action = async ({ request }: Route.LoaderArgs) => {
  console.log('Webhook received: castCreated');
  const requestClone = request.clone();

  const unverifiedData = (await request.json()) as WebhookCastCreated;

  if (unverifiedData.type !== 'cast.created') {
    throw new Error('Incorrect webhook type');
  }

  // TODO: improve to allow for expired secrets

  const results = await db
    .select({
      webhookId: webhooks.id,
      secret: webhookSecrets.value,
    })
    .from(webhooks)
    .leftJoin(webhookSecrets, eq(webhooks.id, webhookSecrets.webhookId))
    .where(and(eq(webhooks.type, 'cast.created')))
    .limit(1);

  const firstResult = results[0];

  if (!firstResult || !firstResult.secret) {
    throw new Error('Webhook not found');
  }

  console.log('verifying webhook source');
  const verifiedData = await verifyNeynarWebhook<WebhookCastCreated>(
    requestClone,
    firstResult.secret
  );
  console.log('webhook data verified');

  await db
    .insert(casts)
    .values({
      hash: verifiedData.data.hash,
      fid: BigInt(verifiedData.data.author.fid),
      text: verifiedData.data.text,
      created_at: new Date(verifiedData.created_at),
    })
    .onConflictDoNothing();

  const tokens = await getTokens();

  const ethAddresses =
    verifiedData.data.author.verified_addresses.eth_addresses.map((address) =>
      address.toLowerCase()
    );

  const firstOwnedToken = tokens.find((token) =>
    ethAddresses.includes(token.address.toLowerCase())
  );

  console.log(
    superjson.stringify(
      verifiedData.data.author.verified_addresses.eth_addresses
    )
  );
  console.log('firstOwnedToken', firstOwnedToken);

  if (firstOwnedToken) {
    console.log('User has aivatar. Invoking sentiment agent');
    await invokeSentimentAgent(
      verifiedData.data.author.fid.toString(),
      firstOwnedToken.tokenId,
      verifiedData.data.text,
      verifiedData.data.hash
    );
    return;
  }
};

export default function Home() {
  return <div>OK</div>;
}
