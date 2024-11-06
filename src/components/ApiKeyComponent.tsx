import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useCdp } from '../contexts/CdpContext';

interface Position {
  x: number;
  y: number;
}

interface ApiKeyComponentProps {
  position: Position;
}

interface Credentials {
  keyName: string;
  keySecret: string;
}

function ApiKeyComponent({ position }: ApiKeyComponentProps) {
  const { setCredentials, isConfigured } = useCdp();
  const [credentials, setCredentialsState] = useState<Credentials>({
    keyName: '',
    keySecret: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!isConfigured);

  const handleSave = () => {
    setError(null);

    if (!credentials.keyName || !credentials.keySecret) {
      setError('Both Key Name and Private Key are required');
      return;
    }

    if (!credentials.keyName.includes('organizations/') || !credentials.keyName.includes('/apiKeys/')) {
      setError('Invalid Key Name format. Expected: organizations/{org_id}/apiKeys/{key_id}');
      return;
    }

    const formattedKey = credentials.keySecret.trim();
    if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----') || 
        !formattedKey.includes('-----END PRIVATE KEY-----')) {
      setError('Invalid Private Key format. Expected PRIVATE KEY format');
      return;
    }

    try {
      setCredentials(credentials.keyName, credentials.keySecret);
      setIsExpanded(false);
    } catch (err: any) {
      setError(err.message || 'Failed to set credentials');
      console.error('Credential setup error:', err);
    }
  };

  if (isConfigured && !isExpanded) {
    return (
      <Draggable defaultPosition={position} grid={[25, 25]}>
        <div className="component api-key-minimized" onClick={() => setIsExpanded(true)}>
          <div className="component-header">
            <span>🔑</span>
            <span>{credentials.keyName.split('/').pop()}</span>
            <span className="auth-check">✓</span>
          </div>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable defaultPosition={position} grid={[25, 25]}>
      <div className="component api-key">
        <div className="component-header">
          <span>🔑</span>
          <span>CDP Credentials</span>
        </div>
        <div className="component-body">
          <div className="input-group">
            <label htmlFor="keyName">Key Name</label>
            <input
              id="keyName"
              type="text"
              placeholder="organizations/{org_id}/apiKeys/{key_id}"
              value={credentials.keyName}
              onChange={(e) => setCredentialsState({
                ...credentials,
                keyName: e.target.value
              })}
              disabled={isConfigured}
            />
          </div>

          <div className="input-group">
            <label htmlFor="keySecret">Private Key</label>
            <textarea
              id="keySecret"
              placeholder="-----BEGIN PRIVATE KEY-----"
              value={credentials.keySecret}
              onChange={(e) => setCredentialsState({
                ...credentials,
                keySecret: e.target.value
              })}
              disabled={isConfigured}
              rows={4}
              className="private-key-input"
            />
          </div>

          {error && (
            <div className="component-error">
              {error}
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isConfigured}
          >
            {isConfigured ? 'Credentials Configured ✓' : 'Save Credentials'}
          </button>

          {isConfigured && (
            <button 
              onClick={() => setIsExpanded(false)} 
              className="minimize-button"
            >
              Minimize
            </button>
          )}
        </div>
      </div>
    </Draggable>
  );
}

export default ApiKeyComponent;