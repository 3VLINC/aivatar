import { createHmac } from 'crypto';

export async function verifyNeynarWebhook<T>(req: Request, secret: string): Promise<T> {
  const body = await req.text();

  const sig = req.headers.get('X-Neynar-Signature');
  if (!sig) {
    throw new Error('Neynar signature missing from request headers');
  }

  const hmac = createHmac('sha512', secret);

  hmac.update(body);

  const generatedSignature = hmac.digest('hex');

  const isValid = generatedSignature === sig;
  if (!isValid) {
    throw new Error('Invalid webhook signature');
  }

  return JSON.parse(body);
}
