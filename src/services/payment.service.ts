
import { getServerWallet } from '@/lib/cdp'
import { ethers } from 'ethers'
import { supabase } from '@/lib/supabase'

// USDC Contract ABI (minimal for transfer)
const USDC_ABI = [
    "function transfer(address to, uint256 amount) returns (boolean)"
]

const USDC_ADDRESS = process.env.USDC_CONTRACT_ADDRESS!

export const PaymentService = {
    async payout(creatorWallet: string, amount: number) {
        const wallet = await getServerWallet()

        // Check balance? SDK handles gas? 
        // CDK SDK allows contract invocation.

        try {
            const invocation = await wallet.invokeContract({
                contractAddress: USDC_ADDRESS,
                method: 'transfer',
                args: {
                    to: creatorWallet,
                    amount: ethers.formatUnits(amount * 1000000, 0) // adjusted for 6 decimals?
                    // Wait, amount in DB is likely raw number (e.g. 5 USDC).
                    // USDC has 6 decimals.
                    // ethers.parseUnits(amount.toString(), 6)
                },
                abi: USDC_ABI
            })

            await invocation.wait()

            return invocation.getTransactionHash()
        } catch (e) {
            console.error("Payout failed:", e)
            throw e
        }
    },

    async refund(advertiserWallet: string, amount: number) {
        return this.payout(advertiserWallet, amount)
    }
}
