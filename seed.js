// Run: node seed.js
const { MongoClient } = require('mongodb')

const uri = 'mongodb+srv://Garvit:garvit123@workbridg.1ozvwit.mongodb.net'
const client = new MongoClient(uri)

async function seed() {
    await client.connect()
    const db = client.db('banner_marketplace')
    
    await db.collection('listings').insertMany([
        {
            id: 'listing-1',
            creator_id: 'user-123',
            price_per_day: 50,
            active: true,
            created_at: new Date()
        },
        {
            id: 'listing-2',
            creator_id: 'user-456',
            price_per_day: 75,
            active: true,
            created_at: new Date()
        }
    ])
    
    console.log('Seed complete')
    await client.close()
}

seed()
