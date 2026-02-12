
import { NextResponse } from 'next/server'
import { getRequestToken } from '@/lib/x-oauth'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        const { oauth_token, oauth_token_secret, oauth_callback_confirmed } = await getRequestToken()

        if (oauth_callback_confirmed !== 'true') {
            return NextResponse.json({ error: 'Callback not confirmed' }, { status: 500 })
        }

        // Store token secret in cookie (httpOnly, secure) to verify callback
        (await
            // Store token secret in cookie (httpOnly, secure) to verify callback
            cookies()).set('oauth_token_secret', oauth_token_secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 10 // 10 minutes
        })

        // Redirect user
        return NextResponse.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}`)
    } catch (error: any) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
