import type { Signer } from '@neynar/nodejs-sdk/build/api';
import { getSignedKey } from '~/utils/getSignedKey';

export async function action(): Promise<Signer> {
  return getSignedKey();
}
