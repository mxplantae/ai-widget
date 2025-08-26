// api/lead.js
import { withCORS, handlePreflight } from "./_utils.cors.js";

// Base en memoria (para producción conecta DB/CRM/Sheets)
globalThis.__LEADS__ = globalThis.__LEADS__ || new Map();

export default async function handler(req, res) {
  withCORS(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, source = "chatbot-10off" } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Faltan datos" });
    }
    const key = email.trim().toLowerCase();
    if (globalThis.__LEADS__.has(key)) {
      return res.status(409).json({ success: false, error: "Cliente ya registrado" });
    }
    globalThis.__LEADS__.set(key, { name, email, source, createdAt: Date.now() });
    return res.status(200).json({ success: true, message: "Lead registrado" });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message || "Server error" });
  }
}
