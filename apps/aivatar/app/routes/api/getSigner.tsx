import { db, users, webhooks, webhookSecrets } from '@aivatar/drizzle';
import type { LoaderFunctionArgs } from 'react-router';
import { getNeynarClient } from '~/clients/getNeynarSdk';
import { eq, and } from 'drizzle-orm';

export async function loader({ request }: LoaderFunctionArgs) {

  const url = new URL(request.url);
  const signerUuid = url.searchParams.get('signer_uuid');

  const webhookUrl = new URL(`https://${url.host}/webhooks/cast.created`);

  if (!signerUuid) {
    return { error: 'signer_uuid is required' };
  }

  const neynarClient = await getNeynarClient();

  const signer = await neynarClient.lookupSigner({ signerUuid });

  if (!signer.fid) {
    throw new Error(`Could not find signer with signer_uuid: ${signerUuid}`);
  }

  const castCreateWebhook = await db
    .select()
    .from(webhooks)
    .where(
      and(
        eq(webhooks.fid, BigInt(signer.fid)),
        eq(webhooks.type, 'cast.created')
      )
    )
    .execute();

  const hasCastCreateWebhook = castCreateWebhook.length > 0;

  if (!hasCastCreateWebhook) {
    const publishWebhookResult = await neynarClient.publishWebhook({
      name: `CastCreated-${signer.fid}`,
      url: webhookUrl.toString(),
      subscription: {
        'cast.created': {
          author_fids: [signer.fid],
        },
      },
    });
    if (!publishWebhookResult) {
      throw new Error(
        `Failed to publish cast.created webhook for signer: ${signerUuid}\n`
      );
    } else if (!publishWebhookResult.webhook?.webhook_id) {
      throw new Error(
        `Failed to publish cast.created webhook for signer: ${signerUuid}\n reason: webhook_id not found`
      );
    }
    console.log(publishWebhookResult);

    const webhookId = publishWebhookResult.webhook?.webhook_id;
    if (webhookId) {

      await db.insert(webhooks).values({
        id: webhookId,
        fid: BigInt(signer.fid),
        type: 'cast.created',
      });
      
      await db.insert(webhookSecrets).values(publishWebhookResult.webhook.secrets.map(
        ({ uid, created_at, deleted_at, expires_at, updated_at, value}) => ({
          uid,
          webhookId,
          created_at,
          deleted_at,
          expires_at,
          updated_at,
          value
        })
      ))
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

  return signer;
}
