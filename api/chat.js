import { withCORS, handlePreflight } from "./_utils/cors.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  withCORS(req, res);

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const input = messages.map(m => `${(m.role || "user").toUpperCase()}: ${m.content || ""}`).join("\n");

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        input
      })
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(500).json({ success: false, error: j || "openai_error" });
    }

    const output_text =
      j.output_text ||
      (Array.isArray(j.output)
        ? j.output.map(x => x?.content?.[0]?.text?.value || "").join("\n")
        : "");

    return res.status(200).json({ success: true, output_text });
  } catch (e) {
    return res.status(500).json({ success: false, error: String(e) });
  }
}
