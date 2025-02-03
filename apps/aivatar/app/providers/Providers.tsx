'use client';

import { useEffect, useState } from 'react';
import { ConfigProvider, type ConfigProviderProps } from './Config';
import NeynarProvider from './Neynar';
import { Preload } from './Preload';

export const Providers = ({ children, value }: ConfigProviderProps) => {
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

  if (!ClientComponent) {
    return null;
  }

  return (
    <ConfigProvider value={value}>
      <NeynarProvider>
        <ClientComponent>
          <Preload>{children}</Preload>
        </ClientComponent>
      </NeynarProvider>
    </ConfigProvider>
  );
};
