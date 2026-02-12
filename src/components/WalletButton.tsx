'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'
import { BrowserProvider } from 'ethers'
import { toast } from 'sonner'
import axios from 'axios'

export function WalletButton() {
    const [connected, setConnected] = useState(false)
    const [address, setAddress] = useState('')

    const connect = async () => {
        if (!window.ethereum) {
            toast.error('MetaMask not found')
            return
        }

        try {
            const provider = new BrowserProvider(window.ethereum)
            const accounts = await provider.send('eth_requestAccounts', [])
            const signer = await provider.getSigner()
            const userAddress = accounts[0]

            const nonce = Date.now().toString()
            const message = `Sign this message to login to Banner Marketplace: ${nonce}`
            const signature = await signer.signMessage(message)

            await axios.post('/api/auth/wallet', {
                address: userAddress,
                signature,
                nonce
            })

            setConnected(true)
            setAddress(`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`)
            toast.success('Wallet connected')
        } catch (error) {
            toast.error('Connection failed')
        }
    }

    const disconnect = () => {
        setConnected(false)
        setAddress('')
        document.cookie = 'user_session=; path=/; max-age=0'
    }

    if (connected) {
        return (
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-full glass text-sm font-medium">
                    {address}
                </div>
                <Button variant="ghost" size="icon" onClick={disconnect}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Button onClick={connect} className="gap-2 bg-primary hover:bg-primary/90">
            <Wallet className="h-4 w-4" />
            Connect Wallet
        </Button>
    )
}
