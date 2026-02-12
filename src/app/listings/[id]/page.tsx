'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BadgeCheck, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { addDays, format, differenceInDays } from 'date-fns'
import { toast } from 'sonner'
import { x402Client } from '@/lib/x402-client'

export default function ListingDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    // Mock Data
    const listing = {
        id,
        user_id: 'user-123',
        username: 'crypto_king',
        price_per_day: 50,
        followers_count: 150000,
        verified: true,
        bg_color: 'from-purple-900 to-indigo-900'
    }

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [days, setDays] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate)
    }

    const handleRent = async () => {
        if (!date) return

        setIsLoading(true)
        try {
            await x402Client.post('/api/rentals/request', {
                listingId: listing.id,
                days: days,
                startDate: date // In real app, send actual date range
            })

            toast.success('Rental confirmed! Redirecting to upload...')
            router.push(`/upload-ad?listingId=${listing.id}`)

        } catch (error) {
            console.error(error)
            toast.error('Failed to process rental.')
        } finally {
            setIsLoading(false)
        }
    }

    const totalCost = listing.price_per_day * days

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">

                {/* Left: Listing Visuals */}
                <div className="md:col-span-2 space-y-6">
                    <div className={`h-64 rounded-xl relative overflow-hidden bg-gradient-to-r ${listing.bg_color}`}>
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-bold uppercase tracking-widest">
                            Banner Space
                        </div>
                    </div>

                    <div className="flex items-end -mt-16 px-8 relative z-10 gap-4">
                        <div className="h-24 w-24 rounded-full bg-black border-4 border-background overflow-hidden flex items-center justify-center bg-zinc-800">
                            <span className="text-2xl font-bold">CK</span>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">@{listing.username}</h1>
                                {listing.verified && <BadgeCheck className="h-6 w-6 text-blue-500" />}
                            </div>
                            <p className="text-muted-foreground">{listing.followers_count.toLocaleString()} Followers</p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <h3>About this space</h3>
                        <p>
                            Reach a highly engaged audience of crypto enthusiasts. I post daily about DeFi, NFTs, and L2 scaling solutions.
                            My banner is the first thing 150k people see when they visit my profile.
                        </p>
                    </div>
                </div>

                {/* Right: Rental Action */}
                <div>
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Price</span>
                                <span className="text-2xl font-bold">${listing.price_per_day}<span className="text-sm font-normal text-muted-foreground">/day</span></span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Start Date</label>
                                <div className="border rounded-md p-2">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        className="rounded-md border-0 w-full flex justify-center"
                                        disabled={(date) => date < new Date()}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Duration (Days)</label>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="icon" onClick={() => setDays(Math.max(1, days - 1))}>-</Button>
                                    <span className="font-bold w-8 text-center">{days}</span>
                                    <Button variant="outline" size="icon" onClick={() => setDays(days + 1)}>+</Button>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>${listing.price_per_day} x {days} days</span>
                                    <span>${totalCost}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${totalCost} USDC</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                onClick={handleRent}
                                disabled={isLoading || !date}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Rent Now'}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Powered by x402. Secure on-chain payment.
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
