
export interface CreateWalletRequest {
    wallet: {
      network_id: string;
      use_server_signer?: boolean;
    };
  }
  
export interface Wallet {
    id: string;
    network_id: string;
    addresses: Address[];
    created_at: string;
    updated_at: string;
}
  
export interface Address {
    id: string;
    network_id: string;
    wallet_id: string;
    address: string;
    created_at: string;
    updated_at: string;
}