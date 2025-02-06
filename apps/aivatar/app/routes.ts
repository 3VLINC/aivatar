import {
  type RouteConfig,
  index,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  ...prefix('api', [
    route('generateSigner', './routes/api/generateSigner.tsx'),
    route('updateLocation', './routes/api/updateLocation.tsx'),
    route('getSigner', './routes/api/getSigner.tsx'),
    route('ask', './routes/api/ask.tsx'),
    route('invokeSentimentAgent', './routes/api/invokeSentimentAgent.tsx'),
  ]),
  ...prefix('webhooks', [
    route('castCreated', './routes/webhooks/castCreated.tsx'),
  ]),
] satisfies RouteConfig;
