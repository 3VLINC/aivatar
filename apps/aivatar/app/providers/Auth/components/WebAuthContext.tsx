import { SignInButton, type UseSignInData } from '@farcaster/auth-kit';
import { AuthContext } from '../Auth.context';
import { useUserResolver } from '../hooks/useUserResolver';
import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { useRestoredUser } from '~/providers/RestoredUser';
import Layout from '~/components/Layout';
import SvgPosJoy from '~/svg/Joy';

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
      {!user ? (
        <Layout>
          <div className="flex flex-col items-center justify-center gap-8">
            <SvgPosJoy height={128} width={128} />
            <p className="text-center">
              Create your AGENTIC PFP today! Get started by connecting your
              farcaster account.
            </p>
            <SignInButton onSuccess={handleSuccess} />
          </div>
        </Layout>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
