
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const sessionToJSON = (await cookies()).get('user_session')?.value
        if (!sessionToJSON) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)

        const { listingId } = await request.json()

        // Verify ownership
        const { data: listing } = await supabase
            .from('listings')
            .select('*')
            .eq('id', listingId)
            .single()

        if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

        if (listing.creator_id !== session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Deactivate
        await supabase
            .from('listings')
            .update({ active: false })
            .eq('id', listingId)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Cancel listing error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
