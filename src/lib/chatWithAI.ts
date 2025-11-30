// chatWithAI.ts
import axios from "axios"

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
  import.meta.env.VITE_GEMINI_API_KEY

// ==========================
// 🔹 Generate Judul Chat
// ==========================
export const generateTitle = async (message: string) => {
  try {
    const res = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            { text: `Buat judul singkat maksimal 4 kata berdasarkan pesan ini: ${message}` }
          ]
        }
      ]
    })

    return (
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Chat Baru"
    )
  } catch (e) {
    console.error("Gemini Title Error:", e)
    return "Chat Baru"
  }
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

    const res = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts
        }
      ]
    })

    return (
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI tidak memberikan respons."
    )
  } catch (error) {
    console.error("Gemini Error:", error)
    return "❌ Gagal terhubung ke AI Gemini."
  }
}
