export const getNeynarClient = async () => {

    const { Configuration, NeynarAPIClient } = await import("@neynar/nodejs-sdk");
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Neynar API KEY");
    }
  
    const config = new Configuration({
      apiKey,
    });
  
    return new NeynarAPIClient(config);
  };
  