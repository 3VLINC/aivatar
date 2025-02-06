import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import '@farcaster/auth-kit/styles.css';
import { Providers } from './providers/Providers';
import { ConfigProvider, type ConfigContextProps } from './providers/Config';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const meta: Route.MetaFunction = () => [
  {
    title: 'AIVATAR',
    description: 'An Agentic PFP',
  },
];

export function loader({ request }: Route.LoaderArgs): ConfigContextProps {
  const url = new URL(request.url);
  const neynarClientId = process.env.NEYNAR_CLIENT_ID;

  if (!neynarClientId) {
    throw new Error('Missing Neynar Client ID');
  }

  const siweUri = new URL(`${url.protocol}//${url.hostname}`);
  siweUri.protocol = 'https';
  console.log('siweUri', siweUri.toString());
  return {
    neynarClientId,
    auth: {
      rpcUrl: 'https://mainnet.optimism.io',
      domain: url.hostname,
      siweUri: siweUri.toString(),
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const value = useRouteLoaderData<ReturnType<typeof loader>>('root');

  const content = value ? (
    <ConfigProvider value={value}>
      <Providers children={children} />
    </ConfigProvider>
  ) : null;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark text-foreground bg-background">
        {content}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
