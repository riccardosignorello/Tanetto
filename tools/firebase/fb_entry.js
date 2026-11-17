/* Tanetto: account e backup online (Firebase). Caricato solo quando serve.
   L'app usa solo window.TanFB, cosi' non dipende dai dettagli di Firebase. */
import { initializeApp } from "firebase/app";
import {
  initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserPopupRedirectResolver,
  GoogleAuthProvider, EmailAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithCredential,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification,
  deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, signOut, onAuthStateChanged, connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, serverTimestamp, connectFirestoreEmulator, writeBatch, Timestamp } from "firebase/firestore/lite";
import { initializeAppCheck, CustomProvider } from "firebase/app-check";

let app = null, auth = null, db = null, ready = null, native = false;

function who(u) {
  if (!u) return null;
  const p = (u.providerData || []).map((x) => x.providerId);
  return { uid: u.uid, email: u.email || "", provider: p.includes("google.com") ? "google" : "password", verified: !!u.emailVerified };
}
function fail(e) { const x = new Error((e && e.message) || "error"); x.code = (e && e.code) || "unknown"; throw x; }
const ref = () => doc(db, "backups", auth.currentUser.uid);

const TanFB = {
  init(cfg, opts = {}) {
    if (ready) return ready;
    native = !!opts.native;
    app = initializeApp(cfg);
    /* 1.0.10: App Check (Play Integrity) solo nell'app Android e solo se acceso nella build: opts.appCheck e' la funzione
       che chiede il gettone al codice nativo (TanettoAppCheck). Va attivato prima di Auth e Firestore. Se il gettone non
       arriva, l'SDK manda le richieste senza gettone valido: finche' la console non lo rende obbligatorio, passano.
       Rinnovo automatico SPENTO: il gettone si chiede solo quando Auth o Firestore ne hanno bisogno e quello di prima e'
       scaduto (con il rinnovo automatico l'SDK ne chiederebbe uno nuovo a meta' durata: il doppio delle chiamate a Play Integrity). */
    if (typeof opts.appCheck === "function") {
      try { initializeAppCheck(app, { provider: new CustomProvider({ getToken: opts.appCheck }), isTokenAutoRefreshEnabled: false }); } catch (e) { /* senza App Check, come prima */ }
    }
    auth = initializeAuth(app, native
      ? { persistence: indexedDBLocalPersistence }
      : { persistence: [indexedDBLocalPersistence, browserLocalPersistence], popupRedirectResolver: browserPopupRedirectResolver });
    db = getFirestore(app);
    if (opts.emu) { connectAuthEmulator(auth, `http://${opts.emu}:9099`, { disableWarnings: true }); connectFirestoreEmulator(db, opts.emu, 8080); }
    if (opts.lang) auth.languageCode = opts.lang;
    ready = new Promise((res) => { const off = onAuthStateChanged(auth, (u) => { off(); res(who(u)); }); });
    if (!native) getRedirectResult(auth).catch(() => {});
    return ready;
  },
  current() { return who(auth && auth.currentUser); },
  setLang(l) { if (auth) auth.languageCode = l; },
  async google(idToken) {
    try {
      if (idToken) return who((await signInWithCredential(auth, GoogleAuthProvider.credential(idToken))).user);
      const pr = new GoogleAuthProvider(); pr.setCustomParameters({ prompt: "select_account" });
      try { return who((await signInWithPopup(auth, pr)).user); }
      catch (e) { if (e && e.code === "auth/popup-blocked") { await signInWithRedirect(auth, pr); return null; } throw e; }
    } catch (e) { fail(e); }
  },
  async emailSignIn(email, pw) { try { return who((await signInWithEmailAndPassword(auth, email, pw)).user); } catch (e) { fail(e); } },
  async emailSignUp(email, pw) {
    try {
      const u = (await createUserWithEmailAndPassword(auth, email, pw)).user;
      sendEmailVerification(u).catch(() => {});
      return who(u);
    } catch (e) { fail(e); }
  },
  async resetPw(email) { try { await sendPasswordResetEmail(auth, email); } catch (e) { fail(e); } },
  async pull() {
    try {
      const s = await getDoc(ref()); if (!s.exists()) return null;
      const x = s.data(); return { d: x.d, at: x.at && x.at.toMillis ? x.at.toMillis() : 0, v: x.v };
    } catch (e) { fail(e); }
  },
  async push(d) {
    try { await setDoc(ref(), { d, at: serverTimestamp(), v: 1, z: /^TANETTO1:/.test(d) }); return Date.now(); } catch (e) { fail(e); }
  },
  async reauthPassword(pw) { try { const u = auth.currentUser; await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, pw)); } catch (e) { fail(e); } },
  async reauthGoogle(idToken) {
    try {
      const u = auth.currentUser;
      if (idToken) await reauthenticateWithCredential(u, GoogleAuthProvider.credential(idToken));
      else await reauthenticateWithPopup(u, new GoogleAuthProvider());
    } catch (e) { fail(e); }
  },
  /* Elimina backup e account. Il backup si cancella per primo: se l'account chiede un nuovo accesso, si riprova senza perdere nulla. */
  async remove() {
    try { await deleteDoc(ref()); await deleteUser(auth.currentUser); } catch (e) { fail(e); }
  },
  async out() { try { await signOut(auth); } catch (e) { fail(e); } },
  /* Vantaggi speciali dell'account (solo l'account dei revisori di Google Play: Plus sbloccato per la revisione).
     Il documento si crea solo dalla console di Firebase: dall'app si puo' solo leggere il proprio. */
  async perks() {
    try { const s = await getDoc(doc(db, "reviewers", auth.currentUser.uid)); return s.exists() ? s.data() : null; } catch (e) { return null; }
  },
  /* ---- 1.0.11 Invita un amico (solo adulti; senza account: le regole di Firestore controllano tutto, vedi
     tools/firebase/firestore.rules). Nessun dato personale: codice casuale, impronta cifrata del telefono, date. ---- */
  async invCreate(code, dev) {
    try {
      const b = writeBatch(db); const exp = Timestamp.fromMillis(Date.now() + 365 * 864e5);
      b.set(doc(db, "invites", code), { q: 0, at: serverTimestamp(), exp });
      b.set(doc(db, "invites", code, "p", "x"), { dev, exp });
      await b.commit(); return true;
    } catch (e) { fail(e); }
  },
  async invGet(code) {
    try { const s = await getDoc(doc(db, "invites", code)); return s.exists() ? { q: +s.data().q || 0 } : null; } catch (e) { fail(e); }
  },
  async invClaim(code, cid, kh, dev) {
    try {
      const b = writeBatch(db); const exp = Timestamp.fromMillis(Date.now() + 365 * 864e5);
      b.set(doc(db, "invites", code, "c", cid), { at: serverTimestamp(), kh, ok: false, dev, exp });
      b.set(doc(db, "devs", dev), { at: serverTimestamp(), exp });
      await b.commit(); return true;
    } catch (e) { fail(e); }
  },
  async invQualify(code, cid, k) {
    try {
      const s = await getDoc(doc(db, "invites", code)); if (!s.exists()) { const x = new Error("gone"); x.code = "not-found"; throw x; }
      const b = writeBatch(db);
      b.update(doc(db, "invites", code, "c", cid), { ok: true, k });
      b.update(doc(db, "invites", code), { q: (+s.data().q || 0) + 1, last: cid });
      await b.commit(); return true;
    } catch (e) { fail(e); }
  },
};
window.TanFB = TanFB;
