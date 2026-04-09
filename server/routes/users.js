import express from 'express'
import pool from '../db.js'

const router = express.Router()

// Create or fetch a user by username
router.post('/claim', async (req, res) => {
  const { username } = req.body
  if (!username || username.length < 2) {
    return res.status(400).json({ error: 'Username must be at least 2 characters' })
  }
  const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
  try {
    // Try to find existing user first
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [clean])
    if (existing.rows.length > 0) return res.json(existing.rows[0])

    // Otherwise create new
    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [clean]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not claim username' })
  }
})

// Check if username is available
router.get('/check/:username', async (req, res) => {
  const clean = req.params.username.toLowerCase().replace(/[^a-z0-9_]/g, '')
  try {
    const result = await pool.query('SELECT id FROM users WHERE username = $1', [clean])
    res.json({ available: result.rows.length === 0 })
  } catch (err) {
    res.status(500).json({ error: 'Could not check username' })
  }
})

// Get a user's full profile (cards + bouquets)
router.get('/:username', async (req, res) => {
  const clean = req.params.username.toLowerCase()
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [clean])
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' })

    const cards = await pool.query(
      'SELECT * FROM cards WHERE user_id = $1 ORDER BY created_at DESC',
      [user.rows[0].id]
    )
    const bouquets = await pool.query(
      'SELECT * FROM bouquets WHERE user_id = $1 ORDER BY created_at DESC',
      [user.rows[0].id]
    )

    res.json({
      user: user.rows[0],
      cards: cards.rows,
      bouquets: bouquets.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch profile' })
  }
})

export default router
