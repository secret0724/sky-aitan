// @ts-ignore
import { serve } from "https://deno.land/std@0.203.0/http/server.ts"

serve(async (req) => {
  try {
    const { image, prompt } = await req.json()

    if (!image || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing image or prompt" }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ result: "Gambar diterima sukses!", imageLength: image.length }),
      { status: 200 }
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
})
