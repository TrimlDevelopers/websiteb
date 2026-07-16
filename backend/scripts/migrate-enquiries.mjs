/**
 * Copy contactenquiries from the `test` DB into `website.Enquiries`.
 * Safe to re-run: skips docs that already exist by _id.
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}

await mongoose.connect(uri)

const client = mongoose.connection.client
const source = client.db('test').collection('contactenquiries')
const dest = client.db('website').collection('Enquiries')

const docs = await source.find().toArray()
console.log(`Found ${docs.length} docs in test.contactenquiries`)

let inserted = 0
let skipped = 0

for (const doc of docs) {
  const existing = await dest.findOne({ _id: doc._id })
  if (existing) {
    skipped += 1
    continue
  }

  let status = doc.status || 'New'
  if (status === 'In Progress') status = 'Contacted'
  if (!['New', 'Contacted', 'Closed'].includes(status)) status = 'New'

  await dest.insertOne({
    _id: doc._id,
    name: doc.name ?? '',
    email: doc.email ?? '',
    phone: doc.phone ?? '',
    company: doc.company ?? '',
    service: doc.service ?? '',
    message: doc.message ?? '',
    status,
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
    __v: doc.__v ?? 0,
  })
  inserted += 1
}

const total = await dest.countDocuments()
console.log(`Inserted: ${inserted}, skipped: ${skipped}, website.Enquiries total: ${total}`)

await mongoose.disconnect()
