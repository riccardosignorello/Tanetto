/* ===== 1.0.10 — una sola moneta visibile: i Tanì (richiesta del proprietario, 17/11/2026) =====
   I "punti" erano l'esperienza che fa salire di livello: sembravano una seconda moneta. Ora non si mostrano mai come numero:
   il livello si racconta come crescita del compagno (barra e percentuale). La scheda del livello dice come si cresce, senza
   numeri che si possano scambiare per Tanì. Le regole del gioco non cambiano. */
const V110_LV = {
  it: ["Ogni buona abitudine ti avvicina al prossimo livello", "Come si cresce di livello", "Ogni obiettivo fatto lo fa crescere", "Ogni viaggio lo fa crescere ancora di più, soprattutto nei mondi lontani"],
  en: ["Every good habit brings you closer to the next level", "How to level up", "Every goal you complete helps them grow", "Every trip helps them grow even more, especially to faraway worlds"],
  de: ["Jede gute Gewohnheit bringt dich dem nächsten Level näher", "So steigst du ein Level auf", "Jedes erledigte Ziel lässt deinen Begleiter wachsen", "Jede Reise lässt ihn noch mehr wachsen, vor allem in ferne Welten"],
  es: ["Cada buen hábito te acerca al siguiente nivel", "Cómo se sube de nivel", "Cada objetivo cumplido lo hace crecer", "Cada viaje lo hace crecer aún más, sobre todo a mundos lejanos"],
  fr: ["Chaque bonne habitude te rapproche du niveau suivant", "Comment monter de niveau", "Chaque objectif accompli le fait grandir", "Chaque voyage le fait grandir encore plus, surtout vers les mondes lointains"],
  pt: ["Cada bom hábito te aproxima do próximo nível", "Como subir de nível", "Cada meta cumprida faz seu companheiro crescer", "Cada viagem faz crescer ainda mais, principalmente para mundos distantes"],
  ja: ["いい習慣を重ねるたびに、次のレベルに近づきます", "レベルの上がり方", "目標を達成するたびに成長します", "旅に出るともっと成長します。遠い世界ほど大きく育ちます"],
  ko: ["좋은 습관 하나하나가 다음 레벨에 가까워지게 해요", "레벨 올리는 법", "목표를 하나 마칠 때마다 자라요", "여행을 다녀오면 더 많이 자라요. 먼 세계일수록 더요"],
  zh: ["每一个好习惯都让你离下一级更近", "如何升级", "每完成一个目标，它就长大一点", "每次旅行会让它长得更多，越远的世界越多"],
  zht: ["每一個好習慣都讓你離下一級更近", "如何升級", "每完成一個目標，牠就長大一點", "每次旅行會讓牠長得更多，越遠的世界越多"],
  ru: ["Каждая хорошая привычка приближает тебя к следующему уровню", "Как повысить уровень", "Каждая выполненная цель помогает расти", "Каждое путешествие помогает расти ещё больше, особенно в далёкие миры"],
  pl: ["Każdy dobry nawyk przybliża cię do kolejnego poziomu", "Jak zdobywać poziomy", "Każdy wykonany cel pomaga rosnąć", "Każda podróż pomaga rosnąć jeszcze bardziej, zwłaszcza do dalekich światów"],
  nl: ["Elke goede gewoonte brengt je dichter bij het volgende level", "Zo stijg je een level", "Elk gehaald doel laat je maatje groeien", "Elke reis laat het nog meer groeien, vooral naar verre werelden"],
  tr: ["Her güzel alışkanlık seni bir sonraki seviyeye yaklaştırır", "Seviye nasıl atlanır", "Tamamladığın her hedef onu büyütür", "Her yolculuk onu daha da büyütür, özellikle uzak dünyalar"]
};
const v110Pct = (a, b, l) => { const p = Math.max(0, Math.min(100, Math.round((a / Math.max(1, b)) * 100))); return l === "tr" ? `%${p}` : ["de", "fr", "es", "ru"].includes(l) ? `${p} %` : `${p}%`; };
Object.keys(V110_LV).forEach((l) => {
  const v = V110_LV[l]; const x = typeof V19 !== "undefined" && V19[l];
  if (x) { x.lvLeft = () => v[0]; x.lvHow = v[1]; x.lvGoal = v[2]; x.lvTrip = v[3]; x.lvPts = (a, b) => v110Pct(a, b, l); }
  if (T[l]) T[l].xpTo = (a, b) => v110Pct(a, b, l);
});
