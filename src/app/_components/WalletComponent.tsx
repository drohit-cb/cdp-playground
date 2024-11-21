'use client';

import React, { useState } from 'react';
import { CdpApiService } from '../_services/cdp/CdpApiService';
import { CreateWalletRequest, Wallet } from '../_types/wallet';

interface Position {
  x: number;
  y: number;
}

interface WalletComponentProps {
  position: Position;
  onWalletCreated?: () => void;
  dragHandleProps?: any;
}

export default function WalletComponent({ position, onWalletCreated, dragHandleProps }: WalletComponentProps) {
  console.log('WalletComponent mounted at position:', position);

  const [networkId, setNetworkId] = useState('base-sepolia');
  const [useServerSigner, setUseServerSigner] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const createWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const cdpService = new CdpApiService();
      const request: CreateWalletRequest = {
        wallet: {
          network_id: networkId,
          use_server_signer: useServerSigner
        }
      };
      
      const newWallet = await cdpService.createWallet(request);
      setWallet(newWallet);
      console.log('Calling onWalletCreated callback');
      onWalletCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-component">
      {wallet ? (
        <div className="wallet-display">
          <div 
            className="wallet-display-header" 
            {...dragHandleProps}
            style={{ cursor: 'grab' }}
          >
            <div className="wallet-emoji">👛</div>
            <div className="wallet-title">{walletName || 'My Wallet'}</div>
            <div className="network-badge" data-network={networkId}>
              {networkId}
            </div>
          </div>
          <div className="wallet-display-content">
            <div className="wallet-id">
              {`(${wallet.id.slice(0, 6)}...${wallet.id.slice(-4)})`}
            </div>
          </div>
        </div>
      ) : (
        <div className="wallet-form">
          <div className="form-header">Create New Wallet</div>
          
          <div className="form-content">
            <div className="form-field">
              <label>Wallet Name</label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="Enter wallet name"
                className="wallet-name-input"
              />
            </div>

            <div className="form-field">
              <label>Network</label>
              <select 
                value={networkId}
                onChange={(e) => setNetworkId(e.target.value)}
                className="network-select"
              >
                <option value="base-sepolia">Base Sepolia</option>
                <option value="base-mainnet">Base Mainnet</option>
              </select>
            </div>

            <div className="form-field checkbox-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useServerSigner}
                  onChange={(e) => setUseServerSigner(e.target.checked)}
                />
                <span>Use Server Signer</span>
              </label>
            </div>

            <button 
              onClick={createWallet}
              disabled={loading}
              className={`create-button ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Wallet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}