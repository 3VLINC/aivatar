// import { type SignIn as SignInCore } from '@farcaster/frame-sdk';
import { AuthContext } from '../Auth.context';
import { useUserResolver } from '../hooks/useUserResolver';
import { useCallback, type PropsWithChildren } from 'react';
import { useRestoredUser } from '~/providers/RestoredUser';
import type { FrameContext } from '~/providers/AppContext';
import { Button } from '@heroui/react';

export const FrameAuthContext = ({
  children,
  ctx,
}: PropsWithChildren<{ ctx: FrameContext }>) => {
  const { setUser } = useRestoredUser();

  const user = useUserResolver();

  const getNonce = useCallback(async () => {
    const nonce = await Math.random().toString(36).slice(2, 10);
    if (!nonce) throw new Error('Unable to generate nonce');
    return nonce;
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      const nonce = await getNonce();
      await ctx.sdk.actions.signIn({ nonce });
      const user = (await ctx.sdk.context).user;
      setUser({
        fid: user.fid.toString(),
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
        username: user.username,
      });
    } catch (e) {
      console.error(e);
    }
  }, [getNonce]);

  return (
    <AuthContext.Provider value={{ user }}>
      {!user ? <Button onPress={handleSignIn}>Sign In</Button> : children}
    </AuthContext.Provider>
  );
};
