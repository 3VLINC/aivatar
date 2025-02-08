// 'use client';
import { useMemo, useState } from 'react';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useConfig,
  useWriteContract,
} from 'wagmi';
import { Button } from '@heroui/react';
import { useContracts } from '~/hooks/useContracts';

export function Mint() {
  const [txHash, setTxHash] = useState<string | null>(null);
  const config = useConfig();

  const { address, isConnected, chainId } = useAccount();

  const contracts = useContracts();

  const {
    writeContract,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
    failureReason,
    status,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  const sendTx = useMemo(
    () =>
      contracts && address
        ? () => {
            writeContract(
              {
                // chainId: baseSepolia.id,
                address: contracts.aivatar.address,
                abi: contracts.aivatar.abi,
                functionName: 'mint',
                // value: parseEther('0.0002'),
                args: [address, '0x'],
                dataSuffix: '0x',
                // data
              },
              {
                onSuccess: (hash) => {
                  setTxHash(hash);
                },
              }
            );
          }
        : undefined,
    [writeContract, address, contracts]
  );

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return (
      <div className="text-red-500 text-xs mt-1">
        {error.message}
        {error.stack}
      </div>
    );
  };

  // if (!isSDKLoaded) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>

      {/* Context and actions omitted. */}

      <div>
        <h2 className="font-2xl font-bold">Wallet</h2>
        <textarea
          value={`Chain ID: ${chainId}
            Failure Reason: ${failureReason ? failureReason.message : ''}
            Status: ${status}
            Error: ${isSendTxError && renderError(sendTxError)}`}
          style={{ width: '100%', height: '100px' }}
        />

        <br />
        <br />
        <br />
        {address && (
          <div className="my-2 text-xs">
            Address: <pre className="inline">{address}</pre>
          </div>
        )}
        <div className="mb-4">
          <Button
            onPress={() =>
              isConnected
                ? disconnect()
                : connect({ connector: config.connectors[0] })
            }
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
        {isConnected && (
          <>
            <div className="mb-4">
              <Button
                onPress={sendTx}
                disabled={!isConnected || isSendTxPending}
                isLoading={isSendTxPending}
              >
                Mint
              </Button>

              {txHash && (
                <div className="mt-2 text-xs">
                  <div>Hash: {txHash}</div>
                  <div>
                    Status:{' '}
                    {isConfirming
                      ? 'Confirming...'
                      : isConfirmed
                      ? 'Confirmed!'
                      : 'Pending'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
