import { createReactAgent } from '@langchain/langgraph/prebuilt';
import type { MessagesAnnotation } from '@langchain/langgraph';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import z from 'zod';
import { getAgentConfig } from '../utils/getAgentConfig';
import { Expression, getChainById, getContracts } from '@aivatar/contracts';
import { cdpApiActionProvider } from '@coinbase/agentkit';

export async function invokeSentimentAgent(message: string) {
  try {
    const config = await getAgentConfig();

    const agentConfig = {
      configurable: { thread_id: 'AIvatar sentiment manager' },
    };

    const sentimentAgent = createReactAgent({
      ...config,
      stateModifier: async (state: typeof MessagesAnnotation.State) => {
        return [
          new SystemMessage(
            'You are an insightful person and are good at reading peoples emotions. Read the follow message and try and guess what emotion the writer is feeling.'
          ),
          ...state.messages,
        ];
      },
      responseFormat: z.object({
        emotion: z.nativeEnum(Expression, {
          message: 'The emotion of the user',
        }),
      }),
    });

    const expression = sentimentAgent
      .invoke(
        {
          messages: [new HumanMessage(message)],
        },
        agentConfig
      )
      .then((response) => response.structuredResponse);

    const { aivatar } = getContracts(getChainById('84532'));

    const interactionAgent = createReactAgent({
      ...config,
      stateModifier: async (state: typeof MessagesAnnotation.State) => {
        return [...state.messages];
      },
    });
    console.log(aivatar.address);
    const stream = await interactionAgent.stream(
      {
        messages: [
          new SystemMessage(
            `Call this method agenticUpdate(uint256 tokenId, uint8 expression) on address ${
              aivatar.address
            } on base sepolia with parameters ${0} and ${expression}`,
            {
              address: aivatar.address,
              tokenId: 0,
              expression,
            }
          ),
        ],
      },
      agentConfig
    );

    const output = [];
    for await (const chunk of stream) {
      if ('agent' in chunk) {
        console.log(chunk.agent.messages[0].content);
        output.push(chunk.agent.messages[0].content);
      } else if ('tools' in chunk) {
        console.log(chunk.tools.messages[0].content);
        output.push(chunk.tools.messages[0].content);
      }
    }
    console.log(output.join(''));
    return output.join('');
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
