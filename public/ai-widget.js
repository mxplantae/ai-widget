(function () {
  // Version marker (so you know which file is loaded)
  window.AIPlantaeWidgetVersion = "mxp-001";
  console.log("[AI Plantae Widget] Loaded v" + window.AIPlantaeWidgetVersion);

  // Prevent duplicate button if script loads twice
  if (document.getElementById("ai-plantae-btn")) return;

  // Create floating button
  var btn = document.createElement("button");
  btn.id = "ai-plantae-btn";
  btn.textContent = "AI Plantae";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "12px 18px";
  btn.style.background = "#2e7d32"; // green plant tone
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  btn.style.cursor = "pointer";
  btn.style.fontFamily = "sans-serif";
  btn.style.fontSize = "14px";

  // Action when clicking the button
  btn.addEventListener("click", function () {
    alert("🌿 AI Plantae Widget is working (version " + window.AIPlantaeWidgetVersion + ")");
  });

  document.body.appendChild(btn);
})();
