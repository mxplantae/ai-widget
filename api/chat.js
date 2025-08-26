// api/chat.js
import { withCORS, handlePreflight } from "./_utils.cors.js";

export default async function handler(req, res) {
  withCORS(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: "Missing OPENAI_API_KEY" });
  }

  try {
    const { messages = [], model = "gpt-5" } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "messages must be an array" });
    }

    // Construye un input simple desde messages
    const input = messages.map(m => `${(m.role||"user").toUpperCase()}: ${m.content||""}`).join("\n");

    const up = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, input })
    });

    const data = await up.json().catch(() => null);
    if (!up.ok) {
      return res.status(up.status).json({ success: false, error: data?.error?.message || "Upstream error" });
    }

    const text = data?.output_text || "";
    return res.status(200).json({ success: true, output_text: text });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message || "Server error" });
  }
}
