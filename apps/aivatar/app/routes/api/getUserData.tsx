import { db, users } from '@aivatar/drizzle';
import type { ActionFunctionArgs } from 'react-router';
import { eq } from 'drizzle-orm';
import { createAppClient, viemConnector } from '@farcaster/auth-client';

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const data = await request.json();

  const nonce = data.nonce;
  const message = data.message;
  const signature = data.signature;

  const appClient = createAppClient({
    relay: 'https://relay.farcaster.xyz',
    ethereum: viemConnector(),
  });

  const { fid, error, isError } = await appClient.verifySignInMessage({
    nonce,
    domain: url.hostname,
    message,
    signature,
  });

  if (isError) {
    throw error;
  }

  return db
    .select({
      signer_uuid: users.signerUuid,
      fid: users.fid,
    })
    .from(users)
    .where(eq(users.fid, BigInt(fid)))
    .limit(1)
    .then((users) => users[0])
    .then((user) => {
      if (!user) {
        return null;
      } else {
        return {
          fid: user.fid.toString(),
          signer_uuid: user.signer_uuid,
        };
      }
    });
}
