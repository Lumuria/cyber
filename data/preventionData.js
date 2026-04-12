// بيانات طرق الوقاية (متعددة اللغات)
const preventionData = [
  {
    id: 1,

    title: {
      ar: "كلمات المرور القوية",
      en: "Strong Passwords"
    },

    category: {
      ar: "أساسيات الأمان",
      en: "Security Basics"
    },

    description: {
      ar: "استخدام كلمات مرور قوية ومعقدة لحماية الحسابات",
      en: "Use strong and complex passwords to protect accounts"
    },

    tips: [
      {
        ar: "استخدم كلمات مرور بطول 12 حرف على الأقل",
        en: "Use passwords with at least 12 characters"
      },
      {
        ar: "امزج بين الأحرف الكبيرة والصغيرة والأرقام والرموز",
        en: "Mix uppercase, lowercase, numbers, and symbols"
      },
      {
        ar: "تجنب استخدام معلومات شخصية",
        en: "Avoid using personal information"
      },
      {
        ar: "استخدم كلمة مختلفة لكل حساب",
        en: "Use different passwords for each account"
      },
      {
        ar: "استخدم مدير كلمات المرور",
        en: "Use a password manager"
      }
    ],

    importance: { ar: "عالية", en: "High" },
    difficulty: { ar: "سهل", en: "Easy" }
  },

  {
    id: 2,

    title: { ar: "التحديثات الأمنية", en: "Security Updates" },
    category: { ar: "صيانة النظام", en: "System Maintenance" },
    description: {
      ar: "الحفاظ على تحديث البرمجيات وأنظمة التشغيل",
      en: "Keep software and systems updated"
    },

    tips: [
      { ar: "فعّل التحديثات التلقائية", en: "Enable automatic updates" },
      { ar: "حدّث التطبيقات بانتظام", en: "Update apps regularly" },
      { ar: "حدّث مضاد الفيروسات", en: "Update antivirus software" },
      { ar: "راجع التحديثات شهرياً", en: "Check updates monthly" },
      { ar: "احذف البرامج غير المستخدمة", en: "Remove unused software" }
    ],

    importance: { ar: "عالية جداً", en: "Critical" },
    difficulty: { ar: "سهل", en: "Easy" }
  },

  {
    id: 3,

    title: { ar: "النسخ الاحتياطية", en: "Backups" },
    category: { ar: "حماية البيانات", en: "Data Protection" },
    description: {
      ar: "إنشاء نسخ احتياطية منتظمة للبيانات",
      en: "Create regular backups of important data"
    },

    tips: [
      { ar: "اتبع قاعدة 3-2-1", en: "Follow the 3-2-1 backup rule" },
      { ar: "اختبر النسخ الاحتياطية", en: "Test backups regularly" },
      { ar: "استخدم التشفير", en: "Use encryption" },
      { ar: "احفظ نسخة خارجية", en: "Store offsite backup" },
      { ar: "جدول النسخ التلقائي", en: "Schedule automatic backups" }
    ],

    importance: { ar: "عالية", en: "High" },
    difficulty: { ar: "متوسط", en: "Medium" }
  },

  {
    id: 4,

    title: { ar: "التصفح الآمن", en: "Safe Browsing" },
    category: { ar: "الاستخدام اليومي", en: "Daily Usage" },
    description: {
      ar: "ممارسات آمنة أثناء التصفح",
      en: "Safe practices while browsing the internet"
    },

    tips: [
      { ar: "تحقق من المواقع", en: "Verify websites" },
      { ar: "استخدم HTTPS", en: "Use HTTPS websites" },
      { ar: "تجنب الروابط المشبوهة", en: "Avoid suspicious links" },
      { ar: "استخدم متصفح آمن", en: "Use secure browser" },
      { ar: "فعّل مانع الإعلانات", en: "Enable ad blocker" }
    ],

    importance: { ar: "عالية", en: "High" },
    difficulty: { ar: "سهل", en: "Easy" }
  },

  {
    id: 5,

    title: { ar: "أمان الشبكة", en: "Network Security" },
    category: { ar: "الشبكات", en: "Networking" },
    description: {
      ar: "حماية الشبكات والاتصالات",
      en: "Secure networks and connections"
    },

    tips: [
      { ar: "استخدم WPA3", en: "Use WPA3 encryption" },
      { ar: "غيّر كلمة الراوتر", en: "Change router password" },
      { ar: "فعّل الجدار الناري", en: "Enable firewall" },
      { ar: "تجنب الشبكات العامة", en: "Avoid public networks" },
      { ar: "استخدم VPN", en: "Use VPN when needed" }
    ],

    importance: { ar: "عالية", en: "High" },
    difficulty: { ar: "متوسط", en: "Medium" }
  },

  {
    id: 6,

    title: { ar: "التوعية بالتصيد", en: "Phishing Awareness" },
    category: { ar: "الهندسة الاجتماعية", en: "Social Engineering" },
    description: {
      ar: "التعرف على هجمات التصيد",
      en: "Identify phishing attempts"
    },

    tips: [
      { ar: "تحقق من المرسل", en: "Verify sender" },
      { ar: "لا تنقر روابط مشبوهة", en: "Avoid suspicious links" },
      { ar: "تحقق من الطلبات", en: "Verify requests" },
      { ar: "احذر الرسائل العاجلة", en: "Beware urgent messages" },
      { ar: "تعلم علامات التصيد", en: "Learn phishing signs" }
    ],

    importance: { ar: "عالية جداً", en: "Critical" },
    difficulty: { ar: "متوسط", en: "Medium" }
  }
];

export default preventionData;