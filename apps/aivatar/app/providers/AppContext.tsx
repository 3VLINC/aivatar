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

export type FrameContext = {
  type: 'frame';
  context: Context.FrameContext;
  sdk: FrameSDK;
};

export type WebContext = {
  type: 'web';
};

export type AppContextType = FrameContext | WebContext;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [context, setContext] = useState<AppContextType | undefined>();

  useEffect(() => {
    const load = async () => {
      const { sdk: _sdk } = await import('@farcaster/frame-sdk');
      await _sdk.actions.ready();
      const context = await _sdk.context;
      setIsSdkLoaded(true);
      if (context) {
        setContext({ type: 'frame', context, sdk: _sdk });
      } else {
        setContext({ type: 'web' });
      }
    };

    if (!isSdkLoaded) {
      load();
    }
  }, [isSdkLoaded]);

  if (!isSdkLoaded || !context) {
    return null;
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
