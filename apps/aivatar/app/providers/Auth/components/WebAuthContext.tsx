import { SignInButton, type UseSignInData } from '@farcaster/auth-kit';
import { AuthContext } from '../Auth.context';
import { useUserResolver } from '../hooks/useUserResolver';
import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { useRestoredUser } from '~/providers/RestoredUser';

export const WebAuthContext = ({ children }: PropsWithChildren) => {
  const { setUser } = useRestoredUser();

  const user = useUserResolver();

  const handleSuccess = useCallback((data: UseSignInData) => {
    if (!data.fid) {
      throw new Error('Login failed');
    }
    setUser({
      displayName: data.displayName,
      fid: data.fid.toString(),
      pfpUrl: data.pfpUrl,
      username: data.username,
    });
  }, []);

  const logout = useMemo(
    () =>
      user
        ? () => {
            setUser(null);
          }
        : undefined,
    []
  );

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!user ? <SignInButton onSuccess={handleSuccess} /> : children}
    </AuthContext.Provider>
  );
};
