import { CdpClient } from '@coinbase/cdp-sdk'

const API_KEY_NAME = process.env.CDP_API_KEY_NAME
const API_KEY_SECRET = process.env.CDP_API_KEY_SECRET

let cdpClient: any = null

if (API_KEY_NAME && API_KEY_SECRET) {
    try {
        cdpClient = new CdpClient({
            apiKeyName: API_KEY_NAME,
            privateKey: API_KEY_SECRET,
        } as any)
    } catch (e) {
        console.error('Failed to initialize CDP Client', e)
    }
}

export const cdp = cdpClient

const SERVER_WALLET_ID = process.env.SERVER_WALLET_ID || 'server-wallet'

export async function getServerWallet() {
    if (!cdp) throw new Error('CDP not initialized')
    try {
        const wallet = await cdp.evm.getOrCreateAccount({ name: SERVER_WALLET_ID })
        return wallet
    } catch (e) {
        const wallet = await cdp.evm.createAccount()
        return wallet
    }
}
