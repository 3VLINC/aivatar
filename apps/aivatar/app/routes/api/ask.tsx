import type { Route } from './+types/invokeAgent';
import { askWalletQuestions } from '~/clients/agents/sentiment/askWalletQuestions';

export async function action({ request }: Route.ActionArgs) {
  const { message } = await request.json();


  return askWalletQuestions(message);

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
