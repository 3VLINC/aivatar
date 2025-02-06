import { ChatOpenAI } from '@langchain/openai';
import { writeFileSync } from 'fs';
import {
  AgentKit,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  walletActionProvider,
} from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { type CreateReactAgentParams } from '@langchain/langgraph/prebuilt';
import { agenticUpdate } from '../tools/agenticUpdate';
import { getWallet } from './getWallet';
import { getConfig } from './getConfig';

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
export async function getAgentConfig(): Promise<CreateReactAgentParams> {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });

    const config = getConfig();

    const { walletProvider } = await getWallet();

    // Initialize AgentKit
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        //   wethActionProvider(),
        //   pythActionProvider(),
        //   erc20ActionProvider(),
        walletActionProvider(),
        cdpApiActionProvider({
          apiKeyName: config.apiKeyName,
          apiKeyPrivateKey: config.apiKeyPrivateKey,
        }),
        cdpWalletActionProvider({
          apiKeyName: config.apiKeyName,
          apiKeyPrivateKey: config.apiKeyPrivateKey,
        }),
        agenticUpdate,
      ],
    });

    const tools = await getLangChainTools(agentkit);

    return {
      llm,
      tools,
    };
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
