
import { ethers } from 'ethers'

export const X402 = {
    parseHeader(header: string) {
        // Expected format: "tx_hash" or "chain_id:tx_hash" or json?
        // Prompt says: "containing tx hash".
        // Let's assume raw hash for simplicity or JSON.
        return header.trim()
    },

    async verifyTransaction(txHash: string, expectedAmount: number, recipientAddress: string, rpcUrl: string, tokenAddress: string) {
        // Verify on-chain
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const receipt = await provider.getTransactionReceipt(txHash)

        if (!receipt) {
            throw new Error('Transaction not found')
        }

        if (receipt.status !== 1) {
            throw new Error('Transaction failed')
        }

        // Verify log for ERC20 Transfer
        // Topic 0: Transfer(address,address,uint256)
        // keccak256("Transfer(address,address,uint256)")
        const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

        const log = receipt.logs.find(l =>
            l.address.toLowerCase() === tokenAddress.toLowerCase() &&
            l.topics[0] === TRANSFER_TOPIC
        )

        if (!log) {
            throw new Error('No USDC transfer found in transaction')
        }

        // Check recipient
        // topics[1] = from, topics[2] = to
        const to = ethers.stripZerosLeft(log.topics[2])
        if (to.toLowerCase() !== recipientAddress.toLowerCase()) {
            throw new Error('Invalid recipient')
        }

        // Check amount
        const amount = BigInt(log.data)
        // Adjust for decimals (USDC is 6)
        const amountUSDC = Number(ethers.formatUnits(amount, 6))

        // Allow small dust error? Or strict? 
        // Strict.
        if (Math.abs(amountUSDC - expectedAmount) > 0.000001) {
            throw new Error(`Invalid amount. Expected ${expectedAmount}, got ${amountUSDC}`)
        }

        return true
    }
}
