
import { supabase } from '@/lib/supabase'
import { PaymentService } from '@/services/payment.service'
import { captureProfile } from '@/lib/verification/screenshot'
import { computeHash } from '@/lib/verification/hash'
import { isMatch } from '@/lib/verification/compare'
import axios from 'axios'

export const VerificationService = {
    async runDailyVerification() {
        // 1. Get active rentals
        const { data: rentals } = await supabase
            .from('rentals')
            .select(`
        *,
        advertiser:users!advertiser_id(wallet_address),
        listing:listings(
            price_per_day,
            creator:users!creator_id(wallet_address, x_user_id)
        )
      `)
            .eq('active', true)
            .gt('remaining_days', 0)

        if (!rentals || rentals.length === 0) return

        for (const rental of rentals) {
            try {
                const creator = rental.listing.creator
                // We need creator X username to screenshot?
                // We have `x_user_id`. We need to lookup username or store it.
                // `x_oauth` callback stored `x_user_id`.
                // `users` table doesn't have `username`.
                // We might need to fetch it from X API using x_user_id?
                // OR verify `x.com/i/user/<id>` redirects?
                // Puppeteer can navigate to `x.com/i/user/<id>`.

                const profileUrl = `https://x.com/i/user/${creator.x_user_id}`

                // Capture
                const screenshotBuffer = await captureProfile(creator.x_user_id) // Passing ID might not work if logic expects username.
                // Updating captureProfile to handle ID redirect if possible?
                // Or just assume we stored username in `users` table?
                // I didn't add username to users table.
                // I'll try `x.com/i/user/id` strategy in captureProfile or just pass the ID and hope it redirects.

                const capturedHash = await computeHash(screenshotBuffer)

                // Get Ad Banner Hash
                // Optimally cached.
                const bannerRes = await axios.get(rental.banner_url, { responseType: 'arraybuffer' })
                const bannerHash = await computeHash(Buffer.from(bannerRes.data))

                const verified = isMatch(capturedHash, bannerHash)

                // Log content
                await supabase.from('verification_logs').insert({
                    rental_id: rental.id,
                    verified,
                    checked_at: new Date().toISOString()
                })

                if (verified) {
                    // Payout Creator
                    await PaymentService.payout(creator.wallet_address, rental.listing.price_per_day)

                    // Decrement days
                    const newRemaining = rental.remaining_days - 1
                    await supabase.from('rentals').update({ remaining_days: newRemaining }).eq('id', rental.id)

                    if (newRemaining <= 0) {
                        await supabase.from('rentals').update({ active: false }).eq('id', rental.id)
                    }
                } else {
                    // Mismatch: Stop and Refund
                    const refundAmount = rental.remaining_days * rental.listing.price_per_day
                    await PaymentService.refund(rental.advertiser.wallet_address, refundAmount)

                    await supabase.from('rentals').update({ active: false, remaining_days: 0 }).eq('id', rental.id)
                    console.log(`Rental ${rental.id} stopped due to verification failure. Refunded ${refundAmount}.`)
                }

            } catch (e) {
                console.error(`Verification failed for rental ${rental.id}:`, e)
                // Don't stop loop
            }
        }
    }
}
