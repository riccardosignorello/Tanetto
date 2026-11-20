"""1.0.10 (113): regole Google Play "Families" (answer/9893335): ai bambini niente video con premio.
1.0.11 (18/11/2026): dopo l'uscita da Families, chi sceglie esplicitamente "Preferisco non dirlo" puo' vedere video teen
non personalizzati; chi non ha ancora risposto resta pending e non attiva l'SDK finche' non sceglie; sotto i 13 anni niente video.
1) child e pending: nessuna offerta in tutta l'app, nessuna chiamata al modulo video (init/load/show/privacy), nessun toast,
   niente "Scelte sulla pubblicita'".
2) skip: i video con premio restano disponibili solo su scelta dell'utente, sempre non personalizzati; nessuna statistica,
   account, backup online, condivisione esterna o offerta commerciale.
3) teen e adult: come prima (pulsanti, testi, video mostrato e premio dato).
4) pending e poi adulto: i video tornano; dichiarata eta' da bambino: restano spenti.
5) testi: informativa, scheda Privacy e Plus in 14 lingue; parti native (AdsPlugin.java e AgeStorePlugin.java)."""
import json, sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T

# il modulo finto dei video conta ogni chiamata (si aggiunge al Capacitor finto di lib110)
SPY = """(() => { const A = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TanettoAds; if (!A) return;
  window.__adc = { init: 0, load: 0, show: 0, privacy: 0, ages: [] };
  ["init", "load", "show", "privacy"].forEach((k) => { const f = A[k]; A[k] = async (o) => { __adc[k]++; if (o && o.age) __adc.ages.push(k + ":" + o.age); return f(o); }; }); })();"""
