'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' // Need Label component
import { Twitter, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateListingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState('')

    const handleConnectX = async () => {
        setLoading(true)
        // Simulate OAuth
        await new Promise(resolve => setTimeout(resolve, 1500))
        setLoading(false)
        setStep(2)
        toast.success('X Account Connected!')
    }

    const handleCreate = async () => {
        if (!price) return
        setLoading(true)

        try {
            const response = await fetch('/api/listings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pricePerDay: parseFloat(price) })
            })

            if (!response.ok) {
                throw new Error('Failed to create listing')
            }

            toast.success('Listing created successfully!')
            router.push('/dashboard')
        } catch (error) {
            toast.error('Failed to create listing')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-lg">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Monetize your X Banner</h1>
                <p className="text-muted-foreground">Start earning USDC by renting out your profile header.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 ? 'Step 1: Connect Account' : 'Step 2: Set Pricing'}
                    </CardTitle>
                    <CardDescription>
                        {step === 1
                            ? 'Verify ownership of your X account to get started.'
                            : 'Define how much you want to earn per day.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                                <div className="p-2 bg-black rounded-full text-white">
                                    <Twitter className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Twitter / X</h3>
                                    <p className="text-xs text-muted-foreground">Read-only access needed</p>
                                </div>
                            </div>

                            <Button className="w-full" onClick={handleConnectX} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" />}
                                Connect X Account
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Daily Price (USDC)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="50"
                                        className="pl-8"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">You can change this anytime.</p>
                            </div>

                            <Button className="w-full" onClick={handleCreate} disabled={loading || !price}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Listing <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
