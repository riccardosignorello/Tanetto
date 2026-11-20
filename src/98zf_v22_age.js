/* =================== 1.0.9 (fase 2): pubblico misto (bambini, ragazzi e adulti), regole Google Play Families ===================
   Fonti (verificate il 12/11/2026): Google Play "Families policy / mixed audience" (support.google.com/googleplay/android-developer
   answer/9893335 e 9867159), AdMob "child-directed / under age of consent" (developers.google.com/admob/android/targeting,
   support.google.com/admob/answer/11402075), Garante privacy (garanteprivacy.it/minori: in Italia 14 anni, art. 2-quinquies).
   1) Schermata dell'eta' NEUTRA: mese e anno di nascita scritti liberamente (due menu senza nessun valore gia' scelto), nessun
      testo che dica che serve una certa eta', "Preferisco non dirlo" sempre possibile. Si chiede una volta sola: subito dopo la
      prima configurazione, oppure (chi ha gia' un compagno) una volta, con gentilezza, al primo avvio dopo l'aggiornamento.
   2) Fasce: "child" sotto i 13 anni; "teen" dai 13 anni all'eta' del consenso digitale del Paese (art. 8 GDPR: Italia e Spagna 14,
      Francia 15, Germania e Paesi Bassi 16, ...; 16 dove non si sa); "adult" dall'eta' del consenso; "unknown" se non risponde.
      "unknown" vale come "child" per la pubblicita' (Families: "children or users of unknown age").
   3) Pubblicita' (97zn -> AdsPlugin.java): child/unknown = dalla 1.0.10 (113) NESSUN video con premio (regole Families: i video
      con premio di AdMob non si chiudono dopo 5 secondi); prima: trattamento per bambini (TFCD), contenuti G, nessun ID pubblicita',
      nessuna personalizzazione; teen = sotto l'eta' del consenso (TFUA): mai personalizzata, contenuti PG; adult = come prima.
   4) Account e backup online (Firebase): solo da "adult" in su. Chi non ha ancora detto l'eta' e tocca "Accedi" vede prima la
      schermata dell'eta'. Chi era gia' collegato e risulta minore: il backup online si spegne su questo telefono, i dati restano.
   5) Chat con il compagno (solo risposte gia' scritte, niente viene inviato): promemoria di sicurezza per tutti.
   6) Pacchetti di Tanì: detto chiaro che i Tanì non sono soldi veri, che i pacchetti costano soldi veri e si pagano solo con
      Google Play; per bambini e ragazzi anche "chiedi a un adulto". */
const AGE_CONSENT = { IT: 14, AT: 14, ES: 14, LT: 14, BG: 14, CY: 14, FR: 15, CZ: 15, GR: 15, SI: 15, BE: 13, DK: 13, EE: 13, FI: 13, LV: 13, MT: 13, PT: 13, SE: 13, GB: 13, NO: 13, IS: 13, US: 13 };
const AGE_LANG_REGION = { it: "IT", de: "DE", es: "ES", fr: "FR", pt: "PT", nl: "NL", pl: "PL", ru: "RU", tr: "TR", ja: "JP", ko: "KR", zh: "CN", zht: "TW", en: "" };
function ageRegion() {
  const tryReg = (l) => { const m = /[-_]([A-Za-z]{2})\b/.exec(l || ""); return m ? m[1].toUpperCase() : ""; };
  let r = ""; try { r = tryReg(Intl.DateTimeFormat().resolvedOptions().locale); } catch (e) { /* niente */ }
  if (!r) try { r = tryReg(navigator.language) || (navigator.languages || []).map(tryReg).find(Boolean) || ""; } catch (e) { /* niente */ }
  return r || AGE_LANG_REGION[S.lang] || "";
}
/* fix 1.0.9 (verifica privacy M4): prima contava solo la regione della lingua del telefono: un ragazzo di 13 anni in Italia
   con il telefono in inglese (Stati Uniti) risultava adulto. Ora si guardano TUTTI i segnali che il telefono da' (lingue del
   telefono, fuso orario, lingua dell'app) e vale l'eta' piu' alta; 16 se un Paese non e' in tabella o se non c'e' nessun segnale. */