AGE_NOAD_EN = "At your age there are no reward videos."
TABS = ["today", "home", "shop", "trips", "more"]
SUBS = ["prog", "comp", "set", "acct", "priv", "buy", "help", "about"]
# frase breve in coda al paragrafo dei video dell'informativa (stesse parole del titolo del paragrafo), 14 lingue
SHORT9 = {
    'it': "Sotto i 13 anni non ci sono video con premio; se preferisci non dire l'età, non sono mai personalizzati.",
    'en': "Under 13 there are no rewarded videos; if you'd rather not say your age, they are never personalised.",
    'de': 'Unter 13 Jahren gibt es keine Videos mit Belohnung; wenn du dein Alter lieber nicht sagst, sind sie nie personalisiert.',
    'es': 'Por debajo de los 13 años no hay vídeos con recompensa; si prefieres no decir tu edad, nunca son personalizados.',
    'fr': "Avant 13 ans, il n'y a pas de vidéos récompensées ; si tu préfères ne pas dire ton âge, elles ne sont jamais personnalisées.",
    'pt': 'Abaixo dos 13 anos não há vídeos com recompensa; se você preferir não dizer sua idade, eles nunca são personalizados.',
    'ja': '13歳未満の方には、ごほうび付き動画はありません。年齢を答えなかった方には、パーソナライズされない動画だけが表示されます。',
    'ko': '만 13세 미만이면 보상형 동영상은 없어요. 나이를 말하고 싶지 않다고 하면 맞춤형이 아닌 동영상만 보여요.',
    'zh': '未满 13 岁时没有奖励视频；你选择不告诉我们年龄时，奖励视频绝不个性化。',
    'zht': '未滿 13 歲時沒有獎勵影片；你選擇不告訴我們年齡時，獎勵影片絕不個人化。',
    'ru': 'До 13 лет видео с наградой нет; если ты не хочешь говорить свой возраст, они никогда не персонализируются.',
    'pl': 'Poniżej 13 lat nie ma filmów z nagrodą; jeśli wolisz nie podawać wieku, nigdy nie są one spersonalizowane.',
    'nl': "Onder de 13 jaar zijn er geen video's met beloning; als je je leeftijd liever niet zegt, zijn ze nooit gepersonaliseerd.",
    'tr': '13 yaşın altındaysan ödüllü video yoktur; yaşını söylememeyi tercih edersen videolar asla kişiselleştirilmez.',
}
# la stessa frase nella scheda Privacy del Profilo (stesse parole della scheda), 14 lingue
SHORTCARD = {
    'it': "Sotto i 13 anni non ci sono video con premio; se preferisci non dire l'età, non sono mai personalizzati.",
    'en': "Under 13 there are no reward videos; if you'd rather not say your age, they are never personalised.",
    'de': 'Unter 13 Jahren gibt es keine Belohnungsvideos; wenn du dein Alter lieber nicht sagst, sind sie nie personalisiert.',
    'es': 'Por debajo de los 13 años no hay vídeos con premio; si prefieres no decir tu edad, nunca son personalizados.',
    'fr': "Avant 13 ans, il n'y a pas de vidéos récompensées ; si tu préfères ne pas dire ton âge, elles ne sont jamais personnalisées.",
    'pt': 'Abaixo dos 13 anos não há vídeos com prêmio; se você preferir não dizer sua idade, eles nunca são personalizados.',
    'ja': '13歳未満の方には、ごほうび動画はありません。年齢を答えなかった方には、パーソナライズされない動画だけが表示されます。',
    'ko': '만 13세 미만이면 보상 영상은 없어요. 나이를 말하고 싶지 않다고 하면 맞춤형이 아닌 영상만 보여요.',
    'zh': '未满 13 岁时没有奖励视频；你选择不告诉我们年龄时，奖励视频绝不个性化。',
    'zht': '未滿 13 歲時沒有獎勵影片；你選擇不告訴我們年齡時，獎勵影片絕不個人化。',
    'ru': 'До 13 лет видео с наградой нет; если ты не хочешь говорить свой возраст, они никогда не персонализируются.',
    'pl': 'Poniżej 13 lat nie ma filmów z nagrodą; jeśli wolisz nie podawać wieku, nigdy nie są one spersonalizowane.',
    'nl': "Onder de 13 jaar zijn er geen beloningsvideo's; als je je leeftijd liever niet zegt, zijn ze nooit gepersonaliseerd.",
    'tr': '13 yaşın altındaysan ödüllü video yoktur; yaşını söylememeyi tercih edersen videolar asla kişiselleştirilmez.',
}
# 1.0.11 (uscita da Families, 18/11/2026): nell'informativa la frase sui video per chi non dice l'eta' e la promessa sui dati
# per chi indica meno di 13 anni, 14 lingue
KIDS111 = {'it': ('Se preferisci non dirlo, invece, i video con premio restano disponibili (li guardi solo se vuoi) e non sono mai personalizzati.', "se indichi meno di 13 anni l'app non invia"), 'en': ("If you'd rather not say, though, rewarded videos stay available (you only watch them if you want) and are never personalised.", 'if you enter an age under 13, the app sends'), 'de': ('Wenn du dein Alter lieber nicht sagst, bleiben Videos mit Belohnung dagegen verfügbar (du siehst sie nur, wenn du willst) und sind nie personalisiert.', 'Wenn du ein Alter unter 13 angibst, sendet die App'), 'es': ('Si prefieres no decirlo, en cambio, los vídeos con recompensa siguen disponibles (solo los ves si quieres) y nunca son personalizados.', 'si indicas menos de 13 años, la app no envía'), 'fr': ('Si tu préfères ne pas le dire, les vidéos récompensées restent en revanche disponibles (tu ne les regardes que si tu veux) et ne sont jamais personnalisées.', "si tu indiques moins de 13 ans, l'app n'envoie"), 'pt': ('Se você preferir não dizer, porém, os vídeos com recompensa continuam disponíveis (você só assiste se quiser) e nunca são personalizados.', 'se você informar menos de 13 anos, o app não envia'), 'ja': ('ただし、年齢を答えなかった場合は、ごほうび付き動画を利用できます（見たいときだけ見ます）。動画がパーソナライズされることはありません。', '13歳未満の年齢を入力した場合、あなたや'), 'ko': ('다만 나이를 말하고 싶지 않다고 하면 보상형 동영상은 볼 수 있어요(원할 때만 봐요). 이 동영상은 맞춤형으로 표시되지 않아요.', '만 13세 미만의 나이를 입력하면 사용자나'), 'zh': ('不过，如果你选择不说，奖励视频仍然可以观看（只在你想看时才看），而且绝不个性化。', '如果你填写的年龄未满 13 岁，应用不会'), 'zht': ('不過，如果你選擇不說，獎勵影片仍然可以觀看（只在你想看時才看），而且絕不個人化。', '如果你填寫的年齡未滿 13 歲，App 不會'), 'ru': ('Если же ты не хочешь называть возраст, видео с наградой остаются доступными (ты смотришь их, только если хочешь) и никогда не персонализируются.', 'если ты укажешь возраст меньше 13 лет, приложение не отправляет'), 'pl': ('Jeśli natomiast wolisz nie podawać wieku, filmy z nagrodą są dostępne (oglądasz je tylko wtedy, gdy chcesz) i nigdy nie są spersonalizowane.', 'jeśli podasz wiek poniżej 13 lat, aplikacja nie wysyła'), 'nl': ("Zeg je je leeftijd liever niet, dan blijven video's met beloning wel beschikbaar (je kijkt ze alleen als je wilt) en zijn ze nooit gepersonaliseerd.", 'als je een leeftijd onder de 13 invult, stuurt de app'), 'tr': ('Yaşını söylememeyi tercih edersen ise ödüllü videolar kullanılabilir (yalnızca istersen izlersin) ve asla kişiselleştirilmez.', '13 yaşından küçük bir yaş girersen uygulama ne bize')}
# 1.0.11: il riassunto "In breve" (primo paragrafo dell'informativa) dice la stessa regola dei video, 14 lingue
PSHORT111 = {'it': "(sotto i 13 anni non ce ne sono; se non dici l'età, non sono mai personalizzati)", 'en': "(if you're under 13 there are none; if you don't say your age, they're never personalised)", 'de': '(unter 13 Jahren gibt es keine; wenn du dein Alter nicht sagst, sind sie nie personalisiert)', 'es': '(si tienes menos de 13 años no hay ninguno; si no dices tu edad, nunca son personalizados)', 'fr': "(avant 13 ans il n'y en a pas ; si tu ne dis pas ton âge, elles ne sont jamais personnalisées)", 'pt': '(abaixo dos 13 anos não há nenhum; se você não disser sua idade, eles nunca são personalizados)', 'ja': '（13歳未満の方には広告はありません。年齢を答えなかった方には、パーソナライズされない動画だけが表示されます）', 'ko': '(만 13세 미만이면 광고가 없어요. 나이를 말하지 않으면 맞춤형이 아닌 영상만 보여요)', 'zh': '（未满 13 岁时没有广告；没有告诉我们年龄时，视频绝不个性化）', 'zht': '（未滿 13 歲時沒有廣告；沒有告訴我們年齡時，影片絕不個人化）', 'ru': '(до 13 лет рекламы нет; если возраст не указан, она никогда не персонализируется)', 'pl': '(poniżej 13 lat nie ma ich wcale; jeśli nie podasz wieku, nigdy nie są spersonalizowane)', 'nl': '(onder de 13 jaar zijn er geen; als je je leeftijd niet zegt, zijn ze nooit gepersonaliseerd)', 'tr': '(13 yaşın altındaysan hiç reklam yoktur; yaşını söylemezsen videolar asla kişiselleştirilmez)'}
# frasi vecchie (1.0.10 / 112) che promettevano video adatti ai bambini: non devono esserci piu'
OLD13 = {
    'it': "Sotto i 13 anni, o se preferisci non dirlo, i video con premio sono solo quelli adatti ai bambini, mai personalizzati, e l'ID pubblicità non viene inviato.",
    'en': "Under 13, or if you'd rather not say, reward videos are only child-appropriate ones, never personalised, and the advertising ID is not sent.",
    'de': 'Unter 13 Jahren, oder wenn du es lieber nicht sagst, gibt es nur kindgerechte Belohnungsvideos, nie personalisiert, und die Werbe-ID wird nicht gesendet.',
    'es': 'Por debajo de los 13 años, o si prefieres no decirlo, los vídeos con premio son solo los adecuados para niños, nunca personalizados, y no se envía el ID de publicidad.',
    'fr': "Avant 13 ans, ou si tu préfères ne pas le dire, les vidéos récompensées sont uniquement adaptées aux enfants, jamais personnalisées, et l'identifiant publicitaire n'est pas envoyé.",
    'pt': 'Abaixo dos 13 anos, ou se você preferir não dizer, os vídeos com prêmio são só os adequados para crianças, nunca personalizados, e o ID de publicidade não é enviado.',
    'ja': '13歳未満の方、または答えなかった方には、子ども向けのごほうび動画だけが表示され、パーソナライズされることはなく、広告IDも送信されません。',
    'ko': '만 13세 미만이거나 말하고 싶지 않다고 하면 어린이에게 맞는 보상 영상만 보이고, 맞춤 광고는 없으며 광고 ID도 보내지 않아요.',
    'zh': '未满 13 岁，或你选择不告诉我们时，只会显示适合儿童的奖励视频，绝不个性化，也不会发送广告 ID。',
    'zht': '未滿 13 歲，或你選擇不告訴我們時，只會顯示適合兒童的獎勵影片，絕不個人化，也不會傳送廣告 ID。',
    'ru': 'До 13 лет, или если ты не хочешь говорить, показываются только подходящие детям видео с наградой, никогда не персонализированные, и рекламный идентификатор не передаётся.',
    'pl': 'Poniżej 13 lat, albo jeśli wolisz nie mówić, filmiki z nagrodą są tylko odpowiednie dla dzieci, nigdy spersonalizowane, a identyfikator reklamowy nie jest wysyłany.',
    'nl': "Onder de 13 jaar, of als je het liever niet zegt, zie je alleen beloningsvideo's die geschikt zijn voor kinderen, nooit gepersonaliseerd, en wordt de advertentie-ID niet verstuurd.",
    'tr': '13 yaşın altındaysan ya da söylememeyi tercih edersen yalnızca çocuklara uygun ödüllü videolar gösterilir, hiçbir zaman kişiselleştirilmez ve reklam kimliği gönderilmez.',
}
# testo vecchio di 'Preferisco non dirlo' in Profilo
OLDNO = {
    'it': 'Hai preferito non dirla: la pubblicità è sempre adatta ai bambini e il backup online non è disponibile.',
    'en': "You preferred not to say: ads are always child-appropriate and the online backup isn't available.",
    'de': 'Du wolltest es lieber nicht sagen: Die Werbung ist immer kindgerecht und das Online-Backup ist nicht verfügbar.',
    'es': 'Preferiste no decirla: los anuncios son siempre aptos para niños y la copia en línea no está disponible.',
    'fr': "Tu as préféré ne pas le dire : les publicités sont toujours adaptées aux enfants et la sauvegarde en ligne n'est pas disponible.",
    'pt': 'Você preferiu não dizer: os anúncios são sempre adequados para crianças e o backup on-line não está disponível.',
    'ja': '答えないことを選びました。広告は常に子ども向けのものだけになり、オンラインバックアップは使えません。',
    'ko': '말하지 않기로 했어요. 광고는 항상 어린이에게 맞는 것만 나오고 온라인 백업은 사용할 수 없어요.',
    'zh': '你选择了不告诉我们：广告始终适合儿童，也不能使用在线备份。',
    'zht': '你選擇了不告訴我們：廣告一律適合兒童，也無法使用線上備份。',
    'ru': 'Без ответа на этот вопрос реклама всегда подходит для детей, а онлайн-копия недоступна.',
    'pl': 'Wybrano odpowiedź „wolę nie mówić”: reklamy są zawsze odpowiednie dla dzieci, a kopia online nie jest dostępna.',
    'nl': 'Je zei het liever niet: advertenties zijn altijd geschikt voor kinderen en de online back-up is niet beschikbaar.',
    'tr': 'Söylememeyi tercih ettin: reklamlar her zaman çocuklara uygundur ve çevrimiçi yedek kullanılamaz.',
}
# frase vecchia del paragrafo per gli Stati Uniti
OLDKIDS = {
    'it': "l'unico servizio che riceve un identificativo tecnico è Google AdMob (pubblicità adatta ai bambini, non personalizzata e senza l'ID pubblicità), e per loro le statistiche anonime sono sempre spente.",
    'en': 'the only service that receives a technical identifier is Google AdMob (child-appropriate ads that are not personalised, without the advertising ID), and anonymous statistics are always off for them.',
    'de': 'Nur ein Dienst erhält eine technische Kennung, Google AdMob (kindgerechte, nicht personalisierte Werbung ohne Werbe-ID), und die anonymen Statistiken sind für sie immer ausgeschaltet.',
    'es': 'el único servicio que recibe un identificador técnico es Google AdMob (anuncios adecuados para niños, no personalizados y sin el ID de publicidad), y para ellos las estadísticas anónimas están siempre desactivadas.',
    'fr': "le seul service qui reçoit un identifiant technique est Google AdMob (des publicités adaptées aux enfants, non personnalisées et sans l'identifiant publicitaire), et les statistiques anonymes sont toujours désactivées pour eux.",
    'pt': 'o único serviço que recebe um identificador técnico é o Google AdMob (anúncios adequados para crianças, não personalizados e sem o ID de publicidade), e para elas as estatísticas anônimas ficam sempre desligadas.',
    'ja': '技術的な識別子を受け取るのはGoogle AdMob（子ども向けでパーソナライズされない広告で、広告IDは使いません）だけで、匿名の統計は常にオフです。',
    'ko': '기술적인 식별 정보를 받는 서비스는 Google AdMob(어린이에게 맞는 비맞춤형 광고, 광고 ID 없이)뿐이고, 익명 통계는 항상 꺼져 있어요.',
    'zh': '只有 Google AdMob（适合儿童、非个性化、不使用广告 ID 的广告）会收到技术标识，匿名统计对他们始终关闭。',
    'zht': '只有 Google AdMob（適合兒童、非個人化、不使用廣告 ID 的廣告）會收到技術識別碼，匿名統計對他們始終關閉。',
    'ru': 'технический идентификатор получает только Google AdMob (подходящая детям неперсонализированная реклама без рекламного идентификатора), а анонимная статистика для них всегда выключена.',
    'pl': 'techniczny identyfikator otrzymuje tylko Google AdMob (reklamy odpowiednie dla dzieci, niespersonalizowane i bez identyfikatora reklamowego), a anonimowe statystyki są dla nich zawsze wyłączone.',
    'nl': 'alleen Google AdMob (niet-gepersonaliseerde advertenties die geschikt zijn voor kinderen, zonder advertentie-ID) ontvangt een technische identificatie, en de anonieme statistieken staan voor hen altijd uit.',
    'tr': "teknik bir tanımlayıcı alan tek hizmet Google AdMob'dur (çocuklara uygun, kişiselleştirilmemiş, reklam kimliği kullanılmayan reklamlar) ve anonim istatistikler onlar için her zaman kapalıdır.",
}
# tutti i testi dei pulsanti dei video (V19AD.gift, V23.adMore) e degli avvisi, in tutte le lingue, letti dall'app
ALLTXT = """JSON.stringify((() => { const o = []; Object.keys(V19AD).forEach((l) => { const a = V19AD[l];
  ["gift", "thanks"].forEach((k) => { try { o.push(a[k](7)); } catch (e) {} }); o.push(a.none, a.privT);
  const v = V23[l] || {}; ["adMore", "adThanksMore"].forEach((k) => { try { if (v[k]) o.push(v[k](7)); } catch (e) {} }); });
  return o.map((s) => String(s).replace(/7/g, "").replace(/[()（）+]/g, "").trim().slice(0, 14)).filter((s) => s.length >= 6); })())"""

