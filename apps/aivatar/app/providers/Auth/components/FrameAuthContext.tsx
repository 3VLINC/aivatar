import { AuthContext } from '../Auth.context';
import { useUserResolver } from '../hooks/useUserResolver';
import { useCallback, type PropsWithChildren } from 'react';
import { useRestoredUser } from '~/providers/RestoredUser';
import type { FrameContext } from '~/providers/AppContext';
import { Button } from '@heroui/react';
import SvgPosJoy from '~/svg/Joy';

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
      {!user ? (
        <div className="flex flex-col items-center justify-center gap-8">
          <SvgPosJoy height={128} width={128} />
          <p className="text-center">
            Create your AGENTIC PFP today! Get started by connecting your
            farcaster account.
          </p>
          <Button
            className="uppercase p-4 bg-purple-500 rounded text-lg"
            variant="solid"
            onPress={handleSignIn}
          >
            Sign In
          </Button>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
