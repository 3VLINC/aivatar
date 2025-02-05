import { ChatOpenAI } from "@langchain/openai";
import { writeFileSync } from "fs";
import { getConfig } from "./getConfig";
import { AgentKit, cdpApiActionProvider, cdpWalletActionProvider, CdpWalletProvider, walletActionProvider } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
// import { MemorySaver } from "@langchain/langgraph";
import {  createReactAgent } from "@langchain/langgraph/prebuilt";
import type { MessagesAnnotation } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { signMessage } from "../tools/signMessage";
import z from 'zod';

export enum Expression {
    HAPPY = "HAPPY",
    SAD = "SAD",
    ANGRY = "ANGRY",
    CONFUSED = "CONFUSED",
};

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
export async function initializeAgent() {
    try {

    const config = getConfig();

    const { cdpWalletDataFile } = config;

      // Initialize LLM
      const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
      });
  
      // Configure CDP Wallet Provider
      
  
      const walletProvider = await CdpWalletProvider.configureWithWallet(config);
  
      // Initialize AgentKit
      const agentkit = await AgentKit.from({
        walletProvider,
        actionProviders: [
        //   wethActionProvider(),
        //   pythActionProvider(),
          walletActionProvider(),
        //   erc20ActionProvider(),
          cdpApiActionProvider({
            apiKeyName: config.apiKeyName,
            apiKeyPrivateKey: config.apiKeyPrivateKey,
          }),
          cdpWalletActionProvider({
            apiKeyName: config.apiKeyName,
            apiKeyPrivateKey: config.apiKeyPrivateKey,
          }),
          signMessage
        ],
      });
  
      const tools = await getLangChainTools(agentkit);
  
      // Store buffered conversation history in memory
    //   const memory = new MemorySaver();
      const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

      
      const agent = createReactAgent({
        llm,
        tools,
        stateModifier: async (state: typeof MessagesAnnotation.State) => {
            return [
                new SystemMessage("You are an insightful person and are good at reading peoples emotions. Read the follow message and try and guess what emotion the writer is feeling."),
                ...state.messages,
            ];
          },
          responseFormat: z.object({
            emotion: z.nativeEnum(Expression, { message: "The emotion of the user" }),
          })
      });
      
      // Save wallet data

      const exportedWallet = await walletProvider.exportWallet();
      
      writeFileSync(cdpWalletDataFile, JSON.stringify(exportedWallet));

      return { agent, config: agentConfig };

    } catch (error) {
      console.error("Failed to initialize agent:", error);
      throw error; // Re-throw to be handled by caller
    }
  }