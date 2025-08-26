(function(){
  "use strict";
  const css = `
  #ai-plantae-chat .aiw-btn{
    background: rgba(255,255,255,.12);
    color: #fff;
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 18px;
    padding: 10px 14px;
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    box-shadow:0 6px 24px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.18);
    transition: transform .15s ease, opacity .2s ease;
    opacity: .96;
  }
  #ai-plantae-chat .aiw-btn:hover{ transform: translateY(-1px); opacity:1 }
  #ai-plantae-chat .aiw-btn:active{ transform: translateY(0); opacity:.94 }
  #ai-plantae-chat .aiw-plant{
    background: rgba(255,255,255,.18);
    border: 1px solid rgba(255,255,255,.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  @media (prefers-color-scheme: dark){
    #ai-plantae-chat .aiw-btn{
      background: rgba(18,18,18,.35);
      border-color: rgba(255,255,255,.12);
      box-shadow:0 6px 26px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06);
      color: #e6e6e6;
    }
    #ai-plantae-chat .aiw-plant{
      background: rgba(30,30,30,.35);
      border-color: rgba(255,255,255,.12);
    }
  }`;
  const style = document.createElement("style");
  style.id = "aiw-glass-style";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
})();
