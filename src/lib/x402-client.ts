import axios from 'axios'
import { toast } from 'sonner'
import { BrowserProvider, Contract } from 'ethers'

const ERC20_ABI = ['function transfer(address to, uint256 amount) returns (bool)']
const BASE_SEPOLIA_CHAIN_ID = '0x14a34' // 84532 in hex

async function performPayment(details: any) {
    if (!window.ethereum) {
        throw new Error('MetaMask not found')
    }

    // Switch to Base Sepolia if needed
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        })
    } catch (switchError: any) {
        if (switchError.code === 4902) {
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
        }
    }

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    
    toast.info(`Sending ${details.amount} USDC payment...`)
    
    const usdcContract = new Contract(details.tokenAddress, ERC20_ABI, signer)
    const amountInWei = BigInt(details.amount * 1_000_000)
    
    const tx = await usdcContract.transfer(details.recipient, amountInWei)
    toast.info('Transaction sent! Waiting for confirmation...')
    
    await tx.wait()
    toast.success('Payment confirmed!')
    
    return tx.hash
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
