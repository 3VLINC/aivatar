import { getTokens } from '~/clients/agents/utils/getTokens';

export async function action() {
  return (await getTokens()).map((token) => ({
    tokenId: token.tokenId.toString(),
    address: token.address,
    expression: token.expression,
  }));
}
