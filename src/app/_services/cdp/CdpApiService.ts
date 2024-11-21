import { AxiosHttpClient, HttpClient } from '@/app/_services/http/HttpClient';
import { CreateWalletRequest, Wallet } from '@/app/_types/wallet';

export class CdpApiService {
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient();
  }

  async createWallet(request: CreateWalletRequest): Promise<Wallet> {
    try {
      // Make request to our backend API
      const response = await this.httpClient.post<Wallet>(
        '/api/wallets',
        request
      );
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}