import { useContext, type PropsWithChildren } from 'react';
import { useAppContext } from '../AppContext';
import type { AppUser } from '~/interface';
import { AuthContext } from './Auth.context';
import { WebAuthContext } from './components/WebAuthContext';
import { FrameAuthContext } from './components/FrameAuthContext';

export const Auth = ({ children }: PropsWithChildren) => {
  const appContext = useAppContext();

  if (appContext.type === 'web') {
    return <WebAuthContext>{children}</WebAuthContext>;
  } else {
    return <FrameAuthContext ctx={appContext}>{children}</FrameAuthContext>;
  }
};

export const useUser = (): AppUser | null => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a AuthProvider');
  }
  return context.user;
};

export const useLogout = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useLogout must be used within a AuthProvider');
  }
  return context.logout;
};
