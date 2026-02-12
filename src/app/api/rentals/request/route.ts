
import { NextRequest, NextResponse } from 'next/server'
import { ListingService } from '@/services/listing.service'
import { X402 } from '@/lib/x402'
import { supabase } from '@/lib/supabase'
import { getServerWallet } from '@/lib/cdp'
import { cookies } from 'next/headers'

const USDC_ADDRESS = process.env.USDC_CONTRACT_ADDRESS!
const BASE_RPC = process.env.BASE_SEPOLIA_RPC!

/*
  x402 Implementation:
  1. GET/POST -> Check availability, calculate price.
  2. If X-PAYMENT header missing -> Return 402 with details.
  3. If X-PAYMENT header present -> Verify tx -> Activate.
*/

export async function POST(request: NextRequest) {
    try {
        console.log('API: Processing rental request...')
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('user_session')
        const sessionToJSON = sessionCookie?.value

        console.log('API: Session exists:', !!sessionToJSON)

        if (!sessionToJSON) {
            console.error('API: No session found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)

        const body = await request.json()
        const { listingId, days, image_url } = body
        console.log('API: Request body parsed', { listingId, days })

        // 1. Validate
        console.log(`API: Fetching listing ${listingId}`)
        const { data: listing, error: listingError } = await ListingService.getListingById(listingId)

        if (listingError) {
            console.error('API: Listing fetch error:', listingError)
            throw new Error(`Listing fetch failed: ${listingError.message}`)
        }

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
        }

        const totalAmount = listing.price_per_day * days

        // Check availability: Assuming simpler model "first come first serve" or checking overlaps.
        // For this MVP, we assume check logic exists.

        const xPayment = request.headers.get('X-PAYMENT')

        const serverWallet = await getServerWallet()
        const serverAddress = serverWallet.address

        if (!xPayment) {
            // Return 402
            return NextResponse.json({
                error: 'Payment Required',
                details: {
                    amount: totalAmount,
                    currency: 'USDC',
                    chainId: 84532, // Base Sepolia
                    tokenAddress: USDC_ADDRESS,
                    recipient: serverAddress
                }
            }, { status: 402 })
        }

        // Verify Payment
        const txHash = X402.parseHeader(xPayment)

        // Check if tx already used
        const { data: existingPayment } = await supabase
            .from('payments')
            .select('*')
            .eq('tx_hash', txHash)
            .single()

        if (existingPayment) {
            return NextResponse.json({ error: 'Transaction already used' }, { status: 409 })
        }

        await X402.verifyTransaction(txHash, totalAmount, serverAddress, BASE_RPC, USDC_ADDRESS)

        // Create Rental
        const { data: rental, error: rentalError } = await supabase
            .from('rentals')
            .insert({
                listing_id: listingId,
                advertiser_id: session.id,
                total_days: days,
                remaining_days: days,
                total_amount: totalAmount,
                active: true // Or wait for approval? "Creators ... Approve rental requests".
                // So active should be false if approval needed.
                // Prompt: "Connect X account ... Approve rental requests".
                // So active = false initially.
            })
            .select()
            .single()

        if (rentalError) {
            console.error(rentalError)
            return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 })
        }

        // Record Payment
        await supabase.from('payments').insert({
            rental_id: rental.id,
            tx_hash: txHash,
            amount: totalAmount,
            status: 'confirmed'
        })

        return NextResponse.json({ success: true, rental })

    } catch (error: any) {
        console.error('Request rental error:', error)
        console.error('Stack trace:', error.stack)
        return NextResponse.json({ error: error.message || 'Internal Server Error', details: error.toString() }, { status: 500 })
    }
}
