import Layout from '../../components/Layout';
import SvgPosJoy from '~/svg/Joy';
import { useUserData } from '~/providers/Auth';
import { GrantAccess } from './components/GrantAccess/GrantAccess';
import { Dashboard } from './components/Dashboard';

export default function () {
  const userData = useUserData();
  return (
    <Layout>
      <div className="flex flex-row items-center justify-center">
        <div className="flex-1 text-center p-4">
          {!userData ? <GrantAccess /> : <Dashboard />}
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
