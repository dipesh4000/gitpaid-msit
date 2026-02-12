import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const ListingService = {
    async createOrUpdateListing(creatorId: string, pricePerDay: number) {
        const db = await getDb()
        const existing = await db.collection('listings').findOne({ creator_id: creatorId })

        if (existing) {
            await db.collection('listings').updateOne(
                { _id: existing._id },
                { $set: { price_per_day: pricePerDay, active: true } }
            )
            return { data: { ...existing, price_per_day: pricePerDay, active: true }, error: null }
        } else {
            const result = await db.collection('listings').insertOne({
                creator_id: creatorId,
                price_per_day: pricePerDay,
                active: true,
                created_at: new Date()
            })
            return { data: { _id: result.insertedId, creator_id: creatorId, price_per_day: pricePerDay, active: true }, error: null }
        }
    },

    async getListings() {
        const db = await getDb()
        const listings = await db.collection('listings').aggregate([
            { $match: { active: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator_id',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            { $unwind: '$creator' }
        ]).toArray()
        return { data: listings, error: null }
    },

    async getListingById(id: string) {
        const db = await getDb()
        let query: any
        
        if (ObjectId.isValid(id) && id.length === 24) {
            query = { _id: new ObjectId(id) }
        } else {
            query = { id: id }
        }
        
        const listing = await db.collection('listings').aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator_id',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } }
        ]).toArray()
        return listing[0] ? { data: listing[0], error: null } : { data: null, error: { message: 'Not found' } }
    }
}
