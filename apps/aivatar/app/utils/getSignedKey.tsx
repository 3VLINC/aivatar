import { getFid } from './getFid';
import { getNeynarClient } from '../clients/getNeynarSdk';
import type { Signer } from '@neynar/nodejs-sdk/build/api';
import { generateSignature } from './generateSignature';
export const getSignedKey = async (): Promise<Signer> => {
  const neynar = await getNeynarClient();
  const createSigner = await neynar.createSigner();
  const { deadline, signature } = await generateSignature(
    createSigner.public_key
  );

  if (deadline === 0 || signature === '0x') {
    throw new Error('Failed to generate signature');
  }

  const fid = await getFid();

  return neynar.registerSignedKey({
    appFid: fid,
    deadline,
    signature,
    signerUuid: createSigner.signer_uuid,
  });
};
