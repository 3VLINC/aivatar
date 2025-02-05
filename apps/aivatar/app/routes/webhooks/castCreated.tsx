import type { Route } from "../../+types/root";
import { verifyNeynarWebhook } from "~/utils/verifyNeynarWebhook";
import { type WebhookCastCreated } from '@neynar/nodejs-sdk';
import { casts, db, webhooks, webhookSecrets } from "@aivatar/drizzle";
import { eq, and } from "drizzle-orm";
import { invokeAgent } from "~/utils/invokeAgent";

export const action = async ({ request }: Route.LoaderArgs) => {
    
    console.log('Webhook received: castCreated');
    const requestClone = request.clone();
    
    const unverifiedData = await request.json() as WebhookCastCreated;
    

    if (unverifiedData.type !== 'cast.created') {
        throw new Error('Incorrect webhook type');
    }
    
    // TODO: improve to allow for expired secrets
    console.log(db.select({
        webhookId: webhooks.id,
        secret: webhookSecrets.value,
    }).from(webhooks).leftJoin(
        webhookSecrets,
        eq(webhooks.id, webhookSecrets.uid)
    ).where(and(
        eq(webhooks.type, 'cast.created'),
        eq(webhooks.fid, BigInt(unverifiedData.data.author.fid))
    )).limit(1).toSQL());

    const results = await db.select({
        webhookId: webhooks.id,
        secret: webhookSecrets.value,
    }).from(webhooks).leftJoin(
        webhookSecrets,
        eq(webhooks.id, webhookSecrets.uid)
    ).where(and(
        eq(webhooks.type, 'cast.created'),
        eq(webhooks.fid, BigInt(unverifiedData.data.author.fid))
    )).limit(1);

    console.log('performed secret lookup', results);

    const firstResult = results[0];

    if (!firstResult || !firstResult.secret) {
        throw new Error('Webhook not found');
    }

    console.log('verifying webhook source');
    const verifiedData = await verifyNeynarWebhook<WebhookCastCreated>(requestClone, firstResult.secret);
    console.log('webhook data verified');

    await db.insert(casts).values({
        hash: verifiedData.data.hash,
        fid: BigInt(verifiedData.data.author.fid),
        text: verifiedData.data.text,
        created_at: new Date(verifiedData.created_at)
    })
    
    await console.log('Cast stored', verifiedData.data.hash);

    const sentiment = await invokeAgent(verifiedData.data.text);

    console.log('Sentiment:', sentiment);
    
}

export default function Home() {
    return <div>OK</div>
}