import { NextResponse } from 'next/server';
import axios from 'axios';
import { CreateWalletRequest, Wallet } from '@/app/_types/wallet';
import { generateJWT } from '../_lib/jwt';
import { config } from '../config';


export async function POST(request: Request) {
    try {
        console.log('🚀 Creating wallet...'); // Terminal log
        const walletRequest: CreateWalletRequest = await request.json();
        
        console.log('📝 Request:', walletRequest); // Terminal log
        const token = generateJWT('POST', '/platform/v1/wallets');

        const response = await axios.post<Wallet>(
            `https://${config.CDP_API_URL}/platform/v1/wallets`,
            walletRequest,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Wallet created:', response.data); // Terminal log
        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('❌ Wallet creation error:', error); // Terminal log
        return NextResponse.json(
            { error: error.response?.data?.message || error.message || 'Failed to create wallet' },
            { status: error.response?.status || 500 }
        );
    }
}