export async function chatWithAI(message: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + import.meta.env.VITE_OPENROUTER_API_KEY,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sky-aitan.vercel.app', // ganti sesuai domain lu
      'X-Title': 'SkyAiTan'
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo', // bisa diganti kayak 'anthropic/claude-3-haiku'
      messages: [
        { role: 'system', content: 'Kamu adalah AI asisten yang ramah.' },
        { role: 'user', content: message }
      ]
    })
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'Gagal mendapatkan balasan.'
}
