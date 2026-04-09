import express from 'express'
import pool from '../db.js'

const router = express.Router()

// Create a new card
router.post('/', async (req, res) => {
  const { user_id, recipient_name, sender_name, message, design_id, music_id, stickers } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO cards (user_id, recipient_name, sender_name, message, design_id, music_id, stickers)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id || null, recipient_name, sender_name, message, design_id, music_id, JSON.stringify(stickers || [])]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create card' })
  }
})

// Get a single card by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cards WHERE id = $1', [req.params.id])
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
