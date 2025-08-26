// api/telemetry.js
import { withCORS, handlePreflight } from "./_utils.cors.js";

export default async function handler(req, res) {
  withCORS(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    console.log("[telemetry]", JSON.stringify(body).slice(0, 2000));
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message || "Server error" });
  }
}
