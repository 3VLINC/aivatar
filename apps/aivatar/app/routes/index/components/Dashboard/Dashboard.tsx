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
        <SponsoredMint onSuccess={onSuccess} />
      </>
    );
  } else {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-xl">Congrats!</h1>
        <p>Your AIVATAR is active. Now let's get casting!</p>
      </div>
    );
  }
}
