/* =================== 1.0.11: la tua icona accanto al nome (richiesta del proprietario, 17/11/2026) ===================
   In Casa il saluto ("Buongiorno, Anna") ha accanto una piccola icona in plastilina, scelta da chi usa l'app.
   1) 12 icone per tutti e 12 con Tanetto Plus (immagini 3D in img/ni/, 144 px, leggibili a 22 px).
   2) Si cambia toccando l'icona (o il saluto): si apre il selettore con l'anteprima del saluto.
      Senza Plus le icone Plus hanno la pillola "Con Plus"; toccandole si apre Tanetto Plus (per bambini e ragazzi la
      finestra di Plus dice gia' "chiedi a un adulto", 98zf: qui niente altro, nessuna insistenza).
   3) Predefinita: il germoglio (il segno di Germo). Il simbolo della stagione accanto al saluto e ai titoli non c'e' piu'
      (decisione del proprietario, 17/11/2026): accanto al nome c'e' solo questa icona.
   4) Se Plus finisce: si torna a vedere il germoglio, ma la scelta resta salvata (S.v111ic) e torna da sola con Plus.
      Nessun messaggio che spinge a riabbonarsi: solo una riga nel selettore.
   5) L'icona sta dentro l'ultima parola del saluto (.gwl, 98zu) e non va mai a capo da sola, con qualsiasi nome. */