def st0(lang="en", **kw):
    d = dict(done=["water"], giftDay="2026-11-16", visit={"n": 5, "last": "2026-11-16"}, adsOk=1, log=[{"d": "2026-11-16", "g": "water"}], seeds=100)
    d.update(kw); return T.base_state(lang, **d)

async def sweep(pg):
    """visita ogni schermata e ogni scheda; ritorna (pulsanti video trovati, testi dei video trovati, dove)"""
    pats = json.loads(await T.ev(pg, ALLTXT))
    found = []
    async def look(where):
        r = json.loads(await T.ev(pg, """JSON.stringify((() => { const q = '.adbtn, #adGift, #adShop, .adpriv, #adPrivacy';
          const n = document.querySelectorAll(q).length; return { n, t: document.body.innerText }; })())"""))
        hit = [p for p in pats if p in r["t"]]
        if r["n"] or hit: found.append((where, r["n"], hit[:3]))
    for tab in TABS:
        await T.ev(pg, f"layer.innerHTML = ''; tab = '{tab}'; moreSub = null; render(); 1"); await pg.wait_for_timeout(250); await look("tab " + tab)
    for sub in SUBS:
        await T.ev(pg, f"layer.innerHTML = ''; tab = 'more'; moreSub = '{sub}'; render(); 1"); await pg.wait_for_timeout(250); await look("profilo " + sub)
    for name, code in [("negozio dei Tanì", "openTaniShop('t113')"), ("ti mancano", "needSheet({ price: 5000, id: 't113' })"), ("Plus", "openPlus('t113')")]:
        await T.ev(pg, f"layer.innerHTML = ''; tab = 'shop'; render(); {code}; 1"); await pg.wait_for_timeout(700); await look(name)
    await T.ev(pg, "layer.innerHTML = ''; tab = 'today'; render(); 1")
    return found

