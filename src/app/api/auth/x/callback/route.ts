
import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/x-oauth'
import { cookies } from 'next/headers'
import { encrypt } from '@/lib/encryption'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const oauth_token = searchParams.get('oauth_token')
    const oauth_verifier = searchParams.get('oauth_verifier')
    const denied = searchParams.get('denied')

    if (denied) {
        return NextResponse.redirect(new URL('/?error=access_denied', request.url))
    }

    const oauth_token_secret_cookie = (await cookies()).get('oauth_token_secret')

    if (!oauth_token || !oauth_verifier || !oauth_token_secret_cookie) {
        return NextResponse.json({ error: 'Missing parameters or session expired' }, { status: 400 })
    }

    try {
        const {
            oauth_token: accessToken,
            oauth_token_secret: accessTokenSecret,
            user_id,
            screen_name
        } = await getAccessToken(oauth_token, oauth_token_secret_cookie.value, oauth_verifier)

        // Encrypt tokens
        const tokens = JSON.stringify({ oauth_token: accessToken, oauth_token_secret: accessTokenSecret })
        const encryptedTokens = encrypt(tokens)

        // Set a secure httpOnly cookie with the pending X data
        // The frontend will then prompt the user to "Connect Wallet" to finalize registration
        // or if the user is ALREADY authenticated via wallet (has a session cookie), 
        // we could update the DB directly here.
        // But since we don't have the wallet session logic implemented yet, we'll return a "pending" state.

        // We'll set the cookie on the response
        const response = NextResponse.redirect(new URL('/onboarding/link-wallet', request.url))

        response.cookies.set('x_auth_pending', JSON.stringify({
            x_user_id: user_id,
            screen_name,
            encrypted_tokens: encryptedTokens
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 // 1 hour
        })

        return response

    } catch (error) {
        console.error('Callback error:', error)
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }
}
