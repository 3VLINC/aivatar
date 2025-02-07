import { useContext, type PropsWithChildren } from 'react';
import { useAppContext } from '../AppContext';
import type { AppUser } from '~/interface';
import { useUserResolver } from './hooks/useUserResolver';
import { AuthContext } from './Auth.context';
import { WebAuthContext } from './components/WebAuthContext';

export const Auth = ({ children }: PropsWithChildren) => {
  const appContext = useAppContext();
  const user = useUserResolver();

  if (appContext.type === 'web') {
    return <WebAuthContext>{children}</WebAuthContext>;
  } else {
    return (
      <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
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
