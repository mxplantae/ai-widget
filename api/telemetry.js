export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://mxplantae.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { kind, data, path, ts } = req.body;
  console.log("Telemetry:", { kind, data, path, ts });

  res.status(200).json({ success: true });
}
