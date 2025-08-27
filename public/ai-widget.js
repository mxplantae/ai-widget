(function(){
  "use strict";
  if (window.__ai_plantae_widget_loaded) return; window.__ai_plantae_widget_loaded = true;

  // ===== Config
  const API_BASE = (typeof window !== "undefined" && window.MXP_WIDGET_API_BASE) || "";
  if (!API_BASE) { console.error("[AIW] No se definió window.MXP_WIDGET_API_BASE"); }
  const API = {
    chat:   API_BASE + "/api/chat",
    status: API_BASE + "/api/order-status",
    lead:   API_BASE + "/api/lead",
    telem:  API_BASE + "/api/telemetry"
  };
  const DISCOUNT_CODE = "MXPOFF10";
  const LOCAL_KEY = "mxp_disc_code_claimed";

  // ===== Helpers
  function ensureMount(){
    let el = document.getElementById("ai-plantae-chat");
    if(!el){
      el = document.createElement("div");
      el.id = "ai-plantae-chat";
      document.body.appendChild(el);
    }
    el.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:2147483647";
    return el;
  }
  function emailOk(s){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s); }
  function addMsg($msgs, role, html, klass){
    const row = document.createElement("div"); row.className="aiw-row";
    row.innerHTML = `<div style="display:flex;gap:8px;align-items:flex-start;">
      <div class="aiw-badge ${role==='user'?'aiw-badge-u':'aiw-badge-ai'}">${role==='user'?'U':'AI'}</div>
      <div class="aiw-bubble ${klass||""}">${html}</div>
    </div>`;
    $msgs.appendChild(row); $msgs.scrollTop = $msgs.scrollHeight;
    return row.querySelector(".aiw-bubble");
  }

  // ===== CSS base
  const css = `
  #ai-plantae-chat .aiw-root{ width:min(360px,92vw); font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; color:#0f172a }
  #ai-plantae-chat .aiw-btn{ border:0; border-radius:18px; padding:10px 14px; display:flex; align-items:center; gap:8px; font-weight:600; cursor:pointer; background:#0f172a; color:#fff; box-shadow:0 6px 22px rgba(0,0,0,.18) }
  #ai-plantae-chat .aiw-plant{ width:22px; height:22px; border-radius:999px; background:#0b1225; display:grid; place-items:center }
  #ai-plantae-chat .aiw-plant svg{ width:14px; height:14px; display:block }
  #ai-plantae-chat .aiw-panel{ display:none; margin-top:10px; background:#fff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.18) }
  #ai-plantae-chat .aiw-pills{ display:flex; gap:8px; flex-wrap:wrap; padding:10px; border-bottom:1px solid #f1f5f9; background:#fafafa }
  #ai-plantae-chat .aiw-pill{ border:1px solid #e5e7eb; border-radius:999px; padding:6px 10px; font-size:12px; background:#fff; cursor:pointer }
  #ai-plantae-chat .aiw-msgs{ height:360px; overflow:auto; padding:12px; line-height:1.5 }
  #ai-plantae-chat .aiw-row{ margin:0 0 12px 0 }
  #ai-plantae-chat .aiw-badge{ width:28px; height:28px; border-radius:999px; color:#fff; display:grid; place-items:center; font-size:12px; font-weight:700 }
  #ai-plantae-chat .aiw-badge-ai{ background:#0f172a } #ai-plantae-chat .aiw-badge-u{ background:#16a34a }
  #ai-plantae-chat .aiw-bubble{ background:#f8fafc; border:1px solid #e5e7eb; padding:10px 12px; border-radius:10px; white-space:pre-wrap }
  #ai-plantae-chat .aiw-footer{ display:flex; gap:8px; padding:10px; border-top:1px solid #f1f5f9; background:#f8fafc }
  #ai-plantae-chat .aiw-input{ flex:1; padding:10px 12px; border:1px solid #d1d5db; border-radius:10px }
  #ai-plantae-chat .aiw-send{ border:0; background:#16a34a; color:#fff; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer }
  #ai-plantae-chat .aiw-greeting{ background:#f4f7f9; border:1px dashed #d7dee6 }
  #ai-plantae-chat .aiw-form{ display:flex; flex-direction:column; gap:8px; margin-top:6px }
  #ai-plantae-chat .aiw-field{ display:flex; flex-direction:column; gap:4px }
  #ai-plantae-chat .aiw-field input{ padding:9px 10px; border:1px solid #d1d5db; border-radius:8px }
  #ai-plantae-chat .aiw-help{ font-size:12px; color:#475569 }
  #ai-plantae-chat .aiw-cta{ display:flex; gap:8px; margin-top:6px }
  #ai-plantae-chat .aiw-cta button{ border:0; border-radius:10px; padding:9px 12px; font-weight:600; cursor:pointer }
  #ai-plantae-chat .aiw-cta .yes{ background:#16a34a; color:#fff } #ai-plantae-chat .aiw-cta .no{ background:#e2e8f0; color:#0f172a }
  #ai-plantae-chat .aiw-code{ font-weight:700; letter-spacing:.5px }
  `;
  const style = document.createElement("style"); style.id="aiw-style"; style.textContent = css;
  (document.head||document.documentElement).appendChild(style);

  // ===== UI
  function mountUI(root){
    root.innerHTML = `
      <div class="aiw-root" role="complementary" aria-label="Asistente AI Mxplantae">
        <button id="aiw-toggle" class="aiw-btn" aria-expanded="false" aria-controls="aiw-panel">
          <span class="aiw-plant" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21c0-4 1-6 4-9-3 0-4 1-4 1s-1-1-4-1c3 3 4 5 4 9Z" fill="#6bbf59"></path>
              <path d="M12 12c0-3 2-6 5-7-1 3-2 4-5 7Z" fill="#87d17c"></path>
              <path d="M12 12c-3-3-4-4-5-7 3 1 5 4 5 7Z" fill="#73c36a"></path>
              <rect x="11.4" y="6" width="1.2" height="15" fill="#2c4a2f" rx=".6"></rect>
            </svg>
          </span>
          AI Plantae
        </button>
        <div id="aiw-panel" class="aiw-panel" role="dialog" aria-modal="false">
          <div class="aiw-pills">
            <button class="aiw-pill" data-q="Recomiéndame una planta para luz media y bajo mantenimiento.">Asesor</button>
            <button class="aiw-pill" data-q="Sugiere un bundle para esta página.">Bundles</button>
            <button class="aiw-pill" data-q="Estado de mi pedido MXP-12345">Pedido</button>
            <button class="aiw-pill" id="aiw-discount">10% de descuento</button>
          </div>
          <div id="aiw-msgs" class="aiw-msgs" aria-live="polite"></div>
          <div class="aiw-footer">
            <input id="aiw-input" class="aiw-input" placeholder="Escribe aquí…" autocomplete="off">
            <button id="aiw-send" class="aiw-send">Enviar</button>
          </div>
        </div>
      </div>`;
  }

  function addStreamMsg($msgs){
    const holder=document.createElement("div"); holder.className="aiw-row";
    holder.innerHTML = '<div style="display:flex;gap:8px;align-items:flex-start;"><div class="aiw-badge aiw-badge-ai">AI</div><div id="aiw-stream" class="aiw-bubble" style="background:#f1f5f9;"></div></div>';
    $msgs.appendChild(holder); return holder.querySelector("#aiw-stream");
  }

  async function saveLead(name,email){
    try{
      const r = await fetch(API.lead,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,source:"chatbot-10off"})});
      if (r.status===409) return "dup";
      if (r.ok) return true;
    }catch(e){}
    try{ await fetch(API.telem,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:"lead_error", email, ts:Date.now()})}); }catch(e){}
    return false;
  }

  function offerDiscount($msgs){
    if (localStorage.getItem(LOCAL_KEY)) { addMsg($msgs,"assistant","Este beneficio es para clientes nuevos. Ya tienes un código asignado 🌿"); return; }
    const c = addMsg($msgs,"assistant","¿Te gustaría un 10% de descuento en tu compra?","aiw-greeting");
    const bar = document.createElement("div"); bar.className="aiw-cta";
    bar.innerHTML = '<button class="yes">Sí, quiero</button><button class="no">No, gracias</button>';
    c.appendChild(bar);
    bar.querySelector(".yes").onclick = ()=> askData($msgs);
    bar.querySelector(".no").onclick  = ()=> addMsg($msgs,"assistant","Perfecto. Si cambias de opinión, aquí estaré 🌿");
  }

  function askData($msgs){
    const wrap = addMsg($msgs,"assistant","Para activar tu 10% necesito tus datos para registrarte como cliente nuevo.\n\nCompleta el formulario:");
    const form = document.createElement("div"); form.className="aiw-form";
    form.innerHTML = `
      <div class="aiw-field"><label>Nombre</label><input id="f-name" placeholder="Ej. Ana Pérez"></div>
      <div class="aiw-field"><label>Correo</label><input id="f-email" placeholder="ejemplo@correo.com"><div class="aiw-help">Solo para enviarte tu beneficio y novedades de Mxplantae.</div></div>
      <div class="aiw-cta"><button class="yes">Obtener 10%</button><button class="no">Cancelar</button></div>`;
    wrap.appendChild(form);
    const $name=form.querySelector("#f-name"), $email=form.querySelector("#f-email");
    form.querySelector(".no").onclick = ()=> addMsg($msgs,"assistant","Sin problema, seguimos en contacto 🌿");
    form.querySelector(".yes").onclick = async ()=>{
      const name=($name.value||"").trim(), email=($email.value||"").trim();
      if(!name || !emailOk(email)){ addMsg($msgs,"assistant","Por favor, ingresa **Nombre** y un **Correo válido**."); return; }
      const ok = await saveLead(name,email);
      localStorage.setItem(LOCAL_KEY,"1");
      if (ok==="dup"){ addMsg($msgs,"assistant","Este beneficio es para clientes nuevos y tu correo ya está registrado 🌿"); return; }
      addMsg($msgs,"assistant","¡Listo, "+name+"! Tu código de **10%**:\n\nCódigo: **<span class='aiw-code'>MXPOFF10</span>**\n*Válido una sola vez.*");
    };
  }

  async function sendMsg($msgs,$input,history){
    const text = ($input.value||"").trim(); if(!text) return; $input.value="";
    if (/descuento|10%|promoc/i.test(text)) { addMsg($msgs,"user",text); offerDiscount($msgs); return; }
    addMsg($msgs,"user",text); history.push({ role:"user", content:text });

    const m = text.match(/pedido\s+#?([A-Z]{2,}-?\d+)/i) || text.match(/(MXP-\d+)/i);
    if(m){
      try{
        const r = await fetch(API.status+"?order="+encodeURIComponent(m[1])); const j = await r.json();
        if (j && j.success){ addMsg($msgs,"assistant","Pedido "+j.data.order+": **"+j.data.status+"**\nTransportista: "+j.data.carrier+"\nGuía: "+j.data.tracking+"\nETA: "+j.data.eta_days+" días"); return; }
      }catch(e){}
    }
    const $stream = addStreamMsg($msgs);
    try{
      const resp = await fetch(API.chat,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ messages: history }) });
      const j2 = await resp.json();
      if (j2 && j2.success) { $stream.textContent = j2.output_text || "(sin respuesta)"; history.push({ role:"assistant", content: j2.output_text || "" }); }
      else { $stream.textContent = "No pude conectar con el asistente."; }
    }catch(e){ $stream.textContent = "Intermitencias de red. Intenta de nuevo."; }
  }

  function greeting(){
    const h = (new Date()).getHours();
    const hi = h<12?"¡Buenos días!":h<19?"¡Buenas tardes!":"¡Buenas noches!";
    return hi + " Soy tu asistente de Mxplantae 🌿\n¿Buscas una planta ideal, quieres suscribirte o consultar tu pedido?";
  }

  function boot(){
    const root = ensureMount();
    // UI
    root.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "aiw-root";
    wrap.innerHTML = `
      <button id="aiw-toggle" class="aiw-btn" aria-expanded="false" aria-controls="aiw-panel">
        <span class="aiw-plant" aria-hidden="true"></span>AI Plantae
      </button>
      <div id="aiw-panel" class="aiw-panel" role="dialog" aria-modal="false">
        <div class="aiw-pills">
          <button class="aiw-pill" data-q="Recomiéndame una planta para luz media y bajo mantenimiento.">Asesor</button>
          <button class="aiw-pill" data-q="Sugiere un bundle para esta página.">Bundles</button>
          <button class="aiw-pill" data-q="Estado de mi pedido MXP-12345">Pedido</button>
          <button class="aiw-pill" id="aiw-discount">10% de descuento</button>
        </div>
        <div id="aiw-msgs" class="aiw-msgs" aria-live="polite"></div>
        <div class="aiw-footer">
          <input id="aiw-input" class="aiw-input" placeholder="Escribe aquí…" autocomplete="off">
          <button id="aiw-send" class="aiw-send">Enviar</button>
        </div>
      </div>`;
    root.appendChild(wrap);

    // Icono en botón
    const icon = root.querySelector(".aiw-plant");
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="14" height="14">
      <path d="M12 21c0-4 1-6 4-9-3 0-4 1-4 1s-1-1-4-1c3 3 4 5 4 9Z" fill="#6bbf59"></path>
      <path d="M12 12c0-3 2-6 5-7-1 3-2 4-5 7Z" fill="#87d17c"></path>
      <path d="M12 12c-3-3-4-4-5-7 3 1 5 4 5 7Z" fill="#73c36a"></path>
      <rect x="11.4" y="6" width="1.2" height="15" fill="#2c4a2f" rx=".6"></rect>
    </svg>`;

    const $toggle=root.querySelector("#aiw-toggle"), $panel=root.querySelector("#aiw-panel"),
          $msgs=root.querySelector("#aiw-msgs"), $input=root.querySelector("#aiw-input"),
          $send=root.querySelector("#aiw-send"), $pills=root.querySelectorAll(".aiw-pill"),
          $disc=root.querySelector("#aiw-discount");

    const history = [{ role:"system", content:"Eres un asistente de Mxplantae. Tono elegante y amable; ofrece 10% solo a clientes nuevos al registrar nombre+correo." }];

    $panel.style.display="none";
    $toggle.onclick = ()=>{
      const open = $panel.style.display!=="none";
      $panel.style.display = open? "none":"block";
      $toggle.setAttribute("aria-expanded", open?"false":"true");
      if (!sessionStorage.getItem("aiw_greeted")){
        addMsg($msgs,"assistant",greeting(),"aiw-greeting");
        if (!localStorage.getItem(LOCAL_KEY)){
          const bar=document.createElement("div"); bar.className="aiw-cta";
          bar.innerHTML='<button class="yes">Quiero 10% OFF</button><button class="no">Quizá después</button>';
          $msgs.lastChild.querySelector(".aiw-bubble").appendChild(bar);
          bar.querySelector(".yes").onclick=()=> offerDiscount($msgs);
          bar.querySelector(".no").onclick =()=> addMsg($msgs,"assistant","Sin problema, sigo aquí para ayudarte 🌿");
        }
        sessionStorage.setItem("aiw_greeted","1");
      }
      if ($panel.style.display==="block") $input.focus();
    };

    $send.onclick = ()=> sendMsg($msgs,$input,history);
    $input.addEventListener("keydown", e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMsg($msgs,$input,history); }});
    [...$pills].forEach(b=> b.onclick=()=>{ $input.value=b.dataset.q; $input.focus(); });
    if ($disc) $disc.onclick = ()=> offerDiscount($msgs);
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