async def kid_case(b, age, lang="en", adsOk=1, label=None):
    label = label or age
    ctx, pg = await T.page(b, st0(lang, adsOk=adsOk), native=True, age=age, lang="en-US", wait=3000, extra_js=SPY)
    await T.close_layer(pg); await pg.wait_for_timeout(9000)  # il controllo dei video gira ogni 5 secondi
    found = await sweep(pg)
    T.check(f"{label} ({lang}): nessuna offerta di video in nessuna schermata o scheda", not found, found[:4])
    # anche chiamando direttamente le funzioni: niente video, niente avviso "nessuna pubblicità"
    r = json.loads(await T.ev(pg, """(async () => { const t0 = (document.getElementById('toast') || {}).textContent || '';
      let got = 0; await adShow(() => { got = 1; }, 't113'); await adsInit(); await adsLoad();
      const b = adBtn('x', 'y'); const t1 = (document.getElementById('toast') || {}).textContent || '';
      return JSON.stringify({ on: adsOn(), offer: adOffer(), b, got, toastNew: t1 !== t0 ? t1 : '', none: v19ad().none, adc: window.__adc }); })()"""))
    T.check(f"  {label}: adsOn() e adOffer() spenti, adBtn() vuoto, adShow() non da' nulla", r["on"] is False and r["offer"] is False and r["b"] == "" and r["got"] == 0, r)
    T.check(f"  {label}: nessun avviso 'nessuna pubblicità' a chi non puo' averne", r["none"] not in r["toastNew"], r["toastNew"])
    T.check(f"  {label}: nessuna chiamata al modulo dei video (init/load/show/privacy)", r["adc"] and all(r["adc"][k] == 0 for k in ("init", "load", "show", "privacy")), r["adc"])
    # il regalo del giorno appena aperto: nessun pulsante "raddoppia"
    await T.ev(pg, "S.giftDay = null; save(); layer.innerHTML = ''; tab = 'more'; moreSub = 'prog'; render(); 1"); await pg.wait_for_timeout(300)
    await T.ev(pg, "openGift(); 1"); await pg.wait_for_timeout(1500)
    await T.ev(pg, "layer.innerHTML = ''; tab = 'more'; moreSub = 'prog'; render(); 1"); await pg.wait_for_timeout(400)
    r = json.loads(await T.ev(pg, "JSON.stringify({ g: S.giftDay === S.day, n: document.querySelectorAll('.adbtn').length, t: !!document.querySelector('.teaser') })"))
    T.check(f"  {label}: regalo del giorno aperto davvero, nessun pulsante del video", r["g"] and r["t"] and r["n"] == 0, r)
    T.check(f"  nessun errore ({label})", not pg.errs, pg.errs[:2])
    await ctx.close()

