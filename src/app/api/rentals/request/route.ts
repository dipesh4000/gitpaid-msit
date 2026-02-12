import { NextRequest, NextResponse } from 'next/server'
import { ListingService } from '@/services/listing.service'
import { X402 } from '@/lib/x402'
import { getDb } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'

const USDC_ADDRESS = process.env.USDC_CONTRACT_ADDRESS!
const BASE_RPC = process.env.BASE_SEPOLIA_RPC!
const SERVER_ADDRESS = process.env.SERVER_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('user_session')
        const sessionToJSON = sessionCookie?.value

        if (!sessionToJSON) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const session = JSON.parse(sessionToJSON)

        const body = await request.json()
        const { listingId, days, image_url } = body

        const { data: listing, error: listingError } = await ListingService.getListingById(listingId)

        if (listingError || !listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
        }

        const totalAmount = listing.price_per_day * days
        const xPayment = request.headers.get('X-PAYMENT')

        if (!xPayment) {
            return NextResponse.json({
                error: 'Payment Required',
                details: {
                    amount: totalAmount,
                    currency: 'USDC',
                    chainId: 84532,
                    tokenAddress: USDC_ADDRESS,
                    recipient: SERVER_ADDRESS
                }
            }, { status: 402 })
        }

        const txHash = X402.parseHeader(xPayment)
        const db = await getDb()
        
        const existingPayment = await db.collection('payments').findOne({ tx_hash: txHash })
        if (existingPayment) {
            return NextResponse.json({ error: 'Transaction already used' }, { status: 409 })
        }

        await X402.verifyTransaction(txHash, totalAmount, SERVER_ADDRESS, BASE_RPC, USDC_ADDRESS)

        const rentalResult = await db.collection('rentals').insertOne({
            listing_id: listingId,
            advertiser_id: session.id,
            total_days: days,
            remaining_days: days,
            total_amount: totalAmount,
            active: true,
            created_at: new Date()
        })

        await db.collection('payments').insertOne({
            rental_id: rentalResult.insertedId.toString(),
            tx_hash: txHash,
            amount: totalAmount,
            status: 'confirmed',
            created_at: new Date()
        })

        return NextResponse.json({ success: true, rental: { id: rentalResult.insertedId } })

    } catch (error: any) {
        console.error('Request rental error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
