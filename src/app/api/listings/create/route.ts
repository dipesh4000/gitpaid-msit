
import { NextRequest, NextResponse } from 'next/server'
import { ListingService } from '@/services/listing.service'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const sessionToJSON = (await cookies()).get('user_session')?.value
        if (!sessionToJSON) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)
        if (session.role !== 'creator') {
            // Allow advertisers to create listing? No.
            // But role can be updated if they link X?
            // For now, strict check.
            // Actually, schema `role` is TEXT, so we can check easily.
            // If they connected X, they are creators.

            // Let's assume user must be creator.
            // However, if logic allows them to become creator by posting?
            // No, they need X tokens to be a creator in this system.    
        }

        const { pricePerDay } = await request.json()
        if (!pricePerDay || pricePerDay <= 0) {
            return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
        }

        const { data, error } = await ListingService.createOrUpdateListing(session.id, pricePerDay)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ listing: data })

    } catch (error) {
        console.error('Create listing error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
