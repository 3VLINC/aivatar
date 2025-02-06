import { Expression, schemas } from '@aivatar/contracts';
import { createHash } from 'crypto';
import { renderToString } from 'react-dom/server';
import type { OutputMetadata, TokenSymbol } from '~/interface';
import Amusement from '~/svg/Amusement';
import Anger from '~/svg/Anger';
import Awe from '~/svg/Awe';
import Disgust from '~/svg/Disgust';
import Fear from '~/svg/Fear';
import Frustration from '~/svg/Frustration';
import Gratitude from '~/svg/Gratitude';
import Guilt from '~/svg/Guilt';
import Hope from '~/svg/Hope';
import Inspiration from '~/svg/Inspiration';
import Jealousy from '~/svg/Jealousy';
import Joy from '~/svg/Joy';
import Loneliness from '~/svg/Loneliness';
import Love from '~/svg/Love';
import Pride from '~/svg/Pride';
import Relief from '~/svg/Relief';
import Sadness from '~/svg/Sadness';

export const coerceStringToTokenSymbol = (symbol: string): TokenSymbol => {
  if (symbol === 'AIVATAR') {
    return `AIVATAR` as const;
  } else {
    throw new Error(`Invalid token symbol: ${symbol}`);
  }
};

export const getAivatarExpression = (expression: Expression) => {
  switch (expression) {
    case Expression.Joy:
      return <Joy />;
    case Expression.Gratitude:
      return <Gratitude />;
    case Expression.Love:
      return <Love />;
    case Expression.Pride:
      return <Pride />;
    case Expression.Hope:
      return <Hope />;
    case Expression.Relief:
      return <Relief />;
    case Expression.Amusement:
      return <Amusement />;
    case Expression.Inspiration:
      return <Inspiration />;
    case Expression.Awe:
      return <Awe />;
    case Expression.Anger:
      return <Anger />;
    case Expression.Sadness:
      return <Sadness />;
    case Expression.Fear:
      return <Fear />;
    case Expression.Jealousy:
      return <Jealousy />;
    case Expression.Frustration:
      return <Frustration />;
    case Expression.Loneliness:
      return <Loneliness />;
    case Expression.Guilt:
      return <Guilt />;
    case Expression.Disgust:
      return <Disgust />;
    default:
      throw new Error('Invalid expression');
  }
};

export const getErc721Schema = (symbol: TokenSymbol) => {
  switch (symbol) {
    case 'AIVATAR':
      return schemas.aivatar;
  }
};

// TODO: fetch from database
export const getExpression = async (tokenId: bigint) => {
  return Expression.Amusement;
};

export const getTokenImage = async (
  symbol: TokenSymbol,
  tokenId: bigint
): Promise<JSX.Element> => {
  if (symbol === 'AIVATAR') {
    return getExpression(tokenId).then(getAivatarExpression);
  } else {
    throw new Error(`Invalid token symbol: ${symbol}`);
  }
};

export const getTokenMetadata = async (
  baseUrl: URL,
  symbol: TokenSymbol,
  tokenId: bigint
): Promise<OutputMetadata> => {
  const hash = createHash('sha256');

  const getHash = (jsx: JSX.Element) =>
    hash.update(renderToString(jsx)).digest('hex');

  const h = await getTokenImage(symbol, tokenId).then(getHash);

  const imageUrl = new URL(baseUrl);
  // TODO: shouldn't need to force https, should inherit from request when full ssl is enabled
  imageUrl.protocol = 'https';

  imageUrl.pathname = `/erc721/${symbol}/image/${tokenId}.png`;
  imageUrl.searchParams.append('hash', h);
  const externalUrl = new URL(baseUrl);
  externalUrl.pathname = `/items/${symbol}/${tokenId}`;

  const schema = getErc721Schema(symbol);

  return {
    image: imageUrl.toString(),
    external_url: externalUrl.toString(),
    description: schema.name,
    name: schema.name,
    background_color: '000000',
    attributes: [
      {
        trait_type: 'Expression',
        value: Expression[await getExpression(tokenId)],
      },
    ],
  };
};
