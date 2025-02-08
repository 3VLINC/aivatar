import { getChainById, getContracts } from '@aivatar/contracts';
import { useAccount } from 'wagmi';

export const useContracts = () => {
  const { chain } = useAccount();
  if (!chain) {
    throw new Error('chain is not set');
  }

  return getContracts(getChainById(chain.id));
};
