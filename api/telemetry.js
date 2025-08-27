import { withCORS, handlePreflight } from "./_utils/cors.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  withCORS(req, res);

  try {
    console.log("TELEMETRY", req.body || null);
  } catch {}
  res.status(200).json({ ok: true });
}
