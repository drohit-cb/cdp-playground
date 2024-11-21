if (!process.env.CDP_KEY_NAME || !process.env.CDP_KEY_SECRET) {
    throw new Error('Missing required CDP API credentials in environment variables');
  }
  
  export const config = {
    CDP_API_URL: process.env.CDP_API_URL,
    CDP_KEY_NAME: process.env.CDP_KEY_NAME,
    CDP_KEY_SECRET: process.env.CDP_KEY_SECRET,
  } as const;