import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { MongoClient, ObjectId } from 'mongodb'

dotenv.config()

const {
  PORT = '4000',
  MONGODB_URI,
  MONGODB_DB_NAME = 'gigsync',
  JWT_SECRET = 'gigsync-local-dev-secret-change-me',
  CLIENT_ORIGINS = 'http://localhost:5173,http://localhost:5174,http://localhost:5175',
  ADMIN_EMAIL = 'admin@gigsync.ai',
  ADMIN_PASSWORD = 'admin123',
  ADMIN_NAME = 'GigSync Admin',
} = process.env

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in backend/.env')
}

const allowedOrigins = CLIENT_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
const mongoClient = new MongoClient(MONGODB_URI)

const PLAN_MAX_PAYOUTS = {
  Basic: 1200,
  Standard: 1500,
  Plus: 1800,
  Premium: 2500,
  Elite: 3200,
}

const EVENT_PAYOUT_WEIGHTS = {
  'Heavy Rain': 0.78,
  'Extreme Heat': 0.62,
  'Air Pollution': 0.84,
  'Zone Closure': 0.4,
}

const RISK_WEIGHTS = {
  Low: 0.35,
  Moderate: 0.58,
  High: 0.8,
  Severe: 0.92,
}

let database
let usersCollection

const app = express()

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  }
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

function normalizeClaimStatus(status) {
  if (status === 'Paid' || status === 'Rejected' || status === 'Processing') {
    return status
  }

  if (status === 'Approved') {
    return 'Paid'
  }

  if (status === 'Completed') {
    return 'Paid'
  }

  return 'Processing'
}

function buildPayoutFromClaim(claim) {
  const payoutAmount = Number(claim.payout) || 0
  return {
    id: `PAY-${String(Date.now()).slice(-8)}`,
    claimId: claim.id,
    date: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
    reason: claim.disruption,
    amount: payoutAmount,
    method: claim.paymentMethod || 'UPI',
    status: 'Completed',
  }
}

async function settleActiveClaimIfNeeded(user) {
  if (!user || user.role !== 'rider' || !user.activeClaim) {
    return user
  }

  const normalizedActiveClaim = normalizeClaimEntry(user.activeClaim)
  if (!normalizedActiveClaim) {
    return user
  }

  const finalStatus = normalizeClaimStatus(normalizedActiveClaim.status)
  if (finalStatus !== 'Paid' && finalStatus !== 'Rejected') {
    return user
  }

  const settledClaim = {
    ...normalizedActiveClaim,
    status: finalStatus,
  }
  const existingHistory = Array.isArray(user.claimHistory) ? user.claimHistory : []
  const hasInHistory = existingHistory.some(entry => normalizeClaimEntry(entry)?.id === settledClaim.id)
  const nextHistory = hasInHistory ? existingHistory : [settledClaim, ...existingHistory]

  const updates = {
    activeClaim: null,
    claimHistory: nextHistory,
  }

  if (finalStatus === 'Paid') {
    const existingPayoutHistory = Array.isArray(user.payoutHistory) ? user.payoutHistory : []
    const hasPayoutForClaim = existingPayoutHistory.some(entry => entry && entry.claimId === settledClaim.id)

    if (!hasPayoutForClaim) {
      const payoutEntry = buildPayoutFromClaim(settledClaim)
      updates.payoutHistory = [payoutEntry, ...existingPayoutHistory]
      updates.totalPayouts = (Number(user.totalPayouts) || 0) + (Number(settledClaim.payout) || 0)
    }
  }

  await usersCollection.updateOne(
    { _id: user._id, 'activeClaim.id': settledClaim.id },
    { $set: updates },
  )

  return await usersCollection.findOne({ _id: user._id })
}

