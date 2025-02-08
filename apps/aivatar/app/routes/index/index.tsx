import Layout from '../../components/Layout';
import SvgPosJoy from '~/svg/Joy';
import { GrantAccess } from './components/GrantAccess/GrantAccess';
import { Dashboard } from './components/Dashboard/Dashboard';
import type { Route } from './+types/index';
import { useIsConnected } from '~/hooks/useIsConnected';
import { useUser } from '~/providers/Auth/Auth';
import { useCallback } from 'react';
import type { FrameEmbedNext } from '@farcaster/frame-sdk';

export const meta = () => {
  const frame: FrameEmbedNext = {
    version: 'next',
    imageUrl: `https://aivatar.3vl.ca/image.png`,
    button: {
      title: 'Create your agentic avatar!',
      action: {
        type: 'launch_frame',
        name: 'AIVATAR',
        url: `https://aivatar.3vl.ca`,
        splashImageUrl: `https://aivatar.3vl.ca/splash.png`,
        splashBackgroundColor: '#f7d932',
      },
    },
  };
  return [
    {
      property: 'fc:frame',
      content: JSON.stringify(frame),
    },
  ];
};
export default function (_: Route.ComponentProps) {
  const user = useUser();
  const { data: isConnected, refetch } = useIsConnected(user?.fid || '');

  const handleOnStored = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout>
      <div className="flex flex-row items-center justify-center">
        <div className="flex-1 text-center p-4">
          {isConnected ? (
            <Dashboard />
          ) : (
            <GrantAccess onStored={handleOnStored} />
          )}
        </div>
        <div className="flex flex-1 text-center p-4 items-center justify-center">
          <div className="w-full h-full max-w-[240px] max-h-[240px] flex items-center justify-center">
            <SvgPosJoy className="w-full h-full" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
