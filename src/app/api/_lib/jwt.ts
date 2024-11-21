import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { config } from '../config';

export function generateJWT(method: string, path: string): string {
    const requestHost = 'api.cdp.coinbase.com';
    const uri = `${method} ${requestHost}${path}`;
    
    const payload = {
        iss: 'cdp',
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: config.CDP_KEY_NAME,
        uri,
    };

    const header = {
        alg: 'ES256',
        kid: config.CDP_KEY_NAME,
        nonce: crypto.randomBytes(16).toString('hex'),
    };

    return jwt.sign(payload, config.CDP_KEY_SECRET, { algorithm: 'ES256', header });
}