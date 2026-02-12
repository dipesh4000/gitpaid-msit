
import { CdpClient } from '@coinbase/cdp-sdk'

const API_KEY_NAME = process.env.CDP_API_KEY_NAME || process.env.CDP_API_KEY
const PRIVATE_KEY = process.env.CDP_API_KEY_SECRET || process.env.CDP_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!API_KEY_NAME || !PRIVATE_KEY) {
    // Warn but don't crash dev if env missing, but required for runtime
    if (process.env.NODE_ENV === 'production') {
        console.error('Missing CDP environment variables')
    }
}

// Initialize the CDP Client
// Maps the user's existing env vars to the SDK's expected format (apiKeyId, apiKeySecret)
let cdpClient: any = null;

try {
    if (API_KEY_NAME && PRIVATE_KEY) {
        cdpClient = new CdpClient({
            apiKeyName: API_KEY_NAME,
            privateKey: PRIVATE_KEY,
        } as any)
    } else {
        console.warn('CDP Client not initialized: Missing env vars')
    }
} catch (e) {
    console.error('Failed to initialize CDP Client', e)
}

export const cdp = cdpClient

// Helper to get server wallet (for payouts/refunds)
// Using "server-wallet" as the consistent name if SERVER_WALLET_ID is not provided
const SERVER_WALLET_ID = process.env.SERVER_WALLET_ID || 'server-wallet'

export async function getServerWallet() {
    try {
        // In the new SDK, wallets are accounts. We use getOrCreateAccount to persist by name.
        const wallet = await cdp.evm.getOrCreateAccount({
            name: SERVER_WALLET_ID
        })

        console.log(`SERVER WALLET: ${wallet.address}`)
        return wallet
    } catch (e) {
        console.error("Failed to fetch/create server wallet:", e)
        // Fallback to creating a new one if everything fails
        const wallet = await cdp.evm.createAccount()
        console.log(`CREATED TEMP SERVER WALLET: ${wallet.address}`)
        return wallet
    }
}
