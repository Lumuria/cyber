// بيانات الهجمات السيبرانية (متعددة اللغات)
const cyberAttacksData = [
  {
    id: 1,
    name: "ILOVEYOU",

    title: { ar: "هجوم أحبك", en: "ILOVEYOU Attack" },
    date: { ar: "مايو 2000", en: "May 2000" },
    type: { ar: "فيروس", en: "Virus" },
    target: { ar: "أجهزة المستخدمين الشخصية", en: "Personal computers" },
    damage: { ar: "أضرار بقيمة 10 مليارات دولار", en: "Damage worth $10 billion" },

    description: {
      ar: "فيروس انتشر عبر البريد الإلكتروني مع موضوع ILOVEYOU وكان يحذف الملفات ويرسل نفسه.",
      en: "A virus spread via email with subject ILOVEYOU, deleting files and spreading itself."
    },

    prevention: {
      ar: "تجنب فتح المرفقات غير المعروفة واستخدم مضاد فيروسات",
      en: "Avoid unknown attachments and use antivirus software"
    },

    detection: {
      ar: "مراقبة البريد الإلكتروني وبرامج الحماية",
      en: "Email monitoring and antivirus systems"
    },

    solution: {
      ar: "إزالة الفيروس واستعادة النسخ الاحتياطية",
      en: "Remove virus and restore backups"
    },

    severity: { ar: "عالية", en: "High" },
    color: "bg-red-500"
  },

  {
    id: 2,
    name: "WannaCry",

    title: { ar: "وانا كراي", en: "WannaCry" },
    date: { ar: "مايو 2017", en: "May 2017" },
    type: { ar: "برمجية خبيثة", en: "Malware" },
    target: { ar: "أنظمة ويندوز", en: "Windows systems" },
    damage: { ar: "تأثر أكثر من 300,000 جهاز", en: "Over 300,000 devices affected" },

    description: {
      ar: "هجوم عالمي قام بتشفير الملفات وطلب فدية لفك التشفير.",
      en: "A global ransomware attack that encrypted files and demanded payment."
    },

    prevention: {
      ar: "تحديث النظام وعمل نسخ احتياطية",
      en: "Update systems and create backups"
    },

    detection: {
      ar: "مراقبة الشبكة وكشف التسلل",
      en: "Network monitoring and IDS systems"
    },

    solution: {
      ar: "عزل الأجهزة واستعادة البيانات",
      en: "Isolate devices and restore data"
    },

    severity: { ar: "عالية جداً", en: "Critical" },
    color: "bg-red-600"
  },

  {
    id: 3,
    name: "Stuxnet",

    title: { ar: "ستوكسنت", en: "Stuxnet" },
    date: { ar: "2010", en: "2010" },
    type: { ar: "دودة كمبيوتر", en: "Computer Worm" },
    target: { ar: "الأنظمة الصناعية", en: "Industrial systems" },
    damage: { ar: "تدمير أجهزة نووية", en: "Damage to nuclear equipment" },

    description: {
      ar: "دودة متطورة استهدفت أنظمة التحكم الصناعية.",
      en: "Advanced worm targeting industrial control systems."
    },

    prevention: {
      ar: "عزل الأنظمة عن الإنترنت",
      en: "Isolate systems from internet"
    },

    detection: {
      ar: "مراقبة الأنظمة الصناعية",
      en: "Monitor industrial systems"
    },

    solution: {
      ar: "تحديث الأنظمة وتعزيز الأمان",
      en: "Update systems and improve security"
    },

    severity: { ar: "متوسطة", en: "Medium" },
    color: "bg-yellow-500"
  },

  {
    id: 4,
    name: "Equifax",

    title: { ar: "اختراق إكويفاكس", en: "Equifax Breach" },
    date: { ar: "2017", en: "2017" },
    type: { ar: "اختراق بيانات", en: "Data Breach" },
    target: { ar: "شركة إكويفاكس", en: "Equifax company" },
    damage: { ar: "تسريب بيانات 147 مليون شخص", en: "Data leak of 147 million people" },

    description: {
      ar: "اختراق ضخم أدى إلى تسريب بيانات حساسة.",
      en: "Massive breach exposing sensitive user data."
    },

    prevention: {
      ar: "تحديث الأنظمة وتشفير البيانات",
      en: "Update systems and encrypt data"
    },

    detection: {
      ar: "مراقبة البيانات وكشف التسلل",
      en: "Data monitoring and intrusion detection"
    },

    solution: {
      ar: "تعزيز الأمان وإشعار المستخدمين",
      en: "Improve security and notify users"
    },

    severity: { ar: "عالية", en: "High" },
    color: "bg-red-500"
  },

  {
    id: 5,
    name: "SolarWinds",

    title: { ar: "سولار ويندز", en: "SolarWinds Attack" },
    date: { ar: "2020", en: "2020" },
    type: { ar: "هجوم سلسلة التوريد", en: "Supply Chain Attack" },
    target: { ar: "شركات وحكومات", en: "Companies and governments" },
    damage: { ar: "تأثر آلاف المؤسسات", en: "Thousands of organizations affected" },

    description: {
      ar: "هجوم عبر تحديث برمجي مصاب أدى لاختراق واسع.",
      en: "Attack via infected software update affecting many organizations."
    },

    prevention: {
      ar: "مراقبة التحديثات وتطبيق الثقة الصفرية",
      en: "Monitor updates and apply zero trust"
    },

    detection: {
      ar: "تحليل السلوك ومراقبة الشبكة",
      en: "Behavior analysis and network monitoring"
    },

    solution: {
      ar: "إزالة البرامج المصابة وتعزيز الأمان",
      en: "Remove infected software and improve security"
    },

    severity: { ar: "عالية جداً", en: "Critical" },
    color: "bg-red-600"
  }
];

export default cyberAttacksData;