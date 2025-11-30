// chatWithAI.ts
import axios from "axios"

// ==========================
// 🔹 Generate Judul Chat
// ==========================
export const generateTitle = async (message: string) => {
  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
    import.meta.env.VITE_GEMINI_API_KEY

  const res = await axios.post(url, {
    contents: [
      {
        role: "user",
        parts: [
          { text: `Buat judul singkat maksimal 4 kata berdasarkan isi pesan ini: ${message}` }
        ]
      }
    ]
  })

  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Chat Baru"
}

// ==========================
// 🔹 Chat + Vision Gemini
// ==========================
export const chatWithAI = async (text: string, imageBase64?: string) => {
  try {
    const parts: any[] = []

    if (text) parts.push({ text })

    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64.replace(/^data:image\/\w+;base64,/, "")
        }
      })
    }

    const url =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
      import.meta.env.VITE_GEMINI_API_KEY

    const res = await axios.post(url, {
      contents: [{ role: "user", parts }]
    })

    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI tidak memberikan respons."
  } catch (error) {
    console.error("Gemini Error:", error)
    return "❌ Gagal terhubung ke AI Gemini."
  }
}
