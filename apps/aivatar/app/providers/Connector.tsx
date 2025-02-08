import { WagmiProvider } from 'wagmi';
import { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { frameConnector } from '~/lib/connector';
// import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com'),
  },
  connectors: [frameConnector()],
});

const queryClient = new QueryClient();
export function ConnectorProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
