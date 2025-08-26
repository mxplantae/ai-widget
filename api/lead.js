let leads = []; // Memoria (para producción conecta a DB o Sheets)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://mxplantae.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, error: "Faltan datos" });

  if (leads.find(l => l.email === email)) {
    return res.status(409).json({ success: false, error: "Cliente ya registrado" });
  }

  leads.push({ name, email, createdAt: Date.now() });
  res.status(200).json({ success: true, message: "Lead registrado" });
}
