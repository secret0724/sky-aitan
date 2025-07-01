// file: api/vision.ts
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { image, caption } = req.body

    if (!image?.startsWith('data:image/')) {
      return res.status(400).json({ result: 'Format gambar tidak valid.' })
    }

    const messages = [
      { role: 'system', content: 'Kamu adalah asisten virtual bernama Skyra. Berfungsi untuk menganalisis gambar.' },
      { role: 'user', content: caption || 'Tolong analisis gambar ini.' }
    ]

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
        'Referer': process.env.VITE_REFERER || '',
        'X-Title': 'SkyAiTan'
        } as Record<string, string>,
      body: JSON.stringify({
        model: '@preset/skyra',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        tools: [],
        vision: [
          {
            type: 'image_url',
            image_url: {
              url: image
            }
          }
        ]
      })
    })

    const data = await response.json()

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || 'Gagal dapat hasil'
    })
  } catch (err) {
    console.error('[Vision API error]', err)
    res.status(500).json({
      result: 'Terjadi kesalahan saat memproses gambar.'
    })
  }
}
