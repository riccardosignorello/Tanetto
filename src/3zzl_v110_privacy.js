/* =================== 1.0.10 (110): informativa, backup automatico di Android ===================
   La parte "Quali dati" dice che i dati restano sul telefono: e' vero, ma se nel telefono e' acceso il backup di Android
   (data_extraction_rules.xml lo permette, per non perdere i progressi cambiando telefono) Google ne tiene una copia
   cifrata nell'account Google della persona. Lo si dice, in 14 lingue (critica indipendente 1.0.10, punto 11). */
const V110_BACKUP = {
  it: " Se sul telefono è attivo il backup di Android, una copia cifrata di questi dati (compresa l'età) finisce anche nel backup del tuo account Google, come per tutte le app: la gestisce Google e puoi spegnerla dalle impostazioni del telefono.",
  en: " If Android backup is turned on on your phone, an encrypted copy of this data (including your age) is also kept in your Google account's backup, as for every app: Google manages it and you can turn it off in your phone's settings.",
  de: " Wenn auf deinem Handy die Android-Sicherung eingeschaltet ist, landet eine verschlüsselte Kopie dieser Daten (auch dein Alter) wie bei jeder App in der Sicherung deines Google-Kontos: Google verwaltet sie, und du kannst sie in den Einstellungen deines Handys ausschalten.",
  es: " Si en tu teléfono está activada la copia de seguridad de Android, una copia cifrada de estos datos (incluida tu edad) también se guarda en la copia de seguridad de tu cuenta de Google, como con todas las apps: la gestiona Google y puedes desactivarla en los ajustes del teléfono.",
  fr: " Si la sauvegarde Android est activée sur ton téléphone, une copie chiffrée de ces données (y compris ton âge) est aussi conservée dans la sauvegarde de ton compte Google, comme pour toutes les apps : Google la gère et tu peux la désactiver dans les réglages du téléphone.",
  pt: " Se o backup do Android estiver ativado no seu celular, uma cópia criptografada desses dados (incluindo sua idade) também fica no backup da sua conta Google, como acontece com todos os apps: quem cuida dela é o Google, e você pode desativá-la nas configurações do celular.",
  ja: "スマートフォンでAndroidのバックアップがオンになっている場合、ほかのアプリと同じように、これらのデータ（年齢を含む）の暗号化されたコピーがGoogleアカウントのバックアップにも保存されます。管理はGoogleが行い、スマートフォンの設定からオフにできます。",
  ko: " 휴대폰에서 Android 백업이 켜져 있으면, 다른 앱과 마찬가지로 이 데이터(나이 포함)의 암호화된 사본이 Google 계정 백업에도 저장돼요. Google이 관리하며 휴대폰 설정에서 끌 수 있어요.",
  zh: "如果你的手机开启了 Android 备份，这些数据（包括年龄）的加密副本也会像所有应用一样保存在你的 Google 账号备份中：由 Google 管理，你可以在手机设置中关闭。",
  zht: "如果你的手機開啟了 Android 備份，這些資料（包括年齡）的加密副本也會像所有 App 一樣儲存在你的 Google 帳戶備份中：由 Google 管理，你可以在手機設定中關閉。",
  ru: " Если на телефоне включено резервное копирование Android, зашифрованная копия этих данных (включая возраст), как и у всех приложений, хранится и в резервной копии твоего аккаунта Google: ею управляет Google, и её можно отключить в настройках телефона.",
  pl: " Jeśli w telefonie jest włączona kopia zapasowa Androida, zaszyfrowana kopia tych danych (także wieku), jak w przypadku każdej aplikacji, trafia też do kopii zapasowej Twojego konta Google: zarządza nią Google, a wyłączyć ją możesz w ustawieniach telefonu.",
  nl: " Als Android-back-up op je telefoon aanstaat, wordt een versleutelde kopie van deze gegevens (ook je leeftijd), zoals bij elke app, ook bewaard in de back-up van je Google-account: Google beheert die en je kunt hem uitzetten in de instellingen van je telefoon.",
  tr: " Telefonunda Android yedeklemesi açıksa, bu verilerin (yaşın dahil) şifreli bir kopyası, tüm uygulamalarda olduğu gibi Google hesabının yedeğinde de saklanır: Google yönetir ve telefonunun ayarlarından kapatabilirsin."
};
Object.keys(V110_BACKUP).forEach((l) => {
  const t = T[l]; const P = t && t.privDoc; if (!P || P.v110) return;
  /* P[0] = in breve, P[1] = titolare, P[2] = "Quali dati" */
  if (typeof P[2] === "string" && !P[2].includes(V110_BACKUP[l].trim().slice(0, 20))) P[2] = P[2] + V110_BACKUP[l];
  P.v110 = 1;
});
