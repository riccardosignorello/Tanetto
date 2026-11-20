/* =================== 1.0.10/1.0.12: informativa, backup automatico di Android ===================
   Il backup Android include i dati dell'app ammessi dalle regole di backup, per non perdere i progressi.
   Il mese e l'anno di nascita sono conservati separatamente in getNoBackupFilesDir(): non entrano nel backup Android,
   nel trasferimento dispositivo-dispositivo o nel backup online. La distinzione e' esplicita in tutte le 14 lingue. */
const V110_BACKUP = {
  it: " Se sul telefono è attivo il backup di Android, una copia cifrata dei dati dell'app ammessi al backup (esclusi il mese e l'anno di nascita) viene inclusa nel backup del tuo account Google. La gestisce Google e puoi spegnerla dalle impostazioni del telefono.",
  en: " If Android backup is turned on on your phone, an encrypted copy of the app data eligible for backup (excluding your birth month and year) is also kept in your Google account's backup. Google manages it, and you can turn it off in your phone's settings.",
  de: " Wenn auf deinem Handy die Android-Sicherung eingeschaltet ist, wird eine verschlüsselte Kopie der für die Sicherung zugelassenen App-Daten (ohne Geburtsmonat und -jahr) auch in der Sicherung deines Google-Kontos gespeichert. Google verwaltet sie; du kannst sie in den Einstellungen deines Handys ausschalten.",
  es: " Si en tu teléfono está activada la copia de seguridad de Android, una copia cifrada de los datos de la app incluidos en la copia (sin el mes ni el año de nacimiento) también se guarda en tu cuenta de Google. Google la gestiona y puedes desactivarla en los ajustes del teléfono.",
  fr: " Si la sauvegarde Android est activée sur ton téléphone, une copie chiffrée des données de l'app incluses dans la sauvegarde (sans le mois ni l'année de naissance) est aussi conservée dans la sauvegarde de ton compte Google. Google la gère et tu peux la désactiver dans les réglages du téléphone.",
  pt: " Se o backup do Android estiver ativado no seu celular, uma cópia criptografada dos dados do app incluídos no backup (sem o mês e o ano de nascimento) também fica no backup da sua conta Google. O Google gerencia essa cópia e você pode desativá-la nas configurações do celular.",
  ja: "スマートフォンでAndroidのバックアップがオンになっている場合、バックアップ対象のアプリデータ（出生月と出生年を除く）の暗号化されたコピーがGoogleアカウントにも保存されます。管理はGoogleが行い、スマートフォンの設定からオフにできます。",
  ko: "휴대폰에서 Android 백업이 켜져 있으면, 백업 대상 앱 데이터(태어난 달과 연도 제외)의 암호화된 사본도 Google 계정 백업에 저장돼요. Google이 관리하며 휴대폰 설정에서 끌 수 있어요.",
  zh: "如果你的手机开启了 Android 备份，应用中纳入备份的数据（不包括出生月份和年份）的加密副本也会保存在你的 Google 账号备份中。该备份由 Google 管理，你可以在手机设置中关闭。",
  zht: "如果你的手機開啟了 Android 備份，應用程式中納入備份的資料（不包括出生月份和年份）的加密副本也會儲存在你的 Google 帳戶備份中。備份由 Google 管理，你可以在手機設定中關閉。",
  ru: " Если на телефоне включено резервное копирование Android, зашифрованная копия данных приложения, разрешённых для резервного копирования (без месяца и года рождения), также хранится в резервной копии аккаунта Google. Ею управляет Google; отключить её можно в настройках телефона.",
  pl: " Jeśli w telefonie jest włączona kopia zapasowa Androida, zaszyfrowana kopia danych aplikacji objętych kopią zapasową (bez miesiąca i roku urodzenia) trafia też do kopii zapasowej Twojego konta Google. Zarządza nią Google; możesz ją wyłączyć w ustawieniach telefonu.",
  nl: " Als Android-back-up op je telefoon aanstaat, wordt een versleutelde kopie van de appgegevens die voor back-up in aanmerking komen (zonder geboortemaand en -jaar) ook bewaard in de back-up van je Google-account. Google beheert die en je kunt hem uitzetten in de instellingen van je telefoon.",
  tr: " Telefonunda Android yedeklemesi açıksa, yedeklemeye uygun uygulama verilerinin (doğum ayı ve yılı hariç) şifreli bir kopyası Google hesabının yedeğinde de saklanır. Bu kopyayı Google yönetir; telefonunun ayarlarından kapatabilirsin."
};
Object.keys(V110_BACKUP).forEach((l) => {
  const t = T[l]; const P = t && t.privDoc; if (!P || P.v110) return;
  /* P[0] = in breve, P[1] = titolare, P[2] = "Quali dati" */
  if (typeof P[2] === "string" && !P[2].includes(V110_BACKUP[l].trim().slice(0, 20))) P[2] = P[2] + V110_BACKUP[l];
  P.v110 = 1;
});
