
import { NextResponse } from 'next/server'
import { VerificationService } from '@/services/verification.service'

export async function GET() {
    try {
        // Vercel Cron protection?
        // Usually checks for specific header `Authorization: Bearer <CRON_SECRET>` if configured.
        // For now, assuming open or relying on Vercel's trusted IP?
        // Better to check secret if in env.

        await VerificationService.runDailyVerification()

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Cron verify error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
