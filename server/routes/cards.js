import express from 'express'
import pool from '../db.js'

const router = express.Router()

const LIMITS = { name: 40, message: 140, id: 64 }
const SLUG = /^[a-z0-9-]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Trim an optional string field; returns null when empty, or an error string when invalid
function cleanText(value, max, label) {
  if (value == null || value === '') return { value: null }
  if (typeof value !== 'string') return { error: `${label} must be text` }
  const trimmed = value.trim()
  if (trimmed.length > max) return { error: `${label} must be ${max} characters or fewer` }
  return { value: trimmed || null }
}

function cleanSlug(value, label) {
  if (value == null || value === '') return { value: null }
  if (typeof value !== 'string' || value.length > LIMITS.id || !SLUG.test(value)) {
    return { error: `${label} is not valid` }
  }
  return { value }
}

// Create a new card
router.post('/', async (req, res) => {
  const body = req.body || {}
  const type = body.type ?? 'preset'
  if (type !== 'preset' && type !== 'custom') {
    return res.status(400).json({ error: 'type must be "preset" or "custom"' })
  }

  const fields = {
    preset_id: cleanSlug(body.preset_id, 'preset_id'),
    to_name:   cleanText(body.to_name, LIMITS.name, 'To'),
    from_name: cleanText(body.from_name, LIMITS.name, 'From'),
    message:   cleanText(body.message, LIMITS.message, 'Message'),
    music_id:  cleanSlug(body.music_id, 'music_id'),
    theme:     cleanSlug(body.theme, 'theme'),
  }
  const invalid = Object.values(fields).find(f => f.error)
  if (invalid) return res.status(400).json({ error: invalid.error })
  if (type === 'preset' && !fields.preset_id.value) {
    return res.status(400).json({ error: 'preset_id is required for preset cards' })
  }
  if (!fields.message.value) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const cardData = type === 'custom' && body.card_data ? JSON.stringify(body.card_data) : null

  try {
    const result = await pool.query(
      `INSERT INTO cards (user_id, type, preset_id, to_name, from_name, message, music_id, card_data, theme)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, type, preset_id, to_name, from_name, message, music_id, card_data, theme, created_at`,
      [
        body.user_id || null,
        type,
        fields.preset_id.value,
        fields.to_name.value,
        fields.from_name.value,
        fields.message.value,
        fields.music_id.value,
        cardData,
        fields.theme.value,
      ]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create card' })
  }
})

// Get a single card by id
router.get('/:id', async (req, res) => {
  if (!UUID.test(req.params.id)) return res.status(404).json({ error: 'Card not found' })
  try {
    const result = await pool.query(
      `SELECT id, type, preset_id, to_name, from_name, message, music_id, card_data, theme, created_at
       FROM cards
       WHERE id = $1 AND (expires_at IS NULL OR expires_at > now())`,
      [req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Card not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch card' })
  }
})

// Get all cards for a user
router.get('/user/:user_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cards WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.user_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch cards' })
  }
})

export default router
