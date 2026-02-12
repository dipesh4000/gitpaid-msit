import { NextRequest, NextResponse } from 'next/server'
import { verifyMessage } from 'ethers'
import { getDb } from '@/lib/mongodb'
import { cookies } from 'next/headers'

const MESSAGE_TEMPLATE = "Sign this message to login to Banner Marketplace: "

export async function POST(request: NextRequest) {
    try {
        const { address, signature, nonce } = await request.json()

        if (!address || !signature || !nonce) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        const message = `${MESSAGE_TEMPLATE}${nonce}`
        const recoveredAddress = verifyMessage(message, signature)

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const db = await getDb()
        const existingUser = await db.collection('users').findOne({ wallet_address: address })

        const pendingXCookie = (await cookies()).get('x_auth_pending')
        let xData = null
        if (pendingXCookie) {
            try {
                xData = JSON.parse(pendingXCookie.value)
            } catch (e) {
                console.error("Failed to parse x_auth_pending cookie")
            }
        }

        let user = existingUser

        if (!user) {
            const role = xData ? 'creator' : 'advertiser'
            const insertData: any = {
                wallet_address: address,
                role,
                created_at: new Date()
            }

            if (xData) {
                insertData.x_user_id = xData.x_user_id
                insertData.encrypted_tokens = xData.encrypted_tokens
            }

            const result = await db.collection('users').insertOne(insertData)
            user = { _id: result.insertedId, ...insertData }
        } else {
            if (xData) {
                await db.collection('users').updateOne(
                    { _id: user._id },
                    { 
                        $set: {
                            x_user_id: xData.x_user_id,
                            encrypted_tokens: xData.encrypted_tokens,
                            role: 'creator'
                        }
                    }
                )
                user.x_user_id = xData.x_user_id
                user.role = 'creator'
            }
        }

        (await cookies()).set('user_session', JSON.stringify({
            id: user._id.toString(),
            wallet_address: user.wallet_address,
            role: user.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        if (xData) {
            (await cookies()).delete('x_auth_pending')
        }

        return NextResponse.json({ success: true, user })

    } catch (error) {
        console.error('Wallet auth error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
