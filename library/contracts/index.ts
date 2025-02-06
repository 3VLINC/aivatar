import { baseSepolia, foundry } from 'viem/chains';
import Data_DeployAivatar_84532 from './broadcast/0_InitialDeploy.s.sol/84532/c0406226-latest.json';
import { aIvatarAbi as aivatarAbi, patchworkProtocolAbi } from './wagmi';
import { type Broadcast, type Transaction, type Receipt } from './interface';
import { type Hex } from 'viem';
import AIvatarSchema from './src/patchwork/AIvatar-schema.json';

export enum Expression {
  Joy = 1,
  Gratitude,
  Love,
  Pride,
  Hope,
  Relief,
  Amusement,
  Inspiration,
  Awe,
  Anger,
  Sadness,
  Fear,
  Jealousy,
  Frustration,
  Loneliness,
  Guilt,
  Disgust,
  Surprise,
  Nostalgia,
}

export type PatchworkProtocolAbi = typeof patchworkProtocolAbi;

export type SupportedChains = typeof baseSepolia | typeof foundry;

export const getChainById = (id: string) => {
  switch (id) {
    case 'base-sepolia':
      return baseSepolia;
    case 'foundry':
      return foundry;
    default:
      throw new Error(`Chain with id ${id} not found`);
  }
};
export const findDeployTx = (
  broadcast: Broadcast,
  contractName: string
): Transaction & { contractAddress: `0x${string}` } => {
  const result = broadcast.transactions.find(
    (a: Transaction) =>
      a.transactionType === 'CREATE' && a.contractName === contractName
  );

  if (!result) {
    throw new Error(`Deployment transaction not found for ${contractName}`);
  }

  return {
    ...result,
    contractAddress: result.contractAddress as `0x${string}`,
  };
};

export const findDeployReceipt = (
  broadcast: Broadcast,
  transactionHash: string
) => {
  const result = broadcast.receipts.find(
    (a: Receipt) => a.transactionHash === transactionHash
  );

  if (!result) {
    throw new Error(`Deployment receipt not found for ${transactionHash}`);
  }

  return result;
};

const getDeployInfo = (broadcast: Broadcast, contractName: string) => {
  const tx = findDeployTx(broadcast, contractName);
  const rcp = findDeployReceipt(broadcast, tx.hash);

  return {
    address: tx.contractAddress,
    startBlock: rcp.blockNumber,
  };
};
const schemas = {
  aivatar: AIvatarSchema,
};

const deployments = {
  [foundry.id]: {
    aivatar: {
      abi: aivatarAbi,
      ...getDeployInfo(Data_DeployAivatar_84532, 'AIvatar'),
    },
    patchworkProtocol: {
      abi: patchworkProtocolAbi,
      address: '0x5fCa9f36772CE35bFbD3Cc75E854F0bEBDDD1ed4' as Hex,
    },
  },
  [baseSepolia.id]: {
    aivatar: {
      abi: aivatarAbi,
      ...getDeployInfo(Data_DeployAivatar_84532, 'AIvatar'),
    },
    patchworkProtocol: {
      abi: patchworkProtocolAbi,
      address: '0x5fCa9f36772CE35bFbD3Cc75E854F0bEBDDD1ed4' as Hex,
    },
    // },
    // [base.id]: {
    //   patchworkProtocol: {
    //     abi: patchworkProtocolAbi,
    //     address: '0x00000000001616E65bb9FdA42dFBb7155406549b' as Hex,
    //   },
  },
};

const getContracts = (chain: SupportedChains) => deployments[chain.id];

export { deployments, schemas, getContracts };
