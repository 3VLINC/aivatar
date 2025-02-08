import { Expression, schemas } from '@aivatar/contracts';
import { db, tokens } from '@aivatar/drizzle';
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
import { eq } from 'drizzle-orm';

export const coerceStringToTokenSymbol = (symbol: string): TokenSymbol => {
  if (symbol === 'AIVATAR') {
    return `AIVATAR` as const;
  } else {
    throw new Error(`Invalid token symbol: ${symbol}`);
  }
};

export const getAivatarExpression = (expression: Expression) => {
  console.log('expression value is', expression);
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

export const mapExpressionStringToEnum = (expression: string): Expression => {
  switch (expression) {
    case 'Joy':
      return Expression.Joy;
    case 'Gratitude':
      return Expression.Gratitude;
    case 'Love':
      return Expression.Love;
    case 'Pride':
      return Expression.Pride;
    case 'Hope':
      return Expression.Hope;
    case 'Relief':
      return Expression.Relief;
    case 'Amusement':
      return Expression.Amusement;
    case 'Inspiration':
      return Expression.Inspiration;
    case 'Awe':
      return Expression.Awe;
    case 'Anger':
      return Expression.Anger;
    case 'Sadness':
      return Expression.Sadness;
    case 'Fear':
      return Expression.Fear;
    case 'Jealousy':
      return Expression.Jealousy;
    case 'Frustration':
      return Expression.Frustration;
    case 'Loneliness':
      return Expression.Loneliness;
    case 'Guilt':
      return Expression.Guilt;
    case 'Disgust':
      return Expression.Disgust;
    case 'Surprise':
      return Expression.Surprise;
    case 'Nostalgia':
      return Expression.Nostalgia;
    default:
      throw new Error(`Invalid expression string: ${expression}`);
  }
};

export const getExpression = async (tokenId: bigint) => {
  const result = await db
    .select({
      expression: tokens.expression,
    })
    .from(tokens)
    .where(eq(tokens.tokenId, tokenId))
    .then((results) => results[0].expression);

  if (!result) {
    return Expression.Joy;
  } else {
    return Expression[
      Expression[result] as unknown as any
    ] as unknown as Expression;
  }
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
