import axios from 'axios'
import { toast } from 'sonner'

// Placeholder for actual payment logic using CDP or window.ethereum
// In a real app, this would trigger a wallet transaction.
async function performPayment(details: any) {
    console.log('Initiating payment...', details)
    toast.info(`Please pay ${details.amount} USDC to ${details.recipient}`)

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock TX Hash
    const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    toast.success('Payment sent! Verifying...')
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
