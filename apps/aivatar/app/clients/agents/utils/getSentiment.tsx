import { createReactAgent } from '@langchain/langgraph/prebuilt';
import type { MessagesAnnotation } from '@langchain/langgraph';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import z from 'zod';
import { getAgentConfig } from './getAgentConfig';
import { mapExpressionStringToEnum } from '~/utils/common';

export async function getSentiment(message: string) {
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
            `You are an insightful person and are good at reading peoples emotions. 
Read the following message and return one of the following emotions: Joy, Gratitude, Love, Pride, Hope, Relief, Amusement, Inspiration, Awe, Anger, Sadness, Fear, Jealousy, Frustration, Loneliness, Guilt, Disgust, Surprise, Nostalgia.`
          ),
          ...state.messages,
        ];
      },
      responseFormat: z.object({
        expression: z.enum([
          'Joy',
          'Gratitude',
          'Love',
          'Pride',
          'Hope',
          'Relief',
          'Amusement',
          'Inspiration',
          'Awe',
          'Anger',
          'Sadness',
          'Fear',
          'Jealousy',
          'Frustration',
          'Loneliness',
          'Guilt',
          'Disgust',
          'Surprise',
          'Nostalgia',
        ]),
      }),
    });

    const { expression } = await sentimentAgent
      .invoke(
        {
          messages: [new HumanMessage(message)],
        },
        agentConfig
      )
      .then((response) => response.structuredResponse);

    const sentiment = mapExpressionStringToEnum(expression);
    console.log(`Sentiment for message ${message}:`, sentiment);
    return sentiment;
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
