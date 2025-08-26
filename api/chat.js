import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://mxplantae.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages,
      stream: false,
    });

    res.status(200).json({ success: true, output_text: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
