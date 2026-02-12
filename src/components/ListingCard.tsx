import { Listing } from '@/types/listing'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BadgeCheck, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ListingCardProps {
    listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Card className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group">
            <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 relative">
                {/* Fallback pattern if no banner */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-black"></div>
            </div>

            <div className="px-6 -mt-8 relative z-10 flex justify-between items-end">
                <div className="h-16 w-16 rounded-full bg-black border-4 border-background overflow-hidden relative">
                    {/* Use a placeholder or real avatar */}
                    <div className="h-full w-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
                        {listing.username[0].toUpperCase()}
                    </div>
                </div>
                <div className="mb-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    ${listing.price_per_day} / day
                </div>
            </div>

            <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg truncate">@{listing.username}</h3>
                    {listing.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                </div>

                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="text-foreground font-medium">{listing.followers_count?.toLocaleString() || '0'}</span> Followers
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pb-4 pt-0">
                <Link href={`/listings/${listing.id}`} className="w-full">
                    <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">Rent Space</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
