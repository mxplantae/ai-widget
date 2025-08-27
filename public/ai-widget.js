(function () {
  window.AIPlantaeWidgetVersion = "mxp-001";
  console.log("[AI Plantae Widget] Loaded v" + window.AIPlantaeWidgetVersion);
  if (document.getElementById("ai-plantae-btn")) return;
  var btn = document.createElement("button");
  btn.id = "ai-plantae-btn";
  btn.textContent = "AI Plantae";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "12px 18px";
  btn.style.background = "#2e7d32";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  btn.style.cursor = "pointer";
  btn.style.fontFamily = "sans-serif";
  btn.style.fontSize = "14px";
  btn.addEventListener("click", function () {
    alert("🌿 AI Plantae Widget is working (version " + window.AIPlantaeWidgetVersion + ")");
  });
  document.body.appendChild(btn);
})();
