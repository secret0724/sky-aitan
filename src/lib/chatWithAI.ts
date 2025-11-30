// chatWithAI.ts
import axios from 'axios'

// 🔹 1. Generate Judul Otomatis
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

// 🔹 2. Kirim gambar + prompt ke Supabase Function (Skyra Vision)
export const sendImageToVisionAI = async (imageBase64: string, prompt: string) => {
  try {
    const res = await fetch("https://kdwjufbyizbfufdymumh.functions.supabase.co/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
        prompt,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Unknown error')
    }

    return data.result || 'Berhasil dianalisis!'
  } catch (err: any) {
    console.error("Vision error:", err)
    return '❌ Gagal menganalisis gambar'
  }
}
