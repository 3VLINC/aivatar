import { db, users, webhooks, webhookSecrets } from '@aivatar/drizzle';
import { getNeynarClient } from '~/clients/getNeynarSdk';
import { eq, and } from 'drizzle-orm';
import type { Route } from './+types/storeSigner';
import type { Signer } from '@neynar/nodejs-sdk/build/api';

export async function action({ request }: Route.ActionArgs): Promise<Signer> {
  const json = await request.json();

  if (!json.signerUuid) {
    throw new Error('signerUuid is required');
  }

  const { signerUuid } = json;

  const url = new URL(request.url);

  const webhookUrl = new URL(`https://${url.host}/webhooks/castCreated`);

  const neynarClient = await getNeynarClient();

  const signer = await neynarClient.lookupSigner({ signerUuid });

  if (!signer.fid) {
    throw new Error(`Could not find signer with signer_uuid: ${signerUuid}`);
  }

  const castCreateWebhook = await db
    .select()
    .from(webhooks)
    .where(and(eq(webhooks.type, 'cast.created')))
    .execute();

  const hasCastCreateWebhook = castCreateWebhook.length > 0;

  // neynarClient.updateWebhook({
  //   name: `CastCreated-${signer.fid}`,
  //   url: webhookUrl.toString(),
  //   subscription: {
  //     'cast.created': {
  //       author_fids: [signer.fid],
  //     },
  //   },
  // })

  if (!hasCastCreateWebhook) {
    const publishWebhookResult = await neynarClient.publishWebhook({
      name: `CastCreated`,
      url: webhookUrl.toString(),
      subscription: {
        'cast.created': {
          author_fids: [signer.fid],
        },
      },
    });

    if (!publishWebhookResult) {
      throw new Error(`Failed to publish cast.created webhook\n`);
    } else if (!publishWebhookResult.webhook?.webhook_id) {
      throw new Error(
        `Failed to publish cast.created webhook  webhook_id not found`
      );
    }

    const webhookId = publishWebhookResult.webhook?.webhook_id;
    if (webhookId) {
      await db.insert(webhooks).values({
        id: webhookId,
        type: 'cast.created',
      });

      await db.insert(webhookSecrets).values(
        publishWebhookResult.webhook.secrets.map(
          ({ uid, created_at, deleted_at, expires_at, updated_at, value }) => ({
            uid,
            webhookId,
            created_at,
            deleted_at,
            expires_at,
            updated_at,
            value,
          })
        )
      );
    }
  }

  await db
    .insert(users)
    .values({
      fid: BigInt(signer.fid),
      signerUuid: signer.signer_uuid,
    })
    .onConflictDoNothing()
    .execute();

  return {
    signer_uuid: signer.signer_uuid,
    public_key: signer.public_key,
    status: signer.status,
    signer_approval_url: signer.signer_approval_url,
    fid: signer.fid,
  };
}
