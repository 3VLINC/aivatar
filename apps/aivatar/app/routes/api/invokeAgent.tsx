import { getAgent } from '~/clients/agent/agent';
import type { Route } from './+types/invokeAgent';
import { HumanMessage } from '@langchain/core/messages';

export async function action({ request }: Route.ActionArgs) {
  const { message } = await request.json();

  const { agent, config } = await getAgent();

  const userInput = message;

  console.log(userInput);

  const result = await agent.invoke({
    messages: [new HumanMessage(userInput)],
  }, config);

  return result.structuredResponse;

//   const stream = await agent.stream(
//     { messages: [new HumanMessage(userInput)] },
//     config
//   );

//   const output = [];
//   for await (const chunk of stream) {
//     if ('agent' in chunk) {
//       console.log(chunk.agent.messages[0].content);
//       output.push(chunk.agent.messages[0].content);
//     } else if ('tools' in chunk) {
//       console.log(chunk.tools.messages[0].content);
//     }
//     console.log('-------------------');
//   }

//   return output.join('');
}
