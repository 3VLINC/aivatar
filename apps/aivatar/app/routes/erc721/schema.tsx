import { coerceStringToTokenSymbol, getErc721Schema } from '~/utils/common';
import type { Route } from './+types/schema';

export function loader({ params }: Route.LoaderArgs) {
  const { symbol: _symbol } = params;
  const symbol = coerceStringToTokenSymbol(_symbol);
  return getErc721Schema(symbol);
}
