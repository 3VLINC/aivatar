'use client';
import type { FrameSDK } from '@farcaster/frame-sdk/dist/types';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

const FarcasterContext = createContext<FrameSDK | undefined>(undefined);


export const Preload = ({ children }: PropsWithChildren) => {
  const [sdk, setIsSDKLoaded] = useState<FrameSDK | undefined>();

  useEffect(() => {
    let sdk: FrameSDK | undefined = undefined;

    const load = async () => {
      const { sdk: _sdk } = await import('@farcaster/frame-sdk');
      sdk = _sdk;
      await sdk.actions.ready();
      setIsSDKLoaded(sdk);

    };

    if (!sdk) {
        load();
    }
    
  }, [sdk]);

  if (!sdk) {
    return false;
  }

  return <FarcasterContext.Provider value={sdk}>{children}</FarcasterContext.Provider>;
};

export const useFarcasterContext = () => useContext(FarcasterContext);
