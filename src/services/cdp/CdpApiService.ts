import * as jose from 'jose';
import { HttpClient } from '../http/HttpClient';
import { config } from '../../config/Config';
import { CreateWalletRequest, Wallet } from '../../types/wallet';

export class CdpApiService {
  private readonly keyName: string;
  private readonly keySecret: string;
  private readonly baseURL = config.CDP_API_URL;

  constructor(
    private readonly httpClient: HttpClient,
    keyName: string,
    privateKey: string
  ) {
    this.keyName = keyName;
    this.keySecret = privateKey;
  }


  private generateNonce(): string {
    // Use Web Crypto API for random values
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

  private async generateJWT(method: string, path: string): Promise<string> {
    const uri = `${method} ${this.baseURL}${path}`;
    const payload = {
        iss: 'cdp',
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: this.keyName,
        uri,
    };

    const privateKey = await jose.importPKCS8(this.keySecret, 'ES256');
    return await new jose.SignJWT(payload)
      .setProtectedHeader({
          alg: 'ES256',
          kid: this.keyName,
          nonce: this.generateNonce(),
      })
      .setIssuedAt()
      .setIssuer("cdp")
      .setExpirationTime('5m')
      .sign(privateKey);
}

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: Record<string, any>
  ): Promise<T> {
    try {
      const jwt = await this.generateJWT(method, endpoint);
      const headers = {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      };

      const url = `${endpoint}`;
      
      switch (method.toUpperCase()) {
        case 'GET':
          return await this.httpClient.get<T>(url, { ...config, headers });
        case 'POST':
          return await this.httpClient.post<T>(url, data, { ...config, headers });
        case 'PUT':
          return await this.httpClient.put<T>(url, data, { ...config, headers });
        case 'DELETE':
          return await this.httpClient.delete<T>(url, { ...config, headers });
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (error) {
      throw new Error(`CDP API Error: ${(error as Error).message}`);
    }
  }

  // Wallet Operations
  async createWallet(request: CreateWalletRequest): Promise<Wallet> {
    console.log('Creating wallet:', request);
    return this.makeRequest<Wallet>('POST', '/v1/wallets', request);
  }
}