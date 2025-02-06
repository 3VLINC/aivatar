import { createReactAgent } from '@langchain/langgraph/prebuilt';
import type { MessagesAnnotation } from '@langchain/langgraph';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import z from 'zod';
import { getAgentConfig } from '../utils/getAgentConfig';


export async function askWalletQuestions(message: string) {
  try {
    const config = await getAgentConfig();

    const agentConfig = {
      configurable: { thread_id: 'AIvatar sentiment manager' },
    };

    const agent = createReactAgent({
      ...config,
      stateModifier: async (state: typeof MessagesAnnotation.State) => {
        return [
          new SystemMessage(
            'Answer questions about the wallet and ignore all other questions.'
          ),
          ...state.messages,
        ];
      }
    });

    const stream = await agent
      .stream(
        {
          messages: [new HumanMessage(message)],
        },
        agentConfig
      );

    const response: string[] = [];

    for await (const chunk of stream) {
      if ('agent' in chunk) {
        console.log(chunk.agent.messages[0].content);
        response.push(chunk.agent.messages[0].content);
      } else if ('tools' in chunk) {
        console.log(chunk.tools.messages[0].content);
      }
      console.log('-------------------');
    }

    return response.join('');

  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