async def grown_case(b, age, want, sent=None):
    sent = sent or age
    ctx, pg = await T.page(b, st0("en"), native=True, age=age, lang="en-US", wait=3000, extra_js=SPY)
    await T.close_layer(pg)
    for _ in range(30):
        if await T.ev(pg, "adsSt.loaded"): break
        await pg.wait_for_timeout(500)
    # lo stesso giro di sweep() che per il bambino non deve trovare niente qui trova i video (cosi' il giro non e' cieco)
    found = await sweep(pg); where = [f[0] for f in found if f[1] and f[2]]
    T.check(f"{age}: il giro di tutte le schermate trova i video (Casa/regalo, negozio, 'ti mancano')", all(w in where for w in ("negozio dei Tanì", "ti mancano")) and any(w.startswith("tab ") or w.startswith("profilo ") for w in where), found)
    await T.ev(pg, "tab = 'more'; moreSub = 'prog'; render(); 1"); await pg.wait_for_timeout(400)
    g = await T.ev(pg, "(document.getElementById('adGift') || {}).textContent || ''")
    T.check(f"{age}: pulsante del video sul regalo del giorno (come prima): '{want}'", want in g, g)
    await T.ev(pg, "layer.innerHTML = ''; openTaniShop('t113'); 1"); await pg.wait_for_timeout(600)
    T.check(f"  {age}: pulsante del video nel negozio dei Tanì", await T.ev(pg, "!!layer.querySelector('#adShop')"))
    await T.ev(pg, "layer.innerHTML = ''; needSheet({ price: 5000, id: 't113' }); 1"); await pg.wait_for_timeout(600)
    T.check(f"  {age}: pulsante del video in 'ti mancano X Tanì'", await T.ev(pg, "!!layer.querySelector('#adShop')"))
    s0 = await T.ev(pg, "S.seeds")
    await pg.click("#adShop"); await pg.wait_for_timeout(2000)
    r = json.loads(await T.ev(pg, "JSON.stringify({ s: S.seeds, adc: window.__adc, shows: window.__ads.shows })"))
    T.check(f"  {age}: il video si guarda e il premio arriva (come prima)", r["shows"] == 1 and r["s"] > s0 and r["adc"]["show"] == 1, (s0, r))
    T.check(f"  {age}: al modulo arriva l'eta' giusta ({sent})", r["adc"]["ages"] and all(x.endswith(":" + sent) for x in r["adc"]["ages"]) and "show:" + sent in r["adc"]["ages"], r["adc"]["ages"])
    await T.ev(pg, "layer.innerHTML = ''; openPlus('t113'); 1"); await pg.wait_for_timeout(600)
    pl = await T.ev(pg, "layer.innerText")
    T.check(f"  {age}: Plus dice ancora 'with no ads' (come prima)", "with no ads" in pl, pl[:200])
    T.check(f"  nessun errore ({age})", not pg.errs, pg.errs[:2])
    await ctx.close()

