import Layout from '../../components/Layout';
import SvgPosJoy from '~/svg/Joy';
import { GrantAccess } from './components/GrantAccess/GrantAccess';
import { Dashboard } from './components/Dashboard';
import type { Route } from './+types/index';
import { useIsConnected } from '~/hooks/useIsConnected';
import { useUser } from '~/providers/Auth/Auth';
import { useCallback } from 'react';

export default function (_: Route.ComponentProps) {
  const user = useUser();
  const {
    data: isConnected,
    loading,
    refetch,
  } = useIsConnected(user?.fid || '');

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
        <div className="flex-1 text-center p-4">
          <div className="w-full h-full flex items-center justify-center">
            <SvgPosJoy className="w-full h-full" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
