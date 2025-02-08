import { useContractState } from '~/hooks/useContractState';
import { SponsoredMint } from './components/SponsoredMint';

export function Dashboard() {
  const { data, isLoading, refetch } = useContractState();

  const onSuccess = () => {
    if (refetch) {
      console.log('refetching');
      refetch();
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (data && data <= 0) {
    return (
      <>
        <h1>To activate your aivatar, mint him first</h1>
        <SponsoredMint onSuccess={onSuccess} />
      </>
    );
  } else {
    return (
      <>
        <h1>Congrats! Your aivatar is active!</h1>
      </>
    );
  }
}