const V111_FREE = ["germoglio", "cuore", "stella", "sole", "luna", "fiore", "goccia", "nuvola", "quadrifoglio", "fungo", "sasso", "tazza"];
const V111_PLUS = ["corona", "gemma", "arcobaleno", "lanterna", "pallina", "stella_cadente", "aquilone", "pianeta", "mongolfiera", "fiocco", "germoglio_fiore", "razzo"];
const V111_ALL = V111_FREE.concat(V111_PLUS);
const V111_N = {
  it: ["Germoglio", "Cuore", "Stella", "Sole", "Luna", "Fiore", "Goccia", "Nuvola", "Quadrifoglio", "Fungo", "Sassolino", "Tazza", "Corona", "Gemma", "Arcobaleno", "Lanterna", "Pallina di Natale", "Stella cadente", "Aquilone", "Pianeta", "Mongolfiera", "Fiocco di neve", "Germoglio in fiore", "Razzo"],
  en: ["Sprout", "Heart", "Star", "Sun", "Moon", "Flower", "Drop", "Cloud", "Four-leaf clover", "Mushroom", "Pebble", "Mug", "Crown", "Gem", "Rainbow", "Lantern", "Christmas bauble", "Shooting star", "Kite", "Planet", "Hot-air balloon", "Snowflake", "Sprout in bloom", "Rocket"],
  de: ["Spross", "Herz", "Stern", "Sonne", "Mond", "Blume", "Tropfen", "Wolke", "Glücks\u00ADklee", "Pilz", "Kiesel\u00ADstein", "Tasse", "Krone", "Edel\u00ADstein", "Regen\u00ADbogen", "Laterne", "Christbaum\u00ADkugel", "Stern\u00ADschnuppe", "Drachen", "Planet", "Heißluft\u00ADballon", "Schnee\u00ADflocke", "Blühender Spross", "Rakete"],
  es: ["Brote", "Corazón", "Estrella", "Sol", "Luna", "Flor", "Gota", "Nube", "Trébol", "Seta", "Piedrita", "Taza", "Corona", "Gema", "Arcoíris", "Farolillo", "Bola de Navidad", "Estrella fugaz", "Cometa", "Planeta", "Globo aerostático", "Copo de nieve", "Brote en flor", "Cohete"],
  fr: ["Pousse", "Cœur", "Étoile", "Soleil", "Lune", "Fleur", "Goutte", "Nuage", "Trèfle", "Champignon", "Galet", "Tasse", "Couronne", "Gemme", "Arc-en-ciel", "Lanterne", "Boule de Noël", "Étoile filante", "Cerf-volant", "Planète", "Montgolfière", "Flocon de neige", "Pousse en fleur", "Fusée"],
  pt: ["Broto", "Coração", "Estrela", "Sol", "Lua", "Flor", "Gota", "Nuvem", "Trevo", "Cogumelo", "Pedrinha", "Caneca", "Coroa", "Joia", "Arco-íris", "Lanterna", "Bola de Natal", "Estrela cadente", "Pipa", "Planeta", "Balão", "Floco de neve", "Broto em flor", "Foguete"],
  ja: ["芽", "ハート", "星", "太陽", "月", "花", "しずく", "雲", "四つ葉", "きのこ", "小石", "マグ\u200Bカップ", "王冠", "宝石", "虹", "ランタン", "クリスマス\u200Bボール", "流れ星", "凧", "惑星", "気球", "雪の結晶", "花咲く芽", "ロケット"],
  ko: ["새싹", "하트", "별", "해", "달", "꽃", "물방울", "구름", "네잎클로버", "버섯", "조약돌", "머그컵", "왕관", "보석", "무지개", "랜턴", "크리스마스 볼", "별똥별", "연", "행성", "열기구", "눈송이", "꽃 핀 새싹", "로켓"],
  zh: ["嫩芽", "爱心", "星星", "太阳", "月亮", "花朵", "水滴", "云朵", "四叶草", "蘑菇", "小石子", "马克杯", "王冠", "宝石", "彩虹", "灯笼", "圣诞球", "流星", "风筝", "星球", "热气球", "雪花", "开花的嫩芽", "火箭"],
  zht: ["嫩芽", "愛心", "星星", "太陽", "月亮", "花朵", "水滴", "雲朵", "四葉草", "蘑菇", "小石子", "馬克杯", "王冠", "寶石", "彩虹", "燈籠", "聖誕球", "流星", "風箏", "星球", "熱氣球", "雪花", "開花的嫩芽", "火箭"],
  ru: ["Росток", "Сердце", "Звезда", "Солнце", "Луна", "Цветок", "Капля", "Облако", "Клевер", "Гриб", "Камешек", "Кружка", "Корона", "Самоцвет", "Радуга", "Фонарик", "Ёлочный шар", "Падающая звезда", "Воздушный змей", "Планета", "Воздушный шар", "Снежинка", "Цветущий росток", "Ракета"],
  pl: ["Kiełek", "Serce", "Gwiazda", "Słońce", "Księżyc", "Kwiat", "Kropla", "Chmurka", "Koniczyna", "Grzybek", "Kamyk", "Kubek", "Korona", "Klejnot", "Tęcza", "Lampion", "Bombka", "Spadająca gwiazda", "Latawiec", "Planeta", "Balon", "Płatek śniegu", "Kwitnący kiełek", "Rakieta"],
  nl: ["Kiempje", "Hart", "Ster", "Zon", "Maan", "Bloem", "Druppel", "Wolk", "Klavertje vier", "Paddenstoel", "Kiezel", "Mok", "Kroon", "Edelsteen", "Regenboog", "Lampion", "Kerstbal", "Vallende ster", "Vlieger", "Planeet", "Luchtballon", "Sneeuwvlok", "Bloeiend kiempje", "Raket"],
  tr: ["Filiz", "Kalp", "Yıldız", "Güneş", "Ay", "Çiçek", "Damla", "Bulut", "Yonca", "Mantar", "Çakıl taşı", "Kupa", "Taç", "Mücevher", "Gökkuşağı", "Fener", "Yılbaşı topu", "Kayan yıldız", "Uçurtma", "Gezegen", "Balon", "Kar tanesi", "Çiçek açan filiz", "Roket"]
};
const V111_T = {
  it: { t: "La tua icona", p: "Sta accanto al saluto. Cambiala quando vuoi.", free: "Per tutti", inuse: "In uso", btn: (n) => `La tua icona: ${n}. Tocca per cambiarla`, done: "Fatto", kept: "Senza Plus si vede il germoglio. La tua scelta resta salvata." },
  en: { t: "Your icon", p: "It sits next to your greeting. Change it whenever you like.", free: "For everyone", inuse: "In use", btn: (n) => `Your icon: ${n}. Tap to change it`, done: "Done", kept: "Without Plus you'll see the sprout. Your choice stays saved." },
  de: { t: "Dein Symbol", p: "Es steht neben deiner Begrüßung. Du kannst es jederzeit ändern.", free: "Für alle", inuse: "Aktiv", btn: (n) => `Dein Symbol: ${n}. Tippen zum Ändern`, done: "Fertig", kept: "Ohne Plus siehst du den Spross. Deine Wahl bleibt gespeichert." },
  es: { t: "Tu icono", p: "Aparece junto a tu saludo. Cámbialo cuando quieras.", free: "Para todos", inuse: "En uso", btn: (n) => `Tu icono: ${n}. Toca para cambiarlo`, done: "Listo", kept: "Sin Plus verás el brote. Tu elección queda guardada." },
  fr: { t: "Ton icône", p: "Elle s'affiche à côté de ton message d'accueil. Change-la quand tu veux.", free: "Pour tous", inuse: "Utilisée", btn: (n) => `Ton icône : ${n}. Touche pour la changer`, done: "OK", kept: "Sans Plus, tu verras la pousse. Ton choix reste enregistré." },
  pt: { t: "Seu ícone", p: "Aparece ao lado da sua saudação. Troque quando quiser.", free: "Para todos", inuse: "Em uso", btn: (n) => `Seu ícone: ${n}. Toque para trocar`, done: "Pronto", kept: "Sem o Plus, aparece o broto. Sua escolha fica salva." },
  ja: { t: "あなたのアイコン", p: "あいさつの横に表示されます。いつでも変えられます。", free: "だれでも", inuse: "使用中", btn: (n) => `あなたのアイコン：${n}。タップして変更`, done: "完了", kept: "Plusがないあいだは芽が表示されます。選んだアイコンは保存されたままです。" },
  ko: { t: "내 아이콘", p: "인사말 옆에 표시돼요. 언제든 바꿀 수 있어요.", free: "모두 사용 가능", inuse: "사용 중", btn: (n) => `내 아이콘: ${n}. 눌러서 바꾸기`, done: "완료", kept: "Plus가 없으면 새싹이 보여요. 고른 아이콘은 그대로 저장돼요." },
  zh: { t: "你的图标", p: "显示在问候语旁边，随时可以更换。", free: "所有人可用", inuse: "使用中", btn: (n) => `你的图标：${n}。点按即可更换`, done: "完成", kept: "没有 Plus 时会显示嫩芽，你的选择会一直保存。" },
  zht: { t: "你的圖示", p: "顯示在問候語旁邊，隨時可以更換。", free: "所有人可用", inuse: "使用中", btn: (n) => `你的圖示：${n}。點一下即可更換`, done: "完成", kept: "沒有 Plus 時會顯示嫩芽，你的選擇會一直保存。" },
  ru: { t: "Твой значок", p: "Он стоит рядом с приветствием. Меняй, когда захочешь.", free: "Для всех", inuse: "Выбран", btn: (n) => `Твой значок: ${n}. Нажми, чтобы сменить`, done: "Готово", kept: "Без Plus будет виден росток. Твой выбор сохранится." },
  pl: { t: "Twoja ikonka", p: "Pojawia się obok powitania. Zmieniaj ją, kiedy chcesz.", free: "Dla wszystkich", inuse: "W użyciu", btn: (n) => `Twoja ikonka: ${n}. Dotknij, aby zmienić`, done: "Gotowe", kept: "Bez Plus zobaczysz kiełek. Twój wybór zostanie zapisany." },
  nl: { t: "Jouw icoon", p: "Het staat naast je begroeting. Verander het wanneer je wilt.", free: "Voor iedereen", inuse: "In gebruik", btn: (n) => `Jouw icoon: ${n}. Tik om te wijzigen`, done: "Klaar", kept: "Zonder Plus zie je het kiempje. Je keuze blijft bewaard." },
  tr: { t: "Simgen", p: "Selamlamanın yanında görünür. İstediğin zaman değiştir.", free: "Herkes için", inuse: "Kullanımda", btn: (n) => `Simgen: ${n}. Değiştirmek için dokun`, done: "Tamam", kept: "Plus olmadan filiz görünür. Seçimin kayıtlı kalır." }
};
const v111T = () => V111_T[S.lang] || V111_T.en;
/* nomi: in tedesco e giapponese con i punti dove si puo' andare a capo (\u00AD trattino morbido, \u200B spazio invisibile);
   per i lettori di schermo e le etichette si tolgono */
