// 1.0.11: prova delle regole di Firestore di "Invita un amico" (tools/firebase/firestore.rules) con l'emulatore.
// Uso: bash tests/t110/run_n111_rules.sh   (avvia l'emulatore con le regole, poi questo file).
// Le 36 ore minime fra l'arrivo dell'amico e i "3 giorni fatti" nelle regole di prova sono 4 secondi (stessa logica).
import { createRequire } from "module";
import crypto from "crypto";
const require = createRequire((process.env.FB_NODE_MODULES || "/home/claude/fbbuild110/node_modules") + "/");
const { initializeApp } = require("firebase/app");
const { getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, writeBatch, serverTimestamp, Timestamp, collection, getDocs } = require("firebase/firestore/lite");

const app = initializeApp({ projectId: "demo-tanetto", apiKey: "x" });
const db = getFirestore(app); connectFirestoreEmulator(db, "127.0.0.1", 8080);
let bad = 0;
const ok = (n, c) => { console.log((c ? "OK  " : "NO  ") + n); if (!c) bad++; };
const tries = async (f) => { try { await f(); return true; } catch (e) { return false; } };
const hex = (n) => crypto.randomBytes(n).toString("hex");
const exp = () => Timestamp.fromMillis(Date.now() + 365 * 864e5);
const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const code = () => Array.from(crypto.randomBytes(8), (b) => A[b & 31]).join("");
const cid = () => Array.from(crypto.randomBytes(20), (b) => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[b % 62]).join("");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function create(c, dev) { const b = writeBatch(db); b.set(doc(db, "invites", c), { q: 0, at: serverTimestamp(), exp: exp() }); b.set(doc(db, "invites", c, "p", "x"), { dev, exp: exp() }); await b.commit(); }
async function claim(c, id, kh, dev) { const b = writeBatch(db); b.set(doc(db, "invites", c, "c", id), { at: serverTimestamp(), kh, ok: false, dev, exp: exp() }); b.set(doc(db, "devs", dev), { at: serverTimestamp(), exp: exp() }); await b.commit(); }
async function qualify(c, id, k, q) { const b = writeBatch(db); b.update(doc(db, "invites", c, "c", id), { ok: true, k }); b.update(doc(db, "invites", c), { q: q + 1, last: id }); await b.commit(); }

const devA = hex(32), devB = hex(32), devC = hex(32);
const C = code();
ok("chi invita crea il codice (q = 0, impronta insieme)", await tries(() => create(C, devA)));
ok("lo stesso codice non si ricrea (niente furto di codice)", !(await tries(() => create(C, devB))));
ok("codice con lettere ambigue (O, 0, I, 1) rifiutato", !(await tries(() => create("ABCDEFG0", devA))));
ok("invito senza impronta rifiutato", !(await tries(() => setDoc(doc(db, "invites", code()), { q: 0, at: serverTimestamp(), exp: exp() }))));
ok("invito che parte da q = 3 rifiutato", !(await tries(async () => { const c = code(); const b = writeBatch(db); b.set(doc(db, "invites", c), { q: 3, at: serverTimestamp(), exp: exp() }); b.set(doc(db, "invites", c, "p", "x"), { dev: devA, exp: exp() }); await b.commit(); })));
ok("scadenza (exp) assurda rifiutata", !(await tries(async () => { const c = code(); const b = writeBatch(db); b.set(doc(db, "invites", c), { q: 0, at: serverTimestamp(), exp: Timestamp.fromMillis(Date.now() + 5 * 365 * 864e5) }); b.set(doc(db, "invites", c, "p", "x"), { dev: devA, exp: exp() }); await b.commit(); })));
const g = await getDoc(doc(db, "invites", C));
ok("chi ha il codice legge solo il contatore (q = 0)", g.exists() && g.data().q === 0);
ok("l'impronta di chi invita NON si legge", !(await tries(() => getDoc(doc(db, "invites", C, "p", "x")))));
ok("l'elenco degli inviti NON si legge", !(await tries(() => getDocs(collection(db, "invites")))));
ok("l'elenco degli amici NON si legge", !(await tries(() => getDocs(collection(db, "invites", C, "c")))));

const k1 = hex(16), id1 = cid();
ok("stesso telefono di chi invita: l'invito NON vale", !(await tries(() => claim(C, cid(), sha(hex(16)), devA))));
ok("amico (telefono B) arriva con il codice", await tries(() => claim(C, id1, sha(k1), devB)));
ok("lo stesso telefono B non usa un secondo invito", !(await tries(async () => { const C2 = code(); await create(C2, devC); await claim(C2, cid(), sha(hex(16)), devB); })));
ok("amico senza la sua impronta in devs: rifiutato", !(await tries(() => setDoc(doc(db, "invites", C, "c", cid()), { at: serverTimestamp(), kh: sha(hex(16)), ok: false, dev: hex(32), exp: exp() }))));
ok("amico che arriva gia' 'fatto' (ok = true): rifiutato", !(await tries(async () => { const d = hex(32); const b = writeBatch(db); b.set(doc(db, "invites", C, "c", cid()), { at: serverTimestamp(), kh: sha(hex(16)), ok: true, dev: d, exp: exp() }); b.set(doc(db, "devs", d), { at: serverTimestamp(), exp: exp() }); await b.commit(); })));
ok("codice inesistente: rifiutato", !(await tries(() => claim(code(), cid(), sha(hex(16)), hex(32)))));
ok("i 3 giorni NON valgono prima del tempo minimo", !(await tries(() => qualify(C, id1, k1, 0))));
await sleep(5000);
ok("chiave sbagliata: rifiutato", !(await tries(() => qualify(C, id1, hex(16), 0))));
ok("contatore che salta di 2: rifiutato", !(await tries(async () => { const b = writeBatch(db); b.update(doc(db, "invites", C, "c", id1), { ok: true, k: k1 }); b.update(doc(db, "invites", C), { q: 2, last: id1 }); await b.commit(); })));
ok("'fatto' senza alzare il contatore: rifiutato", !(await tries(() => writeBatch(db).update(doc(db, "invites", C, "c", id1), { ok: true, k: k1 }).commit())));
ok("contatore alzato senza amico: rifiutato", !(await tries(() => writeBatch(db).update(doc(db, "invites", C), { q: 1, last: id1 }).commit())));
ok("amico vero, chiave giusta, dopo il tempo minimo: q = 1", await tries(() => qualify(C, id1, k1, 0)));
ok("lo stesso amico non conta due volte", !(await tries(() => qualify(C, id1, k1, 1))));
ok("chi invita legge q = 1", (await getDoc(doc(db, "invites", C))).data().q === 1);
ok("nessuno cancella l'invito", !(await tries(async () => { const { deleteDoc } = require("firebase/firestore/lite"); await deleteDoc(doc(db, "invites", C)); })));
console.log(bad ? `CI SONO ${bad} NO` : "TUTTO OK");
process.exit(bad ? 1 : 0);
