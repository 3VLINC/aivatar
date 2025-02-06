import { coerceStringToTokenSymbol, getTokenMetadata } from '~/utils/common';
import type { Route } from './+types/token';

export function loader({ params, request }: Route.LoaderArgs) {
  const { symbol: _symbol, tokenId: _tokenId } = params;

  const symbol = coerceStringToTokenSymbol(_symbol);
  const tokenId = BigInt(_tokenId);

  return getTokenMetadata(new URL(request.url), symbol, tokenId);
}