const v111Name = (id) => (V111_N[S.lang] || V111_N.en)[Math.max(0, V111_ALL.indexOf(id))];
const v111Label = (id) => v111Name(id).replace(/[\u00AD\u200B]/g, "");
const v111PlusOn = () => { try { return typeof plusActive === "function" && !!plusActive(); } catch (e) { return false; } };
const v111Src = (id) => `img/ni/${id}.webp?v=${IMG3D_V}`;
/* l'icona che si vede: quella scelta, se e' per tutti o se Plus e' attivo; altrimenti il germoglio */
function v111Shown() {
  const c = S && S.v111ic;
  if (V111_FREE.includes(c)) return c;
  if (V111_PLUS.includes(c) && v111PlusOn()) return c;
  return "germoglio";
}
/* il pulsante dentro il saluto (98zu v113Greet lo mette dentro l'ultima parola) */
function v111IconEl() {
  const id = v111Shown(); const b = document.createElement("button");
  b.type = "button"; b.className = "gwi"; b.dataset.v111 = id; b.setAttribute("aria-label", v111T().btn(v111Label(id)));
  const im = document.createElement("img"); im.src = v111Src(id); im.alt = ""; im.width = 26; im.height = 26; im.decoding = "async"; im.draggable = false;
  b.appendChild(im); return b;
}
function v111Tile(id) {
  const plus = V111_PLUS.includes(id), locked = plus && !v111PlusOn(), on = v111Shown() === id, n = v111Label(id), nv = v111Name(id), gl = (typeof V113_GOLD !== "undefined" && (V113_GOLD[S.lang] || V113_GOLD.en)) || "Plus";
  const al = locked ? `${n} – ${gl}` : n;
  return `<button class="nit${locked ? " lock" : ""}${on ? " on" : ""}" type="button" data-nic="${id}" aria-pressed="${on}" aria-label="${esc(al)}"><span class="niimg"><img src="${v111Src(id)}" alt="" width="52" height="52" decoding="async" draggable="false"></span><span class="nin" aria-hidden="true">${esc(nv)}</span>${locked ? `<span class="nipl" aria-hidden="true">${esc(gl)}</span>` : ""}${on ? `<span class="nion" aria-hidden="true">✓</span>` : ""}</button>`;
}
function v111Preview() {
  const gw = document.querySelector("#app h1.greet .gw"); let txt = gw ? gw.textContent.trim() : "";
  if (!txt) { try { txt = L().greet[phase()]; } catch (e) { txt = ""; } }
  return `<div class="niprev" aria-hidden="true"><span class="niprt">${esc(txt)}</span><img src="${v111Src(v111Shown())}" alt="" width="40" height="40"></div>`;
}
function openIcons() {
  const t = v111T(); const gl = (typeof V113_GOLD !== "undefined" && (V113_GOLD[S.lang] || V113_GOLD.en)) || "Plus";
  const kept = V111_PLUS.includes(S.v111ic) && !v111PlusOn();
  layer.innerHTML = `<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="niT"><div class="box card nibox">
  ${v111Preview()}<h2 id="niT">${esc(t.t)}</h2><p class="small muted nip">${esc(t.p)}</p>
  <h3 class="nih">${esc(t.free)}</h3><div class="nigrid" role="group" aria-label="${esc(t.free)}">${V111_FREE.map(v111Tile).join("")}</div>
  <h3 class="nih nihp"><span class="nicr" aria-hidden="true">${icon("p_crown")}</span>${esc(gl)}</h3><div class="nigrid" role="group" aria-label="${esc(gl)}">${V111_PLUS.map(v111Tile).join("")}</div>
  ${kept ? `<p class="small muted nikept">${esc(t.kept)}</p>` : ""}
  <button class="btn block" id="closeLayer" type="button">${esc(t.done)}</button></div></div>`;
  v111FitNames();
  const cur = layer.querySelector(".nit.on") || layer.querySelector(".nit"); if (cur) cur.focus({ preventScroll: true });
  if (anim) G.from(".nibox", { y: 30, opacity: 0, duration: 0.4, ease: "power3.out" });
}
/* nomi delle icone: mai spezzati a meta' parola (parole lunghe in russo, tedesco e giapponese su 360 px). Si va a capo solo tra le
   parole; se una parola non ci sta, il carattere scende fino a 9,5 px; solo se non basta ancora si spezza (ultima difesa). */
