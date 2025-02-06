import { ViemLocalEip712Signer } from '@farcaster/hub-nodejs';
import { bytesToHex, hexToBytes } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import type { SignedKeyResult } from '~/interface';
import { getFid } from './getFid';

export const generateSignature = async function (
  public_key: string
): Promise<SignedKeyResult> {
  if (typeof process.env.FARCASTER_DEVELOPER_MNEMONIC === 'undefined') {
    throw new Error('FARCASTER_DEVELOPER_MNEMONIC is not defined');
  }

  const FARCASTER_DEVELOPER_MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC;
  const FID = await getFid();

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);
  const appAccountKey = new ViemLocalEip712Signer(account as any);

  // Generates an expiration date for the signature (24 hours from now).
  const deadline = Math.floor(Date.now() / 1000) + 86400;

  const uintAddress = hexToBytes(public_key as `0x${string}`);

  const signature = await appAccountKey.signKeyRequest({
    requestFid: BigInt(FID),
    key: uintAddress,
    deadline: BigInt(deadline),
  });

  if (signature.isErr()) {
    return {
      deadline,
      signature: '0x',
    };
  }

  const sigHex = bytesToHex(signature.value);

  return { deadline, signature: sigHex };
};
