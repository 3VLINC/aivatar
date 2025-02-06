'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';
import { useConfig } from './Config';
import NeynarProvider from './Neynar';
import { Preload } from './Preload';
import { HeroUIProvider } from '@heroui/react';
import { Auth } from './Auth';
import { AuthKitProvider } from '@farcaster/auth-kit';

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
    <HeroUIProvider>
      <NeynarProvider>
        <ClientComponent>
          <Preload>
            <AuthKitProvider config={auth}>
              <Auth>{children}</Auth>
            </AuthKitProvider>
          </Preload>
        </ClientComponent>
      </NeynarProvider>
    </HeroUIProvider>
  );
};
