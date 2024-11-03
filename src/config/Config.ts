interface EnvConfig {
    CDP_API_URL: string;
}

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

export const config: EnvConfig = {
    CDP_API_URL: requireEnv('REACT_APP_CDP_API_URL'),
};

Object.freeze(config);

export default config;