import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env' });

const fallbackText = await readFile('data/fallback-users.json', 'utf8');
const fallbackUsers = JSON.parse(fallbackText);

const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
await client.connect();

const db = client.db(process.env.MONGODB_DB_NAME || 'gigsync');
const users = db.collection('users');

let upserts = 0;
for (const u of fallbackUsers) {
  if (!u || !u.email || !u.passwordHash) continue;
  const email = String(u.email).toLowerCase();
  const payload = {
    role: u.role,
    name: u.name,
    email,
    passwordHash: u.passwordHash,
    selectedPlan: u.selectedPlan ?? null,
    platform: u.platform ?? null,
    city: u.city ?? null,
    totalPayouts: Number(u.totalPayouts) || 0,
    payoutHistory: Array.isArray(u.payoutHistory) ? u.payoutHistory : [],
    activeClaim: u.activeClaim ?? null,
    claimHistory: Array.isArray(u.claimHistory) ? u.claimHistory : [],
    createdAt: u.createdAt ?? new Date().toISOString(),
  };

  const result = await users.updateOne({ email }, { $set: payload }, { upsert: true });
  if (result.upsertedCount || result.modifiedCount) {
    upserts += 1;
  }
}

const riderCount = await users.countDocuments({ role: 'rider' });
const adminCount = await users.countDocuments({ role: 'admin' });

console.log(`SYNC_OK upserts=${upserts} riders=${riderCount} admins=${adminCount}`);

await client.close();
