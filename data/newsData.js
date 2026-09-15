export const newsData = [
  {
    id: 'news-1',
    title: {
      ar: 'ثغرات حرجة في إضافات متصفح شائعة',
      en: 'Critical flaws found in popular browser extensions',
    },
    summary: {
      ar: 'باحثون كشفوا ثغرات قد تسمح بسرقة الجلسات وبيانات الاعتماد.',
      en: 'Researchers found flaws that can expose sessions and credentials.',
    },
    date: '2026-04-18',
    category: { ar: 'ثغرات أمنية', en: 'Vulnerabilities' },
    severity: { ar: 'عالية', en: 'High' },
    source: { ar: 'فريق استجابة التهديدات', en: 'Threat Response Team' },
    content: {
      ar: 'يوصى بإزالة الإضافات غير الضرورية ومراجعة صلاحيات كل إضافة بشكل دوري.',
      en: 'Remove unnecessary extensions and audit permissions on a regular basis.',
    },
    recommendations: [
      { ar: 'حدث المتصفح والإضافات فوراً', en: 'Update browser and extensions immediately' },
      { ar: 'احذف الإضافات غير المستخدمة', en: 'Uninstall unused extensions' },
      { ar: 'امنع صلاحيات القراءة الكاملة دون حاجة', en: 'Restrict full-page read permissions' },
    ],
  },
  {
    id: 'news-2',
    title: {
      ar: 'تصاعد حملات التصيد عبر صفحات تسجيل مزيفة',
      en: 'Rise in phishing campaigns using fake login portals',
    },
    summary: {
      ar: 'حملات جديدة تستهدف فرق العمل عبر صفحات مطابقة لتطبيقات داخلية.',
      en: 'New campaigns target teams with lookalike internal login pages.',
    },
    date: '2026-03-29',
    category: { ar: 'تصيد', en: 'Phishing' },
    severity: { ar: 'متوسطة', en: 'Medium' },
    source: { ar: 'مختبرات الأمن الرقمي', en: 'Digital Security Labs' },
    content: {
      ar: 'التحقق من الرابط قبل إدخال البيانات خطوة أساسية لتجنب الاختراق.',
      en: 'Verifying URLs before login is essential to prevent compromise.',
    },
    recommendations: [
      { ar: 'فعّل المصادقة الثنائية لجميع الحسابات', en: 'Enable MFA across all accounts' },
      { ar: 'استخدم مدير كلمات مرور موثوق', en: 'Use a trusted password manager' },
      { ar: 'بلّغ فوراً عن أي صفحة مشبوهة', en: 'Report suspicious portals immediately' },
    ],
  },
  {
    id: 'news-3',
    title: {
      ar: 'زيادة هجمات الفدية على بيئات النسخ الاحتياطي',
      en: 'Ransomware actors increasingly target backup systems',
    },
    summary: {
      ar: 'مهاجمون يستهدفون النسخ الاحتياطي أولاً لتعطيل الاستعادة.',
      en: 'Attackers now hit backups first to block recovery options.',
    },
    date: '2026-02-10',
    category: { ar: 'برمجيات فدية', en: 'Ransomware' },
    severity: { ar: 'حرجة', en: 'Critical' },
    source: { ar: 'مركز عمليات الأمن', en: 'Security Operations Center' },
    content: {
      ar: 'ينصح بعزل نسخة احتياطية غير متصلة بالشبكة واختبار الاستعادة شهرياً.',
      en: 'Keep one offline backup copy and test restoration monthly.',
    },
    recommendations: [
      { ar: 'اعتمد قاعدة 3-2-1 للنسخ الاحتياطي', en: 'Apply the 3-2-1 backup strategy' },
      { ar: 'اختبر استعادة النسخ بشكل دوري', en: 'Run periodic restore drills' },
      { ar: 'افصل حسابات النسخ الاحتياطي عن حسابات التشغيل', en: 'Separate backup and production credentials' },
    ],
  },
];
