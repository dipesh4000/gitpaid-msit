
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const rentalId = searchParams.get('id')

        if (!rentalId) return NextResponse.json({ error: 'Rental ID required' }, { status: 400 })

        const { data: logs } = await supabase
            .from('verification_logs')
            .select('*')
            .eq('rental_id', rentalId)
            .order('checked_at', { ascending: false })
            .limit(10)

        return NextResponse.json({ logs })

    } catch (error: any) {
        console.error('Verify status error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
