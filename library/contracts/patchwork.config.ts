import { Feature, type ProjectConfig } from '@patchworkdev/common/types';
import { anvil, base, baseSepolia } from 'viem/chains';

export default {
  name: 'Aivatar App',
  contracts: {
    Aivatar: {
      scopeName: 'aivatar',
      name: 'AIvatar',
      symbol: 'AIVATAR',
      baseURI: 'https://aivatar.3vl.ca/erc721/AIVATAR/',
      schemaURI: 'https://aivatar.3vl.ca/erc721/AIVATAR/schema.json',
      imageURI: 'https://aivatar.3vl.ca/erc721/AIVATAR/image/{tokenID}.svg',
      fields: [
        {
          id: 0,
          key: 'expression',
          type: 'uint8',
          description: 'The facial expression',
        },
      ],
      features: [Feature.MINTABLE],
    },
  },
  contractRelations: {},
  scopes: [
    {
      name: 'aivatar',
    },
  ],
  networks: {
    local: {
      chain: anvil,
      rpc: 'http://127.0.0.1:8545',
    },
    testnet: {
      chain: baseSepolia,
      rpc: 'http://127.0.0.1:8545',
    },
    mainnet: {
      chain: base,
      rpc: 'http://127.0.0.1:8545',
    },
  },
} as ProjectConfig;