const AGE_TZ = { "Europe/Rome": "IT", "Europe/Vatican": "IT", "Europe/San_Marino": "IT", "Europe/Berlin": "DE", "Europe/Busingen": "DE", "Europe/Vienna": "AT", "Europe/Madrid": "ES", "Africa/Ceuta": "ES", "Atlantic/Canary": "ES", "Europe/Paris": "FR", "Europe/Brussels": "BE", "Europe/Amsterdam": "NL", "Europe/Luxembourg": "LU", "Europe/Zurich": "CH", "Europe/Lisbon": "PT", "Atlantic/Madeira": "PT", "Atlantic/Azores": "PT", "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Warsaw": "PL", "Europe/Prague": "CZ", "Europe/Bratislava": "SK", "Europe/Budapest": "HU", "Europe/Ljubljana": "SI", "Europe/Zagreb": "HR", "Europe/Athens": "GR", "Asia/Nicosia": "CY", "Europe/Nicosia": "CY", "Asia/Famagusta": "CY", "Europe/Malta": "MT", "Europe/Copenhagen": "DK", "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Helsinki": "FI", "Europe/Tallinn": "EE", "Europe/Riga": "LV", "Europe/Vilnius": "LT", "Europe/Sofia": "BG", "Europe/Bucharest": "RO", "Atlantic/Reykjavik": "IS", "Europe/Vaduz": "LI", "Europe/Monaco": "MC", "Europe/Andorra": "AD", "Europe/Istanbul": "TR", "Europe/Moscow": "RU", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Shanghai": "CN", "Asia/Taipei": "TW", "Asia/Hong_Kong": "HK", "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US", "America/Detroit": "US", "America/Boise": "US", "Pacific/Honolulu": "US" };
function ageRegions() {
  const tryReg = (l) => { const m = /[-_]([A-Za-z]{2})\b/.exec(l || ""); return m ? m[1].toUpperCase() : ""; };
  const out = new Set();
  try { out.add(tryReg(Intl.DateTimeFormat().resolvedOptions().locale)); } catch (e) { /* niente */ }
  try { [navigator.language].concat(navigator.languages || []).forEach((l) => out.add(tryReg(l))); } catch (e) { /* niente */ }
  try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; out.add(AGE_TZ[tz] || (/^America\/(Indiana|Kentucky|North_Dakota)\//.test(tz) ? "US" : "")); } catch (e) { /* niente */ }
  out.add(AGE_LANG_REGION[S.lang] || ""); out.delete("");
  return [...out];
}
const ageConsent = () => { const r = ageRegions(); return r.length ? Math.max(...r.map((x) => AGE_CONSENT[x] || 16)) : 16; };
function ageYears(a) {
  if (!a || !a.y || !a.m) return null; const n = new Date(); const y = n.getFullYear(), m = n.getMonth() + 1;
  return y - a.y - (m <= a.m ? 1 : 0); /* senza il giorno: nel mese del compleanno si conta l'anno prima (prudente) */
}
function ageBand() {
  const a = AGE_VALUE; if (!a || typeof a !== "object") return "unknown"; if (a.skip) return "unknown";
  const n = ageYears(a); if (n == null) return "unknown";
  return n < 13 ? "child" : n < ageConsent() ? "teen" : "adult";
}
/* per la pubblicita'. 1.0.11 (18/11/2026): pubblico di destinazione 13+ (13-15, 16-17, 18+).
   La risposta esplicita "Preferisco non dirlo" resta "unknown" per le altre protezioni, ma per gli annunci vale "teen"
   (TFUA, contenuti PG, mai personalizzata): i video con premio sono disponibili. La domanda non ancora risposta e' diversa:
   AGE_VALUE resta undefined e adsOn() blocca ogni chiamata all'SDK finche' la persona non risponde o sceglie di non dirlo.
   Chi dichiara meno di 13 anni ("child") resta senza video, SDK e UMP (97zn adsKid, AdsPlugin.java).
   Tutto il resto NON cambia: per ageBand, ageCloudOk (account e backup online), le note "Chiedi a un adulto" e la modalita'
   protetta (ageKid, 98zz), skip e pending restano "unknown".
   fix 1.0.9: chi ha meno di 18 anni non riceve mai il trattamento "adult" per la pubblicita' personalizzabile. */
const ageAds = () => { const b = ageBand(); if (b === "unknown") return "teen"; if (b === "adult" && ageYears(AGE_VALUE) < 18) return "teen"; return b; };
const ageCloudOk = () => ageBand() === "adult";
/* modalita' protetta (98zz) e righe di Plus per i piu' piccoli: sotto i 13 anni dichiarati O eta' non detta (come prima della 1.0.11) */
const ageKid = () => { const b = ageBand(); return b === "child" || b === "unknown"; };

const AGE_T = {
  it: { T: "La tua età", P: "Inserisci mese e anno di nascita: ci serve per mostrarti contenuti e pubblicità adatti alla tua età. Resta solo su questo telefono.", month: "Mese", year: "Anno", go: "Continua", skip: "Preferisco non dirlo", note: "Te lo chiediamo una volta sola.", cloudNo: "Con la tua età il backup online non è disponibile: i tuoi progressi restano su questo telefono. Puoi comunque salvarne una copia in un file.", cloudOff: "Il backup online è stato spento su questo telefono. I tuoi progressi restano qui.", money: "I Tanì sono monete del gioco, non soldi veri. I pacchetti invece costano soldi veri (il prezzo è sul pulsante) e si pagano solo con Google Play.", adult: "Chiedi sempre a un adulto prima di comprare qualcosa.", chatSafe: "Ricorda: non scrivere mai qui o online il tuo nome completo, l'indirizzo, la scuola o il numero di telefono." },
  en: { T: "Your age", P: "Enter your month and year of birth: we use it to show you content and ads that suit your age. It stays only on this phone.", month: "Month", year: "Year", go: "Continue", skip: "I'd rather not say", note: "We only ask this once.", cloudNo: "Online backup isn't available for your age: your progress stays on this phone. You can still save a copy to a file.", cloudOff: "Online backup has been turned off on this phone. Your progress stays here.", money: "Tanì are game coins, not real money. Packs cost real money (the price is on the button) and are paid only through Google Play.", adult: "Always ask an adult before you buy anything.", chatSafe: "Remember: never write your full name, address, school or phone number here or anywhere online." },
  de: { T: "Dein Alter", P: "Gib Monat und Jahr deiner Geburt ein: Damit zeigen wir dir Inhalte und Werbung, die zu deinem Alter passen. Die Angabe bleibt nur auf diesem Handy.", month: "Monat", year: "Jahr", go: "Weiter", skip: "Möchte ich nicht sagen", note: "Wir fragen nur einmal.", cloudNo: "Für dein Alter gibt es kein Online-Backup: Dein Fortschritt bleibt auf diesem Handy. Du kannst aber eine Kopie als Datei speichern.", cloudOff: "Das Online-Backup wurde auf diesem Handy ausgeschaltet. Dein Fortschritt bleibt hier.", money: "Tanì sind Spielmünzen, kein echtes Geld. Pakete kosten echtes Geld (der Preis steht auf dem Knopf) und werden nur über Google Play bezahlt.", adult: "Frag immer einen Erwachsenen, bevor du etwas kaufst.", chatSafe: "Denk dran: Schreib hier und im Internet nie deinen vollen Namen, deine Adresse, deine Schule oder deine Telefonnummer." },
  es: { T: "Tu edad", P: "Escribe el mes y el año en que naciste: lo usamos para mostrarte contenido y anuncios adecuados para tu edad. Solo se guarda en este teléfono.", month: "Mes", year: "Año", go: "Continuar", skip: "Prefiero no decirlo", note: "Solo te lo preguntamos una vez.", cloudNo: "La copia en línea no está disponible para tu edad: tu progreso se queda en este teléfono. Aun así, puedes guardar una copia en un archivo.", cloudOff: "La copia en línea se ha desactivado en este teléfono. Tu progreso se queda aquí.", money: "Los Tanì son monedas del juego, no dinero real. Los paquetes cuestan dinero real (el precio está en el botón) y solo se pagan con Google Play.", adult: "Pregunta siempre a una persona adulta antes de comprar algo.", chatSafe: "Recuerda: nunca escribas aquí ni en internet tu nombre completo, tu dirección, tu colegio ni tu teléfono." },
  fr: { T: "Ton âge", P: "Indique ton mois et ton année de naissance : cela nous sert à te montrer des contenus et des pubs adaptés à ton âge. L'information reste seulement sur ce téléphone.", month: "Mois", year: "Année", go: "Continuer", skip: "Je préfère ne pas le dire", note: "On ne te le demande qu'une fois.", cloudNo: "La sauvegarde en ligne n'est pas disponible pour ton âge : ta progression reste sur ce téléphone. Tu peux quand même en enregistrer une copie dans un fichier.", cloudOff: "La sauvegarde en ligne a été désactivée sur ce téléphone. Ta progression reste ici.", money: "Les Tanì sont des pièces du jeu, pas de l'argent réel. Les packs coûtent de l'argent réel (le prix est sur le bouton) et se paient uniquement via Google Play.", adult: "Demande toujours à un adulte avant d'acheter quoi que ce soit.", chatSafe: "N'oublie pas : n'écris jamais ici ni en ligne ton nom complet, ton adresse, ton école ou ton numéro de téléphone." },
  pt: { T: "Sua idade", P: "Informe o mês e o ano em que você nasceu: usamos isso para mostrar conteúdos e anúncios adequados à sua idade. Fica só neste celular.", month: "Mês", year: "Ano", go: "Continuar", skip: "Prefiro não dizer", note: "Só perguntamos isso uma vez.", cloudNo: "O backup on-line não está disponível para a sua idade: seu progresso fica neste celular. Mesmo assim, você pode salvar uma cópia em um arquivo.", cloudOff: "O backup on-line foi desligado neste celular. Seu progresso continua aqui.", money: "Os Tanì são moedas do jogo, não dinheiro de verdade. Os pacotes custam dinheiro de verdade (o preço está no botão) e são pagos só pelo Google Play.", adult: "Sempre peça para um adulto antes de comprar qualquer coisa.", chatSafe: "Lembre-se: nunca escreva aqui ou na internet seu nome completo, endereço, escola ou telefone." },
  ja: { T: "あなたの年齢", P: "生まれた年と月を入力してください。年齢に合った内容と広告を表示するために使います。この情報はこのスマホにだけ保存されます。", month: "月", year: "年", go: "続ける", skip: "答えない", note: "この質問は一度だけです。", cloudNo: "あなたの年齢ではオンラインバックアップは使えません。進み具合はこのスマホに残ります。ファイルにコピーを保存することはできます。", cloudOff: "このスマホでオンラインバックアップをオフにしました。進み具合はここに残ります。", money: "Tanìはゲームのコインで、本物のお金ではありません。パックは本物のお金がかかり（値段はボタンに書いてあります）、Google Playでのみ支払います。", adult: "何かを買う前に、必ず大人に聞いてね。", chatSafe: "名前（フルネーム）、住所、学校、電話番号は、ここにもネットのどこにも書かないでね。" },
  ko: { T: "나이", P: "태어난 연도와 월을 입력해 주세요. 나이에 맞는 콘텐츠와 광고를 보여 주는 데 써요. 이 정보는 이 휴대폰에만 남아요.", month: "월", year: "연도", go: "계속", skip: "말하고 싶지 않아요", note: "이 질문은 한 번만 해요.", cloudNo: "이 나이에서는 온라인 백업을 쓸 수 없어요. 진행 상황은 이 휴대폰에 남아요. 파일로 사본을 저장할 수는 있어요.", cloudOff: "이 휴대폰에서 온라인 백업을 껐어요. 진행 상황은 여기에 남아요.", money: "Tanì는 게임 속 동전이고 진짜 돈이 아니에요. 패키지는 진짜 돈이 들고(가격은 버튼에 있어요) Google Play로만 결제해요.", adult: "무언가를 사기 전에는 꼭 어른에게 물어보세요.", chatSafe: "기억하세요: 여기에도, 인터넷 어디에도 이름 전체, 주소, 학교, 전화번호를 쓰지 마세요." },
  zh: { T: "你的年龄", P: "请填写你出生的年份和月份：我们用它来显示适合你年龄的内容和广告。这些信息只保存在这台手机上。", month: "月", year: "年", go: "继续", skip: "我不想说", note: "我们只问这一次。", cloudNo: "按你的年龄，不能使用在线备份：你的进度保存在这台手机上。你仍然可以把副本保存成文件。", cloudOff: "这台手机上的在线备份已关闭。你的进度仍保存在这里。", money: "Tanì 是游戏里的金币，不是真钱。礼包要花真钱（价格写在按钮上），并且只能通过 Google Play 付款。", adult: "买任何东西之前，一定要先问问大人。", chatSafe: "记住：不要在这里或网上的任何地方写下你的全名、住址、学校或电话号码。" },
  zht: { T: "你的年齡", P: "請填寫你出生的年份和月份：我們用它來顯示適合你年齡的內容和廣告。這些資訊只保存在這支手機上。", month: "月", year: "年", go: "繼續", skip: "我不想說", note: "我們只問這一次。", cloudNo: "依你的年齡，不能使用線上備份：你的進度保存在這支手機上。你仍然可以把副本存成檔案。", cloudOff: "這支手機上的線上備份已關閉。你的進度仍保存在這裡。", money: "Tanì 是遊戲裡的金幣，不是真的錢。禮包要花真的錢（價格寫在按鈕上），而且只能透過 Google Play 付款。", adult: "買任何東西之前，一定要先問問大人。", chatSafe: "記住：不要在這裡或網路上的任何地方寫下你的全名、地址、學校或電話號碼。" },
  ru: { T: "Твой возраст", P: "Укажи месяц и год рождения: так мы покажем материалы и рекламу, подходящие по возрасту. Это остаётся только на этом телефоне.", month: "Месяц", year: "Год", go: "Продолжить", skip: "Не хочу говорить", note: "Мы спрашиваем об этом только один раз.", cloudNo: "Для твоего возраста онлайн-копия недоступна: прогресс остаётся на этом телефоне. Копию всё равно можно сохранить в файл.", cloudOff: "Онлайн-копия на этом телефоне выключена. Прогресс остаётся здесь.", money: "Tanì нельзя обменять на деньги: это просто игровые монетки. Наборы стоят настоящих денег (цена указана на кнопке) и оплачиваются только через Google Play.", adult: "Всегда спрашивай взрослых, прежде чем что-то покупать.", chatSafe: "Помни: никогда не пиши здесь и в интернете своё полное имя, адрес, школу или номер телефона." },
  pl: { T: "Twój wiek", P: "Wpisz miesiąc i rok urodzenia: dzięki temu pokażemy treści i reklamy odpowiednie do twojego wieku. Te dane zostają tylko na tym telefonie.", month: "Miesiąc", year: "Rok", go: "Dalej", skip: "Wolę nie mówić", note: "Pytamy o to tylko raz.", cloudNo: "W twoim wieku kopia online nie jest dostępna: postępy zostają na tym telefonie. Nadal możesz zapisać kopię w pliku.", cloudOff: "Kopia online została wyłączona na tym telefonie. Postępy zostają tutaj.", money: "Tanì to monety z gry, a nie prawdziwe pieniądze. Pakiety kosztują prawdziwe pieniądze (cena jest na przycisku) i płaci się za nie tylko przez Google Play.", adult: "Zawsze zapytaj dorosłego, zanim coś kupisz.", chatSafe: "Pamiętaj: nigdy nie pisz tutaj ani w internecie swojego pełnego imienia i nazwiska, adresu, szkoły ani numeru telefonu." },
  nl: { T: "Je leeftijd", P: "Vul je geboortemaand en -jaar in: zo laten we inhoud en advertenties zien die bij je leeftijd passen. Het blijft alleen op deze telefoon.", month: "Maand", year: "Jaar", go: "Verder", skip: "Zeg ik liever niet", note: "We vragen dit maar één keer.", cloudNo: "Voor jouw leeftijd is de online back-up niet beschikbaar: je voortgang blijft op deze telefoon. Je kunt wel een kopie in een bestand bewaren.", cloudOff: "De online back-up is op deze telefoon uitgezet. Je voortgang blijft hier.", money: "Tanì zijn munten uit het spel, geen echt geld. Pakketten kosten echt geld (de prijs staat op de knop) en betaal je alleen via Google Play.", adult: "Vraag altijd eerst een volwassene voordat je iets koopt.", chatSafe: "Onthoud: schrijf hier en ergens online nooit je volledige naam, adres, school of telefoonnummer." },
  tr: { T: "Yaşın", P: "Doğduğun ayı ve yılı yaz: yaşına uygun içerik ve reklamları göstermek için kullanırız. Bu bilgi yalnızca bu telefonda kalır.", month: "Ay", year: "Yıl", go: "Devam", skip: "Söylememeyi tercih ederim", note: "Bunu yalnızca bir kez soruyoruz.", cloudNo: "Yaşına göre çevrimiçi yedekleme kullanılamıyor: ilerlemen bu telefonda kalır. Yine de bir kopyasını dosyaya kaydedebilirsin.", cloudOff: "Bu telefonda çevrimiçi yedekleme kapatıldı. İlerlemen burada kalır.", money: "Tanì oyun parasıdır, gerçek para değildir. Paketler gerçek paraya mal olur (fiyat düğmenin üstünde yazar) ve yalnızca Google Play ile ödenir.", adult: "Bir şey satın almadan önce mutlaka bir yetişkine sor.", chatSafe: "Unutma: burada ya da internette hiçbir yere tam adını, adresini, okulunu veya telefon numaranı yazma." }
};
const ageT = () => AGE_T[S.lang] || AGE_T.en;
const AGE_STORE_ISSUE = {
  it: "La scelta precedente non è leggibile. Inseriscila di nuovo: i tuoi progressi non sono stati cancellati.",
  en: "The previous choice could not be read. Please enter it again; your progress has not been erased.",
  de: "Die vorherige Angabe konnte nicht gelesen werden. Bitte gib sie erneut ein; dein Fortschritt bleibt erhalten.",
  es: "No se pudo leer la elección anterior. Introdúcela de nuevo; tu progreso no se ha borrado.",
  fr: "Le choix précédent est illisible. Saisis-le à nouveau ; ta progression n’a pas été effacée.",
  pt: "Não foi possível ler a escolha anterior. Informe-a novamente; seu progresso não foi apagado.",
  ja: "以前の選択を読み取れませんでした。もう一度入力してください。これまでの進行状況は消えていません。",
  ko: "이전 선택을 읽을 수 없어요. 다시 입력해 주세요. 진행 상황은 삭제되지 않았어요.",
  zh: "无法读取之前的选择。请重新填写；你的游戏进度没有被删除。",
  zht: "無法讀取先前的選擇。請重新填寫；你的遊戲進度並未刪除。",
  ru: "Не удалось прочитать предыдущий выбор. Укажи данные ещё раз; игровой прогресс не удалён.",
  pl: "Nie udało się odczytać poprzedniego wyboru. Wpisz go ponownie; postępy nie zostały usunięte.",
  nl: "De vorige keuze kon niet worden gelezen. Vul deze opnieuw in; je voortgang is niet gewist.",
  tr: "Önceki seçim okunamadı. Lütfen yeniden gir; oyun ilerlemen silinmedi."
};
/* Browser fallback: unlike Android noBackupFilesDir, browser storage cannot be guaranteed excluded from device backups. */
const AGE_BROWSER_P = {
  it: "Inserisci mese e anno di nascita: ci serve per mostrarti contenuti e pubblicità adatti alla tua età. Nel browser viene salvata nella memoria locale; le impostazioni di backup del dispositivo potrebbero includerla.",
  en: "Enter your month and year of birth: we use it to show you content and ads that suit your age. In a browser it is stored locally; device backup settings may include it.",
  de: "Gib Monat und Jahr deiner Geburt ein: Damit zeigen wir dir passende Inhalte und Werbung. Im Browser wird die Angabe lokal gespeichert; Gerätesicherungen können sie je nach Einstellung einschließen.",
  es: "Escribe tu mes y año de nacimiento: los usamos para mostrar contenido y anuncios adecuados para tu edad. En el navegador se guarda localmente; las copias de seguridad del dispositivo podrían incluirla.",
  fr: "Indique ton mois et ton année de naissance : nous les utilisons pour adapter les contenus et les publicités. Dans un navigateur, ces données sont stockées localement ; les sauvegardes de l’appareil peuvent les inclure.",
  pt: "Informe o mês e o ano em que você nasceu: usamos esses dados para mostrar conteúdo e anúncios adequados à sua idade. No navegador, ficam armazenados localmente; backups do dispositivo podem incluí-los.",
  ja: "生まれた年と月を入力してください。年齢に合った内容と広告を表示するために使います。ブラウザー内に保存され、端末のバックアップに含まれる場合があります。",
  ko: "태어난 연도와 월을 입력해 주세요. 나이에 맞는 콘텐츠와 광고를 보여 주는 데 사용해요. 브라우저에 로컬로 저장되며 기기 백업에 포함될 수 있어요.",
  zh: "请填写出生年份和月份，以便显示适合你年龄的内容和广告。信息会保存在浏览器本地，设备备份设置可能会将其包含在内。",
  zht: "請填寫出生年份和月份，以便顯示適合你年齡的內容和廣告。資訊會儲存在瀏覽器本機，裝置備份設定可能會將其包含在內。",
  ru: "Укажи месяц и год рождения: мы используем их, чтобы показывать подходящие по возрасту материалы и рекламу. В браузере данные хранятся локально; резервная копия устройства может их включать.",
  pl: "Wpisz miesiąc i rok urodzenia: używamy ich, aby wyświetlać treści i reklamy odpowiednie do twojego wieku. W przeglądarce dane są przechowywane lokalnie; kopia zapasowa urządzenia może je obejmować.",
  nl: "Vul je geboortemaand en -jaar in: zo tonen we inhoud en advertenties die bij je leeftijd passen. In een browser worden ze lokaal opgeslagen; back-ups van het apparaat kunnen ze bevatten.",
  tr: "Doğduğun ayı ve yılı yaz: yaşına uygun içerik ve reklamları göstermek için kullanırız. Tarayıcıda yerel olarak saklanır; cihaz yedeklemeleri bu bilgiyi içerebilir."
};

/* ---------- la schermata neutra ---------- */
let ageAfter = null;
function openAge(after) {
  ageAfter = typeof after === "function" ? after : null; const t = ageT();
  let months = []; try { const f = new Intl.DateTimeFormat(loc(), { month: "long" }); months = Array.from({ length: 12 }, (_, i) => f.format(new Date(2001, i, 15))); } catch (e) { months = Array.from({ length: 12 }, (_, i) => String(i + 1)); }
  const y0 = new Date().getFullYear(); const years = Array.from({ length: 101 }, (_, i) => y0 - i);
  layer.innerHTML = `<div class="overlay agewrap" role="dialog" aria-modal="true" aria-labelledby="agT"><div class="box card agebox"><div class="agepet" aria-hidden="true">${petSVG(S.pet || "germo", "felice", S.hat, typeof stage === "function" && S.pet ? stage() : 0, "")}</div>
    <h2 id="agT" tabindex="-1">${esc(t.T)}</h2><p>${esc(isNativeApp() ? t.P : (AGE_BROWSER_P[S.lang] || AGE_BROWSER_P.en))}</p>
    <div class="agerow"><label class="agefld"><span>${esc(t.month)}</span><select id="ageM" required><option value="" selected></option>${months.map((m, i) => `<option value="${i + 1}">${esc(m)}</option>`).join("")}</select></label>
    <label class="agefld"><span>${esc(t.year)}</span><select id="ageY" required><option value="" selected></option>${years.map((y) => `<option value="${y}">${y}</option>`).join("")}</select></label></div>
    <button class="btn block" id="ageGo" type="button" disabled>${esc(t.go)}</button><button class="link" id="ageSkip" type="button">${esc(t.skip)}</button>
    <p class="small muted">${esc(AGE_STORAGE_RECOVERY ? (AGE_STORE_ISSUE[S.lang] || AGE_STORE_ISSUE.en) : t.note)}</p></div></div>`;
  ageShown = true; trackOnce("eta-chiesta");
  /* (critica fase 2) il lettore di schermo parte dal titolo della finestra (prima il fuoco restava sulla pagina dietro) */
  try { const h = document.getElementById("agT"); if (h) h.focus({ preventScroll: true }); } catch (e) { /* niente */ }
}
async function ageSet(a) {
  try {
    const p = ageNativePlugin();
    if (p && typeof p.set === "function") {
      const choice = a && a.skip ? { skip: true } : { y: a.y, m: a.m };
      const saved = await p.set(choice);
      if (!saved || saved.saved !== true) throw new Error("age_store_write_failed");
      const check = await p.get();
      if (!check || !check.hasChoice || !check.choice) throw new Error("age_store_verify_failed");
      a = check.choice;
    } else {
      a = a && a.skip ? { skip: true } : { y: a.y, m: a.m };
      localStorage.setItem(AGE_KEY, JSON.stringify(a));
    }
  } catch (e) { AGE_STORAGE_FAILED = true; toast(S.lang === "it" ? "Non è stato possibile salvare la scelta. Riprova." : "Could not save your choice. Please try again."); return; }
  AGE_VALUE = a; AGE_READY = true; AGE_STORAGE_FAILED = false; AGE_STORAGE_RECOVERY = false;
  trackOnce(a && a.skip ? "eta-non-detta" : "eta-risposta");
  try { if (typeof adsSt !== "undefined") { adsSt.loaded = false; adsInitP = null; if (S.adsOk && typeof adsInit === "function") adsInit(); } } catch (e) { /* niente */ }
  try { if (ageAds() === "child") { adsSt = { canRequestAds: false, privacyRequired: false, loaded: false }; clearTimeout(adsRetryT); adsRetryOn = false; } } catch (e) { /* niente */ }
  if (!ageCloudOk()) ageCloudStop();
  closeLayer(); render();
  const f = ageAfter; ageAfter = null; if (f) setTimeout(f, 60);
}
document.addEventListener("change", (ev) => {
  if (ev.target && (ev.target.id === "ageM" || ev.target.id === "ageY")) { const ok = document.getElementById("ageM").value && document.getElementById("ageY").value; const b = document.getElementById("ageGo"); if (b) b.disabled = !ok; }
});
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("button"); if (!b) return;
  if (b.id === "ageGo") { ev.stopImmediatePropagation(); const m = +document.getElementById("ageM").value, y = +document.getElementById("ageY").value; if (!m || !y) return; ageSet({ y, m, at: dkey() }); return; }
  if (b.id === "ageSkip") { ev.stopImmediatePropagation(); ageSet({ skip: true, at: dkey() }); return; }
}, true);
/* una volta sola: dopo la prima configurazione, o al primo avvio dopo l'aggiornamento (chi aveva gia' un compagno) */
let ageT0 = Date.now(), ageShown = false, ageDismissed = false;
setInterval(() => {
  try {
    /* (critica fase 2) la risposta e' del telefono: torna anche dopo "Ricomincia da capo", un ripristino o un trasferimento */

    /* (critica fase 2) chiusa senza rispondere (tasto indietro, un'altra finestra): non la si ripropone in questa sessione,
       la si richiede al prossimo avvio. Intanto nessun video con premio (come per i bambini, 113). */
    if (ageShown && AGE_VALUE === undefined && !document.querySelector(".agebox")) { ageShown = false; ageDismissed = true; ageAfter = null; }
    /* (window.__TEST_NOAGE: solo i test automatici vecchi, che non riguardano l'eta', la saltano) */
    if (!AGE_READY || window.__TEST_NOAGE || ageDismissed || AGE_VALUE !== undefined || !S.pet || layer.innerHTML || (typeof tutOn !== "undefined" && tutOn) || Date.now() - ageT0 < 2500) return;
    openAge();
  } catch (e) { /* niente */ }
}, 1200);

/* ---------- (critica fase 2) l'eta' resta davvero solo su questo telefono ----------
   Copie, trasferimenti e backup online non contengono "age". Nell'app Android la scelta vive nel file nativo
   getNoBackupFilesDir() (escluso da backup automatico e trasferimento dispositivo-dispositivo); il Web usa AGE_KEY
   come deposito locale di ripiego. Android non mantiene una copia dell'eta' in Local Storage o nello stato esportabile. */
const AGE_KEY = "tanetto-eta";
let AGE_VALUE, AGE_READY = false, AGE_STORAGE_FAILED = false, AGE_STORAGE_RECOVERY = false, ageInitP = null;
function ageNativePlugin() {
  try { const C = window.Capacitor; if (C && C.Plugins && C.Plugins.TanettoAge) return C.Plugins.TanettoAge; if (C && C.registerPlugin) return C.registerPlugin("TanettoAge"); } catch (e) { /* browser or unavailable bridge */ }
  return null;
}
function ageScrubRaw(raw) {
  try { const o = JSON.parse(raw); if (!o || typeof o !== "object" || Array.isArray(o) || !Object.prototype.hasOwnProperty.call(o, "age")) return raw; delete o.age; return JSON.stringify(o); }
  catch (e) { return raw; } // Never destroy an unreadable recovery copy.
}
function ageScrubLocalCopies() {
  try { const keys = [KEY, ...Array.from({ length: SNAP_N }, (_, i) => SNAP_KEY(i + 1)), ...brokenKeys()]; keys.forEach((k) => { const raw = localStorage.getItem(k); if (raw == null) return; const clean = ageScrubRaw(raw); if (clean !== raw) localStorage.setItem(k, clean); }); localStorage.removeItem(AGE_KEY); }
  catch (e) { AGE_STORAGE_FAILED = true; return false; }
  return true;
}
function ageInit() {
  if (ageInitP) return ageInitP;
  ageInitP = (async () => {
    const legacy = S && S["age"] && typeof S["age"] === "object" ? S["age"] : null;
    if (S && Object.prototype.hasOwnProperty.call(S, "age")) delete S.age;
    try { if (typeof snapT !== "undefined" && snapT) { clearTimeout(snapT); snapT = null; } } catch (e) { /* niente */ }
    const p = ageNativePlugin();
    if (!p && typeof isNativeApp === "function" && isNativeApp()) throw new Error("native_age_plugin_unavailable");
    if (p && typeof p.get === "function" && typeof p.set === "function") {
      const result = await p.get(); AGE_STORAGE_RECOVERY = !!(result && result.storageIssue); AGE_VALUE = result && result.hasChoice && result.choice ? result.choice : undefined;
      // Never migrate a legacy or restored backup age to a new device: ask again.
      if (!ageScrubLocalCopies()) throw new Error("age_legacy_scrub_failed");
    } else {
      let old = null; try { old = JSON.parse(localStorage.getItem(AGE_KEY) || "null"); } catch (e) { old = null; }
      AGE_VALUE = old || legacy || undefined;
      if (!ageScrubLocalCopies()) throw new Error("age_legacy_scrub_failed");
      if (AGE_VALUE && typeof AGE_VALUE === "object") {
        try { localStorage.setItem(AGE_KEY, JSON.stringify(AGE_VALUE.skip ? { skip: true } : { y: AGE_VALUE.y, m: AGE_VALUE.m })); }
        catch (e) { throw new Error("age_browser_store_unavailable"); }
      }
      if (S && Object.prototype.hasOwnProperty.call(S, "age")) delete S.age;
    }
    AGE_READY = true; AGE_STORAGE_FAILED = false; save();
    if (typeof A !== "undefined" && A.uid && !ageCloudOk() && typeof ageCloudStop === "function") ageCloudStop();
    return true;
  })().catch(() => { AGE_STORAGE_FAILED = true; AGE_READY = false; ageInitP = null; setTimeout(() => { if (!AGE_READY) ageInit(); }, 2500); return false; });
  return ageInitP;
}
let ageCloudExitPermit = false;
// Defense in depth: a legacy tab or restore must never reintroduce age into serialized state.
const _saveAgeClean = save;
save = function (...args) { if (S && Object.prototype.hasOwnProperty.call(S, "age")) delete S.age; return _saveAgeClean.apply(this, args); };
if (typeof packState === "function") { const _packStateAgeClean = packState; packState = function (...args) { if (S && Object.prototype.hasOwnProperty.call(S, "age")) delete S.age; return _packStateAgeClean.apply(this, args); }; }
if (typeof saveBackup === "function") { const _saveBackupAgeClean = saveBackup; saveBackup = function (...args) { if (S && Object.prototype.hasOwnProperty.call(S, "age")) delete S.age; return _saveBackupAgeClean.apply(this, args); }; }
ageInit();
if (typeof fbLoad === "function") {
  const _fbLoadAgeGate = fbLoad;
  fbLoad = function (...args) {
    return ageInit().then(() => {
      if (!AGE_READY || (!ageCloudOk() && !ageCloudExitPermit)) throw new Error("age_cloud_blocked");
      return _fbLoadAgeGate.apply(this, args);
    });
  };
}
/* ---------- account e backup online: solo per gli adulti ---------- */
function ageCloudStop() {
  try {
    if (typeof signedIn === "function" && signedIn()) {
      if (typeof fbLoad === "function") {
        ageCloudExitPermit = true;
        fbLoad().then(() => window.TanFB && window.TanFB.out && window.TanFB.out()).catch(() => {}).finally(() => { ageCloudExitPermit = false; });
      }
      const p = typeof gsi === "function" ? gsi() : null; if (p && p.signOut) p.signOut().catch(() => {});
      A = { freq: A.freq || "week" }; saveA(); setTimeout(() => toast(ageT().cloudOff), 400);
    }
  } catch (e) { /* niente */ }
}
const AGE_SIGNIN = ["acGoogle", "acGoogle2", "acEmail", "acEmail2"];
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("button"); if (!b || !AGE_SIGNIN.includes(b.id)) return;
  if (ageCloudOk()) return;
  ev.stopImmediatePropagation(); ev.preventDefault();
  /* (critica fase 2) chi non l'ha detta (anche "Preferisco non dirlo") la puo' dire adesso; chi ha gia' risposto no */
  if (AGE_VALUE === undefined || (AGE_VALUE && AGE_VALUE.skip)) { const id = b.id; openAge(() => { if (ageCloudOk()) { const x = document.getElementById(id); if (x) x.click(); else render(); } else toast(ageT().cloudNo); }); return; }
  toast(ageT().cloudNo);
}, true);
if (typeof acctCard === "function") {
  const _acctCardAge = acctCard;
  acctCard = function () {
    const h = _acctCardAge(); if (ageCloudOk() || AGE_VALUE === undefined || (AGE_VALUE && AGE_VALUE.skip)) return h;
    /* niente inviti all'account (ne' "accedi di nuovo"): solo la riga chiara sui dati che restano sul telefono */
    const i = h.indexOf("</h3>"); if (i < 0 || (typeof signedIn === "function" && signedIn())) return h;
    return h.slice(0, i + 5) + `<p class="small">${esc(ageT().cloudNo)}</p></div>`;
  };
}
if (typeof acctNudgeDue === "function") { const _acctNudgeDueAge = acctNudgeDue; acctNudgeDue = function () { return ageCloudOk() && _acctNudgeDueAge(); }; }
/* gia' collegato e minore (per esempio dopo il ripristino): il backup online si spegne, i dati restano */
setTimeout(() => { if (AGE_VALUE !== undefined && !ageCloudOk()) ageCloudStop(); }, 1500);

