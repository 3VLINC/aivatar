import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

export function getConfig() {
    const output = {
        OPENAI_API_KEY: '',
        CDP_API_KEY_NAME:'',
        CDP_API_KEY_PRIVATE_KEY:'',
        WALLET_DATA_FILE:'',
        NETWORK_ID: 'base-sepolia'
    };

    const missingVars: string[] = [];
  
    // Check required variables
    const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY", "WALLET_DATA_FILE", "NETWORK_ID"];
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      } else {
        output[varName as keyof typeof output] = process.env[varName];
      }
    });
  
    // Exit if any required variables are missing
    if (missingVars.length > 0) {
      console.error("Error: Required environment variables are not set");
      missingVars.forEach(varName => {
        console.error(`${varName}=your_${varName.toLowerCase()}_here`);
      });
      process.exit(1);
    }
  
    // Warn about optional NETWORK_ID
    if (!output.NETWORK_ID) {
      console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
    }

    // Create file if not exists
    const cdpWalletDataFile = resolve(cwd(), output.WALLET_DATA_FILE);

    if (!existsSync(cdpWalletDataFile)) {
        writeFileSync(cdpWalletDataFile, "");
    }

    
    const cdpWalletData = existsSync(cdpWalletDataFile) ? readFileSync(cdpWalletDataFile, "utf-8") : undefined;

    return {
      apiKeyName: output.CDP_API_KEY_NAME,
      apiKeyPrivateKey: output.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      cdpWalletDataFile,
      cdpWalletData,
      networkId: output.NETWORK_ID
    };
  }