import type { Route } from './+types/mint';
import { getSentiment } from '~/clients/agents/utils/getSentiment';

export type MintResponse = {
  success: boolean;
};
export async function action({ request }: Route.ActionArgs) {
  const json = await request.json();
  return getSentiment(json.message);
}
