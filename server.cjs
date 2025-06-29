// server.cjs
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = (...args) => import('node-fetch').then(m => m.default(...args))

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const missing = []
if (!process.env.OPENROUTER_API_KEY) missing.push('OPENROUTER_API_KEY')
if (!process.env.REFERER) missing.push('REFERER')
if (missing.length) console.warn('❌ Missing ENV:', missing.join(', '))
else console.log('✅ ENV loaded')

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Referer': process.env.REFERER,
        'X-Title': 'SkyAiTan'
      },
      body: JSON.stringify({
        model: 'sky-ai-tan',
        messages: req.body.messages
      })
    })

    const data = await response.json()
    res.json(data)
  } catch (e) {
    console.error('🔴 Proxy error:', e)
    res.status(500).json({ error: e.message })
  }
})

module.exports = app
