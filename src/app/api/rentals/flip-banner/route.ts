
import { NextRequest, NextResponse } from 'next/server'
import { BannerService } from '@/services/banner.service'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const sessionToJSON = (await cookies()).get('user_session')?.value
        if (!sessionToJSON) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)

        // Only creator should be able to force flip? Or Admin?
        // For now, allow creator of the rental listing.

        const { rentalId } = await request.json()

        await BannerService.flipBanner(rentalId)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Force flip error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
