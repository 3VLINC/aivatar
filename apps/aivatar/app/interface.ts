import type { Hex } from "viem";

export interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: string;
}

export interface SignedKeyResult {
  deadline: number;
  signature: Hex;
}

export type TokenSymbol = 'AIVATAR';


interface InputMetadata {
  symbol: TokenSymbol;
  tokenId: bigint;
  description: string;
  name: string;

  attributes: Attribute[];
}

export type Attribute =
  | StringAttribute
  | NumberAttribute
  | DateAttribute
  | BoostNumberAttribute
  | BoostPercentageAttribute;

type BaseAttribute = {
  trait_type: string;
};

type StringAttribute = BaseAttribute & {
  display_type?: never;
  value: string;
};

type NumberAttribute = BaseAttribute & {
  display_type: 'number';
  value: number;
  max_value?: number;
};

type DateAttribute = BaseAttribute & {
  display_type: 'date';
  value: number;
};

type BoostNumberAttribute = NumberAttribute & {
  display_type: 'boost_number';
};

type BoostPercentageAttribute = NumberAttribute & {
  display_type: 'boost_percentage';
};

export type OutputMetadata = Omit<InputMetadata, 'symbol' | 'tokenId'> & {
  image: string;
  external_url: string;
  background_color: string;
};