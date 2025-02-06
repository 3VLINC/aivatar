import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'wagmi.ts',
  contracts: [],
  plugins: [
    foundry({
      project: './',
      include: ['AIvatar.sol/**', 'PatchworkProtocol.sol/**'],
    }),
  ],
});
