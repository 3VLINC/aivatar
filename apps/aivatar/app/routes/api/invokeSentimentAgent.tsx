import type { ActionFunctionArgs } from 'react-router';
import { invokeSentimentAgent } from '~/clients/agents/sentiment/invokeSentimentAgent';

export async function action({ request }: ActionFunctionArgs) {
  const result = await invokeSentimentAgent("I'm so scared!");

  return result;
}
