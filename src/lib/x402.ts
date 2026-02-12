
import { ethers } from 'ethers'

export const X402 = {
    parseHeader(header: string) {
        // Expected format: "tx_hash" or "chain_id:tx_hash" or json?
        // Prompt says: "containing tx hash".
        // Let's assume raw hash for simplicity or JSON.
        return header.trim()
    },

    async verifyTransaction(txHash: string, expectedAmount: number, recipientAddress: string, rpcUrl: string, tokenAddress: string) {
        // Skip verification in development for mock transactions
        if (process.env.NODE_ENV === 'development' && txHash.startsWith('0x') && txHash.length === 66) {
            console.log('DEV MODE: Skipping transaction verification for mock tx:', txHash)
            return true
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const receipt = await provider.getTransactionReceipt(txHash)

        if (!receipt) {
            throw new Error('Transaction not found')
        }

        if (receipt.status !== 1) {
            throw new Error('Transaction failed')
        }

        const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

        const log = receipt.logs.find(l =>
            l.address.toLowerCase() === tokenAddress.toLowerCase() &&
            l.topics[0] === TRANSFER_TOPIC
        )

        if (!log) {
            throw new Error('No USDC transfer found in transaction')
        }

        const to = ethers.stripZerosLeft(log.topics[2])
        if (to.toLowerCase() !== recipientAddress.toLowerCase()) {
            throw new Error('Invalid recipient')
        }

        const amount = BigInt(log.data)
        const amountUSDC = Number(ethers.formatUnits(amount, 6))

        if (Math.abs(amountUSDC - expectedAmount) > 0.000001) {
            throw new Error(`Invalid amount. Expected ${expectedAmount}, got ${amountUSDC}`)
        }

        return true
    }
}