function normalizeClaimEntry(entry, index = 0) {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  return {
    id: entry.id || `CLM-${String(index + 1).padStart(3, '0')}`,
    date: entry.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    disruption: entry.disruption || 'Heavy Rain',
    location: entry.location || 'Unknown Zone',
    incomeLoss: Number(entry.incomeLoss) || 0,
    payout: Number(entry.payout) || 0,
    status: normalizeClaimStatus(entry.status),
    rainfallMm: typeof entry.rainfallMm === 'number' ? entry.rainfallMm : undefined,
    ordersDropped: typeof entry.ordersDropped === 'number' ? entry.ordersDropped : undefined,
    paymentMethod: entry.paymentMethod || undefined,
    txnId: entry.txnId || undefined,
    aqiLevel: typeof entry.aqiLevel === 'number' ? entry.aqiLevel : undefined,
  }
}

function roundToNearestTen(value) {
  return Math.max(0, Math.round(value / 10) * 10)
}

function parseMetricValue(metricValue) {
  const parsedValue = Number.parseFloat(String(metricValue ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(parsedValue) ? parsedValue : undefined
}

function buildSimulatedClaim(user, payload) {
  const {
    eventType,
    location,
    riskLevel,
    probability,
    metricValue,
  } = payload

  const maxPayout = PLAN_MAX_PAYOUTS[user.selectedPlan] ?? PLAN_MAX_PAYOUTS.Plus
  const eventWeight = EVENT_PAYOUT_WEIGHTS[eventType] ?? 0.55
  const riskWeight = RISK_WEIGHTS[riskLevel] ?? 0.5
  const probabilityWeight = Math.min(Math.max(Number(probability) || 0, 5), 100) / 100
  const payoutRatio = Math.min(1, (eventWeight + riskWeight + probabilityWeight) / 3)
  const payout = Math.min(maxPayout, roundToNearestTen(maxPayout * payoutRatio))
  const incomeLoss = Math.max(payout, roundToNearestTen(payout * 1.18))
  const normalizedLocation = location && location !== 'All Zones' && location !== 'None'
    ? location
    : `${user.city || 'Coverage'} Zone`
  const metricNumber = parseMetricValue(metricValue)
  const claimSuffix = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`

  const claim = {
    id: `CLM-${claimSuffix}`,
    date: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
    disruption: eventType,
    location: normalizedLocation,
    incomeLoss,
    payout,
    status: 'Processing',
    ordersDropped: Math.max(1, Math.min(8, Math.round((Number(probability) || 20) / 14))),
  }

  if (eventType === 'Heavy Rain' && typeof metricNumber === 'number') {
    claim.rainfallMm = metricNumber
  }

  if (eventType === 'Air Pollution' && typeof metricNumber === 'number') {
    claim.aqiLevel = metricNumber
  }

  return { claim, maxPayout }
}

function mapUser(user) {
  const payoutHistory = Array.isArray(user.payoutHistory)
    ? user.payoutHistory.map(entry => ({
      id: entry.id,
      date: entry.date,
      claimId: entry.claimId,
      reason: entry.reason,
      amount: Number(entry.amount) || 0,
      method: entry.method,
      status: entry.status,
    }))
    : []

  const claimHistory = Array.isArray(user.claimHistory)
    ? user.claimHistory
      .map((entry, index) => normalizeClaimEntry(entry, index))
      .filter(Boolean)
    : []

  const activeClaim = normalizeClaimEntry(user.activeClaim)
  const payoutHistoryTotal = payoutHistory.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0)
  const paidClaimsTotal = claimHistory
    .filter(entry => entry.status === 'Paid')
    .reduce((sum, entry) => sum + (Number(entry.payout) || 0), 0)
    + (activeClaim?.status === 'Paid' ? (Number(activeClaim.payout) || 0) : 0)
  const persistedTotal = Number(user.totalPayouts) || 0
  const totalPayouts = Math.max(persistedTotal, payoutHistoryTotal, paidClaimsTotal)

  return {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
    selectedPlan: user.selectedPlan ?? null,
    platform: user.platform ?? null,
    city: user.city ?? null,
    totalPayouts,
    payoutHistory,
    activeClaim,
    claimHistory,
    blocked: Boolean(user.blocked),
    blockedAt: user.blockedAt ?? null,
    createdAt: user.createdAt,
  }
}

function mapClaimToAdminRow(user, claimEntry, source) {
  const normalized = normalizeClaimEntry(claimEntry)
  if (!normalized) {
    return null
  }

  return {
    id: normalized.id,
    riderId: user._id.toString(),
    riderName: user.name,
    zone: normalized.location || `${user.city || 'Coverage'} Zone`,
    disruption: normalized.disruption || 'Heavy Rain',
    amount: Number(normalized.payout) || 0,
    status: normalized.status,
    triggeredAt: normalized.date,
    autoTriggered: source === 'history',
  }
}

function buildAdminClaims(riderUsers) {
  const claims = []

  riderUsers.forEach(user => {
    const activeClaim = mapClaimToAdminRow(user, user.activeClaim, 'active')
    if (activeClaim) {
      claims.push(activeClaim)
    }

    const historyEntries = Array.isArray(user.claimHistory) ? user.claimHistory : []
    historyEntries.forEach(entry => {
      const mapped = mapClaimToAdminRow(user, entry, 'history')
      if (mapped) {
        claims.push(mapped)
      }
    })
  })

  claims.sort((a, b) => {
    const first = Number.parseInt(String(a.id).replace(/\D/g, ''), 10)
    const second = Number.parseInt(String(b.id).replace(/\D/g, ''), 10)
    const firstSafe = Number.isFinite(first) ? first : 0
    const secondSafe = Number.isFinite(second) ? second : 0
    return secondSafe - firstSafe
  })

  return claims
}

async function connectDatabase() {
  if (database && usersCollection) {
    return
  }

  await mongoClient.connect()
  database = mongoClient.db(MONGODB_DB_NAME)
  usersCollection = database.collection('users')
  await usersCollection.createIndex({ email: 1 }, { unique: true })
}

async function ensureAdminUser() {
  const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL.toLowerCase() })
  if (existingAdmin) {
    return
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await usersCollection.insertOne({
    role: 'admin',
    name: ADMIN_NAME,
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  })
}

async function findUserBySessionToken(req) {
  const token = req.cookies?.gigsync_session
  if (!token) {
    return null
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return await usersCollection.findOne({ _id: new ObjectId(payload.sub) })
  } catch {
    return null
  }
}

async function requireSession(req, res, next) {
  const user = await findUserBySessionToken(req)
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' })
    return
  }

  req.sessionUser = user
  next()
}

function setSessionCookie(res, user) {
  const token = createToken(user)
  res.cookie('gigsync_session', token, getCookieOptions())
}

app.get('/api/health', async (_req, res) => {
  res.json({ status: 'ok', store: 'mongodb' })
})

app.post('/api/auth/rider/signup', async (req, res) => {
  const { name, email, password, selectedPlan, platform, city } = req.body ?? {}

  if (!name || !email || !password || !selectedPlan || !platform || !city) {
    res.status(400).json({ message: 'Name, email, password, selected plan, platform, and city are required.' })
    return
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const existingUser = await usersCollection.findOne({ email: normalizedEmail })
  if (existingUser) {
    res.status(409).json({ message: 'A user with this email already exists.' })
    return
  }

  const passwordHash = await bcrypt.hash(String(password), 10)
  const insertResult = await usersCollection.insertOne({
    role: 'rider',
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    selectedPlan: String(selectedPlan).trim(),
    platform: String(platform).trim(),
    city: String(city).trim(),
    totalPayouts: 0,
    payoutHistory: [],
    activeClaim: null,
    claimHistory: [],
    blocked: false,
    blockedAt: null,
    createdAt: new Date().toISOString(),
  })

  const createdUser = await usersCollection.findOne({ _id: insertResult.insertedId })
  setSessionCookie(res, createdUser)
  res.status(201).json({ user: mapUser(createdUser) })
})

app.post('/api/auth/rider/login', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' })
    return
  }

  const user = await usersCollection.findOne({ email: String(email).trim().toLowerCase(), role: 'rider' })
  if (!user) {
    res.status(401).json({ message: 'Invalid rider credentials.' })
    return
  }

  const isPasswordValid = await bcrypt.compare(String(password), user.passwordHash)
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Invalid rider credentials.' })
    return
  }

  if (user.blocked) {
    res.status(403).json({ message: 'Your rider account has been blocked by admin.' })
    return
  }

  setSessionCookie(res, user)
  res.json({ user: mapUser(user) })
})

app.post('/api/auth/admin/login', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' })
    return
  }

  const user = await usersCollection.findOne({ email: String(email).trim().toLowerCase(), role: 'admin' })
  if (!user) {
    res.status(401).json({ message: 'Invalid admin credentials.' })
    return
  }

  const isPasswordValid = await bcrypt.compare(String(password), user.passwordHash)
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Invalid admin credentials.' })
    return
  }

  setSessionCookie(res, user)
  res.json({ user: mapUser(user) })
})

app.get('/api/auth/session', requireSession, async (req, res) => {
  const resolvedUser = req.sessionUser.role === 'rider'
    ? await settleActiveClaimIfNeeded(req.sessionUser)
    : req.sessionUser

  if (resolvedUser.role === 'rider' && resolvedUser.blocked) {
    res.clearCookie('gigsync_session', getCookieOptions())
    res.status(403).json({ message: 'Your rider account has been blocked by admin.' })
    return
  }

  res.json({ user: mapUser(resolvedUser) })
})

app.get('/api/admin/riders', requireSession, async (req, res) => {
  if (req.sessionUser.role !== 'admin') {
    res.status(403).json({ message: 'Only admins can access riders.' })
    return
  }

  const riderUsersRaw = await usersCollection
    .find({ role: 'rider' })
    .sort({ createdAt: -1 })
    .toArray()

  const riderUsers = []
  for (const riderUser of riderUsersRaw) {
    riderUsers.push(await settleActiveClaimIfNeeded(riderUser))
  }

  res.json({ riders: riderUsers.map(mapUser) })
})

app.get('/api/admin/claims', requireSession, async (req, res) => {
  if (req.sessionUser.role !== 'admin') {
    res.status(403).json({ message: 'Only admins can access claims.' })
    return
  }

  const riderUsersRaw = await usersCollection
    .find({ role: 'rider' })
    .sort({ createdAt: -1 })
    .toArray()

  const riderUsers = []
  for (const riderUser of riderUsersRaw) {
    riderUsers.push(await settleActiveClaimIfNeeded(riderUser))
  }

  res.json({ claims: buildAdminClaims(riderUsers) })
})

app.patch('/api/admin/claims/:claimId/status', requireSession, async (req, res) => {
  if (req.sessionUser.role !== 'admin') {
    res.status(403).json({ message: 'Only admins can verify claims.' })
    return
  }

  const claimId = String(req.params.claimId || '').trim()
  const riderId = String(req.body?.riderId || '').trim()
  const requestedStatusInput = String(req.body?.status || '').trim()
  const requestedStatus = requestedStatusInput === 'Approved' || requestedStatusInput === 'Rejected' || requestedStatusInput === 'Processing'
    ? requestedStatusInput
    : null

  if (!claimId) {
    res.status(400).json({ message: 'Claim id is required.' })
    return
  }

  if (!requestedStatus) {
    res.status(400).json({ message: 'Status must be Approved, Rejected, or Processing.' })
    return
  }

  const claimQuery = {
    role: 'rider',
    $or: [
      { 'activeClaim.id': claimId },
      { 'claimHistory.id': claimId },
    ],
  }

  if (riderId) {
    if (!ObjectId.isValid(riderId)) {
      res.status(400).json({ message: 'Invalid rider id.' })
      return
    }

    claimQuery._id = new ObjectId(riderId)
  }

  const rider = await usersCollection.findOne(claimQuery)

  if (!rider) {
    res.status(404).json({ message: 'Claim not found.' })
    return
  }

  let updateResult
  if (rider.activeClaim?.id === claimId) {
    const activeClaim = normalizeClaimEntry(rider.activeClaim)
    if (!activeClaim) {
      res.status(404).json({ message: 'Claim not found.' })
      return
    }

    if (requestedStatus === 'Approved') {
      const paidClaim = {
        ...activeClaim,
        status: 'Paid',
        paymentMethod: activeClaim.paymentMethod || 'UPI',
        txnId: activeClaim.txnId || `TXN-${Date.now().toString().slice(-8)}`,
      }

      const payoutEntry = {
        id: `PAY-${String(Date.now()).slice(-8)}`,
        date: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
        reason: paidClaim.disruption,
        amount: Number(paidClaim.payout) || 0,
        method: paidClaim.paymentMethod,
        status: 'Completed',
      }

      const existingHistory = Array.isArray(rider.claimHistory) ? rider.claimHistory : []
      const existingPayoutHistory = Array.isArray(rider.payoutHistory) ? rider.payoutHistory : []
      const currentTotalPayouts = Number(rider.totalPayouts) || 0

      updateResult = await usersCollection.updateOne(
        { _id: rider._id, 'activeClaim.id': claimId },
        {
          $set: {
            activeClaim: null,
            claimHistory: [paidClaim, ...existingHistory],
            payoutHistory: [payoutEntry, ...existingPayoutHistory],
            totalPayouts: currentTotalPayouts + (Number(paidClaim.payout) || 0),
          },
        },
      )
    } else if (requestedStatus === 'Rejected') {
      const rejectedClaim = {
        ...activeClaim,
        status: 'Rejected',
      }

      const existingHistory = Array.isArray(rider.claimHistory) ? rider.claimHistory : []
      updateResult = await usersCollection.updateOne(
        { _id: rider._id, 'activeClaim.id': claimId },
        {
          $set: {
            activeClaim: null,
            claimHistory: [rejectedClaim, ...existingHistory],
          },
        },
      )
    } else {
      updateResult = await usersCollection.updateOne(
        { _id: rider._id, 'activeClaim.id': claimId },
        { $set: { 'activeClaim.status': 'Processing' } },
      )
    }
  } else {
    const finalStatus = requestedStatus === 'Approved' ? 'Paid' : requestedStatus
    updateResult = await usersCollection.updateOne(
      { _id: rider._id, 'claimHistory.id': claimId },
      { $set: { 'claimHistory.$.status': finalStatus } },
    )
  }

  if (!updateResult || updateResult.matchedCount === 0) {
    res.status(404).json({ message: 'Claim not found.' })
    return
  }

  const updatedRider = await usersCollection.findOne({ _id: rider._id })
  const adminClaims = buildAdminClaims(updatedRider ? [updatedRider] : [])
  const updatedClaim = adminClaims.find(item => item.id === claimId) || null

  res.json({ claim: updatedClaim })
})

app.patch('/api/admin/claims/:claimId/block-rider', requireSession, async (req, res) => {
  if (req.sessionUser.role !== 'admin') {
    res.status(403).json({ message: 'Only admins can block riders.' })
    return
  }

  const claimId = String(req.params.claimId || '').trim()
  const riderId = String(req.body?.riderId || '').trim()

  if (!claimId) {
    res.status(400).json({ message: 'Claim id is required.' })
    return
  }

  const query = {
    role: 'rider',
    $or: [
      { 'activeClaim.id': claimId },
      { 'claimHistory.id': claimId },
    ],
  }

  if (riderId) {
    if (!ObjectId.isValid(riderId)) {
      res.status(400).json({ message: 'Invalid rider id.' })
      return
    }

    query._id = new ObjectId(riderId)
  }

  const rider = await usersCollection.findOne(query)
  if (!rider) {
    res.status(404).json({ message: 'Claim or rider not found.' })
    return
  }

  const activeClaim = normalizeClaimEntry(rider.activeClaim)
  const historyClaim = Array.isArray(rider.claimHistory)
    ? rider.claimHistory.map((entry, index) => normalizeClaimEntry(entry, index)).find(entry => entry && entry.id === claimId)
    : null
  const targetClaim = activeClaim?.id === claimId ? activeClaim : historyClaim
  const status = normalizeClaimStatus(targetClaim?.status)

  if (!targetClaim || status !== 'Paid') {
    res.status(400).json({ message: 'Only paid claims can be blocked.' })
    return
  }

  await usersCollection.updateOne(
    { _id: rider._id },
    {
      $set: {
        blocked: true,
        blockedAt: new Date().toISOString(),
      },
    },
  )

  const updatedRider = await usersCollection.findOne({ _id: rider._id })
  res.json({ rider: mapUser(updatedRider) })
})

app.patch('/api/admin/riders/:riderId/unblock', requireSession, async (req, res) => {
  if (req.sessionUser.role !== 'admin') {
    res.status(403).json({ message: 'Only admins can unblock riders.' })
    return
  }

  const riderId = String(req.params.riderId || '').trim()
  if (!ObjectId.isValid(riderId)) {
    res.status(400).json({ message: 'Invalid rider id.' })
    return
  }

  const updateResult = await usersCollection.updateOne(
    { _id: new ObjectId(riderId), role: 'rider' },
    {
      $set: {
        blocked: false,
        blockedAt: null,
      },
    },
  )

  if (!updateResult || updateResult.matchedCount === 0) {
    res.status(404).json({ message: 'Rider not found.' })
    return
  }

  const updatedRider = await usersCollection.findOne({ _id: new ObjectId(riderId) })
  res.json({ rider: mapUser(updatedRider) })
})

app.post('/api/rider/claims/simulate', requireSession, async (req, res) => {
  if (req.sessionUser.role !== 'rider') {
    res.status(403).json({ message: 'Only riders can trigger claims.' })
    return
  }

  if (req.sessionUser.blocked) {
    res.status(403).json({ message: 'Your rider account has been blocked by admin.' })
    return
  }

  const { eventType, location, riskLevel, probability, metricValue } = req.body ?? {}

  if (!eventType || !riskLevel) {
    res.status(400).json({ message: 'Event type and risk level are required.' })
    return
  }

  const { claim, maxPayout } = buildSimulatedClaim(req.sessionUser, {
    eventType: String(eventType),
    location: String(location ?? ''),
    riskLevel: String(riskLevel),
    probability: Number(probability) || 0,
    metricValue,
  })

  const existingHistory = Array.isArray(req.sessionUser.claimHistory) ? req.sessionUser.claimHistory : []
  const previousActiveClaim = normalizeClaimEntry(req.sessionUser.activeClaim)
  const updatedHistory = previousActiveClaim ? [previousActiveClaim, ...existingHistory] : existingHistory

  await usersCollection.updateOne(
    { _id: req.sessionUser._id },
    {
      $set: {
        activeClaim: claim,
        claimHistory: updatedHistory,
      },
    },
  )

  const updatedUser = await usersCollection.findOne({ _id: req.sessionUser._id })
  if (!updatedUser) {
    res.status(500).json({ message: 'Unable to save claim for this rider.' })
    return
  }

  res.status(201).json({ user: mapUser(updatedUser), claim, maxPayout })
})

app.post('/api/auth/logout', async (_req, res) => {
  res.clearCookie('gigsync_session', getCookieOptions())
  res.status(204).end()
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error.' })
})

async function startServer() {
  await connectDatabase()
  await ensureAdminUser()

  app.listen(Number(PORT), () => {
    console.log(`GigSync backend listening on http://localhost:${PORT} (MongoDB)`)
  })
}

startServer().catch(error => {
  console.error('Failed to start GigSync backend:', error)
  process.exit(1)
})
