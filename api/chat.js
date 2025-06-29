export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Referer': process.env.REFERER,
        'X-Title': 'SkyAiTan'
      },
      body: JSON.stringify({
        model: '@preset/sky-ai-tan',
        messages: req.body.messages
      })
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('🔴 Proxy error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
