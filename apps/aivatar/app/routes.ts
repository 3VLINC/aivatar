/* eslint-disable no-useless-escape */
import {
  type RouteConfig,
  index,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/index/index.tsx'),
  ...prefix('api', [
    route('generateSigner', './routes/api/generateSigner.tsx'),
    route('storeSigner', './routes/api/storeSigner.tsx'),
    route('isConnected', './routes/api/isConnected.tsx'),
    route('mint', './routes/api/mint.tsx'),
    route('getTokenOwners', './routes/api/getTokenOwners.tsx'),
    route('getSentiment', './routes/api/getSentiment.tsx'),
  ]),
  ...prefix('webhooks', [
    route('castCreated', './routes/webhooks/castCreated.tsx'),
  ]),
  ...prefix('erc721', [
    route(':symbol/image/:tokenId\.png', './routes/erc721/image.tsx'),
    route(':symbol/schema.json', './routes/erc721/schema.tsx'),
    route(':symbol/token/:tokenId.json', './routes/erc721/token.tsx'),
  ]),
  ...prefix('.well-known', [
    route('farcaster.json', './routes/.well-known/farcaster.tsx'),
  ])
] satisfies RouteConfig;
