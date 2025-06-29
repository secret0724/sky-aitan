const fetch = (...args) => import('node-fetch').then(m => m.default(...args))

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const messages = req.body.messages

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        Referer: process.env.REFERER,
        'X-Title': 'SkyAiTan'
      },
      body: JSON.stringify({
        model: '@preset/sky-ai-tan',
        messages
      })
    })

    const data = await response.json()
    return res.status(200).json(data)
  } catch (e) {
    console.error('❌ Proxy Error:', e)
    return res.status(500).json({ error: 'Proxy failed' })
  }
}
