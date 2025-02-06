import { ChatOpenAI } from '@langchain/openai';
import { writeFileSync } from 'fs';
import { getConfig } from './getConfig';
import {
  AgentKit,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  CdpWalletProvider,
  walletActionProvider,
} from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { type CreateReactAgentParams } from '@langchain/langgraph/prebuilt';

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
export async function getAgentConfig(): Promise<CreateReactAgentParams> {
  try {
    const config = getConfig();

    const { cdpWalletDataFile } = config;

    // Initialize LLM
    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });

    // Configure CDP Wallet Provider

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

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
      ],
    });

    const tools = await getLangChainTools(agentkit);

    const exportedWallet = await walletProvider.exportWallet();

    writeFileSync(cdpWalletDataFile, JSON.stringify(exportedWallet));

    return {
      llm,
      tools,
    };
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error; // Re-throw to be handled by caller
  }
}
