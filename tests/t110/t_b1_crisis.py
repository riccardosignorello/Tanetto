"""1.0.10 blocco 1: parole di crisi (M-01b, G3-01, G3-02, G3-03, CR-01) e numeri di aiuto per Paese (M-12, I-06).
- Frasi dell'audit (crisis_audit_lists.py: T = da riconoscere, FP = modi di dire da NON prendere per crisi).
- Frasi nuove scritte per questa prova (HOLD), non usate per tarare gli elenchi all'inizio.
- La chat, il diario, "Lascia andare" e la capsula mostrano l'aiuto; i testi normali no.
- I numeri di aiuto cambiano con il Paese (fuso orario) e hanno sempre findahelpline.com in fondo."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
from crisis_audit_lists import T as AUD_T, FP as AUD_FP
HOLD = {
 "it": (["ho voglia di morire", "non voglio piu stare al mondo", "voglio togliermi la vita", "stanotte la faccio finita", "nessuno sentirebbe la mia mancanza se morissi", "vorrei addormentarmi e non svegliarmi piu", "mi sono fatta del male di nuovo"],
        ["ho ucciso il boss nel gioco", "mi sono tagliato i capelli corti", "oggi muoio di caldo", "che fame, sto morendo", "questo film mi uccide dal ridere", "taglio la torta per tutti"]),
 "en": (["i want to end my life", "i just want to die", "i dont want to wake up tomorrow", "nobody would miss me if i died", "i'm thinking about killing myself", "i keep hurting myself", "life isnt worth living"],
        ["i killed it at the concert", "this cake is to die for", "i'm dead tired", "i cut the paper for my project", "my game character died", "we will kill time at the mall"]),
 "de": (["ich will mich umbringen", "ich will nicht mehr aufwachen", "ich möchte am liebsten tot sein", "ich ritze mich wieder", "keiner würde mich vermissen wenn ich tot wäre"],
        ["ich lach mich kaputt", "ich bin hundemüde", "das spiel bringt mich um vor lachen", "ich schneide das brot", "der film war tödlich langweilig"]),
 "es": (["quiero quitarme la vida", "ya no quiero estar aqui", "me quiero morir ya", "pienso en suicidarme", "me corto para no sentir"],
        ["me muero de ganas de verte", "me corto las uñas", "este examen me mata", "me muero de frio", "corto la tarta"]),
 "fr": (["je veux en finir avec la vie", "j'ai envie de me tuer", "je veux plus vivre du tout", "je me scarifie le soir", "personne ne me regretterait si je mourais"],
        ["je suis mort de rire", "je vais couper le gâteau", "ce prof va me tuer avec ses devoirs", "je meurs de chaud", "je me suis coupé les ongles"]),
 "pt": (["quero tirar minha vida", "nao quero mais estar aqui", "vou me matar hoje", "eu me corto quando fico triste", "queria dormir e nao acordar mais"],
        ["morri de rir", "vou cortar o bolo", "to morrendo de calor", "essa prova me mata", "cortei o cabelo"]),
 "ru": (["я хочу умереть прямо сейчас", "не хочу больше жить так", "думаю покончить с собой", "я режу себя", "лучше бы я умер"],
        ["умираю от скуки ржу", "убить время до урока", "режу хлеб", "от смеха чуть не умер", "голодный как волк"]),
 "pl": (["chce umrzec dzisiaj", "nie chce juz zyc", "mysle zeby sie zabic", "tne sie znowu", "wszystkim byloby lepiej beze mnie"],
        ["umieram ze smiechu", "zabije sie ze smiechu", "kroje chleb", "umieram z nudow", "pojechali beze mnie do kina"]),
 "nl": (["ik wil dood", "ik wil niet meer leven", "ik doe mezelf pijn", "ik wil er een einde aan maken", "ik denk aan zelfmoord"],
        ["ik lach me dood", "ik snij de taart", "ik ben doodmoe", "ik wil niet meer wachten op de bus", "doodgewoon een leuke dag"]),
 "tr": (["olmek istiyorum artik", "kendimi oldurmek istiyorum", "yasamak istemiyorum", "intihar etmeyi dusunuyorum", "kendime zarar veriyorum"],
        ["gulmekten oldum", "keske orada olsem tatilde", "jilet gibi keskin bir zeka", "acliktan oluyorum", "bugun cok yorgunum"]),
 "ja": (["死にたいです", "もう生きていたくない", "消えてしまいたい", "リスカした", "自殺したい"],
        ["笑い死ぬかと思った", "死ぬほどおいしい", "お腹すいて死にそう", "眠い", "宿題が多い"]),
 "ko": (["죽고 싶어요", "살기 싫어", "자해했어", "사라지고 싶어", "그만 살고 싶어"],
        ["웃겨 죽겠어", "배고파 죽겠어", "그냥 죽 먹을래", "목 매일 아파", "졸려"]),
 "zh": (["我想死", "我不想活了", "我想自杀", "活着没意思", "我割腕了"],
        ["笑死我了", "饿死了", "想死你了", "热死了", "累死了"]),
 "zht": (["我想死", "我不想活了", "我想自殺", "活著沒意思", "我割腕了"],
        ["笑死我了", "餓死了", "想死你了", "熱死了", "累死了"]),
}

async def main(b):
    ctx, pg = await T.page(b, T.base_state("en"), age="adult", wait=2500)
    tot = [0, 0, 0, 0]
    for l in T.LANGS:
        pos = AUD_T[l] + HOLD[l][0]; neg = AUD_FP[l] + HOLD[l][1]
        r = json.loads(await T.ev(pg, f"JSON.stringify({{p: {json.dumps(pos)}.map((x) => [x, crisisLevel(x, '{l}')]), n: {json.dumps(neg)}.map((x) => [x, crisisLevel(x, '{l}')])}})"))
        miss = [x for x, v in r["p"] if v < 2]; fp = [x for x, v in r["n"] if v >= 1]
        tot[0] += len(pos) - len(miss); tot[1] += len(pos); tot[2] += len(fp); tot[3] += len(neg)
        T.check(f"crisi {l}: riconosciute {len(pos) - len(miss)}/{len(pos)}", not miss, miss)
        T.check(f"crisi {l}: modi di dire scambiati per crisi 0/{len(neg)}", not fp, fp)
    print(f"TOTALE riconosciute {tot[0]}/{tot[1]}, modi di dire scambiati {tot[2]}/{tot[3]}")
    # livello gentile (parola di morte da sola)
    soft = json.loads(await T.ev(pg, "JSON.stringify([crisisLevel('ho paura di morire', 'it'), crisisLevel('my grandpa died', 'en'), crisisLevel('ich hasse mein leben', 'de'), crisisLevel('oggi bel giorno', 'it')])"))
    # 1.0.10 (98zl): un lutto di un altro ('my grandpa died') non e' un momento di crisi di chi scrive -> 0, come nel ramo sicurezza
    T.check("livello gentile: 'ho paura di morire' / 'ich hasse mein leben' = 1; 'my grandpa died' e frase normale = 0", soft == [1, 0, 1, 0], soft)
    # inglese in piu' in ogni lingua
    T.check("frase inglese di crisi riconosciuta anche con l'app in italiano", await T.ev(pg, "crisisLevel('I want to kill myself', 'it')") == 2)
    # critica indipendente 1.0.10: frasi nuove mai viste, inglese con l'app in un'altra lingua, falsi allarmi
    CR = [("it", "i dont want to live anymore", 2), ("it", "kms", 2), ("it", "i wish i was dead", 2), ("es", "i want to end it all", 2),
          ("de", "ich bringe mich morgen um", 2), ("de", "ich bringe mich bald um", 2), ("it", "non ho più motivi per vivere", 2),
          ("it", "basta non voglio più esserci", 2), ("it", "oggi mi sono rifatta i tagli sulle gambe", 2), ("en", "i keep cutting my arms", 2),
          ("en", "no one would care if i disappeared", 2), ("tr", "kendimi yine kestim", 2), ("ko", "다시는 안 깨어났으면 좋겠어", 2),
          ("ja", "薬を30錠飲んだ", 2), ("zh", "我吃了30片安眠药", 2), ("zht", "我吃了30顆安眠藥", 2),
          ("zh", "你去死吧", 0), ("zht", "你去死吧", 0), ("zh", "我们做个了断吧", 0), ("it", "mi ha fatto morire quel video", 0),
          ("de", "ich bringe mich um den schlaf", 0), ("de", "die katze ist süß", 0), ("nl", "ik vind die film leuk", 0),
          ("it", "ho tanti motivi per vivere", 0), ("it", "ci voglio più esserci a quella festa", 0), ("zh", "我吃了30片饼干", 0)]
    got = await T.ev(pg, "(" + json.dumps(CR) + ").map(([l, x]) => crisisLevel(x, l))")
    bad = [(c, g) for c, g in zip(CR, got) if g != c[2]]
    T.check(f"critica 1.0.10: {len(CR) - len(bad)}/{len(CR)} frasi nuove e falsi allarmi giusti", not bad, bad)
    # controllo finale 1.0.10 (CONTROLLO_FINALE_110): le frasi di crisi della prova finale (tutte forti) e i suoi modi di dire (niente),
    # i falsi allarmi d'affetto ("ti voglio bene da morire") in 14 lingue, i casi limite (gentile) e l'inglese con l'app in un'altra lingua
    FIN = {
     "it": (["stasera mi impicco", "voglio buttarmi dal ponte", "ho preso tutte le pastiglie della mamma", "penso sempre a come uccidermi", "sarebbe meglio se morissi", "non ce la faccio più, voglio solo morire", "mi faccio i tagli sulle cosce", "ho scritto la lettera d'addio ai miei", "a nessuno importerebbe se sparissi", "domani mi butto sotto il treno", "voglio smettere di vivere", "nn ce la faccio + a vivere", "mi odio e voglio morire", "vorrei non essere mai nata"],
            ["che caldo, si muore", "mi sono tagliato con il foglio", "oggi ammazzo il tempo giocando", "mi butto in piscina", "la batteria del telefono sta morendo", "il mio personaggio è morto nel gioco", "ti voglio bene da morire", "ho tagliato la corda prima della lezione", "mia nonna è morta l'anno scorso, mi manca", "ti amo da morire", "ti voglio un mondo di bene da morire"]),
     "en": (["i'm going to hang myself tonight", "im gonna overdose on my meds", "i took a whole bottle of pills", "i want to jump off the bridge", "everyone would be happier if i was gone", "i don't see the point in living anymore", "i've been self-harming again", "i wrote my suicide note", "i just want to stop existing", "i plan to end things this weekend", "i want to disappear forever", "i hate my life i want to die", "i dont want to be here anymore", "i want to sleep and never wake up"],
            ["i'm dying to try the new level", "my battery died", "this joke killed me", "i'm cutting the grass", "dead tired after school", "i want to kill this boss", "she killed it on stage", "i cut my finger peeling apples", "my hamster died yesterday", "i love you to death", "love you to death bestie"]),
     "de": (["ich will mich heute nacht erhängen", "ich nehme alle tabletten auf einmal", "ich springe von der brücke", "es wäre besser, wenn ich nicht mehr da wäre", "ich hab keinen bock mehr zu leben", "ich schneide mir die arme auf", "ich denke ständig an selbstmord", "niemand würde merken, wenn ich weg wäre", "ich will für immer einschlafen", "ich mach heute schluss mit allem", "ich will nicht mehr existieren", "ich möchte sterben"],
            ["ich sterbe vor langeweile", "der akku stirbt gleich", "ich schneide mir die haare", "heute war es todlangweilig", "ich könnte mich totlachen", "ich habe zwiebeln geschnitten", "mein opa ist gestorben", "ich hab dich zum sterben gern", "ich liebe dich bis in den tod"]),
     "es": (["me voy a tirar del puente", "quiero ahorcarme", "me tomé todas las pastillas", "nadie me extrañaría si me muero", "no le veo sentido a vivir", "me hago cortes en las piernas", "ojalá no despertara mañana", "estoy pensando en quitarme la vida", "ya no aguanto, me quiero morir", "quiero dejar de existir", "me quiero suicidar", "quisiera estar muerta"],
            ["me muero de sueño", "me mató de risa ese video", "corté con mi novio", "voy a matar el tiempo", "se me murió el móvil", "me corté el dedo cocinando", "me muero por ir a la playa", "te quiero a morir", "te amo hasta morir"]),
     "fr": (["je vais me pendre ce soir", "j'ai avalé toutes mes pilules", "je veux sauter du pont", "tout le monde serait mieux sans moi", "je ne vois plus l'intérêt de vivre", "je me fais des coupures sur les bras", "je pense à me suicider", "j'aimerais ne plus me réveiller", "je veux plus exister", "j'ai envie de crever", "je veux mettre fin à mes jours"],
            ["je suis morte de fatigue", "ce film m'a tué", "j'ai coupé les légumes", "mon téléphone est mort", "je tue le temps", "je meurs d'envie de te voir", "mon chat est mort la semaine dernière", "je t'aime à mourir", "je t'aime à en mourir"]),
     "pt": (["vou me enforcar", "tomei todos os remédios da caixa", "quero pular da ponte", "ninguém sentiria minha falta", "não vejo sentido em viver", "tô me cortando de novo", "penso em me matar todo dia", "não quero mais existir", "vou acabar com a minha vida", "quero morrer hoje", "queria estar morto"],
            ["morri de vergonha", "meu celular morreu", "matei a aula hoje", "cortei o dedo cozinhando", "tô morta de cansaço", "morro de vontade de viajar", "te amo até morrer", "amo você de morrer"]),
     "ru": (["я повешусь сегодня", "выпью все таблетки", "хочу спрыгнуть с крыши", "никто не заметит если я умру", "не вижу смысла жить", "я опять порезала руки", "думаю о суициде", "мне незачем жить", "хочу уснуть и не проснуться", "хочу покончить с жизнью", "я хочу умереть"],
            ["умираю от скуки", "телефон умер", "убил босса в игре", "порезал палец когда готовил", "устал до смерти", "бабушка умерла в прошлом году", "люблю тебя до смерти"]),
     "pl": (["powieszę się dziś", "połknęłam wszystkie tabletki", "skoczę z mostu", "nikt by nie zauważył gdybym umarła", "nie widzę sensu życia", "znowu się cięłam", "chcę zasnąć i się nie obudzić", "myślę o samobójstwie codziennie", "nie chcę już istnieć", "chcę ze sobą skończyć", "chcę się zabić"],
            ["umieram z zimna", "telefon mi padł", "zabijam czas", "pokroiłam warzywa", "padam ze zmęczenia", "dziadek umarł w zeszłym roku", "kocham cię na zabój", "kocham cię na śmierć"]),
     "nl": (["ik ga mezelf ophangen", "ik heb alle pillen genomen", "ik spring van de brug", "niemand zou me missen", "het leven heeft geen zin meer", "ik snijd mezelf weer", "ik denk aan zelfdoding", "ik wil niet meer bestaan", "ik wil er niet meer zijn", "ik wil niet meer wakker worden", "ik maak een einde aan mijn leven"],
            ["ik verveel me dood", "mijn telefoon is dood", "ik schrok me dood", "ik snij de groenten", "doodop na school", "mijn oma is dood", "ik hou van je tot de dood"]),
     "tr": (["kendimi asacağım", "bütün ilaçları içtim", "köprüden atlayacağım", "ölsem kimse fark etmez", "yaşamanın anlamı yok", "yine kollarımı kestim", "intihar etmek istiyorum", "artık var olmak istemiyorum", "canıma kıymak istiyorum", "ölmek istiyorum artık", "kendimi öldüreceğim bu gece"],
            ["sıcaktan öldüm", "telefonum öldü", "saçımı kestim", "gülmekten kırıldım", "zaman öldürüyorum", "dedem geçen yıl öldü", "seni ölesiye seviyorum"]),
     "ja": (["首を吊りたい", "薬を全部飲んだ", "飛び降りたい", "私がいなくなっても誰も気にしない", "生きる意味がわからない", "また腕を切った", "自分を傷つけてしまう", "もう終わりにしたい", "消えてなくなりたい", "死にたいと思う", "生きるのをやめたい"],
            ["暑くて死ぬ", "スマホの電池が死んだ", "ゲームで死んだ", "野菜を切った", "疲れて死にそう", "おじいちゃんが死んだ", "死ぬほど愛してる"]),
     "ko": (["목매고 싶어", "약을 다 먹었어", "옥상에서 뛰어내리고 싶어", "내가 없어져도 아무도 모를 거야", "사는 게 의미 없어", "또 팔을 그었어", "자살 생각이 계속 나", "그냥 다 끝내고 싶어", "죽어버릴까", "살고 싶지 않아요", "죽고 싶다는 생각뿐이야"],
            ["더워 죽겠다", "배터리가 죽었어", "게임에서 죽었어", "야채를 썰었어", "피곤해 죽겠어", "할아버지가 돌아가셨어", "죽도록 사랑해"]),
     "zh": (["我想上吊", "我把药全吃了", "我想从楼上跳下去", "我死了也没人在乎", "活着没有意义", "我又割自己了", "我一直想自杀", "我想结束这一切", "我不想存在了", "我真的不想活了", "我想去死"],
            ["热得要死", "游戏里我死了", "我在切菜", "累得要命", "你去死吧", "我们做个了断吧", "我爷爷去世了", "爱你爱得要死"]),
     "zht": (["我想上吊", "我把藥全吃了", "我想從樓上跳下去", "我死了也沒人在乎", "活著沒有意義", "我又割自己了", "我一直想自殺", "我想結束這一切", "我不想存在了", "我真的不想活了", "我想去死"],
            ["熱得要死", "遊戲裡我死了", "我在切菜", "累得要命", "你去死吧", "我們做個了斷吧", "我爺爺過世了", "愛你愛得要死"]),
    }
    FX = [("it", "ti voglio bene da morire", 0),
          ("it", "ti voglio un bene da morire", 0),
          ("it", "voglio un gelato da morire", 0),
          ("it", "mi sono tagliato con il foglio", 0),
          ("it", "mi sono tagliata con un foglio di carta", 0),
          ("it", "vorrei tanto morire dal ridere", 0),
          ("it", "voglio morire", 2),
          ("it", "sto pensando di tagliarmi i capelli", 0),
          ("it", "meglio morire che fare matematica ahah", 1),
          ("it", "preferirei morire piuttosto che andare a scuola", 1),
          ("it", "preferirei morire piuttosto che vivere cosi", 2),
          ("en", "i would rather die than eat broccoli", 1),
          ("en", "i would rather die than live like this", 2),
          ("en", "i want to die my hair blue", 0),
          ("es", "quiero un helado, me muero", 0),
          ("it", "non voglio andare a vivere dalla nonna", 0),
          ("es", "me volvi a cortar despues de la escuela", 2),
          ("pt", "me cortei de novo depois da escola", 2),
          ("it", "giochiamo all'impiccato", 0),
          ("tr", "kendimi kesinlikle iyi hissediyorum", 0),
          ("pl", "nikt nie zauważył mojej fryzury", 0),
          ("fr", "j'ai avalé toutes les frites", 0),
          ("en", "i want to sleep forever", 1),
          ("it", "vorrei addormentarmi per sempre", 2),
          ("it", "i plan to end things this weekend", 2),
          ("de", "i plan to end things this weekend", 2),
          ("es", "i plan to end things this weekend", 2),
          ("ja", "i plan to end things this weekend", 2),
          ("tr", "i plan to end things this weekend", 2),
          ("ru", "i plan to end things this weekend", 2),
          ("zh", "i plan to end things this weekend", 2),
          ("pl", "i plan to end things this weekend", 2)]
    CF = [(l, x, 2) for l, (p, n) in FIN.items() for x in p] + [(l, x, 0) for l, (p, n) in FIN.items() for x in n] + [tuple(c) for c in FX]
    got = await T.ev(pg, "(" + json.dumps(CF) + ").map(([l, x]) => crisisLevel(x, l))")
    bad = [(c, g) for c, g in zip(CF, got) if g != c[2]]
    T.check(f"controllo finale 1.0.10: {len(CF) - len(bad)}/{len(CF)} frasi di crisi, modi di dire e casi limite giusti", not bad, bad)
    await ctx.close()
    # chat: risposta con i numeri, gentile, normale
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", tz="Europe/Rome")
    r = json.loads(await T.ev(pg, "JSON.stringify([chatReply('mi voglio ammazzare'), chatReply('ho paura di morire'), chatReply('devo tagliarmi i capelli'), chatReply('ciao!')])"))
    T.check("chat it 'mi voglio ammazzare': risposta di crisi con i numeri", r[0].get("crisis") and any("19696" in x for x in r[0]["lines"]), r[0])
    T.check("chat it 'ho paura di morire': risposta gentile con i numeri", r[1].get("crisis") and r[1].get("soft") and r[1]["lines"], r[1])
    T.check("chat it 'devo tagliarmi i capelli': risposta normale", not r[2].get("crisis"), r[2])
    T.check("chat it 'ciao!': risposta normale", not r[3].get("crisis"), r[3])
    # diario
    await T.close_layer(pg)
    for txt, want in [("mi ammazzo", True), ("Oggi bel giorno, ho camminato", False)]:
        await T.ev(pg, "layer.innerHTML = ''; tab = 'diary'; render(); 1"); await pg.wait_for_timeout(500)
        has = await T.ev(pg, "!!document.getElementById('line')")
        if not has: T.check("diario aperto", False); break
        await pg.fill("#line", txt); await T.ev(pg, "document.getElementById('diaryForm').requestSubmit(); 1"); await pg.wait_for_timeout(1500)
        sos = await T.ev(pg, "document.querySelectorAll('.v26sos').length"); saved = await T.ev(pg, f"S.diary.some((d) => d.text === {json.dumps(txt)})")
        T.check(f"diario '{txt}': salvato comunque", saved)
        T.check(f"diario '{txt}': aiuto {'mostrato' if want else 'non mostrato'}", (sos > 0) == want, sos)
        if want:
            lines = await T.ev(pg, "(document.querySelector('.v26sos') || {}).textContent || ''")
            T.check("  diario: numeri dell'Italia (Telefono Azzurro 19696) e findahelpline", "19696" in lines and "findahelpline" in lines, lines[:200])
            T.check("  diario: pulsanti 'Parla con' e 'Chiudi'", await T.ev(pg, "!!document.getElementById('v26Talk') && !!document.getElementById('v26Close')"))
            await pg.click("#v26Talk"); await pg.wait_for_timeout(600)
            T.check("  'Parla con Germo' apre la chat", await T.ev(pg, "!!document.querySelector('.chatbox')"))
    # capsula
    await T.ev(pg, "layer.innerHTML = ''; tab = 'diary'; render(); 1"); await pg.wait_for_timeout(500)
    if await T.ev(pg, "!!document.getElementById('capsIn')"):
        await pg.fill("#capsIn", "voglio morire"); await T.ev(pg, "sealCapsule(); 1"); await pg.wait_for_timeout(2000)
        T.check("capsula 'voglio morire': aiuto mostrato", await T.ev(pg, "document.querySelectorAll('.v26sos').length") > 0)
    else: T.check("capsula: campo presente nel diario", False)
    T.check("nessun errore (chat, diario, capsula)", not pg.errs, pg.errs[:3])
    await ctx.close()
    # numeri per Paese
    cases = [("en", "en-GB", "Europe/Rome", ["19696", "112"]), ("en", "en-US", "America/Toronto", ["Kids Help Phone", "988"]), ("en", "en-AU", "Australia/Sydney", ["13 11 14", "Kids Helpline"]),
             ("es", "es-MX", "America/Mexico_City", ["800 911 2000"]), ("pt", "pt-PT", "Europe/Lisbon", ["SOS Criança"]), ("fr", "fr-CH", "Europe/Zurich", ["143", "147"]),
             ("de", "de-AT", "Europe/Vienna", ["142", "147"]), ("ja", "ja-JP", "Asia/Tokyo", ["0120-0-78310", "0120-279-338"]), ("es", "es-AR", "America/Argentina/Buenos_Aires", ["135", "0800 345 1435"]),
             ("en", "en-US", "America/Bogota", ["findahelpline"]), ("it", "it-IT", "Europe/Stockholm", ["112"])]
    for lang, loc, tz, want in cases:
        ctx, pg = await T.page(b, T.base_state(lang), age="adult", lang=loc, tz=tz, wait=2000)
        lines = (await T.ev(pg, "L().helpLines.join(' | ')")).replace("\u00a0", " ").replace("\u2060", "")
        T.check(f"numeri di aiuto {lang} {tz}: {', '.join(want)} + findahelpline", all(w in lines for w in want) and "findahelpline.com" in lines, lines)
        await ctx.close()

T.run(main)
