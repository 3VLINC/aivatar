export type Transaction = {
  hash: string;
  transactionType: string;
  contractName: null | string;
  contractAddress: string;
};

export type Receipt = {
  transactionHash: string;
  blockNumber: string;
  contractAddress?: string | null;
};

export type Broadcast = {
  transactions: Transaction[];
  receipts: Receipt[];
};
