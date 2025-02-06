import { PassThrough } from 'stream';
import type { Route } from './+types/image';
import { coerceStringToTokenSymbol, getTokenImage } from '~/utils/common';
import { renderToPipeableStream } from 'react-dom/server';
import sharp from 'sharp';

export async function loader({ params }: Route.LoaderArgs) {
  const { symbol: _symbol, tokenId: _tokenId } = params;

  const symbol = coerceStringToTokenSymbol(_symbol);
  const tokenId = BigInt(_tokenId);

  const element = await getTokenImage(symbol, tokenId);

  const response = new PassThrough();

  const { pipe } = renderToPipeableStream(element, {
    onShellReady() {
      pipe(sharp()).png().pipe(response);
    },
  });

  // TODO: figure out why this cast is necessary
  return new Response(response as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
