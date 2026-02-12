'use client'

import { ListingCard } from '@/components/ListingCard'
import { Listing } from '@/types/listing'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useState } from 'react'

const MOCK_LISTINGS: Listing[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `listing-${i + 1}`,
    user_id: `user-${i}`,
    username: `creator_${i + 1}`,
    price_per_day: (i + 1) * 10 + (i % 3) * 5,
    followers_count: (i + 1) * 15000 + (i % 5) * 10000,
    verified: i % 3 === 0,
    created_at: new Date().toISOString()
}))

export default function ListingsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Explore Creators</h1>
                        <p className="text-muted-foreground">Find the perfect audience for your advertisement</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Creators</p>
                                <p className="text-2xl font-bold">{MOCK_LISTINGS.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg. Reach</p>
                                <p className="text-2xl font-bold">125K</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <DollarSign className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Starting From</p>
                                <p className="text-2xl font-bold">$10/day</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by username or niche..." 
                        className="pl-10 h-12" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {MOCK_LISTINGS.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <Button variant="outline" size="lg">Load More</Button>
            </div>
        </div>
    )
}
