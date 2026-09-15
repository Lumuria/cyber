export const incidentsData = [
  {
    id: 'inc-1',
    year: 2017,
    title: {
      ar: 'هجوم WannaCry للفدية',
      en: 'WannaCry Ransomware Outbreak',
    },
    impact: {
      ar: 'تعطيل أنظمة مستشفيات ومؤسسات حول العالم خلال ساعات.',
      en: 'Global disruption across hospitals and enterprises in hours.',
    },
    lesson: {
      ar: 'تحديث الأنظمة القديمة يسد الباب أمام الهجمات واسعة الانتشار.',
      en: 'Patching legacy systems blocks large-scale automated attacks.',
    },
    level: 'critical',
  },
  {
    id: 'inc-2',
    year: 2020,
    title: {
      ar: 'اختراق سلسلة التوريد SolarWinds',
      en: 'SolarWinds Supply Chain Breach',
    },
    impact: {
      ar: 'وصول خفي لجهات متعددة عبر تحديث برمجي موثوق.',
      en: 'Stealth access across many organizations via trusted software updates.',
    },
    lesson: {
      ar: 'راقب سلامة سلسلة التوريد وفعّل كشف السلوك غير الطبيعي.',
      en: 'Continuously audit supply-chain trust and monitor abnormal behavior.',
    },
    level: 'high',
  },
  {
    id: 'inc-3',
    year: 2023,
    title: {
      ar: 'تسريبات بسبب إعدادات سحابية خاطئة',
      en: 'Cloud Misconfiguration Data Exposures',
    },
    impact: {
      ar: 'انكشاف قواعد بيانات كاملة بسبب أذونات خاطئة.',
      en: 'Full datasets exposed due to incorrect access policies.',
    },
    lesson: {
      ar: 'طبّق مبدأ أقل صلاحية وافحص الإعدادات تلقائياً.',
      en: 'Enforce least privilege and automate cloud configuration checks.',
    },
    level: 'medium',
  },
];
