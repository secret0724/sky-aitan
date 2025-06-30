// summaryTitle.ts
import axios from 'axios'

export const generateTitle = async (message: string) => {
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistralai/mixtral-8x7b',
      messages: [
        {
          role: 'system',
          content: 'Buat judul singkat yang cocok untuk merangkum isi pesan user. Maksimal 4 kata. Jangan pakai tanda kutip atau kata "judul:".'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 20,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  )

  return res.data.choices[0].message.content.trim()
}
