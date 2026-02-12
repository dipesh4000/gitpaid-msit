import { ListingCard } from '@/components/ListingCard'
import { Listing } from '@/types/listing'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// Mock Data
const MOCK_LISTINGS: Listing[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `listing-${i}`,
    user_id: `user-${i}`,
    username: `creator_${i + 1}`,
    price_per_day: (i + 1) * 10,
    followers_count: (i + 1) * 1500,
    verified: i % 3 === 0,
    created_at: new Date().toISOString()
}))

export default function ListingsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Explore Creators</h1>
                    <p className="text-muted-foreground">Find the perfect audience for your ad.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by username..." className="pl-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {MOCK_LISTINGS.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>

            {/* Pagination or Load More (Future) */}
            <div className="mt-12 text-center text-sm text-muted-foreground">
                Showing {MOCK_LISTINGS.length} results
            </div>
        </div>
    )
}
