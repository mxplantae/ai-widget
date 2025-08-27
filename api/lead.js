import { withCORS, handlePreflight } from "./_utils/cors.js";

const seen = new Set(); // temporal; cambia por DB/CRM/Zapier

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  withCORS(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name = "", email = "", source = "chatbot" } = req.body || {};
  const key = email.trim().toLowerCase();
  if (!key) return res.status(400).json({ success: false, error: "Missing email" });

  if (seen.has(key)) return res.status(409).json({ success: false, error: "duplicate" });
  seen.add(key);

  // Ejemplo: envía a Zapier/CRM aquí
  // await fetch("https://hooks.zapier.com/...", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name, email, source }) });

  res.status(200).json({ success: true });
}
