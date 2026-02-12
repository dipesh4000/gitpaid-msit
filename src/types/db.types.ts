
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    wallet_address: string
                    x_user_id: string | null
                    encrypted_tokens: string | null
                    role: 'creator' | 'advertiser'
                    created_at: string
                }
                Insert: {
                    id?: string
                    wallet_address: string
                    x_user_id?: string | null
                    encrypted_tokens?: string | null
                    role: 'creator' | 'advertiser'
                    created_at?: string
                }
                Update: {
                    id?: string
                    wallet_address?: string
                    x_user_id?: string | null
                    encrypted_tokens?: string | null
                    role?: 'creator' | 'advertiser'
                    created_at?: string
                }
            }
            listings: {
                Row: {
                    id: string
                    creator_id: string
                    price_per_day: number
                    active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    creator_id: string
                    price_per_day: number
                    active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    creator_id?: string
                    price_per_day?: number
                    active?: boolean
                    created_at?: string
                }
            }
            rentals: {
                Row: {
                    id: string
                    listing_id: string
                    advertiser_id: string
                    total_days: number
                    remaining_days: number
                    total_amount: number
                    active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    listing_id: string
                    advertiser_id: string
                    total_days: number
                    remaining_days: number
                    total_amount: number
                    active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    listing_id?: string
                    advertiser_id?: string
                    total_days?: number
                    remaining_days?: number
                    total_amount?: number
                    active?: boolean
                    created_at?: string
                }
            }
            payments: {
                Row: {
                    id: string
                    rental_id: string
                    tx_hash: string
                    amount: number
                    status: 'pending' | 'confirmed' | 'failed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    rental_id: string
                    tx_hash: string
                    amount: number
                    status?: 'pending' | 'confirmed' | 'failed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    rental_id?: string
                    tx_hash?: string
                    amount?: number
                    status?: 'pending' | 'confirmed' | 'failed'
                    created_at?: string
                }
            }
            verification_logs: {
                Row: {
                    id: string
                    rental_id: string
                    verified: boolean
                    hash_distance: number | null
                    checked_at: string
                }
                Insert: {
                    id?: string
                    rental_id: string
                    verified: boolean
                    hash_distance?: number | null
                    checked_at?: string
                }
                Update: {
                    id?: string
                    rental_id?: string
                    verified: boolean
                    hash_distance?: number | null
                    checked_at?: string
                }
            }
        }
    }
}
