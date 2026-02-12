import axios from 'axios'
import { toast } from 'sonner'
import { BrowserProvider, Contract, getAddress } from 'ethers'

const ERC20_ABI = ['function transfer(address to, uint256 amount) returns (bool)']
const BASE_SEPOLIA_CHAIN_ID = '0x14a34'

async function performPayment(details: any) {
    // TODO: Uncomment for real MetaMask payment
    /*
    if (!window.ethereum) {
        throw new Error('MetaMask not found')
    }

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org']
            }]
        })
    } catch (addError: any) {
        if (addError.code !== 4902) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
            })
        }
    }

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    
    toast.info(`Sending ${details.amount} USDC payment...`)
    
    const usdcContract = new Contract(details.tokenAddress, ERC20_ABI, signer)
    const amountInWei = BigInt(Math.floor(details.amount * 1_000_000))
    const recipientAddress = details.recipient.toLowerCase()
    
    try {
        const tx = await usdcContract.transfer(recipientAddress, amountInWei)
        toast.info('Transaction sent! Waiting for confirmation...')
        
        const receipt = await tx.wait()
        toast.success('Payment confirmed!')
        
        return tx.hash
    } catch (error: any) {
        if (error.message?.includes('exceeds balance')) {
            toast.error('Insufficient USDC balance. Using mock payment for demo.')
            await new Promise(resolve => setTimeout(resolve, 1000))
            const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
            return mockTxHash
        }
        throw error
    }
    */

    // Mock payment for demo
    toast.info('Processing payment...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    toast.success('Payment confirmed!')
    return mockTxHash
}

export const x402Client = {
    async post(url: string, data: any) {
        try {
            const response = await axios.post(url, data, {
                withCredentials: true
            })
            return response.data
        } catch (error: any) {
            if (error.response && error.response.status === 402) {
                const paymentDetails = error.response.data.details

                try {
                    const txHash = await performPayment(paymentDetails)

                    // Retry with X-PAYMENT header
                    const retryResponse = await axios.post(url, data, {
                        withCredentials: true,
                        headers: {
                            'X-PAYMENT': txHash
                        }
                    })
                    return retryResponse.data

                } catch (paymentError) {
                    toast.error('Payment failed or cancelled')
                    throw paymentError
                }
            }
            throw error
        }
    }
}
