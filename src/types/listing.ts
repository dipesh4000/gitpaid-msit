export interface Listing {
    id: string
    user_id: string
    username: string
    price_per_day: number
    description?: string
    followers_count?: number
    verified?: boolean
    avatar_url?: string
    banner_url?: string // Current banner or placeholder
    created_at: string
}
