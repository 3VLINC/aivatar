import { CdpWalletProvider } from '@coinbase/agentkit';
import { getConfig } from './getConfig';
import { writeFileSync } from 'fs';
import { Wallet } from '@coinbase/coinbase-sdk';

export const getWallet = async () => {
  const config = getConfig();

  const { cdpWalletDataFile } = config;

  // Configure CDP Wallet Provider

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);

  const exportedWallet = await walletProvider.exportWallet();

  const wallet = await Wallet.createWithSeed({
    seed: exportedWallet.seed,
    networkId: exportedWallet.networkId,
  });

  writeFileSync(cdpWalletDataFile, JSON.stringify(exportedWallet));

  return { walletProvider, wallet };
};
