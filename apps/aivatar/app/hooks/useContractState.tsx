import { useAccount, useReadContract } from 'wagmi';
import { useContracts } from './useContracts';
import { zeroAddress } from 'viem';

export const useContractState = () => {
  const { address } = useAccount();
  const contracts = useContracts();

  const { data, isLoading, refetch } = useReadContract({
    abi: contracts?.aivatar.abi || [],
    functionName: 'balanceOf',
    args: address ? [address] : [zeroAddress],
    address: contracts?.aivatar.address
      ? contracts?.aivatar.address
      : zeroAddress,
  });

  if (!address) {
    return { data: 0, isLoading: false };
  }

  return { data, isLoading, refetch };
};
