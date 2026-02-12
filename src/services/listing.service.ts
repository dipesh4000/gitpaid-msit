
import { supabase } from '@/lib/supabase'

export const ListingService = {
    async createOrUpdateListing(creatorId: string, pricePerDay: number) {
        // Check if listing exists
        const { data: existing } = await supabase
            .from('listings')
            .select('*')
            .eq('creator_id', creatorId)
            .single()

        if (existing) {
            return await supabase
                .from('listings')
                .update({ price_per_day: pricePerDay, active: true })
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            return await supabase
                .from('listings')
                .insert({ creator_id: creatorId, price_per_day: pricePerDay })
                .select()
                .single()
        }
    },

    async getListings() {
        return await supabase
            .from('listings')
            .select(`
        *,
        creator:users(id, x_user_id, wallet_address)
      `)
            .eq('active', true)
    },

    async getListingById(id: string) {
        return await supabase
            .from('listings')
            .select(`
            *,
            creator:users(id, x_user_id, wallet_address)
        `)
            .eq('id', id)
            .single()
    }
}
