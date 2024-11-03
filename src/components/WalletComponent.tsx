import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useCdp } from '../contexts/CdpContext';
import { CreateWalletRequest, Wallet } from '../types/wallet';

interface Position {
  x: number;
  y: number;
}

interface WalletComponentProps {
  position: Position;
}

function WalletComponent({ position }: WalletComponentProps) {
  const { cdpService, isConfigured } = useCdp();
  const [networkId, setNetworkId] = useState('base-sepolia');
  const [useServerSigner, setUseServerSigner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const createWallet = async () => {
    if (!cdpService) {
      setError('Please configure CDP credentials first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: CreateWalletRequest = {
        wallet: {
          network_id: networkId,
          use_server_signer: useServerSigner
        }
      };
      const newWallet = await cdpService.createWallet(request);
      setWallet(newWallet);
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet');
      console.error('Wallet creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Draggable defaultPosition={position} grid={[25, 25]}>
      <div className="component wallet">
        <div className="component-header">
          <span>👛</span>
          <span>Create Wallet</span>
        </div>
        <div className="component-body">
          <select
            value={networkId}
            onChange={(e) => setNetworkId(e.target.value)}
            disabled={loading}
          >
            <option value="base-sepolia">Base Sepolia</option>
            <option value="base-mainnet">Base Mainnet</option>
            <option value="ethereum-sepolia">Ethereum Sepolia</option>
            <option value="ethereum-goerli">Ethereum Goerli</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useServerSigner}
              onChange={(e) => setUseServerSigner(e.target.checked)}
              disabled={loading}
            />
            Use Server Signer
          </label>

          <button 
            onClick={createWallet}
            disabled={loading || !isConfigured}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Creating...' : 'Create Wallet'}
          </button>
          
          {error && (
            <div className="component-error">
              {error}
            </div>
          )}
          
          {wallet && (
            <div className="component-success">
              <div>Wallet Created Successfully!</div>
              <div className="wallet-details">
                <div>ID: {wallet.id}</div>
                <div>Network: {wallet.network_id}</div>
                <div>Created: {new Date(wallet.created_at).toLocaleString()}</div>
              </div>
            </div>
          )}

          {!isConfigured && (
            <div className="component-warning">
              Please configure CDP credentials first
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}

export default WalletComponent;