async def main(b):
    # 1) bambini, eta' non detta, eta' mai chiesta (anche senza consenso ancora dato: il pulsante "pigro")
    await kid_case(b, "child")
    await kid_case(b, "child", adsOk=0, label="bambino senza consenso gia' dato")
    await kid_case(b, {"y": 2014, "m": 1}, label="12 anni")
    await kid_case(b, "child", lang="it")
    # tutte le lingue: negozio, "ti mancano" e regalo, per un bambino
    for lang in T.LANGS:
        ctx, pg = await T.page(b, st0(lang), native=True, age="child", lang="en-US", wait=2500, extra_js=SPY)
        await T.close_layer(pg); await pg.wait_for_timeout(5500)
        n = []
        for code in ["openTaniShop('t113')", "needSheet({ price: 5000, id: 't113' })", "tab = 'more'; moreSub = 'prog'; render()"]:
            await T.ev(pg, f"layer.innerHTML = ''; {code}; 1"); await pg.wait_for_timeout(500)
            n.append(await T.ev(pg, "document.querySelectorAll('.adbtn').length"))
        adc = json.loads(await T.ev(pg, "JSON.stringify(window.__adc)"))
        T.check(f"bambino, {lang}: nessun pulsante del video (negozio, 'ti mancano', regalo) e nessuna chiamata", n == [0, 0, 0] and adc["init"] == adc["load"] == adc["show"] == 0, (n, adc))
        await T.ev(pg, "layer.innerHTML = ''; openPlus('t113'); 1"); await pg.wait_for_timeout(500)
        r = json.loads(await T.ev(pg, "JSON.stringify({ t: layer.innerText, a: L().plus.perks[6], k: AGE_PLUS_KID[S.lang](EC.PLUS_MONTH) })"))
        T.check(f"  {lang}: Plus senza 'senza pubblicità' per il bambino", r["k"] in r["t"] and r["a"] not in r["t"] and r["k"] != r["a"], r["t"][:160])
        T.check(f"  nessun errore ({lang})", not pg.errs, pg.errs[:2])
        await ctx.close()
    # 1b) 1.0.11 (10/10): in modalita' protetta niente inviti a Plus; Plus resta raggiungibile da Profilo > Acquisti e Plus
    PROMO = """JSON.stringify((() => { layer.innerHTML = ''; tab = 'more'; moreSub = null; render();
      const card = !!document.querySelector('button#plusCard'); const txt = document.body.innerText.includes(L().plus.card);
      layer.innerHTML = '<div class="overlay"><div class="sheet nvplus"><button id="nvPlusGo">x</button></div></div><button id="xmPlusGo">y</button>';
      return { card, txt, due: nav20plusDue('story') }; })())"""
    for lang, age, kid in [("en", "child", True), ("en", "skip", True), ("en", "none", True), ("it", "child", True), ("ja", "skip", True), ("en", "teen", False), ("it", "adult", False)]:
        ctx, pg = await T.page(b, st0(lang, tut=99, firstDay="2026-11-10"), native=True, age=age, lang="en-US", wait=2500, extra_js=SPY)
        await T.close_layer(pg)
        r = json.loads(await T.ev(pg, PROMO)); await pg.wait_for_timeout(300)
        r["left"] = await T.ev(pg, "[!!document.querySelector('.nvplus'), !!document.getElementById('xmPlusGo')].join()")
        # l'offerta che si apre da sola: chiamata direttamente, con i prezzi finti
        r["offer"] = await T.ev(pg, """(() => { layer.innerHTML = ''; billProducts = { plans: { year: { price: '9,99 EUR' } } }; nav20plusOffer('story'); return !!document.querySelector('.nvplus'); })()""")
        await T.ev(pg, "layer.innerHTML = ''; tab = 'more'; moreSub = 'buy'; render(); 1"); await pg.wait_for_timeout(300)
        q = json.loads(await T.ev(pg, """JSON.stringify((() => { const b = document.getElementById('psPlus'); const o = { has: !!b, lab: b ? b.textContent.trim() : '' };
          if (b) b.click(); return o; })())"""))
        await pg.wait_for_timeout(700)
        q["plus"] = await T.ev(pg, "!!document.querySelector('.plusbox')")
        q["note"] = await T.ev(pg, "!!document.querySelector('.plusbox .ageadult') && document.querySelector('.plusbox .ageadult').textContent === ageT().adult")
        if kid:
            T.check(f"protetta {age} ({lang}): niente scheda 'Scopri Tanetto Plus' in cima al profilo", not r["card"] and not r["txt"], r)
            T.check(f"  {age} ({lang}): niente proposta di Plus che si apre da sola, niente pulsante Plus dell'albero", r["due"] is False and r["left"] == "false,false" and r["offer"] is False, r)
            T.check(f"  {age} ({lang}): Plus raggiungibile da Profilo > Acquisti e Plus, pulsante neutro, con l'avviso per gli adulti", q["has"] and q["lab"] == "Tanetto Plus" and q["plus"] and q["note"], q)
        else:
            T.check(f"{age} ({lang}): scheda 'Scopri Tanetto Plus' e inviti come prima", r["card"] and r["left"] == "true,true", r)
            T.check(f"  {age} ({lang}): Plus da Profilo > Acquisti e Plus come prima", q["has"] and q["plus"], q)
        T.check(f"  nessun errore ({age}, {lang})", not pg.errs, pg.errs[:2])
        await ctx.close()
    # 2) ragazzi e adulti: come prima
    await grown_case(b, "adult", "double your gift")
    await grown_case(b, "teen", "extra gift")
    # 1.0.11: "Preferisco non dirlo" ed eta' mai chiesta: i video ci sono, come per i ragazzi (al modulo arriva "teen")
    await grown_case(b, "skip", "extra gift", sent="teen")
    await grown_case(b, "skip", "extra gift", sent="teen")
    for age in ("skip", "none"):
        ctx, pg = await T.page(b, st0("en"), native=True, age=age, lang="en-US", wait=2500)
        r = json.loads(await T.ev(pg, "JSON.stringify({ band: ageBand(), ads: ageAds(), cloud: ageCloudOk(), kid: ageKid(), prot: document.documentElement.classList.contains('a111kid') })"))
        T.check(f"  {age}: per tutto il resto resta 'unknown' (backup online no, modalita' protetta si')", r == {"band": "unknown", "ads": "teen", "cloud": False, "kid": True, "prot": True}, r)
        await ctx.close()
    # 3) eta' non detta -> detta piu' tardi
    for ans, want in ((T.AGE["adult"], True), (T.AGE["child"], False)):
        ctx, pg = await T.page(b, st0("en"), native=True, age="skip", lang="en-US", wait=3000, extra_js=SPY)
        await T.close_layer(pg); await pg.wait_for_timeout(6000)
        a0 = json.loads(await T.ev(pg, "JSON.stringify(window.__adc)")); a0["ages"] = list(a0["ages"])
        await T.ev(pg, f"ageSet({json.dumps(dict(ans, at='2026-11-16'))}); 1")
        for _ in range(30):
            if await T.ev(pg, "adsSt.loaded"): break
            await pg.wait_for_timeout(500)
        await T.ev(pg, "layer.innerHTML = ''; tab = 'more'; moreSub = 'prog'; render(); 1"); await pg.wait_for_timeout(400)
        r = json.loads(await T.ev(pg, "JSON.stringify({ g: !!document.getElementById('adGift'), adc: window.__adc, band: ageAds() })"))
        if want:
            T.check("eta' non detta (video come 'teen'), poi detta da adulto: si rifanno consenso e video come 'adult', pulsante sul regalo", "init:teen" in a0["ages"] and r["g"] and r["adc"]["init"] > a0["init"] and r["adc"]["load"] > a0["load"] and "init:adult" in r["adc"]["ages"], (a0, r))
        else:
            T.check("eta' non detta (video come 'teen'), poi detta da bambino: i video si spengono, nessuna nuova chiamata al modulo", r["band"] == "child" and not r["g"] and r["adc"]["init"] == a0["init"] and r["adc"]["load"] == a0["load"] and r["adc"]["show"] == 0 and not await T.ev(pg, "adsOn()"), (a0, r))
        T.check("  nessun errore", not pg.errs, pg.errs[:2])
        await ctx.close()
    # 4) testi in 14 lingue: informativa (app e pagina pubblica) e scheda Privacy del Profilo
    ctx, pg = await T.page(b, T.base_state("en"), age="adult")
    pp = open(os.path.join(T.REPO, "privacy.html"), encoding="utf-8").read()
    for lang in T.LANGS:
        r = json.loads(await T.ev(pg, f"JSON.stringify({{ d: T['{lang}'].privDoc.join(' '), p: T['{lang}'].privP, n: V23['{lang}'].ageNo }})"))
        s9, sc = SHORT9[lang], SHORTCARD[lang]
        T.check(f"testi {lang}: informativa (app e pagina pubblica) e scheda Privacy: sotto i 13 anni niente video, senza eta' mai personalizzati", s9 in r["d"] and sc in r["p"] and s9 in pp, (s9 in r["d"], sc in r["p"], s9 in pp))
        k1, k2 = KIDS111[lang]
        T.check(f"  {lang}: 'Eta' e bambini': i video per chi non dice l'eta' e la promessa sui dati per chi indica meno di 13 anni", k1 in r["d"] and k2 in r["d"] and k1 in pp and k2 in pp, (k1 in r["d"], k2 in r["d"], k1 in pp))
        p0 = await T.ev(pg, f"T['{lang}'].privDoc[0]")
        T.check(f"  {lang}: 'In breve': sotto i 13 anni niente video, senza eta' mai personalizzati (anche nella pagina pubblica)", PSHORT111[lang] in p0 and PSHORT111[lang] in pp, p0[:200])
        nt = await T.ev(pg, f"AGE_T['{lang}'].note")
        T.check(f"  {lang}: schermata dell'eta', nota senza 'per tutte le eta'' (solo 'te lo chiediamo una volta sola')", nt == await T.ev(pg, f"A111['{lang}'].note") and "Tanetto" not in nt, nt)
        bad = [o for o in (OLD13[lang], OLDKIDS[lang], OLDNO[lang]) if o in r["d"] or o in r["n"] or o in pp]
        T.check(f"  {lang}: nessuna frase vecchia ('video adatti ai bambini', 'solo AdMob riceve un identificativo', 'pubblicità per bambini')", not bad, [x[:50] for x in bad])
    old = ["only child-appropriate ones", "child-appropriate ads that are not personalised", "ads are always child-appropriate", "solo quelli adatti ai bambini", "pubblicità adatta ai bambini", "la pubblicità è sempre adatta ai bambini"]
    T.check("  pagina pubblica e testi it/en: nessuna delle frasi vecchie", not [o for o in old if o in pp] and not [o for o in old if o in await T.ev(pg, "T.en.privDoc.join(' ') + T.it.privDoc.join(' ') + V23.en.ageNo + V23.it.ageNo")])
    T.check("  'Preferisco non dirlo' in Profilo: video mai personalizzati (non piu' 'niente video'), niente pubblicità per bambini (it/en)", "non sono mai personalizzati" in await T.ev(pg, "V23.it.ageNo") and "never personalised" in await T.ev(pg, "V23.en.ageNo") and "no reward videos" not in await T.ev(pg, "V23.en.ageNo"))
    T.check("  data dell'informativa aggiornata (21/11/2026, 1.0.12)", await T.ev(pg, "PRIVACY_DATE") == "2026-11-21")
    backup = json.loads(await T.ev(pg, "JSON.stringify(V110_BACKUP)"))
    old_age_claims = ["compresa l'età", "including your age", "auch dein Alter", "incluida tu edad", "y compris ton âge", "incluindo sua idade", "年齢を含む", "나이 포함", "包括年龄", "包括年齡", "включая возраст", "także wieku", "ook je leeftijd", "yaşın dahil"]
    T.check("  backup Android: nessuna delle 14 lingue dichiara più che l'età viene copiata", len(backup) == 14 and not any(old.lower() in value.lower() for old in old_age_claims for value in backup.values()), [k for k,v in backup.items() if any(old.lower() in v.lower() for old in old_age_claims)])
    T.check("  backup Android: italiano e inglese escludono esplicitamente mese e anno di nascita", "esclusi il mese e l'anno di nascita" in backup["it"] and "excluding your birth month and year" in backup["en"])
    legacy_backup = {"it":"backup creato con una versione precedente", "en":"older backup created before this change", "de":"frühere Sicherung", "es":"versión anterior", "fr":"ancienne version", "pt":"versão anterior", "ja":"以前のバージョン", "ko":"이전 버전", "zh":"旧版本", "zht":"舊版本", "ru":"предыдущей версии", "pl":"wcześniejszej wersji", "nl":"eerdere versie", "tr":"önceki bir sürüm"}
    T.check("  backup Android: avviso sulle copie precedenti presente in tutte le 14 lingue", len(backup) == 14 and all(legacy_backup[k] in backup[k] for k in legacy_backup), [k for k in legacy_backup if legacy_backup[k] not in backup.get(k, "")])
    T.check("  backup Android: l'esclusione e l'avviso legacy appaiono anche nell'informativa pubblica", "excluding your birth month and year" in pp and "older backup created before this change" in pp and "excluding your birth month and year" in await T.ev(pg, "T.en.privDoc[2]"))
    T.check("  adulto: la scheda dell'eta' in Profilo non parla di 'niente video' (come prima)", AGE_NOAD_EN not in await T.ev(pg, "psAgeCard()"))
    await ctx.close()
    for lang in T.LANGS:
        ctx, pg = await T.page(b, T.base_state(lang), age="child", lang="en-US")
        r = json.loads(await T.ev(pg, "JSON.stringify({ c: psAgeCard(), x: esc(AGE_KID_NOAD[S.lang]), y: esc(V23[S.lang].ageYes) })"))
        T.check(f"  {lang}: bambino che ha detto l'eta': la scheda dell'eta' dice anche che non ci sono video", r["x"] in r["c"] and r["y"][:20] in r["c"], r["c"][:200])
        await ctx.close()
    # 5) parti native: AdsPlugin non chiede consenso, non avvia l'SDK, non prepara e non mostra video per "child"
    j = open(os.path.join(T.REPO, "app-android/android/app/src/main/java/com/tanettoapp/tanetto/AdsPlugin.java"), encoding="utf-8").read()
    def body(name):
        k = j.index("public void " + name + "("); e = j.find("@PluginMethod", k); return j[k:e if e > 0 else len(j)]
    T.check("nativo: init verifica la scelta locale e ferma pending/child prima del consenso UMP", "refreshTrustedAge()" in body("init") and "if (kid())" in body("init") and body("init").index("refreshTrustedAge()") < body("init").index("getConsentInformation") and body("init").index("kid()") < body("init").index("getConsentInformation"))
    T.check("nativo: load con 'child' rifiuta prima di chiedere un video", "if (kid()) { rewarded = null; call.reject(\"child\"" in body("load") and body("load").index("kid()") < body("load").index("RewardedAd.load"))
    T.check("nativo: show rilegge la scelta locale e rifiuta prima di mostrare", "refreshTrustedAge()" in body("show") and body("show").index("kid()") < body("show").index("ad.show("))
    T.check("nativo: startSdk e privacy fermi per 'child', state() mai 'canRequestAds' per 'child'", "if (kid()) return;" in j[j.index("private void startSdk"):][:200] and "if (kid())" in body("privacy") and '"canRequestAds", !k &&' in j)
    T.check("nativo: senza scelta valida resta pending e init/load/show verificano il deposito locale", 'private volatile String age = "pending";' in j and all("refreshTrustedAge()" in body(x) for x in ("init", "load", "show")) and 'return "pending";' in j)
    age_store = open(os.path.join(T.REPO, "app-android/android/app/src/main/java/com/tanettoapp/tanetto/AgeStorePlugin.java"), encoding="utf-8").read()
    T.check("nativo: una data di nascita salvata non puo' essere sostituita", "AgePolicy.canReplace(" in age_store and 'call.reject("age_choice_locked", "age_choice_locked")' in age_store)
    man = open(os.path.join(T.REPO, "app-android/android/app/src/main/AndroidManifest.xml"), encoding="utf-8").read()
    T.check("nativo: la misurazione degli annunci parte solo con MobileAds.initialize (DELAY_APP_MEASUREMENT_INIT)", 'android:name="com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT" android:value="true"' in man)
    js = open(os.path.join(T.REPO, "src/97zn_v19_ads.js"), encoding="utf-8").read()
    T.check("app: show() passa l'eta' al modulo", "adsPlugin().show(adAgeOpts())" in js)

T.run(main)
