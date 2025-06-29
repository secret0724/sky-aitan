// api/chat.js
const fetch = (...args) => import('node-fetch').then(res => res.default(...args))

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        Referer: process.env.REFERER,
        'X-Title': 'SkyAiTan'
      },
      body: JSON.stringify({
        model: '@preset/sky-ai-tan',
        messages: req.body.messages
      })
    })

    const data = await r.json()
    res.status(r.status).json(data)
  } catch (e) {
    console.error('API ERROR:', e)
    res.status(500).json({ error: 'Server Error', detail: e.message })
  }
}