function v111FitNames() {
  try {
    layer.querySelectorAll(".nibox .nin").forEach((el) => {
      el.style.fontSize = ""; el.classList.add("fit");
      for (const fs of [11, 10.5, 10, 9.5]) { if (el.scrollWidth <= el.clientWidth + 0.5) return; el.style.fontSize = fs + "px"; }
      if (el.scrollWidth > el.clientWidth + 0.5) { el.style.fontSize = ""; el.classList.remove("fit"); }
    });
  } catch (e) { /* niente */ }
}
let v111FitRaF = 0;
window.addEventListener("resize", () => { cancelAnimationFrame(v111FitRaF); v111FitRaF = requestAnimationFrame(() => { if (layer.querySelector(".nibox")) v111FitNames(); }); });
function v111Pick(id) {
  if (!V111_ALL.includes(id)) return;
  if (V111_PLUS.includes(id) && !v111PlusOn()) {
    /* senza Plus: si apre Tanetto Plus; dopo l'acquisto l'icona scelta e' gia' messa */
    try { SND.play("click"); } catch (e) { /* niente */ }
    openPlus("icona-nome", () => { if (v111PlusOn()) { S.v111ic = id; save(); render(); } });
    return;
  }
  S.v111ic = id; save();
  try { SND.play("click"); SND.haptic(8); } catch (e) { /* niente */ }
  const y = window.scrollY; render(); window.scrollTo(0, y);
  /* il selettore resta aperto: anteprima e segno di spunta aggiornati, il fuoco resta sull'icona toccata */
  const box = layer.querySelector(".nibox"); if (!box) return;
  box.querySelectorAll(".nit").forEach((b) => { const on = b.dataset.nic === v111Shown(); b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
    const ck = b.querySelector(".nion"); if (on && !ck) b.insertAdjacentHTML("beforeend", `<span class="nion" aria-hidden="true">✓</span>`); if (!on && ck) ck.remove(); });
  const pv = box.querySelector(".niprev img"); if (pv) { pv.src = v111Src(v111Shown()); if (anim) G.fromTo(pv, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: "back.out(2.4)" }); }
  const kp = box.querySelector(".nikept"); if (kp) kp.remove();
}
document.addEventListener("click", (ev) => {
  const tile = ev.target.closest && ev.target.closest(".nibox .nit");
  if (tile) { ev.preventDefault(); v111Pick(tile.dataset.nic); return; }
  const g = ev.target.closest && ev.target.closest("#app h1.greet .gwi, #app h1.greet .gw");
  if (g && S.pet && !layer.innerHTML.trim()) { ev.preventDefault(); try { SND.play("click"); } catch (e) { /* niente */ } openIcons(); }
});
