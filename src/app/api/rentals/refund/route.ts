
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { PaymentService } from '@/services/payment.service'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const sessionToJSON = (await cookies()).get('user_session')?.value
        if (!sessionToJSON) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)

        const { rentalId } = await request.json()

        // Get rental
        const { data: rental } = await supabase
            .from('rentals')
            .select(`*, advertiser:users!advertiser_id(wallet_address)`) // need wallet to refund
            .eq('id', rentalId)
            .single() // RLS should handle auth but we double check

        if (!rental) {
            return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
        }

        // Only advertiser can cancel/refund their own rental?
        // Or Creator? "Instant stop + refund if banner removed" (System)
        // Advertiser can "Stop" -> Refund remaining.
        if (rental.advertiser_id !== session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        if (!rental.active) {
            return NextResponse.json({ error: 'Rental not active' }, { status: 400 })
        }

        // Calculate refund
        const refundAmount = rental.remaining_days * rental.listing.price_per_day // Need price_per_day from listing logic?
        // We didn't fetch listing price.
        // Fetch again with listing
        const { data: rentalWithListing } = await supabase
            .from('rentals')
            .select(`*, listing:listings(price_per_day)`)
            .eq('id', rentalId)
            .single()

        const price = rentalWithListing.listing.price_per_day;
        const amount = rental.remaining_days * price

        // Process Refund
        await PaymentService.refund(rental.advertiser.wallet_address, amount)

        // Deactivate
        await supabase.from('rentals').update({ active: false, remaining_days: 0 }).eq('id', rentalId)

        return NextResponse.json({ success: true, refundedAmount: amount })

    } catch (error: any) {
        console.error('Refund error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
