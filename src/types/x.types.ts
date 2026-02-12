
export interface XTokenResponse {
    token_type: string
    expires_in: number
    access_token: string
    scope: string
    refresh_token?: string
}

export interface XUser {
    id: string
    name: string
    username: string
    profile_image_url?: string
}

export interface OAuth1Tokens {
    oauth_token: string
    oauth_token_secret: string
}
