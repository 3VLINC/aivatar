'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';
import { useConfig } from './Config';
import NeynarProvider from './Neynar';
import { Auth } from './Auth/Auth';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { RestoredUserProvider } from './RestoredUser';

export const Providers = ({ children }: PropsWithChildren) => {
  const [ClientComponent, setClientComponent] = useState<React.ComponentType<{
    children: React.ReactNode;
  }> | null>(null);

  const loadComponent = async () => {
    const module = await import('./Connector');
    setClientComponent(() => module.ConnectorProvider);
  };

  useEffect(() => {
    loadComponent();
  }, []);

  const { auth } = useConfig();

  if (!ClientComponent) {
    return null;
  }

  if (!auth) {
    return null;
  }

  return (
    <NeynarProvider>
      <ClientComponent>
        <AuthKitProvider config={auth}>
          <RestoredUserProvider>
            <Auth>{children}</Auth>
          </RestoredUserProvider>
        </AuthKitProvider>
      </ClientComponent>
    </NeynarProvider>
  );
};
