import {
  getChainById,
  getContracts,
  type SupportedChains,
} from '@aivatar/contracts';
import { useAccount } from 'wagmi';

export const useContracts = () => {
  const { chain } = useAccount();

  let id: SupportedChains | undefined = undefined;
  if (chain) {
    id = getChainById(chain.id);
  }

  if (!id) {
    return null;
  }

  return getContracts(id);
};
