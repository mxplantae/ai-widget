/* public/ai-widget.js — Widget AI Mxplantae con 10% descuento */
(function () {
  "use strict";

  const API = {
    CHAT: "https://mxplantae.vercel.app/api/chat",
    LEAD: "https://mxplantae.vercel.app/api/lead",
  };
  const DISCOUNT_CODE = "MXPOFF10";
  const LOCAL_KEY = "mxp_disc_code_claimed";

  function ensureMount() {
    let el = document.getElementById("ai-plantae-chat");
    if (!el) {
      el = document.createElement("div");
      el.id = "ai-plantae-chat";
      el.style.cssText =
        "position:fixed;left:16px;bottom:16px;z-index:2147483647;";
      document.body.appendChild(el);
    }
    return el;
  }

  function css() {
    return `
      .aiw-root{ width:min(360px,92vw); font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; }
      .aiw-btn{ border:0; border-radius:999px; padding:10px 14px; background:#0f172a; color:#fff; font-weight:600; cursor:pointer;
                box-shadow:0 6px 22px rgba(0,0,0,.18); display:flex; align-items:center; gap:8px; }
      .aiw-plant{ width:22px; height:22px; border-radius:999px; background:#0b1225; display:grid; place-items:center; }
      .aiw-plant svg{ width:14px; height:14px; display:block; }
      .aiw-panel{ display:none; margin-top:10px; background:#fff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;
                  box-shadow:0 10px 30px rgba(0,0,0,.18) }
      .aiw-pills{ display:flex; gap:8px; flex-wrap:wrap; padding:10px; border-bottom:1px solid #f1f5f9; background:#fafafa }
      .aiw-pill{ border:1px solid #e5e7eb; border-radius:999px; padding:6px 10px; font-size:12px; background:#fff; cursor:pointer }
      .aiw-msgs{ height:360px; overflow:auto; padding:12px; line-height:1.5 }
      .aiw-row{ margin:0 0 12px 0 }
      .aiw-badge{ width:28px; height:28px; border-radius:999px; color:#fff; display:grid; place-items:center; font-size:12px; font-weight:700 }
      .aiw-badge-ai{ background:#0f172a } .aiw-badge-u{ background:#16a34a }
      .aiw-bubble{ background:#f8fafc; border:1px solid #e5e7eb; padding:10px 12px; border-radius:10px; white-space:pre-wrap }
      .aiw-footer{ display:flex; gap:8px; padding:10px; border-top:1px solid #f1f5f9; background:#f8fafc }
      .aiw-input{ flex:1; padding:10px 12px; border:1px solid #d1d5db; border-radius:10px }
      .aiw-send{ border:0; background:#16a34a; color:#fff; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer }
      .aiw-greeting{ background:#f4f7f9; border:1px dashed #d7dee6; color:#0f172a; }
      .aiw-form{ display:flex; flex-direction:column; gap:8px; margin-top:6px }
      .aiw-field{ display:flex; flex-direction:column; gap:4px }
      .aiw-field input{ padding:9px 10px; border:1px solid #d1d5db; border-radius:8px; }
      .aiw-help{ font-size:12px; color:#475569 }
      .aiw-cta{ display:flex; gap:8px; margin-top:6px }
      .aiw-cta button{ border:0; border-radius:10px; padding:9px 12px; font-weight:600; cursor:pointer }
      .aiw-cta .yes{ background:#16a34a; color:#fff } .aiw-cta .no{ background:#e2e8f0; color:#0f172a }
      .aiw-code{ font-weight:700; letter-spacing:.5px; }
    `;
  }

  function greeting() {
    const h = new Date().getHours();
    const hi = h < 12 ? "¡Buenos días!" : h < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";
    return `${hi} Soy tu asistente de Mxplantae 🌿\n¿Buscas una planta ideal, quieres suscribirte o consultar tu pedido?`;
  }

  function mountUI(el) {
    el.innerHTML = `
      <style>${css()}</style>
      <div class="aiw-root" role="complementary" aria-label="Asistente AI Mxplantae">
        <button id="aiw-toggle" class="aiw-btn" aria-expanded="false" aria-controls="aiw-panel">
          <span class="aiw-plant" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21c0-4 1-6 4-9-3 0-4 1-4 1s-1-1-4-1c3 3 4 5 4 9Z" fill="#6bbf59"/>
              <path d="M12 12c0-3 2-6 5-7-1 3-2 4-5 7Z" fill="#87d17c"/>
              <path d="M12 12c-3-3-4-4-5-7 3 1 5 4 5 7Z" fill="#73c36a"/>
              <rect x="11.4" y="6" width="1.2" height="15" fill="#2c4a2f" rx=".6"/>
            </svg>
          </span>
          AI Plantae
        </button>

        <div id="aiw-panel" class="aiw-panel" role="dialog" aria-modal="false">
          <div class="aiw-pills">
            <button class="aiw-pill" data-q="Recomiéndame una planta para luz media y bajo mantenimiento.">Asesor</button>
            <button class="aiw-pill" data-q="Sugiere un bundle para esta página.">Bundles</button>
            <button class="aiw-pill" data-q="Estado de mi pedido MXP-12345">Pedido</button>
            <button class="aiw-pill" data-q="Tengo dudas de envío">Envíos</button>
            <button class="aiw-pill" id="aiw-discount">10% de descuento</button>
          </div>
          <div id="aiw-msgs" class="aiw-msgs" aria-live="polite"></div>
          <div class="aiw-footer">
            <input id="aiw-input" class="aiw-input" placeholder="Escribe aquí…" autocomplete="off" />
            <button id="aiw-send" class="aiw-send">Enviar</button>
          </div>
        </div>
      </div>`;
  }

  function addMsg($msgs, role, html, extraClass) {
    const row = document.createElement("div"); row.className = "aiw-row";
    row.innerHTML = `<div style="display:flex;gap:8px;align-items:flex-start;">
      <div class="aiw-badge ${role === "user" ? "aiw-badge-u" : "aiw-badge-ai"}">${role === "user" ? "U" : "AI"}</div>
      <div class="aiw-bubble ${extraClass || ""}">${html}</div></div>`;
    $msgs.appendChild(row); $msgs.scrollTop = $msgs.scrollHeight;
    return row.querySelector(".aiw-bubble");
  }

  function emailOk(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

  async function saveLead(name, email) {
    try {
      const r = await fetch(API.LEAD, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, source: "chatbot-10off" })
      });
      return r.ok;
    } catch { return false; }
  }

  function offerDiscount($msgs) {
    if (localStorage.getItem(LOCAL_KEY)) {
      addMsg($msgs, "assistant", "Este beneficio es para clientes nuevos. Ya tienes un código asignado a tu visita 🌿");
      return;
    }
    const cta = addMsg($msgs, "assistant", "¿Te gustaría un 10% de descuento en tu compra?", "aiw-greeting");
    const bar = document.createElement("div");
    bar.className = "aiw-cta";
    bar.innerHTML = `<button class="yes">Sí, quiero</button><button class="no">No, gracias</button>`;
    cta.appendChild(bar);
    bar.querySelector(".yes").addEventListener("click", () => askData($msgs));
    bar.querySelector(".no").addEventListener("click", () => addMsg($msgs, "assistant", "Perfecto, sigo aquí para ayudarte 🌿"));
  }

  function askData($msgs) {
    const formWrap = addMsg($msgs, "assistant", "Para activar tu 10% necesito tus datos:\n\nCompleta el formulario:");
    const form = document.createElement("div");
    form.className = "aiw-form";
    form.innerHTML = `
      <div class="aiw-field"><label>Nombre</label><input id="f-name" placeholder="Ej. Ana Pérez"></div>
      <div class="aiw-field"><label>Correo</label><input id="f-email" placeholder="ejemplo@correo.com"><div class="aiw-help">No compartimos tu correo.</div></div>
      <div class="aiw-cta"><button class="yes">Obtener 10%</button><button class="no">Cancelar</button></div>`;
    formWrap.appendChild(form);

    const $name = form.querySelector("#f-name");
    const $email = form.querySelector("#f-email");
    form.querySelector(".no").addEventListener("click", () => addMsg($msgs, "assistant", "Entendido. Si lo deseas más tarde, dilo y lo activamos."));
    form.querySelector(".yes").addEventListener("click", async () => {
      const name = ($name.value || "").trim(), email = ($email.value || "").trim();
      if (!name || !emailOk(email)) {
        addMsg($msgs, "assistant", "Por favor, ingresa **Nombre** y un **Correo válido**.");
        return;
      }
      const ok = await saveLead(name, email);
      localStorage.setItem(LOCAL_KEY, "1");
      const msg = ok
        ? `¡Listo, ${name}! Aquí tienes tu código de **10%**:\n\nCódigo: **<span class="aiw-code">${DISCOUNT_CODE}</span>**\n*Úsalo una sola vez en tu compra.*`
        : `¡Listo, ${name}! Te doy tu código de **10%**:\n\nCódigo: **<span class="aiw-code">${DISCOUNT_CODE}</span>**\n*Úsalo una sola vez en tu compra.*`;
      addMsg($msgs, "assistant", msg);
    });
  }

  function addStreamHolder($msgs) {
    const holder = document.createElement("div"); holder.className = "aiw-row";
    holder.innerHTML = `<div style="display:flex;gap:8px;align-items:flex-start;">
      <div class="aiw-badge aiw-badge-ai">AI</div>
      <div id="aiw-stream" class="aiw-bubble" style="background:#f1f5f9;"></div></div>`;
    $msgs.appendChild(holder); return holder.querySelector("#aiw-stream");
  }

  async function sendChat($msgs, $input, history) {
    const text = ($input.value || "").trim(); if (!text) return;
    $input.value = "";
    if (/descuento|10%|promoc/i.test(text)) {
      addMsg($msgs, "user", text);
      offerDiscount($msgs);
      return;
    }
    addMsg($msgs, "user", text); history.push({ role: "user", content: text });

    const $stream = addStreamHolder($msgs);
    let finalText = "", buf = ""; const dec = new TextDecoder("utf-8");
    try {
      const resp = await fetch(API.CHAT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      if (!resp.ok || !resp.body) throw new Error("network");
      const reader = resp.body.getReader(); let done = false;
      while (!done) {
        const { value, done: d } = await reader.read(); done = d;
        buf += dec.decode(value || new Uint8Array(), { stream: true });
        const chunks = buf.split("\n\n"); buf = chunks.pop() || "";
        for (const ch of chunks) {
          const line = ch.replace(/^data:\s?/, ""); if (line === "[DONE]") continue;
          try {
            const obj = JSON.parse(line);
            const piece = obj.output_text ?? obj.delta?.content ?? "";
            if (piece) { finalText += piece; $stream.textContent = finalText; $msgs.scrollTop = $msgs.scrollHeight; }
          } catch {}
        }
      }
      history.push({ role: "assistant", content: finalText || "(sin respuesta)" });
    } catch {
      $stream.textContent = "No pude conectar por ahora. Intenta de nuevo en unos segundos.";
    }
  }

  function boot() {
    const el = ensureMount(); mountUI(el);
    const $toggle = el.querySelector("#aiw-toggle");
    const $panel = el.querySelector("#aiw-panel");
    const $msgs = el.querySelector("#aiw-msgs");
    const $input = el.querySelector("#aiw-input");
    const $send = el.querySelector("#aiw-send");
    const $pillDiscount = el.querySelector("#aiw-discount");

    let history = [
      { role: "system", content: "Eres un asistente de Mxplantae. Tono elegante, minimalista y amable. Si el usuario menciona descuentos, ofrece 10% solo a clientes nuevos." }
    ];

    $panel.style.display = "none";
    $toggle.addEventListener("click", () => {
      const open = $panel.style.display !== "none";
      if (open) { $panel.style.display = "none"; $toggle.setAttribute("aria-expanded", "false"); }
      else {
        $panel.style.display = "block"; $toggle.setAttribute("aria-expanded", "true");
        if (!sessionStorage.getItem("aiw_greeted")) {
          const hi = addMsg($msgs, "assistant", greeting(), "aiw-greeting");
          if (!localStorage.getItem(LOCAL_KEY)) {
            const bar = document.createElement("div"); bar.className = "aiw-cta";
            bar.innerHTML = `<button class="yes">Quiero 10% OFF</button><button class="no">Quizá después</button>`;
            hi.appendChild(bar);
            bar.querySelector(".yes").addEventListener("click", () => offerDiscount($msgs));
            bar.querySelector(".no").addEventListener("click", () => addMsg($msgs, "assistant", "Sin problema, aquí estaré 🌿"));
          }
          sessionStorage.setItem("aiw_greeted", "1");
        }
        $input.focus();
      }
    });

    $send.addEventListener("click", () => sendChat($msgs, $input, history));
    $input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat($msgs, $input, history); } });
    if ($pillDiscount) $pillDiscount.addEventListener("click", () => offerDiscount($msgs));

    console.log("[Mxplantae] Widget cargado");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
