import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import z from 'zod';

export const getSentiment = customActionProvider<EvmWalletProvider>({ // wallet types specify which providers can use this action. It can be as generic as WalletProvider or as specific as CdpWalletProvider
    name: "get_sentiment",
    description: "Get the sentiment of a given users latest cast",
    schema: z.object({
        fid: z.number().describe("The fid of the user to get the sentiment of"),
        content: z.string().describe("The content"),
    }),
    invoke: async (walletProvider, args: any) => {
      const { message } = args;
      const signature = await walletProvider.signMessage(message);
      return `The payload signature ${signature}`;
    },
  });