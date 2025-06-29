require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Log status ENV
const missing = []
if (!process.env.OPENROUTER_API_KEY) missing.push('OPENROUTER_API_KEY')
if (!process.env.REFERER) missing.push('REFERER')

if (missing.length) {
  console.warn(`❌ Missing ENV variables: ${missing.join(', ')}`)
} else {
  console.log('✅ All required ENV variables are loaded')
}

// Endpoint proxy ke OpenRouter
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.REFERER,
        'X-Title': 'SkyAiTan'
      },
      body: JSON.stringify({
        model: '@preset/sky-ai-tan',
        messages
      })
    })

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('🔴 Proxying error:', err)
    res.status(500).json({ error: 'Proxy server error' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at https://sky-aitan.vercel.app/api/chat`)
})
