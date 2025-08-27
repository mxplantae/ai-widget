export const ALLOWED = new Set([
  "https://www.mxplantae.com",
  "https://mxplantae.com"
]);

export function withCORS(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

export function handlePreflight(req, res) {
  if (req.method === "OPTIONS") {
    withCORS(req, res);
    res.status(204).end();
    return true;
  }
  return false;
}
