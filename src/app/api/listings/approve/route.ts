
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { BannerService } from '@/services/banner.service'

export async function POST(request: NextRequest) {
    try {
        const sessionToJSON = (await cookies()).get('user_session')?.value
        if (!sessionToJSON) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)

        const { rentalId } = await request.json()

        // Verify ownership: User must be the creator of the listing for this rental
        const { data: rental } = await supabase
            .from('rentals')
            .select('*, listing:listings(creator_id)')
            .eq('id', rentalId)
            .single()

        if (!rental) {
            return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
        }

        if (rental.listing.creator_id !== session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Approve
        const { error } = await supabase
            .from('rentals')
            .update({ active: true })
            .eq('id', rentalId)

        if (error) throw error

        // Trigger Banner Flip immediately if it's supposed to be active now?
        // "Automatic banner flipping".
        // If rental is active and today is covered, we should flip.
        // For simplicity, let's try to flip immediately upon approval.
        try {
            await BannerService.flipBanner(rentalId)
        } catch (e) {
            console.error("Banner flip failed on approval:", e)
            // Don't fail the approval? Or warn?
            // Maybe return warning.
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Approve rental error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