/* ---------- chat: promemoria di sicurezza ---------- */
if (typeof openChat === "function") {
  const _openChatAge = openChat;
  openChat = function () { _openChatAge(); const n = document.querySelector(".chatbox .chnote"); if (n && !n.querySelector(".chsafe")) n.insertAdjacentHTML("afterend", `<p class="chnote chsafe">${esc(ageT().chatSafe)}</p>`); };
}

/* ---------- pacchetti: Tanì non sono soldi veri; per i minori anche "chiedi a un adulto" ---------- */
const _openTaniShopAge = openTaniShop;
openTaniShop = function (src) {
  _openTaniShopAge(src); const box = document.querySelector(".tshop"); if (!box) return; const t = ageT();
  const p = document.createElement("p"); p.className = "small agemoney"; p.textContent = t.money + (ageBand() !== "adult" ? " " + t.adult : "");
  /* (critica fase 2) a bambini, ragazzi e a chi non ha detto l'eta' non si mostra la promozione "primo acquisto: Tanì doppi" */
  if (ageBand() !== "adult") box.querySelectorAll(".firstpk, .pack .pbadge").forEach((x) => x.remove());
  const h = box.querySelector(".packs"); if (h) h.insertAdjacentElement("beforebegin", p); else box.appendChild(p);
};
/* 1.0.10 (113): a chi risulta bambino (sotto i 13 anni o eta' non detta) non ci sono video con premio (97zn, adsKid): la riga
   di Plus non promette "senza pubblicità", che per lui non vuol dire niente. Stessa frase di 98zd (PR22_PLUS) senza la coda. */
