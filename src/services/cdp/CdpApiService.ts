import axios, { AxiosInstance } from 'axios';
import * as jose from 'jose';

export class CdpApiService {
  private api: AxiosInstance;
  private keyName: string;
  private keySecret: string;

  constructor(keyName: string, keySecret: string) {
    this.keyName = keyName;
    this.keySecret = keySecret;
    
    this.api = axios.create({
      baseURL: 'https://api.cdp.coinbase.com/platform',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor to add JWT token
    this.api.interceptors.request.use(async (config) => {
      const token = await this.generateJWT(config.method?.toUpperCase() || 'GET', config.url || '');
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  private async generateJWT(requestMethod: string, requestPath: string): Promise<string> {
    const requestHost = 'api.cdp.coinbase.com';
    const algorithm = 'ES256';
    const uri = `${requestMethod} ${requestHost}${requestPath}`;

    const payload = {
      iss: 'cdp',
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.keyName,
      uri,
    };

    // Convert PEM to private key
    const privateKey = await jose.importPKCS8(
      this.keySecret,
      algorithm
    );

    // Generate random nonce
    const nonce = window.crypto.getRandomValues(new Uint8Array(16))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

    // Sign JWT
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ 
        alg: algorithm, 
        kid: this.keyName,
        nonce 
      })
      .sign(privateKey);

    return jwt;
  }

  async createWallet(networkId: string, useServerSigner: boolean = false) {
    try {
      const response = await this.api.post('/wallets', {
        network_id: networkId,
        use_server_signer: useServerSigner
      });
      return response.data;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }
}