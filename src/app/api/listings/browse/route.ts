
import { NextRequest, NextResponse } from 'next/server'
import { ListingService } from '@/services/listing.service'

export async function GET(request: NextRequest) {
    try {
        const { data, error } = await ListingService.getListings()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ listings: data })
    } catch (error) {
        console.error('Browse listings error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
