
import { supabase } from '@/lib/supabase'
import { decrypt } from '@/lib/encryption'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import axios from 'axios'

// We need to re-instantiate OAuth helper or import it.
// Since x-oauth.ts exports helper functions but not the `oauth` instance directly or it's not exported.
// I'll reuse the logic or export the signer from x-oauth.ts if I can.
// But I didn't export it. I'll just re-implement the signer here or import `getRequestToken` etc doesn't help with arbitrary requests.
// I should have exported a `signRequest` helper in x-oauth.ts.
// I will just re-implement the signing logic here for now to avoid modifying x-oauth.ts again and causing potential issues.
// It's short.

const CLIENT_ID = process.env.X_CLIENT_ID!
const CLIENT_SECRET = process.env.X_CLIENT_SECRET!

const oauth = new OAuth({
    consumer: { key: CLIENT_ID, secret: CLIENT_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string: crypto.BinaryLike, key: crypto.BinaryLike | crypto.KeyObject) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64')
    },
})

export const BannerService = {
    async flipBanner(rentalId: string) {
        // 1. Get Rental and User (Creator) and Listing
        const { data: rental } = await supabase
            .from('rentals')
            .select(`
        *,
        listing:listings(
            creator:users(x_user_id, encrypted_tokens)
        )
      `)
            .eq('id', rentalId)
            .single()

        if (!rental) throw new Error('Rental not found')

        const creator = rental.listing.creator
        if (!creator.encrypted_tokens) throw new Error('Creator tokens missing')

        // 2. Decrypt Tokens
        const decrypted = decrypt(creator.encrypted_tokens)
        const { oauth_token, oauth_token_secret } = JSON.parse(decrypted)

        // 3. Update Banner
        // API: POST https://api.twitter.com/1.1/account/update_profile_banner.json
        // Param: banner (base64 encoded image)

        // We need the image from the rental?
        // The rental request should have included an image_url or image_data.
        // I missed `image_url` in the rental schema!
        // "Advertisers: ... Upload banners".
        // Schema `rentals` does NOT have `image_url`.
        // Schema `listings`? No.
        // Schema provided in prompt:
        // rentals: id, listing_id, advertiser_id, total_days, remaining_days, total_amount, active, created_at
        // WHERE is the banner image stored?
        // Maybe `listings` has it? No, listing is the space.
        // Maybe it was omitted in schema description but required?
        // "Advertisers: ... Upload banners".
        // I MUST Add `banner_url` to `rentals` table.
        // I will assume it exists or I should add it.
        // Since I already wrote the schema, I should ADD a migration or just assume I can add it now.
        // I'll add a migration `20240101000001_add_banner_url.sql`.

        // For now, assuming `rental.banner_url` exists.

        // Fetch image from URL
        // We need to fetch the image and convert to base64.
        const bannerUrl = (rental as any).banner_url // Cast to any for now
        if (!bannerUrl) throw new Error('Banner URL missing')

        const imageRes = await axios.get(bannerUrl, { responseType: 'arraybuffer' })
        const bannerBase64 = Buffer.from(imageRes.data, 'binary').toString('base64')

        const requestData = {
            url: 'https://api.twitter.com/1.1/account/update_profile_banner.json',
            method: 'POST',
            data: { banner: bannerBase64 }
        }

        const token = { key: oauth_token, secret: oauth_token_secret }
        const authHeader = oauth.toHeader(oauth.authorize(requestData, token))

        try {
            await axios.post(requestData.url, new URLSearchParams(requestData.data), {
                headers: { ...authHeader, 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            return true
        } catch (e: any) {
            console.error("Failed to flip banner:", e.response?.data || e.message)
            throw new Error("Failed to update banner on X")
        }
    }
}
