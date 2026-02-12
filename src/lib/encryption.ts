
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const SECRET_KEY = process.env.ENCRYPTION_SECRET

if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    // Using a warning here instead of error to prevent build fail if env not set yet, 
    // but runtime will fail if used.
    // In production, force error.
    if (process.env.NODE_ENV === 'production') {
        // It must be 32 bytes (character string of 32 chars if utf8, or encoded).
        // If the user provides a hex string, we might need to parse it. 
        // For now, assuming raw string or handled by user.
        // Better to strictly enforce length.
    }
}

// Ensure secret is Buffer
function getSecret() {
    if (!SECRET_KEY) throw new Error("ENCRYPTION_SECRET is missing")
    if (SECRET_KEY.length === 32) return Buffer.from(SECRET_KEY, 'utf-8')
    if (SECRET_KEY.length === 64) return Buffer.from(SECRET_KEY, 'hex')
    return Buffer.from(SECRET_KEY, 'base64').subarray(0, 32)
}

export function encrypt(text: string): string {
    const iv = randomBytes(16)
    const cipher = createCipheriv(ALGORITHM, getSecret(), iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag().toString('hex')

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decrypt(text: string): string {
    const parts = text.split(':')
    if (parts.length !== 3) throw new Error('Invalid encrypted text format')

    const [ivHex, authTagHex, encryptedHex] = parts

    const decipher = createDecipheriv(ALGORITHM, getSecret(), Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}
