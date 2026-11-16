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
    # prova cieca indipendente 1.0.10 (blind110): crisi (tutte forti), frasi normali (niente), inglese con l'app in it/de/es/ja (forte)
    BL = {
     "it": (["voglio morire", "non ce la faccio più, voglio farla finita", "sto pensando di uccidermi", "stasera prendo tutte le pastiglie di mia madre", "mi taglio di nuovo le braccia con la lametta", "ieri ho provato a impiccarmi", "sarebbe meglio per tutti se io non ci fossi piu", "addio a tutti, vi voglio bene, non mi vedrete più", "vorrei addormentarmi e non svegliarmi mai più", "a scuola tutti mi odiano, mi voglio ammazzare", "voglio buttarmi dal ponte", "nessuno sentirebbe la mia mancanza se morissi", "mi faccio del male apposta quando sono triste", "vojo mori nn ce la faccio +", "ho scritto la lettera d'addio per i miei genitori"],
            ["sto morendo dal ridere", "questi compiti mi uccidono", "ti voglio bene da morire", "muoio di fame, cosa c'è per cena?", "mia madre mi ammazza se torno tardi", "mi sto annoiando a morte", "ho tagliato le verdure per la cena", "la batteria del telefono è morta", "abbiamo ucciso il boss finale nel videogioco", "mi butto in piscina", "non ce la faccio più ad aspettare le vacanze, che bello!", "ho preso la pastiglia per il mal di testa", "il mio pesciolino è morto, sono un po' triste", "che caldo, si muore", "mi sono tagliato il dito mentre cucinavo"]),
     "en": (["I want to die", "I'm going to kill myself", "I've been thinking about ending my life", "Tonight I'm going to take all my mom's pills", "I cut myself again last night", "I tried to hang myself yesterday", "Everyone would be better off without me", "Goodbye everyone, I love you, this is my last message", "I wish I could go to sleep and never wake up", "Everyone at school hates me, I don't want to live anymore", "I'm going to jump off the bridge", "Nobody would care if I died", "I hurt myself on purpose when I'm sad", "i wanna kms fr, cant do this anymore", "I wrote a suicide note for my parents"],
            ["I'm dying of laughter", "This homework is killing me", "I love you to death", "I'm starving, what's for dinner?", "My mom will kill me if I'm late", "I'm bored to death", "I cut the vegetables for the salad", "My phone battery died", "We killed the final boss in the game", "I'm going to jump in the pool", "I can't wait for the holidays!", "I took a pill for my headache", "My goldfish died, I'm a bit sad", "It's so hot I'm dying", "I cut my finger while cooking"]),
     "de": (["Ich will sterben", "Ich will mich umbringen", "Ich denke daran, mir das Leben zu nehmen", "Ich habe Tabletten gesammelt, um heute alle auf einmal zu nehmen", "Ich ritze mich wieder", "Ich habe letzte Woche versucht, mich umzubringen", "Es wäre besser, wenn ich nicht mehr da wäre", "Lebt wohl, ihr werdet mich nie wieder sehen. Das ist mein Abschied", "Ich will einschlafen und nie wieder aufwachen", "In der Schule hassen mich alle, ich will nicht mehr leben", "Ich springe heute von der Brücke", "Niemand würde mich vermissen, wenn ich tot wäre", "Ich schneide mir in die Arme, wenn es mir schlecht geht", "ich will nich mehr lebn, hat eh alles kein sinn", "Ich habe einen Abschiedsbrief an meine Eltern geschrieben"],
            ["Ich lach mich tot", "Diese Hausaufgaben bringen mich um", "Ich hab dich zum Sterben gern", "Ich sterbe vor Hunger, was gibt es zum Abendessen?", "Meine Mutter bringt mich um, wenn ich zu spät komme", "Mir ist todlangweilig", "Ich habe Gemüse für den Salat geschnitten", "Mein Handyakku ist tot", "Wir haben den Endboss im Spiel getötet", "Ich springe gleich in den Pool", "Ich kann es kaum erwarten, bis die Ferien anfangen!", "Ich habe eine Tablette gegen Kopfschmerzen genommen", "Mein Hamster ist gestorben, ich bin ein bisschen traurig", "Es ist so heiß, ich sterbe", "Ich habe mich beim Kochen in den Finger geschnitten"]),
     "es": (["Quiero morirme", "Me quiero suicidar", "Estoy pensando en quitarme la vida", "Esta noche me voy a tomar todas las pastillas de mi mamá", "Me corto los brazos con una cuchilla", "Ayer intenté ahorcarme", "Todos estarían mejor sin mí", "Adiós a todos, los quiero, esta es mi despedida", "Quiero dormirme y no despertar nunca más", "En el cole todos me odian, me quiero matar", "Me voy a tirar del puente", "Nadie me extrañaria si me muriera", "Me hago daño a propósito cuando estoy triste", "ya no kiero vivir nada tiene sentido", "Escribí una carta de despedida para mis papás"],
            ["Me muero de risa", "Estos deberes me están matando", "Me muero por verte, te quiero un montón", "Me muero de hambre, ¿qué hay de cenar?", "Mi mamá me va a matar si llego tarde", "Me aburro a muerte en clase", "Corté las verduras para la ensalada", "Se murió la batería del móvil", "Matamos al jefe final del videojuego", "Me voy a tirar a la piscina", "¡No puedo esperar a las vacaciones, qué ganas!", "Me tomé una pastilla para el dolor de cabeza", "Se murió mi pez y estoy un poco triste", "Hace tanto calor que me muero", "Me corté el dedo sin querer cocinando"]),
     "fr": (["Je veux mourir", "J'ai envie de me suicider", "Je pense à mettre fin à mes jours", "Ce soir je vais avaler toutes les pilules de ma mère", "Je me scarifie encore les bras", "Hier j'ai essayé de me pendre", "Tout le monde serait mieux sans moi", "Adieu tout le monde, je vous aime, vous ne me reverrez plus", "Je voudrais m'endormir et ne jamais me réveiller", "A l'ecole tout le monde me deteste, je veux me tuer", "Je vais sauter du pont", "Personne ne remarquerait si je disparaissais pour toujours", "Je me fais du mal exprès quand je suis triste", "jveux plus vivre ca sert a rien", "J'ai écrit une lettre d'adieu à mes parents"],
            ["Je suis mort de rire", "Ces devoirs me tuent", "Je t'aime à mourir", "Je meurs de faim, on mange quoi ?", "Ma mère va me tuer si je rentre tard", "Je m'ennuie à mourir", "J'ai coupé les légumes pour la soupe", "La batterie de mon téléphone est morte", "On a tué le boss final du jeu", "Je vais sauter dans la piscine", "J'en peux plus d'attendre les vacances, trop hâte !", "J'ai pris un cachet pour le mal de tête", "Mon poisson rouge est mort, je suis un peu triste", "Il fait tellement chaud, je meurs", "Je me suis coupé le doigt en cuisinant"]),
     "pt": (["Eu quero morrer", "Quero me matar", "Estou pensando em tirar minha própria vida", "Hoje à noite vou tomar todos os remédios da minha mãe", "Eu me corto com lâmina quando fico mal", "Ontem tentei me enforcar", "Todo mundo ficaria melhor sem mim", "Adeus a todos, amo vocês, essa é minha despedida", "Queria dormir e nunca mais acordar", "Na escola todo mundo me odeia, não quero mais viver", "Vou pular da ponte", "Ninguém sentiria minha falta se eu morresse", "Eu me machuco de propósito quando estou triste", "n aguento mais, qro morrer", "Escrevi uma carta de despedida para os meus pais"],
            ["Estou morrendo de rir", "Essa lição de casa está me matando", "Morro de saudade de você", "Estou morrendo de fome, o que tem pro jantar?", "Minha mãe vai me matar se eu chegar tarde", "Morri de tédio na aula", "Cortei os legumes para a salada", "A bateria do celular morreu", "Matamos o chefão final do jogo", "Vou pular na piscina", "Não aguento mais esperar as férias, que vontade!", "Tomei um remédio para dor de cabeça", "Meu peixinho morreu, estou um pouco triste", "Que calor, estou morrendo", "Cortei o dedo sem querer cozinhando"]),
     "ja": (["死にたい", "自殺したい", "もう生きていたくない", "今夜、薬を全部飲むつもり", "またリストカットしちゃった", "昨日首を吊ろうとした", "私なんかいない方がみんな幸せ", "みんな今までありがとう、さようなら。もう会えないね", "眠ったまま目が覚めなければいいのに", "学校でいじめられてる。もう消えたい", "屋上から飛び降りようと思う", "私が死んでも誰も悲しまない", "辛いときに自分を傷つけてしまう", "しにたい もうむり", "親に遺書を書いた"],
            ["笑いすぎて死ぬ", "宿題が多すぎて死にそう", "お腹すいて死にそう", "暑すぎて死ぬ", "遅く帰ったらお母さんに殺される", "退屈で死にそう", "野菜を切ってサラダを作った", "スマホの充電が切れて死んだ", "ゲームでラスボスを殺した", "プールに飛び込んだ", "夏休みが待ちきれない！", "頭痛薬を飲んだ", "金魚が死んじゃって、ちょっと悲しい", "この漫画、面白すぎて死ぬ", "料理中に指を切っちゃった"]),
     "ko": (["죽고 싶어", "자살하고 싶어", "더 이상 살고 싶지 않아", "오늘 밤에 약을 다 먹을 거야", "또 칼로 손목을 그었어", "어제 목을 매려고 했어", "내가 없으면 모두 더 행복할 거야", "다들 고마웠어, 안녕. 이제 다시 못 볼 거야", "자다가 그냥 안 깨어났으면 좋겠어", "학교에서 다 나를 싫어해. 그냥 사라지고 싶어", "다리에서 뛰어내릴 거야", "내가 죽어도 아무도 슬퍼하지 않을 거야", "힘들 때 자해를 해", "죽고싶다 진짜 ㅠㅠ", "부모님께 유서를 썼어"],
            ["웃겨 죽겠다 ㅋㅋㅋ", "숙제 때문에 죽겠어", "배고파 죽겠어", "더워 죽겠다", "늦게 들어가면 엄마한테 죽었다", "심심해 죽겠어", "샐러드 만들려고 채소를 잘랐어", "핸드폰 배터리가 죽었어", "게임에서 최종 보스를 죽였어", "수영장에 뛰어들었어", "방학이 너무 기다려져!", "두통약을 먹었어", "금붕어가 죽어서 조금 슬퍼", "너무 귀여워서 죽을 것 같아", "요리하다가 손가락을 베었어"]),
     "zh": (["我想死", "我想自杀", "我不想活了", "今晚我要把所有的药都吃掉", "我又割腕了", "昨天我试过上吊", "没有我大家会过得更好", "再见了大家，谢谢你们，以后再也见不到了", "真希望睡着了就再也不要醒来", "在学校大家都讨厌我，我想消失", "我要从楼顶跳下去", "我死了也没有人会难过", "难受的时候我会伤害自己", "不想活了 好累", "我给爸妈写了遗书"],
            ["笑死我了", "作业多得要死", "饿死了，晚饭吃什么？", "热死了", "回家晚了我妈会杀了我", "无聊死了", "我切了蔬菜做沙拉", "手机没电了", "我们在游戏里杀了最终boss", "我跳进了游泳池", "等不及放暑假了！", "我吃了头疼药", "我的金鱼死了，有点难过", "这只小猫可爱死了", "做饭的时候不小心切到手指了"]),
     "zht": (["我想死", "我想自殺", "活著好累，我不想活了", "今晚我要把所有的藥都吞下去", "我又用美工刀割自己了", "昨天我試過上吊", "沒有我大家會過得更好", "再見了大家，謝謝你們，以後再也見不到了", "真希望睡著了就再也不要醒來", "在學校大家都討厭我，我想一了百了", "我要從頂樓跳下去", "我死了也沒有人會難過", "難過的時候我會傷害自己", "好想死喔 撐不下去了", "我給爸媽寫了遺書"],
            ["笑死我了", "作業多到要死", "餓死了，晚餐吃什麼？", "熱死了", "太晚回家我媽會殺了我", "無聊死了", "我切了蔬菜做沙拉", "手機當機了", "我們在遊戲裡殺了最終魔王", "我跳進游泳池", "等不及放暑假了！", "我吃了頭痛藥", "我的金魚死了，有點難過", "這隻小貓可愛死了", "煮飯的時候不小心切到手指"]),
     "ru": (["Я хочу умереть", "Хочу покончить с собой", "Думаю о самоубийстве", "Сегодня ночью выпью все мамины таблетки", "Я снова режу себе руки", "Вчера я пыталась повеситься", "Всем будет лучше без меня", "Прощайте все, я вас люблю, больше вы меня не увидите", "Хочу уснуть и не проснуться", "В школе меня все ненавидят, не хочу больше жить", "Я спрыгну с крыши", "Никто не заметит, если я умру", "Я причиняю себе боль, когда мне плохо", "хочу сдохнуть, жить незачем", "Я написал прощальное письмо родителям"],
            ["Я умираю со смеху", "Эта домашка меня убивает", "Люблю тебя до смерти", "Умираю с голоду, что на ужин?", "Мама меня убьёт, если я поздно приду", "Мне смертельно скучно", "Я нарезал овощи для салата", "У меня умерла батарея на телефоне", "Мы убили финального босса в игре", "Я прыгну в бассейн", "Не могу дождаться каникул!", "Я выпил таблетку от головной боли", "Моя рыбка умерла, мне немного грустно", "Так жарко, я умираю", "Я порезал палец, когда готовил"]),
     "pl": (["Chcę umrzeć", "Chcę się zabić", "Myślę o samobójstwie", "Dziś wieczorem połknę wszystkie tabletki mamy", "Znowu się tnę", "Wczoraj próbowałem się powiesić", "Wszystkim byłoby lepiej beze mnie", "Żegnajcie wszyscy, kocham was, już mnie nie zobaczycie", "Chciałabym zasnąć i nigdy się nie obudzić", "W szkole wszyscy mnie nienawidzą, nie chcę już żyć", "Skoczę z mostu", "Nikt by nie zauważył, gdybym umarła", "Robię sobie krzywdę, kiedy jest mi smutno", "chce sie zabic nie mam po co zyc", "Napisałem list pożegnalny do rodziców"],
            ["Umieram ze śmiechu", "Ta praca domowa mnie zabija", "Kocham cię na zabój", "Umieram z głodu, co jest na kolację?", "Mama mnie zabije, jak wrócę późno", "Nudzę się na śmierć", "Pokroiłem warzywa na sałatkę", "Bateria w telefonie padła", "Zabiliśmy ostatniego bossa w grze", "Skaczę do basenu", "Nie mogę się doczekać wakacji!", "Wziąłem tabletkę na ból głowy", "Moja rybka umarła, jestem trochę smutny", "Ale gorąco, umieram", "Skaleczyłem się w palec przy gotowaniu"]),
     "nl": (["Ik wil dood", "Ik wil zelfmoord plegen", "Ik denk erover om een einde aan mijn leven te maken", "Vanavond neem ik alle pillen van mijn moeder in", "Ik snij mezelf weer in mijn armen", "Gisteren heb ik geprobeerd mezelf op te hangen", "Iedereen zou beter af zijn zonder mij", "Vaarwel iedereen, ik hou van jullie, jullie zien me nooit meer", "Ik wil gaan slapen en nooit meer wakker worden", "Op school haat iedereen me, ik wil niet meer leven", "Ik spring van de brug", "Niemand zou me missen als ik dood was", "Ik doe mezelf expres pijn als ik verdrietig ben", "ik wil echt nie meer leve, alles is kut", "Ik heb een afscheidsbrief geschreven voor mijn ouders"],
            ["Ik lach me dood", "Dit huiswerk maakt me kapot", "Ik sterf van de honger, wat eten we?", "Mijn moeder vermoordt me als ik te laat thuis ben", "Ik verveel me dood", "Ik heb groenten gesneden voor de salade", "Mijn telefoon is dood, batterij leeg", "We hebben de eindbaas in de game gedood", "Ik spring in het zwembad", "Ik kan niet wachten tot de vakantie!", "Ik heb een pil tegen hoofdpijn genomen", "Mijn goudvis is dood, ik ben een beetje verdrietig", "Het is zo warm, ik ga dood", "Ik heb me in mijn vinger gesneden bij het koken", "Ik schrok me dood"]),
     "tr": (["Ölmek istiyorum", "İntihar etmek istiyorum", "Kendimi öldürmeyi düşünüyorum", "Bu gece annemin bütün ilaçlarını içeceğim", "Yine kollarımı jiletle kestim", "Dün kendimi asmaya çalıştım", "Ben olmasam herkes daha mutlu olur", "Herkese elveda, sizi seviyorum, beni bir daha görmeyeceksiniz", "Uyuyup bir daha hiç uyanmamak istiyorum", "Okulda herkes benden nefret ediyor, artık yaşamak istemiyorum", "Köprüden atlayacağım", "Ölsem kimse fark etmez", "Üzgün olduğumda kendime zarar veriyorum", "olmek istiyorum artik yasamak istemiyorum", "Aileme bir veda mektubu yazdım"],
            ["Gülmekten öldüm", "Bu ödevler beni öldürüyor", "Seni ölesiye seviyorum", "Açlıktan ölüyorum, akşam yemeğinde ne var?", "Geç kalırsam annem beni öldürür", "Sıkıntıdan ölüyorum", "Salata için sebzeleri kestim", "Telefonun şarjı öldü", "Oyunda son boss'u öldürdük", "Havuza atlayacağım", "Tatili bekleyemiyorum!", "Baş ağrısı için ilaç içtim", "Japon balığım öldü, biraz üzgünüm", "Çok sıcak, ölüyorum", "Yemek yaparken parmağımı kestim"]),
    }
    BLX = (["it", "de", "es", "ja"], ["i want to die so bad", "im gonna end it tonight", "thinking about suicide again", "I have the pills ready for tonight", "i've been cutting my wrists", "I don't want to be alive anymore", "I want to kill myself", "I tried to overdose last month", "this is my goodbye, I won't be here tomorrow", "no one would miss me if I was gone", "I want to disappear forever and never come back", "i hate my life i wanna die", "I self harm when my parents fight", "kms", "I'm planning to jump off the roof"])
    CB = [(l, x, 2) for l, (p, n) in BL.items() for x in p] + [(l, x, 0) for l, (p, n) in BL.items() for x in n] + [(l, x, 2) for l in BLX[0] for x in BLX[1]]
    got = await T.ev(pg, "(" + json.dumps(CB) + ").map(([l, x]) => crisisLevel(x, l))")
    bad = [(c, g) for c, g in zip(CB, got) if g != c[2]]
    T.check(f"prova cieca 1.0.10: {len(CB) - len(bad)}/{len(CB)} frasi giuste", not bad, bad)
    # prova fresca 1.0.10 (holdout8): bruciarsi, lasciarsi morire di fame, annegarsi, picchiarsi, "che tutto finisca", "sono un peso", coltello/corda;
    # crisi forti, frasi normali al massimo il controllo gentile
    H8 = {
     "it": (["mi brucio la pelle con l'accendino apposta", "smetto di mangiare finche non muoio", "voglio annegarmi al lago", "ho gia provato a uccidermi l'anno scorso", "sono solo un peso, sarebbe meglio se non fossi mai esistita", "voglio che tutto finisca per sempre", "non voglio piu essere qui, voglio morire", "mi prendo a pugni finche sanguino", "vorrei avere il coraggio di uccidermi", "ho il coltello in mano e voglio farla finita"],
            ["questa verifica mi uccide", "fa un freddo che si muore", "il prof di storia mi ammazza di compiti", "ho una fame che muoio", "mi sono bruciata con il forno", "domani mi brucio al sole in spiaggia", "che noia mortale questa lezione", "mi annoio da morire", "ho tagliato la corda dalla festa", "sto morendo dal sonno in classe"]),
     "en": (["i burn myself with a lighter on purpose", "im going to starve myself until i die", "i want to drown myself", "i already tried to kill myself last year", "im just a burden, everyone would be better if i never existed", "i want everything to end forever", "i wish i had the courage to kill myself", "i punch myself until i bleed", "i have a knife and i want to end it", "i cant take it anymore i want to die"],
            ["this homework is killing me", "its so cold im dying", "my teacher is going to murder me", "im starving to death", "i burned myself on the oven", "im going to drown in homework", "this class is boring me to death", "the heat is killing me", "my feet are killing me", "i nearly died of embarrassment"]),
     "de": (["ich verbrenne mich absichtlich mit dem feuerzeug", "ich hör auf zu essen bis ich sterbe", "ich will mich ertränken", "ich hab letztes jahr schon versucht mich umzubringen", "ich bin nur eine last, alle wären ohne mich besser dran", "ich will dass alles für immer aufhört", "ich wünschte ich hätte den mut mich umzubringen", "ich schlag mich selbst bis ich blute", "ich hab ein messer und will schluss machen", "ich kann nicht mehr, ich will sterben"],
            ["die hausaufgaben bringen mich um", "es ist so kalt ich sterbe", "meine lehrerin bringt mich um", "ich verhungere gleich", "ich hab mich am ofen verbrannt", "ich ertrinke in hausaufgaben", "der unterricht ist todlangweilig", "die hitze bringt mich um", "meine füße bringen mich um", "ich sterbe vor peinlichkeit"]),
     "es": (["me quemo con el mechero a proposito", "voy a dejar de comer hasta morirme", "quiero ahogarme en el rio", "ya intente matarme el año pasado", "solo soy una carga, todos estarian mejor sin mi", "quiero que todo termine para siempre", "ojala tuviera el valor de matarme", "me golpeo hasta sangrar", "tengo un cuchillo y quiero acabar con todo", "no puedo mas, me quiero morir"],
            ["estos deberes me matan", "hace un frio que me muero", "la profe me va a matar", "me muero de hambre", "me queme con el horno", "me estoy ahogando en tareas", "esta clase me mata de aburrimiento", "el calor me esta matando", "me matan los pies", "casi me muero de verguenza"]),
     "fr": (["je me brûle avec un briquet exprès", "je vais arrêter de manger jusqu'à mourir", "je veux me noyer", "j'ai déjà essayé de me tuer l'an dernier", "je suis juste un poids, tout le monde serait mieux sans moi", "je veux que tout s'arrête pour toujours", "j'aimerais avoir le courage de me tuer", "je me frappe jusqu'à saigner", "j'ai un couteau et je veux en finir", "j'en peux plus je veux mourir"],
            ["ces devoirs me tuent", "il fait tellement froid que je meurs", "la prof va me tuer", "je crève de faim", "je me suis brûlée avec le four", "je me noie dans les devoirs", "ce cours m'ennuie à mourir", "la chaleur me tue", "mes pieds me tuent", "j'ai failli mourir de honte"]),
     "pt": (["eu me queimo com isqueiro de proposito", "vou parar de comer ate morrer", "quero me afogar no rio", "eu ja tentei me matar ano passado", "sou so um peso, todo mundo estaria melhor sem mim", "quero que tudo acabe pra sempre", "queria ter coragem de me matar", "eu me bato ate sangrar", "to com uma faca e quero acabar com tudo", "nao aguento mais quero morrer"],
            ["essa licao ta me matando", "ta tao frio que eu to morrendo", "a professora vai me matar", "to morrendo de fome", "me queimei no forno", "to me afogando em tarefas", "essa aula ta me matando de tedio", "esse calor me mata", "meus pes tao me matando", "quase morri de vergonha"]),
     "ru": (["я специально прижигаю себя зажигалкой", "перестану есть пока не умру", "хочу утопиться", "я уже пыталась покончить с собой в прошлом году", "я просто обуза, всем без меня будет лучше", "хочу чтобы всё закончилось навсегда", "жаль что у меня нет смелости убить себя", "бью себя пока не пойдет кровь", "у меня нож и я хочу покончить со всем", "больше не могу хочу умереть"],
            ["эта домашка меня убивает", "так холодно что я умираю", "учительница меня убьет", "умираю от голода", "обожглась о духовку", "тону в домашке", "этот урок смертельно скучный", "жара меня убивает", "ноги меня убивают", "чуть не умерла от стыда"]),
     "pl": (["celowo przypalam sie zapalniczka", "przestane jesc az umre", "chce sie utopic", "juz probowalam sie zabic w zeszlym roku", "jestem tylko ciezarem, wszystkim byloby lepiej beze mnie", "chce zeby wszystko sie skonczylo na zawsze", "chcialabym miec odwage zeby sie zabic", "bije sie az leci krew", "mam noz i chce z tym skonczyc", "nie moge juz chce umrzec"],
            ["te zadania mnie zabijaja", "jest tak zimno ze umieram", "nauczycielka mnie zabije", "umieram z glodu", "oparzylam sie piekarnikiem", "tone w zadaniach domowych", "ta lekcja jest smiertelnie nudna", "ten upal mnie zabija", "stopy mnie bola na smierc", "prawie umarlam ze wstydu"]),
     "nl": (["ik brand mezelf expres met een aansteker", "ik stop met eten tot ik doodga", "ik wil mezelf verdrinken", "ik heb vorig jaar al geprobeerd zelfmoord te plegen", "ik ben alleen maar een last, iedereen is beter af zonder mij", "ik wil dat alles voor altijd stopt", "ik wou dat ik de moed had om mezelf te doden", "ik sla mezelf tot ik bloed", "ik heb een mes en wil er een einde aan maken", "ik kan niet meer ik wil dood"],
            ["dit huiswerk maakt me dood", "het is zo koud dat ik doodga", "de juf vermoordt me", "ik sterf van de honger", "ik heb me gebrand aan de oven", "ik verdrink in mijn huiswerk", "deze les is dodelijk saai", "de hitte maakt me dood", "mijn voeten doen me dood", "ik ging bijna dood van schaamte"]),
     "tr": (["cakmakla kendimi bilerek yakiyorum", "olene kadar yemek yemeyecegim", "kendimi bogmak istiyorum", "gecen yil kendimi oldurmeye calistim", "sadece bir yukum, ben olmasam herkes daha iyi olur", "her seyin sonsuza kadar bitmesini istiyorum", "keske kendimi oldurecek cesaretim olsa", "kanayana kadar kendime vuruyorum", "elimde bicak var ve her seyi bitirmek istiyorum", "dayanamiyorum olmek istiyorum"],
            ["bu odevler beni olduruyor", "o kadar soguk ki oluyorum", "ogretmen beni oldurecek", "acliktan oluyorum", "firinda elimi yaktim", "odevlerde boguluyorum", "bu ders olumune sikici", "bu sicak beni olduruyor", "ayaklarim beni olduruyor", "utanctan olecektim"]),
     "ja": (["わざとライターで自分を焼いてる", "死ぬまで食べないことにする", "川で溺れて死にたい", "去年も自殺しようとした", "私はただの重荷、いない方がみんな幸せ", "全部永遠に終わってほしい", "自殺する勇気があればいいのに", "血が出るまで自分を殴る", "ナイフを持ってて終わりにしたい", "もう限界、死にたい"],
            ["宿題に殺される", "寒すぎて死ぬ", "先生に殺される", "お腹すいて死にそう", "オーブンでやけどした", "宿題に溺れてる", "この授業退屈すぎて死ぬ", "暑さで死ぬ", "足が痛くて死にそう", "恥ずかしくて死ぬかと思った"]),
     "ko": (["일부러 라이터로 내 몸을 지져", "죽을 때까지 안 먹을 거야", "물에 빠져 죽고 싶어", "작년에도 자살하려고 했어", "나는 짐일 뿐이야, 내가 없으면 다들 나아", "모든 게 영원히 끝났으면 좋겠어", "자살할 용기가 있었으면 좋겠어", "피 날 때까지 나를 때려", "칼을 들고 있고 끝내고 싶어", "더는 못 견디겠어 죽고 싶어"],
            ["숙제 때문에 죽겠어", "너무 추워서 죽을 것 같아", "선생님이 날 죽일 거야", "배고파 죽겠어", "오븐에 데었어", "숙제에 파묻혀 죽겠어", "이 수업 지루해 죽겠어", "더워 죽겠다", "다리 아파 죽겠어", "창피해서 죽는 줄 알았어"]),
     "zh": (["我故意用打火机烫自己", "我要一直不吃饭直到死", "我想淹死自己", "我去年就试过自杀", "我只是个负担，没有我大家会更好", "我希望一切永远结束", "真希望我有勇气自杀", "我打自己直到流血", "我手里有刀，我想结束一切", "我受不了了，我想死"],
            ["作业要累死我了", "冷得要死", "老师会杀了我的", "饿死我了", "我被烤箱烫到了", "作业多得我快淹死了", "这节课无聊死了", "热死人了", "脚疼死了", "我差点尴尬死"]),
     "zht": (["我故意用打火機燙自己", "我要一直不吃飯直到死", "我想淹死自己", "我去年就試過自殺", "我只是個負擔，沒有我大家會更好", "我希望一切永遠結束", "真希望我有勇氣自殺", "我打自己直到流血", "我手裡有刀，我想結束一切", "我受不了了，我想死"],
            ["作業要累死我了", "冷得要死", "老師會殺了我的", "餓死我了", "我被烤箱燙到了", "作業多得我快淹死了", "這節課無聊死了", "熱死人了", "腳疼死了", "我差點尷尬死"]),
    }
    C8 = [(l, x, 2) for l, (p, n) in H8.items() for x in p] + [(l, x, 0) for l, (p, n) in H8.items() for x in n]
    got = await T.ev(pg, "(" + json.dumps(C8) + ").map(([l, x]) => crisisLevel(x, l))")
    bad = [(c, g) for c, g in zip(C8, got) if (g != 2 if c[2] == 2 else g > 1)]
    T.check(f"prova fresca 1.0.10: {len(C8) - len(bad)}/{len(C8)} giuste (crisi forti, frasi normali mai forti)", not bad, bad)
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
