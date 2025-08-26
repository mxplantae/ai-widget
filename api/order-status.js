// api/order-status.js
import { withCORS, handlePreflight } from "./_utils.cors.js";

export default async function handler(req, res) {
  withCORS(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { order } = req.query || {};
  if (!order) {
    return res.status(400).json({ success: false, error: "Missing order parameter" });
  }

  // Mock de ejemplo
  return res.status(200).json({
    success: true,
    data: {
      order,
      status: "En tránsito",
      carrier: "Estafeta",
      tracking: "EST123456789MX",
      eta_days: 2
    }
  });
}
