'use client';
import type { Context } from '@farcaster/frame-sdk';
import type { FrameSDK } from '@farcaster/frame-sdk/dist/types';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

export type InFrameContext = {
  type: 'in-frame';
  context: Context.FrameContext;
  sdk: FrameSDK;
};

export type OutFrameContext = {
  type: 'out-frame';
};

export type FarcasterContext = InFrameContext | OutFrameContext;

const FarcasterContext = createContext<FarcasterContext | undefined>(undefined);

export const Preload = ({ children }: PropsWithChildren) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [context, setContext] = useState<FarcasterContext | undefined>();

  useEffect(() => {
    const load = async () => {
      const { sdk: _sdk } = await import('@farcaster/frame-sdk');
      await _sdk.actions.ready();
      const context = await _sdk.context;
      setIsSdkLoaded(true);
      if (context) {
        setContext({ type: 'in-frame', context, sdk: _sdk });
      } else {
        setContext({ type: 'out-frame' });
      }
    };

    if (!isSdkLoaded) {
      load();
    }
  }, [isSdkLoaded]);

  if (!isSdkLoaded) {
    return false;
  }

  return (
    <FarcasterContext.Provider value={context}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const useFarcasterContext = () => useContext(FarcasterContext);
