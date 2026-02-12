
import { imageHash } from 'image-hash'

export function computeHash(imageBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        imageHash({ data: imageBuffer }, 16, true, (error: any, data: string) => {
            if (error) reject(error)
            else resolve(data)
        })
    })
}
