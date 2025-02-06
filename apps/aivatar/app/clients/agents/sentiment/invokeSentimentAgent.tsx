import { createReactAgent } from '@langchain/langgraph/prebuilt';
import type { MessagesAnnotation } from '@langchain/langgraph';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import z from 'zod';
import { getAgentConfig } from '../utils/getAgentConfig';
import { Expression, getChainById, getContracts } from '@aivatar/contracts';
import { getWallet } from '../utils/getWallet';

export async function invokeSentimentAgent(message: string) {
  try {
    const config = await getAgentConfig();
    const { wallet } = await getWallet();

    const agentConfig = {
      configurable: { thread_id: 'AIvatar sentiment manager' },
    };

    const sentimentAgent = createReactAgent({
      ...config,
      stateModifier: async (state: typeof MessagesAnnotation.State) => {
        return [
          new SystemMessage(
            'You are an insightful person and are good at reading peoples emotions. Read the following message and try and guess what emotion the writer is feeling.'
          ),
          ...state.messages,
        ];
      },
      responseFormat: z.object({
        expression: z.nativeEnum(Expression, {
          message: 'The emotion of the user',
        }),
      }),
    });

    const tokenId = 0;

    const { expression } = await sentimentAgent
      .invoke(
        {
          messages: [new HumanMessage(message)],
        },
        agentConfig
      )
      .then((response) => response.structuredResponse);

    const { aivatar } = getContracts(getChainById(wallet.getNetworkId()));

    const contractInvocation = await wallet.invokeContract({
      abi: aivatar.abi,
      contractAddress: aivatar.address,
      method: 'agenticUpdate',
      args: { tokenId: tokenId.toString(), expression: expression.toString() },
    });

    console.log('tx hash', contractInvocation.getTransactionHash());
    await contractInvocation
      .wait({
        intervalSeconds: 5,
        timeoutSeconds: 60,
      })
      .catch((err) => console.error(err));

    return `The contract call was invoked updating tokenId: ${tokenId} with expression: ${expression}\n tx: ${contractInvocation.getTransactionHash()}`;

    //   const interactionAgent = createReactAgent({
    //     ...config,
    //     stateModifier: async (state: typeof MessagesAnnotation.State) => {
    //       return [
    //         "explain to me how to invoke a tool and pass in the expected schema parameters if I don't include it right away.",
    //         ...state.messages,
    //       ];
    //     },
    //   });
    //   console.log(aivatar.address);
    //   console.log(
    //     'msg',
    //     `Invoke tool agentic_update with \`\`\`json
    //  {
    //    "tokenId": ${0},
    //    "expression": ${expression}
    //  }
    //  \`\`\``
    //   );
    //   const stream = await interactionAgent.stream(
    //     {
    //       messages: [
    //         new HumanMessage(
    //           `Invoke tool agentic_update with \`\`\`json
    //  {
    //    "tokenId": ${0},
    //    "expression": ${expression}
    //  }
    //  \`\`\``,
    //           {
    //             tokenId: 0n,
    //             expression,
    //           }
    //         ),
    //       ],
    //     },
    //     agentConfig
    //   );

    //   const output = [];
    //   for await (const chunk of stream) {
    //     if ('agent' in chunk) {
    //       console.log(chunk.agent.messages[0].content);
    //       output.push(chunk.agent.messages[0].content);
    //     } else if ('tools' in chunk) {
    //       console.log(chunk.tools.messages[0].content);
    //       output.push(chunk.tools.messages[0].content);
    //     }
    //   }
    //   console.log(output.join(''));
    //   return output.join('');
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
