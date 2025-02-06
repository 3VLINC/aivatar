import Layout from '~/components/Layout';
import { useFarcasterContext } from '~/providers/Preload';
import { useProfile } from '@farcaster/auth-kit';
import { useLoaderData } from 'react-router';
import { useUserData } from '~/providers/Auth';

export default function Connect() {
  const profile = useProfile();
  const userData = useUserData();

  if (!profile) {
    return null;
  }

  const fcContext = useFarcasterContext();

  //   const handleUpdateLocation = async () => {
  //     try {
  //       const response = await axios.post('/api/updateLocation', {
  //         signerUuid: farcasterUser?.signer_uuid,
  //       });
  //       console.log('response data', response.data);
  //     } catch (error) {
  //       console.error('API Call failed', error);
  //     }
  //   };

  return (
    <Layout>
      <div className="flex flex-row items-center justify-center">
        {userData ? <h1>Already Connected!</h1> : <h1>Connect</h1>}
      </div>
      {/* {!farcasterUser?.status && (
        <Button onPress={handleSignIn} disabled={loading}>
          {loading ? 'Loading...' : 'Sign in with farcaster'}
        </Button>
      )}

      
      {farcasterUser && <span>Congrats you are connected!</span>} */}
    </Layout>
  );
}
