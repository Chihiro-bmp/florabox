import express from 'express'
import pool from '../db.js'

const router = express.Router()

// Create a new bouquet
router.post('/', async (req, res) => {
  const { user_id, recipient_name, sender_name, flowers, message } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO bouquets (user_id, recipient_name, sender_name, flowers, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id || null, recipient_name, sender_name, JSON.stringify(flowers || []), message]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create bouquet' })
  }
})

// Get a single bouquet by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bouquets WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Bouquet not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch bouquet' })
  }
})

// Get all bouquets for a user
router.get('/user/:user_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bouquets WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.user_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch bouquets' })
  }
})

export default router
