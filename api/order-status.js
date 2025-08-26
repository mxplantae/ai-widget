export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://mxplantae.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { order } = req.query;
  if (!order) return res.status(400).json({ success: false, error: "Falta número de pedido" });

  // Ejemplo estático
  res.status(200).json({
    success: true,
    data: {
      order,
      status: "En camino",
      carrier: "DHL",
      tracking: "1234567890",
      eta_days: 3,
    },
  });
}