const AGE_PLUS_KID = {
  it: (m) => `${m} Tanì in regalo ogni mese e il regalo del giorno vale il triplo`,
  en: (m) => `${m} Tanì gifted every month, and your daily gift is worth triple`,
  de: (m) => `Jeden Monat ${m} Tanì geschenkt, und dein Tagesgeschenk zählt dreifach`,
  es: (m) => `${m} Tanì de regalo cada mes y el regalo del día vale el triple`,
  fr: (m) => `${m} Tanì offerts chaque mois, et ton cadeau du jour vaut le triple`,
  pt: (m) => `${m} Tanì de presente todo mês e o presente do dia vale o triplo`,
  ja: (m) => `毎月${m} Tanìのプレゼント。毎日のプレゼントは3倍に`,
  ko: (m) => `매달 ${m} Tanì 선물, 매일 선물은 세 배`,
  zh: (m) => `每月赠送 ${m} Tanì，每日礼物变成三倍`,
  zht: (m) => `每月送你 ${m} Tanì，每日禮物變成三倍`,
  ru: (m) => `${m} Tanì в подарок каждый месяц, а ежедневный подарок втрое больше`,
  pl: (m) => `${m} Tanì w prezencie co miesiąc, a codzienny prezent jest potrójny`,
  nl: (m) => `Elke maand ${m} Tanì cadeau, en je dagelijkse cadeau is drie keer zoveel`,
  tr: (m) => `Her ay hediye ${m} Tanì, günlük hediyen de üç katı`
};
/* 113: in Profilo › Privacy ed età, a chi ha detto un'età sotto i 13 anni: niente video (come già dice "Preferisco non dirlo") */
const AGE_KID_NOAD = {
  it: "Alla tua età non ci sono video con premio.", en: "At your age there are no reward videos.",
  de: "In deinem Alter gibt es keine Belohnungsvideos.", es: "A tu edad no hay vídeos con premio.",
  fr: "À ton âge, il n'y a pas de vidéos récompensées.", pt: "Na sua idade, não há vídeos com prêmio.",
  ja: "あなたの年齢では、ごほうび動画はありません。", ko: "이 나이에는 보상 영상이 없어요.",
  zh: "你这个年龄没有奖励视频。", zht: "你這個年齡沒有獎勵影片。",
  ru: "Для твоего возраста видео с наградой нет.", pl: "W twoim wieku nie ma filmów z nagrodą.",
  nl: "Voor jouw leeftijd zijn er geen beloningsvideo's.", tr: "Senin yaşında ödüllü video yok."
};
const ageKidNoAd = (txt) => { try { if (ageAds() !== "child") return txt; const x = AGE_KID_NOAD[S.lang] || AGE_KID_NOAD.en; return txt.includes(x) ? txt : txt + (/^(ja|zh|zht)$/.test(S.lang) ? "" : " ") + x; } catch (e) { return txt; } };
function agePlusKid(box) {
  try {
    if (!box || ageAds() !== "child") return; const p = L().plus || {}; const adult = Array.isArray(p.perks) ? p.perks[6] : null;
    if (typeof adult !== "string") return; const kid = (AGE_PLUS_KID[S.lang] || AGE_PLUS_KID.en)(EC.PLUS_MONTH);
    box.querySelectorAll(".perks li span").forEach((x) => { if (!x.children.length && x.textContent === adult) x.textContent = kid; });
  } catch (e) { /* niente */ }
}
if (typeof openPlus === "function") {
  const _openPlusAge = openPlus;
  openPlus = function (...a) { const r = _openPlusAge.apply(this, a); agePlusKid(document.querySelector(".plusbox")); try { if (ageBand() !== "adult") { const box = document.querySelector(".plusbox"); if (box && !box.querySelector(".ageadult")) { const ft = box.querySelector(".plussticky"); const h = `<p class="small ageadult">${esc(ageT().adult)}</p>`; if (ft) ft.insertAdjacentHTML("beforebegin", h); else box.insertAdjacentHTML("beforeend", h); } } } catch (e) { /* niente */ } return r; };
}

/* (critica fase 2) "Ti mancano X Tanì": a bambini, ragazzi e a chi non ha detto l'eta' non si propone un pacchetto preciso
   con il suo prezzo (con i pacchetti x5 la proposta compariva quasi sempre). Restano la stima onesta dei giorni e
   "Vedi i pacchetti", che porta al negozio con "Chiedi sempre a un adulto". */
if (typeof needSheet === "function") {
  const _needSheetAge = needSheet;
  needSheet = function (s) {
    const r = _needSheetAge(s);
    try { if (ageBand() !== "adult") { const box = document.querySelector(".ndsheet"); if (box) box.querySelectorAll(":scope > p.small").forEach((p) => { if (p.className === "small") p.remove(); }); } } catch (e) { /* niente */ }
    return r;
  };
}
