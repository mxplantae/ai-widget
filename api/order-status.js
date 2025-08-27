import { withCORS, handlePreflight } from "./_utils/cors.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  withCORS(req, res);

  const order = (req.query?.order || "").toString().trim();
  if (!order) {
    return res.status(400).json({ success: false, error: "Missing order" });
  }

  // Mock: conecta aquí con tu ERP real cuando quieras
  const sample = {
    order,
    status: "Procesando",
    carrier: "Estafeta",
    tracking: "ESTA123456789",
    eta_days: 2
  };

  res.status(200).json({ success: true, data: sample });
}
