/* ═══════════════════════════════════════════
   BITÁCORA — app.js
═══════════════════════════════════════════ */

// ── i18n ──────────────────────────────────
const I18N = {
  en: {
    nav_home:'Home', nav_courses:'Courses', nav_plan:'Plan',
    nav_study:'Study', nav_progress:'Progress', nav_settings:'Settings',
    home_subtitle:"Here's your study overview for today",
    stat_courses:'Courses', stat_completed:'Completed',
    stat_target:'Target', stat_days_left:'Days left',
    overall_progress:'Overall progress',
    legend_expected:'Expected', legend_actual:'Actual',
    per_course:'Per course',
    deadline_label:'Target deadline', dc_sub:'days until Jun 10, 2026',
    courses_sub:'Click a course to view its plan',
    study_sub:'Module summaries and personal notes',
    select_course:'Select course',
    mode_summary:'Summary', mode_notes:'My Notes',
    notes_placeholder:'Write your thoughts, key takeaways, and personal notes for this module...',
    progress_sub:'Completion by course',
    settings_sub:'Customize your experience',
    sg_appearance:'Appearance', dark_mode:'Dark mode',
    dark_mode_sub:'Switch between dark and light theme',
    sg_language:'Language', language_label:'Interface language',
    sg_profile:'Profile', display_name:'Display name',
    back:'← Back', course_progress:'Course progress',
    ahead_status:'You\'re ahead of schedule',
    ontrack_status:'You\'re on track',
    behind_status:'You\'re behind schedule',
    badge_ahead:'Ahead', badge_ontrack:'On track',
    badge_behind:'Behind', badge_done:'Done',
    badge_notstarted:'Not started',
    greeting_morning:'Good morning', greeting_afternoon:'Good afternoon',
    greeting_evening:'Good evening',
    week_progress:'Week progress',
  },
  es: {
    nav_home:'Inicio', nav_courses:'Cursos', nav_plan:'Plan',
    nav_study:'Estudio', nav_progress:'Progreso', nav_settings:'Ajustes',
    home_subtitle:'Aquí tienes tu resumen de estudio de hoy',
    stat_courses:'Cursos', stat_completed:'Completados',
    stat_target:'Meta', stat_days_left:'Días restantes',
    overall_progress:'Progreso general',
    legend_expected:'Esperado', legend_actual:'Real',
    per_course:'Por curso',
    deadline_label:'Fecha límite', dc_sub:'días hasta el 10 de jun 2026',
    courses_sub:'Haz clic en un curso para ver su plan',
    study_sub:'Resúmenes por módulo y notas personales',
    select_course:'Selecciona curso',
    mode_summary:'Resumen', mode_notes:'Mis Notas',
    notes_placeholder:'Escribe tus apuntes, ideas clave y notas personales para este módulo...',
    progress_sub:'Completado por curso',
    settings_sub:'Personaliza tu experiencia',
    sg_appearance:'Apariencia', dark_mode:'Modo oscuro',
    dark_mode_sub:'Alternar entre modo oscuro y claro',
    sg_language:'Idioma', language_label:'Idioma de la interfaz',
    sg_profile:'Perfil', display_name:'Nombre de usuario',
    back:'← Volver', course_progress:'Progreso del curso',
    ahead_status:'Vas adelantado',
    ontrack_status:'Vas al día',
    behind_status:'Estás atrasado',
    badge_ahead:'Adelantado', badge_ontrack:'Al día',
    badge_behind:'Atrasado', badge_done:'Completo',
    badge_notstarted:'Sin iniciar',
    greeting_morning:'Buenos días', greeting_afternoon:'Buenas tardes',
    greeting_evening:'Buenas noches',
    week_progress:'Progreso semana',
  },
  fr: {
    nav_home:'Accueil', nav_courses:'Cours', nav_plan:'Plan',
    nav_study:'Étude', nav_progress:'Progrès', nav_settings:'Paramètres',
    home_subtitle:"Voici votre aperçu d'étude d'aujourd'hui",
    stat_courses:'Cours', stat_completed:'Terminés',
    stat_target:'Objectif', stat_days_left:'Jours restants',
    overall_progress:'Progrès global',
    legend_expected:'Prévu', legend_actual:'Réel',
    per_course:'Par cours',
    deadline_label:'Date limite', dc_sub:'jours jusqu\'au 10 jun 2026',
    courses_sub:'Cliquez sur un cours pour voir son plan',
    study_sub:'Résumés par module et notes personnelles',
    select_course:'Sélectionner cours',
    mode_summary:'Résumé', mode_notes:'Mes Notes',
    notes_placeholder:'Écrivez vos pensées, points clés et notes personnelles pour ce module...',
    progress_sub:'Complétion par cours',
    settings_sub:'Personnalisez votre expérience',
    sg_appearance:'Apparence', dark_mode:'Mode sombre',
    dark_mode_sub:'Basculer entre mode sombre et clair',
    sg_language:'Langue', language_label:'Langue de l\'interface',
    sg_profile:'Profil', display_name:'Nom d\'affichage',
    back:'← Retour', course_progress:'Progression du cours',
    ahead_status:'Vous êtes en avance',
    ontrack_status:'Vous êtes dans les temps',
    behind_status:'Vous êtes en retard',
    badge_ahead:'En avance', badge_ontrack:'Dans les temps',
    badge_behind:'En retard', badge_done:'Terminé',
    badge_notstarted:'Non commencé',
    greeting_morning:'Bonjour', greeting_afternoon:'Bon après-midi',
    greeting_evening:'Bonsoir',
    week_progress:'Progrès semaine',
  },
  ko: {
    nav_home:'홈', nav_courses:'과정', nav_plan:'계획',
    nav_study:'학습', nav_progress:'진행률', nav_settings:'설정',
    home_subtitle:'오늘의 학습 현황입니다',
    stat_courses:'과정', stat_completed:'완료',
    stat_target:'목표', stat_days_left:'남은 날',
    overall_progress:'전체 진행률',
    legend_expected:'예상', legend_actual:'실제',
    per_course:'과정별',
    deadline_label:'목표 마감일', dc_sub:'2026년 6월 10일까지 남은 일수',
    courses_sub:'과정을 클릭하여 계획을 확인하세요',
    study_sub:'모듈별 요약 및 개인 노트',
    select_course:'과정 선택',
    mode_summary:'요약', mode_notes:'내 노트',
    notes_placeholder:'이 모듈에 대한 생각, 핵심 내용, 개인 노트를 작성하세요...',
    progress_sub:'과정별 완료율',
    settings_sub:'경험을 맞춤 설정하세요',
    sg_appearance:'외관', dark_mode:'다크 모드',
    dark_mode_sub:'다크 모드와 라이트 모드 전환',
    sg_language:'언어', language_label:'인터페이스 언어',
    sg_profile:'프로필', display_name:'표시 이름',
    back:'← 뒤로', course_progress:'과정 진행률',
    ahead_status:'일정보다 앞서 있습니다',
    ontrack_status:'일정에 맞게 진행 중입니다',
    behind_status:'일정보다 늦어지고 있습니다',
    badge_ahead:'앞서있음', badge_ontrack:'정상',
    badge_behind:'늦어짐', badge_done:'완료',
    badge_notstarted:'미시작',
    greeting_morning:'좋은 아침이에요', greeting_afternoon:'안녕하세요',
    greeting_evening:'좋은 저녁이에요',
    week_progress:'주간 진행률',
  },
  ja: {
    nav_home:'ホーム', nav_courses:'コース', nav_plan:'プラン',
    nav_study:'学習', nav_progress:'進捗', nav_settings:'設定',
    home_subtitle:'今日の学習状況です',
    stat_courses:'コース', stat_completed:'完了',
    stat_target:'目標', stat_days_left:'残り日数',
    overall_progress:'全体の進捗',
    legend_expected:'予定', legend_actual:'実績',
    per_course:'コース別',
    deadline_label:'目標期限', dc_sub:'2026年6月10日まで',
    courses_sub:'コースをクリックして計画を確認',
    study_sub:'モジュール別要約と個人ノート',
    select_course:'コース選択',
    mode_summary:'要約', mode_notes:'マイノート',
    notes_placeholder:'このモジュールについての考え、重要ポイント、個人ノートを書いてください...',
    progress_sub:'コース別完了率',
    settings_sub:'設定をカスタマイズ',
    sg_appearance:'外観', dark_mode:'ダークモード',
    dark_mode_sub:'ダーク・ライトモードの切り替え',
    sg_language:'言語', language_label:'インターフェース言語',
    sg_profile:'プロフィール', display_name:'表示名',
    back:'← 戻る', course_progress:'コース進捗',
    ahead_status:'予定より進んでいます',
    ontrack_status:'予定通りです',
    behind_status:'遅れています',
    badge_ahead:'先行', badge_ontrack:'順調',
    badge_behind:'遅延', badge_done:'完了',
    badge_notstarted:'未開始',
    greeting_morning:'おはようございます', greeting_afternoon:'こんにちは',
    greeting_evening:'こんばんは',
    week_progress:'週間進捗',
  }
};

let currentLang = 'en';
function t(key) { return (I18N[currentLang] || I18N.en)[key] || (I18N.en)[key] || key; }

function setLang(lang) {
  currentLang = lang;
  saveState({ lang });
  document.getElementById('lang-btn').textContent = lang.toUpperCase();
  // update active in dropdown
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.toggle('active', el.getAttribute('onclick').includes(`'${lang}'`));
  });
  document.getElementById('lang-dropdown').classList.remove('visible');
  applyI18n();
  document.querySelectorAll('.bnav-label[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // refresh dynamic content
  renderGreeting();
  renderTracking();
  renderCourseGrid();
  renderStudyCourseList();
  renderProgressSection();
  if (currentPlanCourseId) renderPlanSection(currentPlanCourseId);
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}

function toggleLangMenu() {
  document.getElementById('lang-dropdown').classList.toggle('visible');
}

// ── THEME ──────────────────────────────────
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
  const tog = document.getElementById('theme-toggle-settings');
  if (tog) tog.checked = isDark;
  saveState({ theme: isDark ? 'dark' : 'light' });
}

// ── STATE / LOCALSTORAGE ───────────────────
function loadState() {
  try { return JSON.parse(localStorage.getItem('bitacora_v2') || '{}'); } catch(e) { return {}; }
}
function saveState(patch) {
  const s = loadState();
  Object.assign(s, patch);
  try { localStorage.setItem('bitacora_v2', JSON.stringify(s)); } catch(e) {}
}
function getCheckState(key) { return loadState()[key] || ''; }
function setCheckState(key, val) { saveState({ [key]: val }); }

// ── NAVIGATION ─────────────────────────────
let currentSection = 'home';
let currentPlanCourseId = null;

function navigate(section, courseId) {
  // hide all
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.bnav-item').forEach(n => n.classList.remove('active'));
  // show target
  document.getElementById(`section-${section}`).classList.add('active');
  const navEl = document.getElementById(`nav-${section}`);
  if (navEl) navEl.classList.add('active');
  const bnavEl = document.getElementById(`bnav-${section}`);
  if (bnavEl) bnavEl.classList.add('active');
  currentSection = section;
  // special renders
  if (section === 'plan') {
    if (courseId) {
      currentPlanCourseId = courseId;
      renderPlanSection(courseId);
    } else if (!currentPlanCourseId) {
      renderPlanSection(null);
    }
  }
  if (section === 'home')     { renderTracking(); renderCalendar(); renderGreeting(); }
  if (section === 'courses')  renderCourseGrid();
  if (section === 'study')    renderStudyCourseList();
  if (section === 'progress') renderProgressSection();
  saveState({ lastSection: section });
  window.scrollTo(0,0);
  document.getElementById('main').scrollTo(0,0);
}

// ── GREETING ───────────────────────────────
function renderGreeting() {
  const h = new Date().getHours();
  let key = h < 12 ? 'greeting_morning' : h < 18 ? 'greeting_afternoon' : 'greeting_evening';
  const name = loadState().userName || '';
  const gt = document.getElementById('greeting-title');
  if (gt) gt.textContent = t(key) + (name ? `, ${name}` : '');
}

// ── COURSE DATA ────────────────────────────
const COURSES = [
  {
    id:'c01', num:'01', tag:'cisco', accent:'#5b9cf6', hours:'~6h', type:'CCST Ciberseguridad',
    title:'Introducción a Ciberseguridad',
    studyTopics:['Módulo 2: Ataques y malware','Módulo 3: Protección de datos','Módulo 4: Protegiendo la organización','Módulo 5: Futuro en ciberseguridad'],
    weeks:[
      {tag:'wb1',label:'Week 1',name:'Módulo 2 — Ataques, conceptos y técnicas',dates:'May 12–18',
       items:[
         {name:'Módulo 1 — Introducción a la Ciberseguridad',sub:'✓ Completado',day:'',done:true},
         {name:'2.1 Analizando un ciberataque',sub:'En progreso',day:'Mon–Tue',partial:true},
         {name:'2.2 Métodos de infiltración',sub:'',day:'Wed–Thu'},
         {name:'2.3 Aprovechamiento de vulnerabilidades',sub:'',day:'Fri'},
         {name:'2.4 El panorama de la ciberseguridad',sub:'',day:'Sat'},
         {name:'2.5 Cuestionario Módulo 2',sub:'',day:'Sat',exam:true},
       ],tip:'Módulo 2 is the densest. Finishing it this week gives you breathing room.'},
      {tag:'wb2',label:'Week 2',name:'Módulo 3 — Protegiendo sus datos',dates:'May 19–25',
       items:[
         {name:'Módulo 3 completo',sub:'Mon–Fri, quiz Friday',day:'Mon–Fri'},
         {name:'Cuestionario Módulo 3',sub:'',day:'Fri',exam:true},
       ],tip:'Usually shorter. If you finish early, start Módulo 4.'},
      {tag:'wb3',label:'Week 3',name:'Módulos 4 & 5 + Final exam',dates:'May 26–Jun 1',
       items:[
         {name:'Módulo 4 — Protegiendo a la organización',sub:'',day:'Mon–Wed'},
         {name:'Módulo 5 — ¿Tu futuro en ciberseguridad?',sub:"Don't skip",day:'Thu'},
         {name:'Encuesta de fin de curso',sub:'',day:'Fri'},
         {name:'Repaso general',sub:'',day:'Fri'},
         {name:'Examen final del curso',sub:'~25–30 questions',day:'Sat',exam:true},
       ],tip:'Reserve Friday for review. Don\'t leave the exam for the last minute.'},
    ]
  },
  {
    id:'c02', num:'02', tag:'cisco', accent:'#34d399', hours:'~10h', type:'CCST Ciberseguridad',
    title:'Conceptos Básicos de Redes',
    studyTopics:['Módulo 1–4: Fundamentos y redes domésticas','Módulo 5–11: Protocolos e IP','Módulo 12–17: Enrutamiento y protocolos'],
    weeks:[
      {tag:'wb1',label:'Week 1',name:'Modules 1–4 — Fundamentos',dates:'May 19–25',
       items:[
         {name:'Intro del curso',sub:'33% done',day:'Mon'},
         {name:'Módulo 1 — Comunicación en un Mundo Conectado',sub:'',day:'Mon–Tue'},
         {name:'Módulo 2 — Componentes, tipos y conexiones',sub:'',day:'Wed'},
         {name:'Módulo 3 — Redes inalámbricas y móviles',sub:'',day:'Thu'},
         {name:'Módulo 4 — Crear una Red Doméstica',sub:'',day:'Fri–Sat'},
         {name:'Examen parcial: Construir una red pequeña',sub:'',day:'Sat',exam:true},
       ],tip:'Introductory week. Build vocab before diving into IP.'},
      {tag:'wb2',label:'Week 2',name:'Modules 5–11 — IP ⚠️',dates:'May 26–Jun 1',
       items:[
         {name:'Módulo 5 — Principios de Comunicación',sub:'OSI/TCP-IP',day:'Mon'},
         {name:'Módulo 6 — Medios de red',sub:'',day:'Mon'},
         {name:'Módulo 7 — La capa de acceso',sub:'Ethernet',day:'Tue'},
         {name:'Examen parcial: Acceso a la red',sub:'',day:'Tue',exam:true},
         {name:'Módulo 8 — IPv4',sub:'',day:'Wed'},
         {name:'Módulo 9 — IPv4 y subnetting',sub:'Hardest topic',day:'Thu'},
         {name:'Módulo 10 — IPv6',sub:'',day:'Fri'},
         {name:'Módulo 11 — DHCP',sub:'',day:'Sat'},
         {name:'Examen parcial: Protocolo de Internet',sub:'',day:'Sat',exam:true},
       ],tip:'⚠️ Hardest week. Don\'t move on if subnetting isn\'t clear.'},
      {tag:'wb3',label:'Week 3',name:'Modules 12–17 — Routing & Protocols',dates:'Jun 2–7',
       items:[
         {name:'Módulo 12 — Gateway y NAT',sub:'',day:'Mon'},
         {name:'Módulo 13 — ARP',sub:'',day:'Mon'},
         {name:'Módulo 14 — Enrutamiento',sub:'',day:'Tue'},
         {name:'Examen parcial: Comunicación entre Redes',sub:'',day:'Tue',exam:true},
         {name:'Módulo 15 — TCP y UDP',sub:'',day:'Wed'},
         {name:'Módulo 16 — Servicios de Aplicación',sub:'DNS, HTTP, FTP, SSH — longest',day:'Thu–Fri'},
         {name:'Módulo 17 — Utilidades de red',sub:'ping, traceroute, ipconfig',day:'Sat'},
         {name:'Examen parcial: Protocolos',sub:'',day:'Sat',exam:true},
       ],tip:'Módulo 16 has 8 subsections — give it two days.'},
      {tag:'wb4',label:'Week 4',name:'Review + Final exam',dates:'Jun 8–14',
       items:[
         {name:'Repaso módulos 1–11',sub:'',day:'Mon–Tue'},
         {name:'Repaso módulos 12–17',sub:'',day:'Wed'},
         {name:'Examen final del curso',sub:'',day:'Thu–Fri',exam:true},
         {name:'Encuesta final',sub:'',day:'Fri'},
       ],tip:'You finish June 14 — 16 days before deadline.'},
    ]
  },
  {
    id:'c04', num:'04', tag:'cisco', accent:'#f97316', hours:'~8h', type:'CCST Ciberseguridad',
    title:'Seguridad de Terminales',
    studyTopics:['Módulo 1: Amenazas y ataques','Módulo 2–6: Protección de redes','Módulo 7–8: Windows y Linux','Módulo 9–10: Protección de terminales'],
    weeks:[
      {tag:'wb1',label:'Week 1',name:'Módulos 1–6 — Amenazas y redes',dates:'May 19–25',
       items:[
         {name:'Módulo 1 — Amenazas, vulnerabilidades y ataques',sub:'',day:'Mon–Tue'},
         {name:'Módulo 2 — Protección de redes',sub:'',day:'Wed'},
         {name:'Módulo 3 — Ataque a los fundamentos',sub:'',day:'Thu'},
         {name:'Módulo 4 — Atacando lo que hacemos',sub:'',day:'Fri'},
         {name:'Módulo 5 — Comunicación inalámbrica',sub:'',day:'Sat'},
         {name:'Módulo 6 — Infraestructura de seguridad',sub:'',day:'Sat'},
         {name:'Examen parcial: Seguridad de la red',sub:'',day:'Sat',exam:true},
       ],tip:''},
      {tag:'wb2',label:'Week 2',name:'Módulos 7–10 — OS & Endpoints',dates:'May 26–Jun 1',
       items:[
         {name:'Módulo 7 — Sistema operativo Windows',sub:'Architecture, config, security',day:'Mon–Tue'},
         {name:'Módulo 8 — Linux',sub:'Shell, servers, filesystem — 8 subsections',day:'Wed–Thu'},
         {name:'Módulo 9 — Protección de terminales',sub:'',day:'Fri'},
         {name:'Módulo 10 — Principios de ciberseguridad',sub:'',day:'Sat'},
         {name:'Examen parcial: SO y seguridad',sub:'',day:'Sat',exam:true},
       ],tip:'Module 8 (Linux) is the longest — don\'t leave it for the last day.'},
      {tag:'wb3',label:'Week 3',name:'Final exam',dates:'Jun 2–4',
       items:[
         {name:'Repaso general',sub:'',day:'Mon–Tue'},
         {name:'Examen final del curso',sub:'',day:'Wed',exam:true},
         {name:'Encuesta final',sub:'',day:'Wed'},
       ],tip:''},
    ]
  },
  {
    id:'c05', num:'05', tag:'cisco', accent:'#a78bfa', hours:'~12h', type:'CCST Ciberseguridad',
    title:'Defensa de la Red',
    studyTopics:['Módulo 1–3: Defensa y control de acceso','Módulo 4–8: Firewalls, nube y criptografía','Módulo 9–11: Tecnologías y alertas'],
    weeks:[
      {tag:'wb1',label:'Week 1',name:'Módulos 1–3 — Defense & Access',dates:'May 26–Jun 1',
       items:[
         {name:'Intro + Packet Tracer setup',sub:'Install if you haven\'t',day:'Mon'},
         {name:'Módulo 1 — Comprendiendo qué es Defensa',sub:'',day:'Mon–Tue'},
         {name:'Módulo 2 — Defensa del sistema y la red',sub:'8 subsections',day:'Wed–Thu'},
         {name:'Módulo 3 — Control de Acceso',sub:'AAA, accounts',day:'Fri'},
         {name:'Examen parcial: Principios de Defensa',sub:'',day:'Sat',exam:true},
       ],tip:'Module 2 has 8 subsections — one of the longest.'},
      {tag:'wb2',label:'Week 2',name:'Módulos 4–8 — ACL, Firewalls, Cloud & Crypto',dates:'Jun 2–8',
       items:[
         {name:'Módulo 4 — ACL',sub:'Wildcard, IPv4/IPv6',day:'Mon–Tue'},
         {name:'Módulo 5 — Firewalls',sub:'',day:'Wed'},
         {name:'Módulo 6 — ZPF',sub:'Zone-based firewalls',day:'Thu'},
         {name:'Módulo 7 — Seguridad en la nube',sub:'VMs, virtualization',day:'Fri'},
         {name:'Módulo 8 — Criptografía',sub:'Hash, PKI, encryption',day:'Sat'},
         {name:'Examen parcial: Firewalls, Crypto, Cloud',sub:'',day:'Sat',exam:true},
       ],tip:'Module 8 (Cryptography) is conceptually dense — take your time with PKI.'},
      {tag:'wb3',label:'Week 3',name:'Módulos 9–11 + Final',dates:'Jun 9–14',
       items:[
         {name:'Módulo 9 — Tecnologías y protocolos',sub:'',day:'Mon'},
         {name:'Módulo 10 — Datos de seguridad de red',sub:'',day:'Tue'},
         {name:'Módulo 11 — Evaluar alertas',sub:'',day:'Wed'},
         {name:'Examen parcial: Evaluación de alertas',sub:'',day:'Wed',exam:true},
         {name:'Repaso general',sub:'',day:'Thu'},
         {name:'Examen final del curso',sub:'',day:'Fri',exam:true},
         {name:'Encuesta final',sub:'',day:'Fri'},
       ],tip:'Protect your review days — don\'t compress them.'},
    ]
  },
  {
    id:'c06', num:'06', tag:'cisco', accent:'#2dd4bf', hours:'~6h', type:'CCST Ciberseguridad',
    title:'Administración de Amenazas Cibernéticas',
    studyTopics:['Módulo 1–3: Gobernanza y threat intelligence','Módulo 4–5: Vulnerabilidades y riesgos','Módulo 6: Forense e incidentes'],
    weeks:[
      {tag:'wb1',label:'Week 1',name:'Módulos 1–5 — Governance, Testing & Risk',dates:'May 26–Jun 1',
       items:[
         {name:'Módulo 1 — Gestión y Cumplimiento',sub:'Governance, ethics, frameworks',day:'Mon'},
         {name:'Módulo 2 — Pruebas de Seguridad',sub:'Pen testing, tools',day:'Tue'},
         {name:'Módulo 3 — Inteligencia contra Amenazas',sub:'Sources, services',day:'Wed'},
         {name:'Módulo 4 — Evaluación de vulnerabilidades',sub:'CVSS, profiles',day:'Thu'},
         {name:'Módulo 5 — Administración de Riesgos',sub:'Risk assessment, controls',day:'Fri'},
         {name:'Examen parcial: Vulnerabilidad y Riesgos',sub:'',day:'Fri',exam:true},
       ],tip:'More conceptual than technical — read carefully and take notes.'},
      {tag:'wb2',label:'Week 2',name:'Módulo 6 + Final',dates:'Jun 2–4',
       items:[
         {name:'Módulo 6 — Análisis Forense y Respuesta',sub:'Kill Chain, Diamond Model, IR',day:'Mon–Tue'},
         {name:'Examen parcial: Respuesta a incidentes',sub:'',day:'Tue',exam:true},
         {name:'Repaso general',sub:'',day:'Wed'},
         {name:'Examen final del curso',sub:'',day:'Wed',exam:true},
         {name:'Encuesta final',sub:'',day:'Wed'},
       ],tip:'Module 6 — Cyber Kill Chain and Diamond Model are exam favorites.'},
    ]
  },
  {
    id:'c07', num:'07', tag:'ms', accent:'#34d399', hours:'~5.5h', type:'Microsoft Learn',
    title:'Intro a Aplicaciones y Agentes de IA en Azure',
    studyTopics:['IA en Azure','IA Generativa y Agentes','Análisis de Texto','Servicios de Voz','Computer Vision','Extracción de Información'],
    weeks:[
      {tag:'wb1',label:'Block',name:'6 modules — complete in 2–3 days',dates:'Jun 1–3',
       items:[
         {name:'Intro a la IA en Azure',sub:'56 min',day:'Day 1'},
         {name:'IA Generativa y Agentes',sub:'58 min',day:'Day 1'},
         {name:'Análisis de texto',sub:'45 min',day:'Day 2'},
         {name:'Servicios de voz',sub:'47 min',day:'Day 2'},
         {name:'Computer Vision',sub:'50 min',day:'Day 3'},
         {name:'Extracción de información',sub:'43 min',day:'Day 3'},
       ],tip:'Each module has a ~30 min hands-on exercise in Microsoft Foundry. Needs Azure account.'},
    ]
  },
  {
    id:'c08', num:'08', tag:'ms', accent:'#f472b6', hours:'~3.3h', type:'Microsoft Learn',
    title:'Conceptos de IA para Desarrolladores',
    studyTopics:['Fundamentos de IA','IA Generativa y LLMs','NLP','Voz','Computer Vision','Extracción de información'],
    weeks:[
      {tag:'wb1',label:'Block',name:'6 modules — complete in 1–2 days',dates:'May 19–20',
       items:[
         {name:'Introducción a los conceptos de IA',sub:'40 min',day:'Day 1'},
         {name:'Intro a IA generativa y agentes',sub:'37 min',day:'Day 1'},
         {name:'Conceptos de NLP',sub:'30 min',day:'Day 1'},
         {name:'Conceptos de voz',sub:'28 min',day:'Day 2'},
         {name:'Conceptos de Computer Vision',sub:'34 min',day:'Day 2'},
         {name:'Extracción de información',sub:'28 min',day:'Day 2'},
       ],tip:'Shortest course (~3h). Start here to build momentum.'},
    ]
  },
  {
    id:'c09', num:'09', tag:'ms', accent:'#60a5fa', hours:'~5.5h', type:'Microsoft Learn · AZ-900',
    title:'Introducción a la Infraestructura en la Nube',
    studyTopics:['Conceptos de la nube','Arquitectura y servicios de Azure','Administración y gobernanza de Azure'],
    weeks:[
      {tag:'wb1',label:'Part 1',name:'Cloud concepts (~1h)',dates:'May 21',
       items:[
         {name:'Descripción de la informática en la nube',sub:'1/8 units done',day:''},
         {name:'Ventajas de servicios en la nube',sub:'',day:''},
         {name:'Tipos de servicio en la nube',sub:'IaaS, PaaS, SaaS',day:''},
       ],tip:''},
      {tag:'wb2',label:'Part 2',name:'Architecture & services (~3h)',dates:'May 22–23',
       items:[
         {name:'Componentes arquitectónicos de Azure',sub:'',day:''},
         {name:'Servicios de proceso',sub:'VMs, containers, Functions',day:''},
         {name:'Servicios de red',sub:'VNet, VPN, DNS',day:''},
         {name:'Servicios de almacenamiento',sub:'',day:''},
         {name:'Identidad, acceso y seguridad',sub:'AAD, RBAC, Zero Trust',day:''},
       ],tip:'Identity & security connects directly to your CCST courses.'},
      {tag:'wb3',label:'Part 3',name:'Management & governance (~1.5h)',dates:'May 24',
       items:[
         {name:'Administración de costos',sub:'',day:''},
         {name:'Gobernanza y cumplimiento',sub:'',day:''},
         {name:'Administrar e implementar recursos',sub:'',day:''},
         {name:'Herramientas de supervisión',sub:'',day:''},
       ],tip:''},
    ]
  },
  {
    id:'c10', num:'10', tag:'ms', accent:'#fb923c', hours:'~6h', type:'Microsoft Learn · DP-900',
    title:'Introducción a los Datos de Microsoft Azure',
    studyTopics:['Conceptos de datos','Datos relacionales','Datos no relacionales','Análisis de datos'],
    weeks:[
      {tag:'wb1',label:'Part 1',name:'Core data concepts',dates:'May 25',
       items:[
         {name:'Conceptos de datos principales',sub:'2/8 units done',day:''},
         {name:'Roles y servicios de datos',sub:'',day:''},
       ],tip:''},
      {tag:'wb2',label:'Part 2',name:'Relational data',dates:'May 26',
       items:[
         {name:'Fundamentos de datos relacionales',sub:'SQL, normalization',day:''},
         {name:'Servicios de BD relacionales',sub:'Azure SQL, MySQL, PostgreSQL',day:''},
       ],tip:''},
      {tag:'wb3',label:'Part 3',name:'Non-relational data',dates:'May 27',
       items:[
         {name:'Azure Storage para datos no relacionales',sub:'Blob, Data Lake, Tables',day:''},
         {name:'Azure Cosmos DB',sub:'APIs, global scale',day:''},
       ],tip:''},
      {tag:'wb4',label:'Part 4',name:'Data analytics',dates:'May 28',
       items:[
         {name:'Análisis a gran escala',sub:'Data warehouse, Fabric',day:''},
         {name:'Análisis en tiempo real',sub:'Streaming, Spark',day:''},
         {name:'Visualización de datos',sub:'Power BI',day:''},
       ],tip:'Most hands-on part — includes Fabric and Power BI exercises.'},
    ]
  },
];

// ── COURSE HELPERS ─────────────────────────
function getSavedTitle(id) { return loadState()['title_' + id] || ''; }

function getCourseProgress(c) {
  const s = loadState();
  let total = 0, done = 0;
  c.weeks.forEach((w,wi) => w.items.forEach((_,ii) => {
    total++;
    if (s[`${c.id}_w${wi}_i${ii}`] === 'done') done++;
  }));
  return total ? Math.round(done/total*100) : 0;
}

function getWeekProgress(c, wi) {
  const s = loadState();
  const items = c.weeks[wi].items;
  const done = items.filter((_,ii) => s[`${c.id}_w${wi}_i${ii}`] === 'done').length;
  return items.length ? Math.round(done/items.length*100) : 0;
}

function toggleCourseItem(cid, wi, ii, chkEl) {
  const key = `${cid}_w${wi}_i${ii}`;
  const cur = getCheckState(key);
  const next = cur === 'done' ? '' : 'done';
  setCheckState(key, next);
  const isExam = chkEl.classList.contains('exam-style');
  chkEl.className = `mod-chk ${next === 'done' ? 'done' : ''} ${isExam ? 'exam-style' : ''}`;
  // update week progress
  const c = COURSES.find(x => x.id === cid);
  const wPct = getWeekProgress(c, wi);
  const wpEl = document.getElementById(`wkp-${cid}-${wi}`);
  const wbEl = document.getElementById(`wkb-${cid}-${wi}`);
  if (wpEl) wpEl.textContent = wPct + '%';
  if (wbEl) wbEl.style.width = wPct + '%';
  // update course header progress
  const cpct = getCourseProgress(c);
  const cpEl = document.getElementById('cp-pct');
  const cfEl = document.getElementById('cp-fill');
  if (cpEl) cpEl.textContent = cpct + '%';
  if (cfEl) cfEl.style.width = cpct + '%';
  // update plan banner
  const bannerEl = document.getElementById('plan-track-banner');
  if (bannerEl) bannerEl.outerHTML = buildPlanTrackBanner(c);
  // refresh home tracking
  if (currentSection === 'home') renderTracking();
}

// ── COURSE GRID ────────────────────────────
function renderCourseGrid() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;
  grid.innerHTML = '';
  COURSES.forEach(c => {
    const pct = getCourseProgress(c);
    const title = getSavedTitle(c.id) || c.title;
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.setProperty('--card-accent', c.accent);
    card.innerHTML = `
      <div class="cc-num">${c.num} · ${c.type}</div>
      <div class="cc-title-wrap">
        <div class="cc-title" id="cct-${c.id}" contenteditable="false"
          onblur="saveCourseTitle('${c.id}',this)"
          onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"
        >${title}</div>
        <div class="cc-edit" onclick="event.stopPropagation();toggleTitleEdit('${c.id}',this)">✎</div>
      </div>
      <div class="cc-prog-row">
        <span class="cc-pct">${pct}%</span>
        <span class="cc-hours">${c.hours}</span>
      </div>
      <div class="cc-bar"><div class="cc-bar-fill" style="width:${pct}%;background:${c.accent}"></div></div>
      <div class="cc-tags">
        <span class="cc-tag ${c.tag === 'cisco' ? 'tag-cisco' : 'tag-ms'}">${c.tag === 'cisco' ? 'Cisco NetAcad' : 'Microsoft Learn'}</span>
        <span class="cc-tag tag-hrs">${c.hours}</span>
        ${pct > 0 && pct < 100 ? '<span class="cc-tag tag-ip">In progress</span>' : ''}
        ${pct === 100 ? '<span class="cc-tag tag-done">✓ Done</span>' : ''}
      </div>`;
    card.addEventListener('click', e => {
      if (e.target.classList.contains('cc-edit') || e.target.classList.contains('cc-title')) return;
      navigate('plan', c.id);
    });
    grid.appendChild(card);
  });
}

function saveCourseTitle(id, el) {
  saveState({ ['title_' + id]: el.textContent.trim() });
  el.contentEditable = 'false';
}
function toggleTitleEdit(id, btn) {
  const el = document.getElementById('cct-' + id);
  if (el.contentEditable === 'true') { el.blur(); btn.textContent = '✎'; }
  else {
    el.contentEditable = 'true';
    el.focus();
    const r = document.createRange();
    r.selectNodeContents(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    btn.textContent = '✓';
  }
}

// ── PLAN SECTION ───────────────────────────
function renderPlanSection(courseId) {
  const section = document.getElementById('section-plan');
  if (!courseId) {
    section.innerHTML = `
      <div class="section-header"><div class="section-title" data-i18n="nav_plan">${t('nav_plan')}</div></div>
      <div style="color:var(--text3);font-size:13px;margin-top:8px;">${t('courses_sub')}</div>
      <div class="courses-grid" style="margin-top:20px;" id="plan-course-picker"></div>`;
    const picker = document.getElementById('plan-course-picker');
    COURSES.forEach(c => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.style.setProperty('--card-accent', c.accent);
      card.style.cursor = 'pointer';
      card.innerHTML = `<div class="cc-num">${c.num}</div><div class="cc-title">${getSavedTitle(c.id) || c.title}</div>`;
      card.onclick = () => renderPlanSection(c.id);
      picker.appendChild(card);
    });
    return;
  }

  const c = COURSES.find(x => x.id === courseId);
  if (!c) return;
  const pct = getCourseProgress(c);

  let weeksHTML = c.weeks.map((w, wi) => {
    const wPct = getWeekProgress(c, wi);
    const itemsHTML = w.items.map((item, ii) => {
      const key = `${c.id}_w${wi}_i${ii}`;
      const st = getCheckState(key) || (item.done ? 'done' : item.partial ? 'partial' : '');
      return `<div class="mod-item ${item.exam ? 'exam-item' : ''}"
        onclick="toggleCourseItem('${c.id}',${wi},${ii},this.querySelector('.mod-chk'))">
        <div class="mod-chk ${st === 'done' ? 'done' : st === 'partial' ? 'partial' : ''} ${item.exam ? 'exam-style' : ''}"
          id="chk-${c.id}-${wi}-${ii}"></div>
        <div class="mod-info">
          <div class="mod-name">${item.exam ? '📝 ' : ''}${item.name}</div>
          ${item.sub ? `<div class="mod-sub">${item.sub}</div>` : ''}
        </div>
        ${item.day ? `<div class="mod-day">${item.day}</div>` : ''}
      </div>`;
    }).join('');
    return `<div class="week-block">
      <div class="wk-hdr" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="wk-badge ${w.tag}">${w.label}</span>
        <span class="wk-name">${w.name}</span>
        ${w.dates ? `<span class="wk-dates">${w.dates}</span>` : ''}
      </div>
      <div class="wk-body open">
        ${itemsHTML}
        <div class="wk-prog-wrap">
          <div class="wk-prog-row">
            <span class="wk-prog-lbl">${t('week_progress')}</span>
            <span class="wk-prog-pct" id="wkp-${c.id}-${wi}">${wPct}%</span>
          </div>
          <div class="wk-prog-bar"><div class="wk-prog-fill" id="wkb-${c.id}-${wi}" style="width:${wPct}%"></div></div>
        </div>
        ${w.tip ? `<div class="wk-tip">${w.tip}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  section.innerHTML = `
    <div class="plan-header">
      <div class="plan-back" onclick="renderPlanSection(null)">← ${t('back')}</div>
    </div>
    <div class="plan-course-title">${getSavedTitle(c.id) || c.title}</div>
    <div class="plan-course-sub">${c.num} · ${c.type} · ${c.hours}</div>
    ${buildPlanTrackBanner(c)}
    <div class="course-progress-row">
      <span class="cp-label">${t('course_progress')}</span>
      <span class="cp-pct" id="cp-pct">${pct}%</span>
    </div>
    <div class="cp-bar"><div class="cp-fill" id="cp-fill" style="width:${pct}%"></div></div>
    ${weeksHTML}`;
}

function buildPlanTrackBanner(c) {
  const {status, diff, done, expectedItems, actualPct, expectedPct} = getTrackInfo(c);
  const icons   = {ahead:'🚀','on-track':'✅',behind:'⚠️',done:'🎉'};
  const titles  = {ahead:t('ahead_status'),'on-track':t('ontrack_status'),behind:t('behind_status'),done:'Complete!'};
  let sub = '';
  if (status === 'done') sub = '🎉';
  else if (status === 'ahead') sub = `${diff} item${diff!==1?'s':''} ahead (${expectedPct}% expected · ${actualPct}% actual)`;
  else if (status === 'on-track') sub = `${done} of total items · ~${expectedItems} expected today`;
  else sub = `${Math.abs(diff)} item${Math.abs(diff)!==1?'s':''} behind · complete ${Math.abs(diff)} more today`;
  return `<div class="plan-track-banner ${status}" id="plan-track-banner">
    <div class="ptb-icon">${icons[status]}</div>
    <div class="ptb-body">
      <div class="ptb-title">${titles[status]}</div>
      <div class="ptb-sub">${sub}</div>
    </div>
  </div>`;
}

// ── TRACKING ───────────────────────────────
const START_DATE  = new Date('2026-05-12T00:00:00');
const TARGET_DATE = new Date('2026-06-10T23:59:59');

function getDayRatio() {
  const now = new Date();
  const total = TARGET_DATE - START_DATE;
  const elapsed = Math.min(Math.max(now - START_DATE, 0), total);
  return elapsed / total;
}

function getGlobalItems() {
  let total = 0, done = 0;
  const s = loadState();
  COURSES.forEach(c => c.weeks.forEach((w,wi) => w.items.forEach((_,ii) => {
    total++;
    if (s[`${c.id}_w${wi}_i${ii}`] === 'done') done++;
  })));
  return { total, done };
}

function getTrackInfo(c) {
  const ratio = getDayRatio();
  const s = loadState();
  let total = 0, done = 0;
  if (c) {
    c.weeks.forEach((w,wi) => w.items.forEach((_,ii) => {
      total++; if (s[`${c.id}_w${wi}_i${ii}`] === 'done') done++;
    }));
  } else {
    const g = getGlobalItems(); total = g.total; done = g.done;
  }
  const actualPct   = total ? Math.round(done/total*100) : 0;
  const expectedPct = Math.round(ratio*100);
  const expectedItems = Math.round(ratio*total);
  const diff = done - expectedItems;
  let status;
  if (actualPct >= 100) status = 'done';
  else if (diff >= 5)   status = 'ahead';
  else if (diff >= -5)  status = 'on-track';
  else                  status = 'behind';
  return { status, diff, done, total, actualPct, expectedPct, expectedItems };
}

function renderTracking() {
  const {status, diff, done, total, actualPct, expectedPct} = getTrackInfo(null);
  const colors = {ahead:'var(--green)','on-track':'var(--accent)',behind:'var(--red)',done:'var(--green)'};
  const icons  = {ahead:'🚀','on-track':'✅',behind:'⚠️',done:'🎉'};
  const titles = {ahead:t('ahead_status'),'on-track':t('ontrack_status'),behind:t('behind_status'),done:'Complete!'};
  const col = colors[status];

  const banner = document.getElementById('track-banner');
  if (banner) {
    banner.className = `track-banner ${status}`;
    document.getElementById('tb-icon').textContent = icons[status];
    document.getElementById('tb-status').textContent = titles[status];
    let detail = '';
    if (status === 'done') detail = '🎉 All courses complete!';
    else if (status === 'ahead') detail = `${diff} item${diff!==1?'s':''} ahead of expected schedule.`;
    else if (status === 'on-track') detail = `${done} of ${total} items done · ${expectedPct}% expected today.`;
    else detail = `${Math.abs(diff)} item${Math.abs(diff)!==1?'s':''} below target. Complete ${Math.abs(diff)} more today.`;
    document.getElementById('tb-detail').textContent = detail;
    const bigNum = status === 'done' ? '✓' : Math.abs(diff) || done;
    document.getElementById('tb-big').textContent = bigNum;
    const small = status === 'behind' ? 'items to catch up' : status === 'ahead' ? 'items ahead' : 'items done';
    document.getElementById('tb-small').textContent = status === 'done' ? 'complete' : small;
  }

  // dual bar
  const dbExp = document.getElementById('dbar-exp');
  const dbAct = document.getElementById('dbar-act');
  const dbMkr = document.getElementById('dbar-marker');
  const dbSub = document.getElementById('dbars-sub');
  if (dbExp) { dbExp.style.width = expectedPct + '%'; }
  if (dbAct) { dbAct.style.width = actualPct + '%'; dbAct.style.background = col; }
  if (dbMkr) { dbMkr.style.left = expectedPct + '%'; }
  if (dbSub) dbSub.textContent = `${t('legend_expected')}: ${expectedPct}% · ${t('legend_actual')}: ${actualPct}%`;
  const dot = document.getElementById('dl-actual-dot');
  if (dot) dot.style.background = col;

  // stats
  const sDays = document.getElementById('hs-days');
  const sDone = document.getElementById('hs-done');
  if (sDays) {
    const dLeft = Math.max(0, Math.ceil((TARGET_DATE - new Date()) / 864e5));
    sDays.textContent = dLeft;
  }
  if (sDone) sDone.textContent = COURSES.filter(c => getCourseProgress(c) === 100).length;

  // deadline card
  const dcVal  = document.getElementById('dc-val');
  const dcFill = document.getElementById('dc-fill');
  const dLeft2 = Math.max(0, Math.ceil((TARGET_DATE - new Date()) / 864e5));
  if (dcVal)  dcVal.textContent = dLeft2;
  if (dcFill) dcFill.style.width = Math.min(100, getDayRatio()*100) + '%';

  // per-course tracks
  renderCourseTrackRows();
}

function renderCourseTrackRows() {
  const container = document.getElementById('course-tracks');
  if (!container) return;
  container.innerHTML = '';
  const ratio = getDayRatio();
  const expPct = Math.round(ratio*100);
  COURSES.forEach(c => {
    const pct = getCourseProgress(c);
    const {status} = getTrackInfo(c);
    const badgeClass = {ahead:'badge-ahead','on-track':'badge-ontrack',behind:'badge-behind',done:'badge-done'}[status] || 'badge-notstarted';
    const badgeText  = {ahead:t('badge_ahead'),'on-track':t('badge_ontrack'),behind:t('badge_behind'),done:t('badge_done')}[status] || t('badge_notstarted');
    const barCol     = {ahead:'var(--green)','on-track':'var(--accent)',behind:'var(--red)',done:'var(--green)'}[status] || 'var(--text3)';
    const row = document.createElement('div');
    row.className = 'ctrack-row';
    row.onclick = () => navigate('plan', c.id);
    row.innerHTML = `
      <div class="ctr-dot" style="background:${c.accent}"></div>
      <div class="ctr-name">${getSavedTitle(c.id) || c.title}</div>
      <div class="ctr-barwrap">
        <div class="ctr-bar-bg">
          <div class="ctr-bar-exp" style="width:${Math.min(expPct,100)}%"></div>
          <div class="ctr-bar-act" style="width:${pct}%;background:${barCol}"></div>
        </div>
      </div>
      <div class="ctr-badge ${badgeClass}">${badgeText}</div>
      <div class="ctr-pct">${pct}%</div>`;
    container.appendChild(row);
  });
}

// ── CALENDAR ──────────────────────────────
let calYear = 2026, calMonth = 4; // 0-indexed, 4=May
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month');
  if (!grid) return;
  label.textContent = `${MONTHS_EN[calMonth]} ${calYear}`;
  grid.innerHTML = DOW.map(d => `<div class="cal-dow">${d}</div>`).join('');
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const daysInPrev  = new Date(calYear, calMonth, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

  // prev month fill
  for (let i = firstDay-1; i >= 0; i--) {
    grid.innerHTML += `<div class="cal-day other-month">${daysInPrev-i}</div>`;
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && d === today.getDate();
    const isDeadline = calYear === 2026 && calMonth === 5 && d === 10; // Jun 10
    const isDeadline2 = calYear === 2026 && calMonth === 5 && d === 30; // Jun 30
    const cls = [isToday?'today':'', isDeadline||isDeadline2?'deadline':''].filter(Boolean).join(' ');
    grid.innerHTML += `<div class="cal-day ${cls}">${d}</div>`;
  }
  // next month fill
  const cells = firstDay + daysInMonth;
  const remaining = cells % 7 === 0 ? 0 : 7 - (cells % 7);
  for (let d = 1; d <= remaining; d++) {
    grid.innerHTML += `<div class="cal-day other-month">${d}</div>`;
  }
}

function calPrev() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); }
function calNext() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); }

// ── STUDY ─────────────────────────────────
let currentStudyCourseId = COURSES[0].id;
let currentStudyTopic = COURSES[0].studyTopics[0];

const STUDY_SUMMARIES = {
  c01: [
    `<div class="ai-content"><h3>Overview</h3><p>This module examines the full spectrum of cyberattacks and malware variants, explaining how threat actors exploit systems. Students learn to distinguish between attack categories and understand the behavior and intent behind each malware type — forming the foundational vocabulary for all subsequent security courses.</p><h3>Key Concepts</h3><ul><li><strong>Virus</strong> — Malware that self-replicates by attaching to a legitimate program; requires a host to spread and typically requires user action to trigger.</li><li><strong>Worm</strong> — Standalone malware that replicates independently across networks without needing a host file or user interaction; can spread extremely rapidly.</li><li><strong>Trojan Horse</strong> — Malware disguised as a legitimate file; does not self-replicate but acts as a delivery vehicle for malicious payloads.</li><li><strong>Ransomware</strong> — Encrypts victim data and demands payment (usually cryptocurrency) before restoring access; among the most financially damaging malware types.</li><li><strong>Spyware</strong> — Silently monitors user activity, logs keystrokes, and captures sensitive data (banking credentials, passwords) without user consent.</li><li><strong>Adware</strong> — Delivers unwanted advertisements; often bundled with free software; degrades performance and can redirect browser traffic.</li><li><strong>DoS / DDoS</strong> — Denial-of-Service attacks flood a target with traffic to make it unavailable; Distributed DoS uses a botnet of compromised machines.</li><li><strong>Social Engineering</strong> — Non-technical attacks that manipulate people into divulging information; includes phishing, pretexting, and baiting.</li></ul><h3>Exam Tips</h3><ul><li>Worms differ from viruses: worms do NOT require a host program and spread autonomously across the network.</li><li>Ransomware works by encrypting data — the encryption step is its distinguishing behavior.</li><li>Spyware steals data; adware delivers ads — both may arrive bundled with legitimate software.</li><li>Social engineering exploits human psychology rather than technical vulnerabilities — phishing is the most common form.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module establishes the core framework of information security — the CIA Triad — and explores how data must be protected across its various states. Encryption is introduced as the primary technical control for maintaining confidentiality, and students learn to classify data and apply appropriate safeguards.</p><h3>Key Concepts</h3><ul><li><strong>Confidentiality</strong> — Ensures data is accessible only to authorized parties; enforced through encryption, access controls, and MFA.</li><li><strong>Integrity</strong> — Guarantees data has not been altered or tampered with; enforced through hashing, checksums, and digital signatures.</li><li><strong>Availability</strong> — Ensures authorized users can access data and systems when needed; protected through redundancy, backups, and disaster recovery.</li><li><strong>States of Data</strong> — Data at Rest (stored on drives/databases), Data in Transit (moving across a network), Data in Use (actively being processed in RAM/CPU).</li><li><strong>PII / PHI</strong> — Personally Identifiable Information and Protected Health Information; each carries different regulatory and protection requirements.</li><li><strong>Encryption</strong> — Transforms readable plaintext into unreadable ciphertext; symmetric uses one key; asymmetric uses a public/private key pair.</li></ul><h3>Exam Tips</h3><ul><li>Know all three CIA components and a real-world violation example: data breach = confidentiality; data tampering = integrity; DDoS = availability.</li><li>Encryption protects data both at rest AND in transit — disk encryption for storage, TLS for transport.</li><li>Hashing verifies integrity but does NOT encrypt; the same data always produces the same hash output.</li><li>Least privilege access directly supports confidentiality by limiting who can view sensitive data.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module shifts from conceptual security to organizational defense tools. Students learn the types of firewalls, the role of IDS and IPS systems, and how security policies and incident response procedures work together to form a layered defense mapped directly to enterprise security operations.</p><h3>Key Concepts</h3><ul><li><strong>Firewall Types</strong> — Network layer (filters by IP), transport layer (filters by port/state), application layer (inspects app traffic), proxy server (hides internal hosts), host-based (protects a single device).</li><li><strong>IDS</strong> — Intrusion Detection System; monitors traffic passively and alerts admins; does NOT block traffic.</li><li><strong>IPS</strong> — Intrusion Prevention System; sits inline and actively blocks or drops malicious traffic in real time.</li><li><strong>NAT</strong> — Network Address Translation; masquerades private IPs behind a single public IP; serves both routing and security functions.</li><li><strong>Security Policy</strong> — Formal document defining acceptable use, access controls, and response procedures; legal and operational framework for the organization's security posture.</li><li><strong>Incident Response</strong> — Structured process: Preparation → Detection → Containment → Eradication → Recovery → Lessons Learned.</li></ul><h3>Exam Tips</h3><ul><li>Critical distinction: IDS is passive (detects and logs only); IPS is active (detects AND blocks).</li><li>A proxy server hides internal network addresses from external entities, providing both privacy and content filtering.</li><li>Security policies must address acceptable use, password policies, and incident reporting — not just technical controls.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module prepares students for professional entry into cybersecurity by mapping out career trajectories, industry certifications, and the ethical and legal responsibilities practitioners carry. It contextualizes the entire course within the broader ecosystem of the cybersecurity workforce.</p><h3>Key Concepts</h3><ul><li><strong>CCST Cybersecurity</strong> — Cisco's entry-level cybersecurity credential; does not expire; validates foundational skills for this course track.</li><li><strong>Career Roles</strong> — SOC Analyst, Ethical Hacker/Pen Tester, Network Security Engineer, Incident Responder, Security Architect.</li><li><strong>Certification Pathway</strong> — Entry: CCST, Security+; Intermediate: CySA+, CEH; Advanced: CISSP, CISM; Vendor: Cisco CCNP Security.</li><li><strong>Ethics</strong> — Protecting privacy, avoiding unauthorized access, reporting vulnerabilities responsibly (responsible disclosure), maintaining client confidentiality.</li><li><strong>Legal Frameworks</strong> — CFAA (USA), GDPR (EU), HIPAA (healthcare), PCI-DSS (payment cards); violations carry civil and criminal penalties.</li><li><strong>Responsible Disclosure</strong> — Reporting discovered vulnerabilities to vendors before public release, allowing time to patch before threat actors exploit them.</li></ul><h3>Exam Tips</h3><ul><li>Ethical hacking vs. illegal access: written permission and intent are the legal differentiators.</li><li>CCST Cybersecurity is the entry point of the Cisco Junior Cybersecurity Analyst career path.</li><li>SOC Tier 1 analysts triage alerts; Tier 2 investigate; Tier 3 hunt threats proactively.</li><li>GDPR gives individuals the right to access, correct, and delete their personal data.</li></ul></div>`
  ],
  c02: [
    `<div class="ai-content"><h3>Overview</h3><p>These modules establish what a network is, identify its physical and logical components, categorize network types by size and ownership, and walk through the setup of a typical home or small office network. Students learn how devices communicate and the role of addressing in enabling that communication.</p><h3>Key Concepts</h3><ul><li><strong>Network Components</strong> — End devices (computers, phones, servers), intermediary devices (switches, routers, wireless APs), and network media (copper, fiber optic, wireless).</li><li><strong>Network Types</strong> — PAN (Bluetooth), LAN (single building), WAN (spans cities/countries), WLAN (wireless LAN), MAN (metropolitan).</li><li><strong>Bandwidth vs. Throughput</strong> — Bandwidth is the theoretical maximum data rate; throughput is the actual measured rate, always lower due to latency and congestion.</li><li><strong>Home Network</strong> — Typically includes a modem (connects to ISP), wireless router (LAN + Wi-Fi), and DHCP for automatic IP assignment.</li><li><strong>ISP Connection Types</strong> — DSL (phone line), Cable (coaxial), Fiber-optic (highest speed), Cellular (4G/5G), Satellite (remote areas).</li></ul><h3>Exam Tips</h3><ul><li>A router connects different networks (LAN to WAN); a switch connects devices within the same LAN.</li><li>The home router typically performs three functions: switch, router, and wireless access point.</li><li>LANs use private IP addresses (RFC 1918); the router performs NAT to translate to the public IP from the ISP.</li><li>Bandwidth is measured in bits per second (bps), not bytes — distinguish from file transfer rates in Bps.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules form the theoretical backbone of networking, covering how communication protocols are organized into layered models, how IPv4 and IPv6 addressing works, and the basics of subnetting. This section is the highest-density content in the course.</p><h3>Key Concepts</h3><ul><li><strong>OSI Model (7 Layers)</strong> — Physical → Data Link → Network → Transport → Session → Presentation → Application. Each layer has distinct functions and protocols.</li><li><strong>TCP/IP Model (4 Layers)</strong> — Network Access, Internet, Transport, Application; the actual protocol suite used on the internet.</li><li><strong>IPv4</strong> — 32-bit addresses in dotted decimal (e.g., 192.168.1.1); private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.</li><li><strong>IPv6</strong> — 128-bit addresses in hexadecimal with colons; eliminates NAT; uses unicast, multicast, and anycast (no broadcast).</li><li><strong>TCP vs. UDP</strong> — TCP is connection-oriented, reliable, uses 3-way handshake (SYN → SYN-ACK → ACK); UDP is connectionless, faster, used for streaming/DNS/VoIP.</li><li><strong>Subnetting</strong> — Dividing a network using subnet masks; CIDR notation (e.g., /24 = 254 usable hosts); reduces broadcast domains.</li></ul><h3>Exam Tips</h3><ul><li>Know OSI layer functions and protocols: HTTP/DNS at Layer 7, TCP/UDP at Layer 4, IP at Layer 3, Ethernet/MAC at Layer 2.</li><li>IPv6 uses /128 for individual hosts and /64 for a typical network segment.</li><li>TCP three-way handshake: SYN → SYN-ACK → ACK; establishes reliable connection before data transfer.</li><li>A /24 subnet has 256 addresses total, 254 usable (first = network address, last = broadcast).</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules cover how data is moved between different networks through routing, how routers learn about networks dynamically, and how essential network services like DHCP and DNS automate addressing and name resolution. Students learn both theory and basic configuration concepts.</p><h3>Key Concepts</h3><ul><li><strong>Routing</strong> — Selecting the best path for packets across networks; routers use routing tables with network destinations, next-hop addresses, and metrics.</li><li><strong>Static Routing</strong> — Routes manually configured by an administrator; best for small, unchanging networks; does not adapt automatically.</li><li><strong>Dynamic Routing</strong> — Routers automatically discover and share routing info; examples: RIP (hop count), OSPF (link-state, cost metric), EIGRP (Cisco proprietary).</li><li><strong>DHCP</strong> — Automatically assigns IP, subnet mask, default gateway, and DNS to clients; uses DORA process (Discover → Offer → Request → Acknowledge).</li><li><strong>DNS</strong> — Translates domain names (e.g., www.cisco.com) into IP addresses; hierarchical distributed database.</li><li><strong>Default Gateway</strong> — The router interface IP on a local network; all traffic destined outside the local subnet is forwarded here.</li></ul><h3>Exam Tips</h3><ul><li>DHCP prevents IP conflicts by centrally managing address allocation; SOHO routers typically run a built-in DHCP server.</li><li>DNS resolution: client cache → ISP/recursive resolver → root server → TLD server → authoritative server.</li><li>Default gateway failure means local LAN devices can communicate with each other but cannot reach the internet.</li><li>Dynamic routes have an administrative distance value that indicates trustworthiness of the routing protocol.</li></ul></div>`
  ],
  c04: [
    `<div class="ai-content"><h3>Overview</h3><p>This module defines the attack surface of an endpoint device and categorizes types of threats. Students distinguish between threats, vulnerabilities, and risks, and learn how threat actors deliver malware through various attack vectors targeting host operating systems and applications.</p><h3>Key Concepts</h3><ul><li><strong>Threat vs. Vulnerability vs. Risk</strong> — Threat: potential harm; Vulnerability: weakness that can be exploited; Risk: probability a threat exploits a vulnerability × impact.</li><li><strong>Attack Vector</strong> — Path used to gain unauthorized access; common vectors: phishing emails, malicious downloads, USB drives, unpatched software, drive-by downloads.</li><li><strong>Endpoint</strong> — Any device that connects to a network: laptops, desktops, smartphones, tablets, IoT devices, printers.</li><li><strong>Zero-Day Vulnerability</strong> — A previously unknown vulnerability with no available patch; no signature-based defense exists until the vendor releases a fix.</li><li><strong>Application-Layer Attacks</strong> — SQL injection, XSS (cross-site scripting), buffer overflows targeting vulnerabilities in web apps or installed software.</li></ul><h3>Exam Tips</h3><ul><li>Risk equation: Risk = Threat × Vulnerability × Impact — reducing any factor reduces overall risk.</li><li>Zero-day exploits are dangerous because signature-based antivirus cannot detect them (no known signature yet).</li><li>The attack surface is the sum of all possible entry points; reducing it is a core security principle.</li><li>Social engineering targets the human element rather than technical vulnerabilities.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules cover network-level controls used to protect endpoints from external and internal threats. Access Control Lists are examined in depth as a fundamental packet-filtering mechanism, alongside network security infrastructure including IDS/IPS sensors, VPNs, and network segmentation.</p><h3>Key Concepts</h3><ul><li><strong>ACL (Access Control List)</strong> — Rules applied to a router/switch interface that permit or deny traffic based on source/destination IP, protocol type, and port number.</li><li><strong>Standard ACL</strong> — Filters on source IP only; place closest to the destination to avoid blocking legitimate traffic elsewhere.</li><li><strong>Extended ACL</strong> — Filters on source/destination IP, protocol, and port; place closest to the source to stop traffic early.</li><li><strong>DMZ (Demilitarized Zone)</strong> — Network segment between internal LAN and the internet; hosts publicly accessible servers while protecting the internal network.</li><li><strong>Network Segmentation</strong> — Dividing a network into isolated zones using VLANs or subnets to contain breaches and limit lateral movement.</li><li><strong>VPN</strong> — Creates an encrypted tunnel over a public network to securely connect remote users or branch offices to the corporate network.</li></ul><h3>Exam Tips</h3><ul><li>Standard ACLs: near destination. Extended ACLs: near source — this is a frequently tested distinction.</li><li>ACL rules process top-to-bottom; there is an implicit "deny all" at the end of every ACL.</li><li>A DMZ ensures that even if a DMZ server is compromised, the attacker cannot reach the internal LAN directly.</li><li>VLANs provide Layer 2 segmentation; inter-VLAN routing requires a router or Layer 3 switch.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules examine Windows and Linux operating systems from a security perspective, covering how each manages users, processes, permissions, and logs. Hardening techniques — reducing the attack surface of each OS — are the central focus.</p><h3>Key Concepts</h3><ul><li><strong>Windows UAC</strong> — User Account Control; prompts for admin confirmation before executing privileged actions, preventing silent privilege escalation by malware.</li><li><strong>Windows Registry</strong> — Hierarchical database storing system/app settings; frequently targeted for malware persistence (startup entries, service installations).</li><li><strong>Windows Event Logs</strong> — Security log captures login/logout and privileged access events; Event ID 4624 = successful logon; Event ID 4625 = failed logon.</li><li><strong>Linux File Permissions</strong> — Three-tier model (owner, group, other) with read/write/execute; represented numerically (e.g., chmod 755); root has unrestricted access.</li><li><strong>Linux Hardening</strong> — Disable unused services, use sudo instead of root, configure iptables/firewalld, enable SSH key auth (disable password auth), monitor /var/log.</li><li><strong>OS Hardening Principles</strong> — Remove unused software, disable unneeded services, apply least privilege, enable logging/auditing, keep OS patched.</li></ul><h3>Exam Tips</h3><ul><li>UAC prevents malware running as a standard user from silently gaining admin rights.</li><li>/etc/shadow contains hashed passwords and is readable only by root; /etc/passwd has basic account info.</li><li>Event IDs 4624 and 4625 are key forensic indicators of brute-force or unauthorized access attempts.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules cover layered defensive technologies deployed directly on endpoint devices to detect, prevent, and remediate threats. Students learn how antimalware engines work, how host-based firewalls differ from network firewalls, and why patch management is one of the most effective controls against exploitation.</p><h3>Key Concepts</h3><ul><li><strong>Antimalware / Antivirus</strong> — Detects and removes malicious code using signature-based detection (known malware), heuristic detection (behavioral analysis), and sandboxing.</li><li><strong>Host-Based Firewall (HBFW)</strong> — Software on the endpoint itself that filters inbound/outbound connections; protects even when the device is outside the corporate perimeter.</li><li><strong>HIPS</strong> — Host-based Intrusion Prevention System; monitors system calls and application behavior on a single host; can detect rootkits and privilege escalation.</li><li><strong>Patch Management</strong> — Identifying, testing, and deploying software updates that fix known vulnerabilities; unpatched systems are among the most common successful attack vectors.</li><li><strong>EDR (Endpoint Detection and Response)</strong> — Advanced platform that continuously monitors endpoints, uses behavioral analytics to detect threats, and provides automated response capabilities.</li><li><strong>Allowlisting / Blocklisting</strong> — Allowlisting permits only pre-approved apps (most secure, highest overhead); blocklisting blocks known-bad apps (more permissive, lower maintenance).</li></ul><h3>Exam Tips</h3><ul><li>Signature-based AV cannot detect zero-day malware; heuristic/behavioral detection is required for unknown threats.</li><li>Patch management is ranked among the top controls for preventing breaches — most exploited vulnerabilities have patches available before attacks occur.</li><li>EDR differs from traditional AV: EDR provides continuous monitoring and incident response, not just detection and quarantine.</li></ul></div>`
  ],
  c05: [
    `<div class="ai-content"><h3>Overview</h3><p>These modules establish the governance layer of cybersecurity — the policies, frameworks, and intelligence sources that guide organizational security decisions. Students learn how security programs are structured, how frameworks like NIST CSF provide a common language, and how threat intelligence informs proactive defense.</p><h3>Key Concepts</h3><ul><li><strong>Security Policy</strong> — Formal document defining security objectives, acceptable use rules, access control requirements, and response procedures; binding on all employees and contractors.</li><li><strong>NIST CSF 2.0</strong> — Six core functions: Govern, Identify, Protect, Detect, Respond, Recover; flexible, outcome-driven approach to managing cybersecurity risk.</li><li><strong>ISO/IEC 27001</strong> — International standard for Information Security Management Systems (ISMS); systematic approach to managing sensitive information; certification demonstrates compliance.</li><li><strong>Threat Intelligence</strong> — Collection, analysis, and sharing of information about threat actors' TTPs (Tactics, Techniques, Procedures); used to anticipate and counter attacks proactively.</li><li><strong>Cyber Kill Chain</strong> — Lockheed Martin model: Reconnaissance → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives.</li><li><strong>MITRE ATT&amp;CK</strong> — Knowledge base of adversary tactics and techniques based on real-world observations; used by defenders to map detections and identify coverage gaps.</li></ul><h3>Exam Tips</h3><ul><li>NIST CSF 2.0 added "Govern" as a sixth function (previously five); Govern covers organizational context and supply chain risk.</li><li>Kill Chain value: disrupting any single stage prevents the attack from completing — early-stage disruption is most effective.</li><li>Threat intelligence is only useful if timely, accurate, and actionable — raw data alone is not intelligence.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules teach how to systematically identify weaknesses in an organization's systems and quantify the business impact of potential exploits. Vulnerability assessment and risk management are proactive disciplines that prioritize remediation based on impact and likelihood.</p><h3>Key Concepts</h3><ul><li><strong>Vulnerability Assessment</strong> — Systematic process of identifying, classifying, and prioritizing security weaknesses using scanners (e.g., Nessus, OpenVAS).</li><li><strong>Penetration Testing</strong> — Authorized simulated cyberattack that actively attempts to exploit vulnerabilities; provides proof-of-concept evidence of real-world impact.</li><li><strong>CVSS</strong> — Common Vulnerability Scoring System; 0–10 scale based on exploitability and impact: 0 = None, 0.1–3.9 = Low, 4.0–6.9 = Medium, 7.0–8.9 = High, 9.0–10.0 = Critical.</li><li><strong>Risk Management</strong> — Identify assets → assess threats/vulnerabilities → calculate risk (likelihood × impact) → select controls → monitor residual risk.</li><li><strong>Risk Treatment Options</strong> — Avoidance (stop the activity), Mitigation (implement controls), Transfer (insurance/outsourcing), Acceptance (document acceptable risk).</li><li><strong>Asset Inventory</strong> — Complete register of all hardware, software, and data assets; risk cannot be managed for unknown assets.</li></ul><h3>Exam Tips</h3><ul><li>CVSS Critical (9.0–10.0) and High (7.0–8.9) patches should be prioritized first.</li><li>Vulnerability scanning is passive/non-exploitative; pen testing actively exploits vulnerabilities — both require authorization.</li><li>Risk cannot be reduced to zero; residual risk is what remains after controls are applied.</li><li>Threat is external; vulnerability is the internal weakness; risk is the intersection of both.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers how organizations respond to confirmed security incidents and how digital evidence is collected and preserved for legal proceedings. The incident response lifecycle and the forensic chain of custody are the two core frameworks students must master.</p><h3>Key Concepts</h3><ul><li><strong>Incident Response Lifecycle (NIST)</strong> — Preparation → Detection and Analysis → Containment / Eradication / Recovery → Post-Incident Activity (lessons learned).</li><li><strong>Digital Forensics (NIST 4-Step)</strong> — Collection → Examination → Analysis → Reporting; must be performed in a legally admissible manner.</li><li><strong>Chain of Custody</strong> — Documented, chronological record of who collected, handled, transferred, and stored evidence; must be unbroken for evidence to be admissible in court.</li><li><strong>Order of Volatility</strong> — Collect from most volatile to least: CPU registers/RAM → network connections → running processes → hard drive → backup media → paper records.</li><li><strong>Write Blocker</strong> — Hardware/software that prevents modification of original evidence media during forensic imaging; working from a forensic copy is standard practice.</li><li><strong>IOCs (Indicators of Compromise)</strong> — Artifacts indicating a compromise: unusual processes, unexpected network connections, modified system files, new user accounts, suspicious registry entries.</li></ul><h3>Exam Tips</h3><ul><li>Chain of custody: any gap can invalidate evidence in court — document every person and every location.</li><li>Order of volatility: RAM must be captured BEFORE powering down a system during live forensics.</li><li>Containment comes BEFORE eradication — stop the bleeding before removing the threat.</li><li>Write blockers ensure the original evidence is not altered; always work from a forensic image copy.</li></ul></div>`
  ],
  c06: [
    `<div class="ai-content"><h3>Overview</h3><p>These modules establish the governance layer of cybersecurity — formal policies, major frameworks, and the threat intelligence discipline that guides proactive defense. Students learn how organizations structure their security programs and use frameworks like NIST CSF and MITRE ATT&amp;CK to manage risk systematically.</p><h3>Key Concepts</h3><ul><li><strong>Security Governance</strong> — The set of responsibilities, practices, policies, and processes used to direct and control an organization's security strategy; aligns security with business objectives.</li><li><strong>NIST CSF 2.0 Functions</strong> — Govern, Identify, Protect, Detect, Respond, Recover; each function maps to specific security outcomes and activities.</li><li><strong>Threat Intelligence Sources</strong> — OSINT (open-source), ISACs (industry-specific sharing centers), commercial threat feeds, government advisories (CISA, US-CERT); feeds into SIEM and security operations.</li><li><strong>TTPs</strong> — Tactics, Techniques, and Procedures; the behavioral patterns of threat actors; understanding TTPs allows defenders to anticipate and detect attacks beyond simple indicators.</li><li><strong>Security Awareness Training</strong> — Educating employees on phishing, social engineering, password policies, and reporting; human error is the leading cause of security incidents.</li></ul><h3>Exam Tips</h3><ul><li>NIST CSF is voluntary but widely adopted; ISO 27001 is an international certifiable standard — know the difference.</li><li>Threat intelligence must be timely and actionable; a threat feed no one acts on provides no security value.</li><li>MITRE ATT&amp;CK is used for detection gap analysis, red/blue team exercises, and mapping security tool coverage.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>These modules cover how to systematically identify and prioritize security weaknesses and how to quantify the business impact of potential exploits. Vulnerability management and risk assessment are core disciplines in a mature security program.</p><h3>Key Concepts</h3><ul><li><strong>Vulnerability Scanning</strong> — Automated tools (Nessus, OpenVAS, Qualys) scan systems for known vulnerabilities; produces a prioritized list based on CVSS scores.</li><li><strong>CVSS Scoring</strong> — 0–10 scale; Critical (9.0–10.0), High (7.0–8.9), Medium (4.0–6.9), Low (0.1–3.9); guides patching priority.</li><li><strong>Penetration Testing</strong> — Goes beyond scanning to actively exploit vulnerabilities; requires written authorization; produces a detailed report of findings and recommendations.</li><li><strong>Qualitative vs. Quantitative Risk</strong> — Qualitative: categorizes risk as High/Medium/Low using expert judgment; Quantitative: uses numerical values (ALE = ARO × SLE) for financial impact.</li><li><strong>Risk Register</strong> — A document listing identified risks, their likelihood, impact, assigned owner, and treatment plan; maintained and reviewed regularly.</li></ul><h3>Exam Tips</h3><ul><li>Vulnerability scanning is passive; pen testing is active — both require authorization from the asset owner.</li><li>CVSS 9.0+ (Critical) requires immediate remediation; don't just memorize the ranges, understand the urgency each implies.</li><li>Risk acceptance must be formally documented and approved by management — it is not ignoring the risk.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers digital forensics methodology and the structured process for handling security incidents. Students learn how evidence is collected, preserved, and analyzed to support legal proceedings, and how organizations recover and improve after an incident.</p><h3>Key Concepts</h3><ul><li><strong>Incident Response Phases</strong> — Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned (PICERL is a common mnemonic).</li><li><strong>Digital Evidence Types</strong> — Volatile (RAM, network connections, running processes) and non-volatile (hard drives, logs, backup media); volatile data is lost on power-off.</li><li><strong>Forensic Imaging</strong> — Creating a bit-for-bit copy of storage media using tools like dd or FTK Imager; hash values (MD5/SHA-256) verify the image matches the original.</li><li><strong>Chain of Custody</strong> — Unbroken documentation of evidence handling from collection to courtroom; any gap may render evidence inadmissible.</li><li><strong>Post-Incident Activity</strong> — Root cause analysis, lessons-learned meeting, policy/control updates, and updating the incident response plan based on findings.</li></ul><h3>Exam Tips</h3><ul><li>Hash values (MD5/SHA-256) are used to verify forensic image integrity — if hashes match, the copy is authentic.</li><li>Containment precedes eradication: isolate the affected system first, then remove the threat, then restore.</li><li>Lessons learned is not optional — it closes the loop and prevents recurrence of the same incident.</li><li>The order of volatility determines collection sequence: RAM first, hard drives last.</li></ul></div>`
  ],
  c07: [
    `<div class="ai-content"><h3>Overview</h3><p>This module introduces the Azure AI services ecosystem, explaining how Microsoft has packaged AI capabilities into accessible, API-driven services that developers can integrate without deep ML expertise. Students learn the service categories and how to provision and authenticate AI services in Azure.</p><h3>Key Concepts</h3><ul><li><strong>Azure AI Services</strong> — Cloud-based APIs covering Vision, Language, Speech, Decision, and OpenAI capabilities; consumed via REST API or SDK; no ML expertise required.</li><li><strong>Responsible AI Principles</strong> — Microsoft's six principles: Fairness, Reliability &amp; Safety, Privacy &amp; Security, Inclusiveness, Transparency, and Accountability.</li><li><strong>Service Provisioning</strong> — AI services are provisioned as Azure resources with an endpoint URL and access key; can be multi-service (one key for all) or single-service resource.</li><li><strong>AI Workload Categories</strong> — Machine learning, computer vision, NLP, document intelligence, knowledge mining, and generative AI — each maps to specific Azure services.</li><li><strong>Azure OpenAI Service</strong> — Access to GPT-4, DALL-E, Whisper, and embedding models hosted on Azure; combines OpenAI capabilities with Azure enterprise security and compliance.</li></ul><h3>Exam Tips</h3><ul><li>Authentication uses either an API key or Azure Active Directory/Entra ID — know both methods.</li><li>The Responsible AI principle of Fairness requires validation, not assumption — AI systems must be tested for discriminatory outcomes.</li><li>Azure OpenAI requires a separate application and approval process beyond a standard Azure subscription.</li><li>Multi-service resource simplifies development; single-service resource provides isolation and separate billing.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers generative AI capabilities in Azure — including large language models, Copilot integrations, and AI agents. It explains how prompts, temperature, and system messages shape model behavior, and introduces the emerging pattern of autonomous AI agents.</p><h3>Key Concepts</h3><ul><li><strong>Generative AI</strong> — AI that creates new content (text, images, code, audio) based on patterns learned from training data; powered by LLMs and diffusion models.</li><li><strong>Prompt Engineering</strong> — System prompts (set behavior/persona), user prompts (the question), and few-shot examples (demonstrations in context) that guide model output.</li><li><strong>Temperature</strong> — Controls output randomness; temperature 0 = deterministic/factual; temperature 1 = creative/random.</li><li><strong>Grounding / RAG</strong> — Connecting an LLM to real data sources (via Azure AI Search) to reduce hallucinations and improve factual accuracy.</li><li><strong>Microsoft Copilot</strong> — AI assistant integrated into Microsoft 365, Windows, Bing, and GitHub; uses grounding to provide contextually relevant responses.</li><li><strong>AI Agents</strong> — Autonomous systems that use tools and memory to complete multi-step tasks; loop: perceive → plan → act → observe → repeat.</li></ul><h3>Exam Tips</h3><ul><li>Generative AI produces probabilistic output — same prompt can give different results; this causes hallucination.</li><li>Temperature 0 is appropriate for factual/deterministic tasks; higher temperature for creative generation.</li><li>Grounding is the key technique for reducing hallucinations — without it, LLMs only know their training cutoff data.</li><li>AI agents differ from chatbots in their ability to autonomously orchestrate tools without human confirmation at each step.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers Azure's NLP services that analyze and understand text — detecting sentiment, extracting named entities, and identifying language. These services power chatbots, content moderation, and business intelligence applications.</p><h3>Key Concepts</h3><ul><li><strong>Azure Language Service</strong> — Unified NLP service providing: sentiment analysis, opinion mining, NER, key phrase extraction, language detection, text summarization, and CLU.</li><li><strong>Sentiment Analysis</strong> — Classifies text as Positive, Negative, Neutral, or Mixed with confidence scores (0–1) at document and sentence level.</li><li><strong>Opinion Mining</strong> — Links sentiment to specific aspects: e.g., "the room was clean but the service was slow" returns separate sentiments per aspect.</li><li><strong>Named Entity Recognition (NER)</strong> — Identifies and categorizes entities: Person, Location, Organization, Date/Time, Quantity, URL; Custom NER supports user-defined types.</li><li><strong>Key Phrase Extraction</strong> — Identifies main talking points and returns a list of key phrases; useful for summarizing documents or categorizing support tickets.</li><li><strong>CLU (Conversational Language Understanding)</strong> — Successor to LUIS; trains a model to understand intents and extract entities from conversational input.</li></ul><h3>Exam Tips</h3><ul><li>Sentiment analysis returns document-level AND sentence-level scores; opinion mining adds aspect-level sentiment.</li><li>Prebuilt NER works out-of-the-box; Custom NER requires labeled training data for domain-specific entity types.</li><li>Key phrase extraction is NOT the same as summarization — it extracts verbatim phrases, not generated prose.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers Azure's cloud-based speech processing capabilities — converting between audio and text in real time or batch, and translating spoken language across dozens of language pairs. These services power voice assistants, transcription tools, and multilingual analytics.</p><h3>Key Concepts</h3><ul><li><strong>Speech-to-Text (STT)</strong> — Converts spoken audio to text; supports real-time streaming and batch transcription; can be customized with Custom Speech for domain-specific vocabulary.</li><li><strong>Text-to-Speech (TTS)</strong> — Converts text to natural-sounding audio; Neural voices use deep learning for human-like quality; Custom Neural Voice clones a specific speaker.</li><li><strong>Speech Translation</strong> — Real-time translation of spoken audio from one language to another; can output as translated audio or text.</li><li><strong>Speaker Recognition</strong> — Speaker Verification: "is this the person they claim to be?"; Speaker Identification: "who is speaking?"</li><li><strong>Custom Speech</strong> — Fine-tunes the base STT model with domain-specific audio and transcripts; used for medical, legal, or technical jargon.</li></ul><h3>Exam Tips</h3><ul><li>Neural voices are significantly more natural than standard voices and are preferred for production.</li><li>Speech Translation (audio → translated audio/text) differs from Azure Translator (text → translated text).</li><li>All Azure Speech service features are provisioned under a single Azure AI Speech resource.</li><li>Custom Speech and Custom Neural Voice require separate data preparation and training steps.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers Azure's vision AI services that analyze, understand, and extract information from images and video. Students learn to describe images, detect objects, read text in images, and identify faces — and understand the ethical constraints that apply to facial recognition.</p><h3>Key Concepts</h3><ul><li><strong>Azure AI Vision (Image Analysis)</strong> — Generates captions, identifies objects, detects brands/logos, classifies images, and identifies unsafe content (adult/racy/gory scores).</li><li><strong>OCR (Read API)</strong> — Extracts handwritten and printed text from images and PDFs; returns bounding boxes and confidence scores for each word.</li><li><strong>Object Detection</strong> — Identifies and locates multiple objects, returning both class labels AND bounding box coordinates; evaluated with mean Average Precision (mAP).</li><li><strong>Azure Face API</strong> — Detects faces, estimates attributes (age, emotion, head pose); Face Verification: compare two faces; Face Identification: match against a group.</li><li><strong>Spatial Analysis</strong> — Analyzes video streams to understand people's movement and presence; used for occupancy counting and traffic flow analysis.</li><li><strong>Limited Access</strong> — Facial recognition for identifying individuals requires a separate approval process due to privacy concerns.</li></ul><h3>Exam Tips</h3><ul><li>OCR extracts text from images; Image Analysis describes image content — these are different tasks, different APIs.</li><li>Object detection returns label + bounding box; image classification returns only a label.</li><li>Face API identification and verification features are gated — not available to all Azure subscribers by default.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers Azure AI Document Intelligence (formerly Form Recognizer), which uses AI to extract structured data from unstructured documents such as invoices, receipts, ID documents, and custom business forms. It combines OCR, NER, and document structure understanding.</p><h3>Key Concepts</h3><ul><li><strong>Azure AI Document Intelligence</strong> — Uses ML to extract key-value pairs, tables, bounding boxes, and structured data from documents; goes beyond OCR by understanding document structure and semantics.</li><li><strong>Prebuilt Models</strong> — Pre-trained for common document types: Invoice, Receipt, Business Card, ID Document, Health Insurance Card, Tax forms (W-2, 1040); ready to use without training.</li><li><strong>Custom Models</strong> — Trained on your own labeled document samples; requires a minimum of 5 labeled samples (recommend 50+) for training.</li><li><strong>Layout Model</strong> — Extracts text, tables, selection marks (checkboxes), and structural info from any document without a specific prebuilt model.</li><li><strong>Document Intelligence Studio</strong> — Web-based tool for testing prebuilt models, labeling training data, and reviewing extraction results without writing code.</li></ul><h3>Exam Tips</h3><ul><li>OCR extracts raw text; Document Intelligence extracts structured data with semantic understanding — they are different capabilities.</li><li>Prebuilt models require no training; custom models require labeled training data.</li><li>Azure AI Document Intelligence was formerly known as Azure Form Recognizer — exam questions may use either name.</li><li>Low-confidence extractions should trigger human review — confidence scores are returned for each field.</li></ul></div>`
  ],
  c08: [
    `<div class="ai-content"><h3>Overview</h3><p>This module establishes the theoretical foundations of machine learning for developers, covering different training paradigms, what types of problems each solves, and key algorithms within each category. It provides the conceptual vocabulary needed to make informed decisions about AI system design.</p><h3>Key Concepts</h3><ul><li><strong>Supervised Learning</strong> — Training on labeled data (input-output pairs); use cases: classification (spam/not spam) and regression (price prediction); examples: linear regression, decision trees, neural networks.</li><li><strong>Unsupervised Learning</strong> — Training on unlabeled data; discovers patterns, groupings, or structures; use cases: customer segmentation (K-means), anomaly detection, dimensionality reduction (PCA).</li><li><strong>Reinforcement Learning</strong> — Agent learns by trial-and-error, receiving rewards for correct actions; use cases: game-playing AI, robotics, recommendation optimization.</li><li><strong>Overfitting vs. Underfitting</strong> — Overfitting: model memorizes training data, performs poorly on new data; Underfitting: model too simple to capture patterns; regularization helps manage this tradeoff.</li><li><strong>Transfer Learning</strong> — A pre-trained model fine-tuned on a smaller, domain-specific dataset; reduces data and compute requirements significantly.</li><li><strong>Training / Validation / Test Sets</strong> — Training trains the model; validation tunes hyperparameters; test set provides unbiased final evaluation; typical split: 70/15/15.</li></ul><h3>Exam Tips</h3><ul><li>Supervised = labeled data; Unsupervised = no labels; Reinforcement = reward signals — this distinction is always tested.</li><li>Regression predicts continuous values; classification predicts discrete categories — both are supervised.</li><li>Cross-validation (k-fold) improves evaluation reliability by training and testing on multiple subsets.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module provides developers with an in-depth understanding of how LLMs work technically — the Transformer architecture, tokenization, and vector embeddings. This knowledge enables more effective use of LLMs, critical evaluation of their outputs, and understanding of their limitations.</p><h3>Key Concepts</h3><ul><li><strong>Transformer Architecture</strong> — Uses self-attention to weigh the importance of each token relative to all others; encoder (understands input) and decoder (generates output) components.</li><li><strong>Tokenization</strong> — Splits text into tokens (subword units, not whole words); GPT uses BPE (Byte-Pair Encoding); token count affects API cost and context window usage.</li><li><strong>Context Window</strong> — Maximum tokens an LLM can process at once (input + output); GPT-4o supports up to 128K tokens; data outside the window is not visible to the model.</li><li><strong>Embeddings</strong> — Dense vector representations where semantic similarity corresponds to mathematical proximity; used for semantic search, RAG, and classification.</li><li><strong>RAG (Retrieval-Augmented Generation)</strong> — Retrieves relevant documents from a vector database and injects them into the LLM's context to ground responses in specific data.</li><li><strong>Hallucination</strong> — When an LLM generates plausible-sounding but factually incorrect information; fundamental limitation of predicting probable text sequences.</li></ul><h3>Exam Tips</h3><ul><li>Self-attention is the key Transformer innovation — captures long-range dependencies unlike sequential RNNs.</li><li>Tokens ≠ words: "unbelievable" ≈ 3 tokens; average English word ≈ 1.3 tokens.</li><li>RAG reduces hallucination by grounding the model in external, verified data.</li><li>Temperature, Top-P, and frequency/presence penalties are the primary parameters for controlling LLM output behavior.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers natural language processing from the developer perspective — how text is preprocessed, how language models are built and trained, and how machine translation bridges human languages. It covers the full NLP pipeline from raw text to actionable outputs.</p><h3>Key Concepts</h3><ul><li><strong>NLP Pipeline</strong> — Tokenization → stop word removal → stemming/lemmatization → POS tagging → parsing → semantic analysis → output task.</li><li><strong>Stemming vs. Lemmatization</strong> — Stemming crudely cuts word endings ("running" → "run"); lemmatization uses morphological analysis to return the dictionary base form ("better" → "good").</li><li><strong>Word Embeddings</strong> — Word2Vec, GloVe: fixed vector representations of words; limitation: same word has one representation regardless of context (polysemy problem).</li><li><strong>Contextual Embeddings</strong> — BERT, GPT: same word gets different vectors depending on surrounding context; solves polysemy; foundation of modern NLP.</li><li><strong>BERT vs. GPT</strong> — BERT is bidirectional (sees context on both sides); GPT is unidirectional (left-to-right); BERT is better for understanding, GPT for generation.</li><li><strong>Azure Translator</strong> — Supports 100+ languages; real-time and batch translation; optional custom glossary and domain adaptation via Custom Translator.</li></ul><h3>Exam Tips</h3><ul><li>Stop words should be preserved in sentiment analysis ("not good" vs. "good") but removed in information retrieval tasks.</li><li>Subword tokenization (BPE, WordPiece) handles rare/unknown words better than whitespace-based tokenization.</li><li>Azure Translator is text-in → text-out; Azure Speech Translation is audio-in → text or audio-out.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module explains the technical underpinnings of speech recognition — from the acoustic signal to the final transcription. Developers learn the role of acoustic models, end-to-end architectures, and how to select, customize, and evaluate speech services.</p><h3>Key Concepts</h3><ul><li><strong>Speech Recognition Pipeline</strong> — Audio → feature extraction (MFCC) → acoustic model (maps features to phonemes) → language model (converts phonemes to words) → text output.</li><li><strong>MFCC</strong> — Mel-Frequency Cepstral Coefficients; standard audio feature representation that mimics human auditory perception; input to acoustic models.</li><li><strong>End-to-End Models</strong> — Single neural network (e.g., OpenAI Whisper, used in Azure) that directly maps audio to text; more accurate and simpler than traditional separate acoustic + language models.</li><li><strong>Custom Speech</strong> — Fine-tuning the base Azure speech model with domain-specific audio and transcripts; necessary for medical dictation, legal transcription, or specialized vocabulary.</li><li><strong>Speaker Diarization</strong> — Segmenting audio to identify and label segments by speaker ("who spoke when"); used for meeting transcription and call center analytics.</li><li><strong>WER (Word Error Rate)</strong> — Primary metric for speech recognition quality: WER = (Substitutions + Deletions + Insertions) / Total Reference Words.</li></ul><h3>Exam Tips</h3><ul><li>MFCCs are the standard audio feature for speech models — they capture frequency content in a biologically-inspired format.</li><li>End-to-end models (Whisper) are now preferred over traditional HMM-based acoustic models.</li><li>Custom Speech is needed when the default model underperforms — don't expect out-of-the-box accuracy for highly specialized domains.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers the deep learning foundations of computer vision — how CNNs learn visual features hierarchically, and how this enables tasks from basic image classification to complex object detection. Developers learn when to use each approach and how to evaluate model performance.</p><h3>Key Concepts</h3><ul><li><strong>CNN (Convolutional Neural Network)</strong> — Deep neural architecture for images; uses convolutional layers (learn edges, textures), pooling layers (downsample), and fully connected layers (classify); learns hierarchical features automatically.</li><li><strong>Image Classification</strong> — Assigns a single label to an entire image; evaluated with accuracy, precision, recall, F1-score.</li><li><strong>Object Detection</strong> — Identifies and locates multiple objects; outputs class labels + bounding box coordinates; architectures: YOLO (real-time), Faster R-CNN (accurate); evaluated with mAP.</li><li><strong>Semantic Segmentation</strong> — Classifies every pixel into a category; used in autonomous driving and medical imaging; more granular than object detection.</li><li><strong>Transfer Learning for Vision</strong> — Pre-trained models (ResNet, EfficientNet, ViT) trained on ImageNet reused as feature extractors; dramatically reduces required training data.</li><li><strong>Azure Custom Vision</strong> — Trains custom image classification and object detection models with as few as 15 images per class; no ML expertise required; exposes models via REST API.</li></ul><h3>Exam Tips</h3><ul><li>Object detection = label + bounding box; image classification = label only — this distinction is commonly tested.</li><li>Transfer learning is the standard approach when training data is limited.</li><li>Azure Custom Vision has two project types: Classification and Object Detection — they use different training data formats.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers automated techniques for extracting structured information from unstructured text, with a focus on Named Entity Recognition and key phrase extraction as foundational capabilities for downstream tasks like document classification and automated data entry.</p><h3>Key Concepts</h3><ul><li><strong>NER (Named Entity Recognition)</strong> — Sequence labeling task that identifies and classifies named entities into categories (Person, Organization, Location, Date, Money, etc.); uses BERT-based models for state-of-the-art performance.</li><li><strong>BIO Tagging</strong> — NER implementation scheme: B (Beginning of entity), I (Inside entity), O (Outside/not an entity); each token receives a tag.</li><li><strong>Key Phrase Extraction</strong> — Identifies the most important phrases in text using statistical and linguistic methods; returns salient phrases, NOT typed entities like NER.</li><li><strong>Relation Extraction</strong> — Identifies relationships between entities in text: e.g., "Microsoft acquired GitHub" → (Microsoft, acquired, GitHub); an advanced information extraction task.</li><li><strong>Text Summarization</strong> — Extractive: selects existing sentences; Abstractive: generates new text capturing main points; both supported in Azure Language service.</li><li><strong>Custom NER</strong> — Trains a model to recognize domain-specific entity types (contract clauses, medical procedures, product codes) using labeled training data in Azure Language Studio.</li></ul><h3>Exam Tips</h3><ul><li>NER is supervised and requires labeled data; key phrase extraction is unsupervised — works on any text without training.</li><li>Custom NER requires at least 10 tagged examples per entity type (more is better).</li><li>Information extraction converts unstructured text to structured, queryable data — it enables downstream analytics and automation.</li></ul></div>`
  ],
  c09: [
    `<div class="ai-content"><h3>Overview</h3><p>This module establishes the foundational vocabulary and economic framework of cloud computing. Students learn how cloud deployment models differ, what core benefits cloud provides over on-premises infrastructure, and how cloud shifts IT spending from capital expenditure to operational expenditure.</p><h3>Key Concepts</h3><ul><li><strong>Public Cloud</strong> — Owned by a third-party provider (Azure, AWS, GCP); resources shared across tenants; accessible over the internet; no hardware purchase required.</li><li><strong>Private Cloud</strong> — Infrastructure dedicated to a single organization; can be on-premises or hosted; greater control; organization bears full maintenance responsibility.</li><li><strong>Hybrid Cloud</strong> — Combines public and private clouds; workloads run where most appropriate (sensitive data on-premises, variable-demand workloads in public cloud).</li><li><strong>CapEx vs. OpEx</strong> — CapEx: large upfront hardware investment with depreciation; OpEx: pay-as-you-go with no upfront costs; cloud converts CapEx to OpEx.</li><li><strong>Cloud Benefits</strong> — High availability (SLA-backed), scalability (add resources on demand), elasticity (auto-scale), agility (rapid provisioning), geographic distribution, disaster recovery.</li><li><strong>Shared Responsibility Model</strong> — Provider secures physical infrastructure; customer secures data, identities, applications, and configurations; responsibility shifts by service model (IaaS/PaaS/SaaS).</li></ul><h3>Exam Tips</h3><ul><li>Shared Responsibility: IaaS = customer manages OS, apps, data; PaaS = customer manages apps and data; SaaS = customer manages data and access only.</li><li>Elasticity (auto-scale) ≠ Scalability (manual scaling) — elasticity automatically adjusts resources based on demand.</li><li>Consumption-based pricing: you only pay for what you use — no cost for idle resources if you scale down.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module provides a comprehensive survey of Azure's physical and logical infrastructure and core service categories — compute, storage, networking, and databases. Students learn how Azure organizes its global infrastructure and gain familiarity with the primary services on the platform.</p><h3>Key Concepts</h3><ul><li><strong>Regions and Availability Zones</strong> — 60+ Azure regions worldwide; each supported region has 3+ Availability Zones (physically separate datacenters with independent power/cooling/networking); AZs protect against datacenter-level failures.</li><li><strong>Compute Services</strong> — Virtual Machines (IaaS, full OS control), AKS (container orchestration), ACI (serverless containers), App Service (PaaS web hosting), Azure Functions (serverless, event-driven, pay-per-execution).</li><li><strong>Azure Storage</strong> — Blob (unstructured objects: Hot/Cool/Archive tiers), Azure Files (managed file shares), Queue Storage (message queuing), Table Storage (NoSQL key-value), Disk Storage (managed VM disks).</li><li><strong>Networking</strong> — Virtual Network (VNet) for isolation; VNet Peering connects VNets; VPN Gateway (over internet) and ExpressRoute (private dedicated connection) connect to on-premises.</li><li><strong>Database Services</strong> — Azure SQL Database (PaaS SQL Server), Azure SQL MI (near-100% SQL Server compatibility for migrations), Azure Cosmos DB (globally distributed NoSQL), open-source managed DBs (MySQL, PostgreSQL, MariaDB).</li></ul><h3>Exam Tips</h3><ul><li>Availability Zones = intra-region redundancy; Region Pairs = cross-region disaster recovery (e.g., East US ↔ West US).</li><li>Azure Functions: pay only per execution and duration — zero cost when idle; perfect for sporadic event-driven workloads.</li><li>Blob tiers: Hot (frequent access), Cool (infrequent, lower cost, early deletion penalty), Archive (rare access, hours-long rehydration).</li><li>ExpressRoute is private (not over internet); VPN Gateway is over the public internet but encrypted.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers the tools and frameworks Azure provides for controlling costs, enforcing compliance, managing access, and governing resources at scale — essential for enterprises deploying Azure in production environments with regulatory and financial constraints.</p><h3>Key Concepts</h3><ul><li><strong>Azure Cost Management</strong> — Monitoring, allocating, and optimizing Azure spending; includes cost analysis dashboards, budgets (with alerts at thresholds), and Azure Advisor recommendations for right-sizing.</li><li><strong>Azure Policy</strong> — Enforces organizational rules on Azure resources; policies can audit (non-compliance reporting) or deny (block non-compliant resource creation); bundled into Initiatives (policy sets).</li><li><strong>Azure RBAC</strong> — Controls who can do what on which resources; built-in roles: Owner (full access + manage access), Contributor (full access, no access management), Reader (view only); custom roles available.</li><li><strong>Microsoft Entra ID</strong> — Formerly Azure Active Directory; cloud identity and access management; provides authentication (SSO, MFA) and authorization for Azure and Microsoft 365.</li><li><strong>Azure Blueprints</strong> — Packages ARM templates, policies, role assignments, and resource groups into a repeatable, auditable blueprint for deploying compliant environments.</li><li><strong>Cloud Adoption Framework (CAF)</strong> — Guidance for adopting Azure; stages: Strategy → Plan → Ready → Adopt → Govern → Manage.</li></ul><h3>Exam Tips</h3><ul><li>RBAC scope hierarchy: Management Group → Subscription → Resource Group → Individual Resource; permissions are inherited downward.</li><li>Azure Policy can enforce compliance at scale; the Deny effect prevents non-compliant resources from being created.</li><li>Budget alerts NOTIFY you when spending reaches threshold — they do NOT automatically stop services.</li><li>CAF "Ready" phase involves creating an Azure Landing Zone — pre-configured environment with networking, identity, and governance established.</li></ul></div>`
  ],
  c10: [
    `<div class="ai-content"><h3>Overview</h3><p>This module introduces fundamental data concepts that underpin all Azure data services. Students learn to categorize data by structure, understand batch vs. stream processing paradigms, and recognize the distinct professional roles in modern data engineering and analytics teams.</p><h3>Key Concepts</h3><ul><li><strong>Structured Data</strong> — Predefined schema with rows and columns (tabular); stored in relational databases; easily queried with SQL; examples: customer records, transaction tables.</li><li><strong>Semi-Structured Data</strong> — Has some organizational properties but no rigid schema; examples: JSON, XML, CSV, email; stored in document databases or blob storage.</li><li><strong>Unstructured Data</strong> — No predefined format or schema; examples: images, videos, audio, social media posts, raw text; stored in object/blob storage.</li><li><strong>Batch Processing</strong> — Collecting and processing large volumes of data at scheduled intervals; high latency, high throughput; used for historical reporting and ETL; tools: Azure Data Factory, Azure Synapse.</li><li><strong>Stream Processing</strong> — Processing data in real time as it arrives; low latency; used for fraud detection, real-time dashboards, IoT; tools: Azure Stream Analytics, Azure Event Hubs.</li><li><strong>Data Roles</strong> — DBA (manages databases, backups, security), Data Engineer (builds pipelines), Data Analyst (produces insights), Data Scientist (builds ML models), App Developer (consumes data in apps).</li></ul><h3>Exam Tips</h3><ul><li>The three Vs of Big Data: Volume, Velocity, Variety (a fourth V, Veracity/data quality, is also referenced).</li><li>Batch = tolerate delayed insights; Stream = real-time decisions required — know when each is appropriate.</li><li>Data Engineer builds the pipelines; Data Analyst consumes clean data; Data Scientist builds models — distinct roles on the DP-900 exam.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers the principles and implementation of relational databases, from the theoretical foundations of normalization through to Azure-managed relational database services. Students learn how relational databases ensure data integrity and how Azure's managed SQL services reduce operational overhead.</p><h3>Key Concepts</h3><ul><li><strong>ACID Properties</strong> — Atomicity (all-or-nothing transactions), Consistency (valid state always), Isolation (concurrent transactions don't interfere), Durability (committed data persists); guarantees transaction reliability.</li><li><strong>Primary and Foreign Keys</strong> — Primary key: uniquely identifies each row (cannot be NULL); Foreign key: references another table's primary key, enforcing referential integrity.</li><li><strong>Normalization</strong> — Organizing tables to reduce redundancy; 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies); reduces insert/update/delete anomalies.</li><li><strong>SQL</strong> — DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE); the standard language for relational databases.</li><li><strong>Azure SQL Database</strong> — Fully managed PaaS SQL Server; no OS management; supports hyperscale, serverless, and elastic pool configurations; built-in HA, automated backups, and patching.</li><li><strong>Azure SQL Managed Instance</strong> — Near-100% SQL Server compatibility; supports SQL Agent, linked servers, CLR; designed for lift-and-shift migrations from on-premises SQL Server.</li></ul><h3>Exam Tips</h3><ul><li>Azure SQL Database = new cloud-native apps; Azure SQL MI = migrating existing SQL Server workloads with minimal code changes.</li><li>Indexes improve query performance without scanning the entire table — the database engine finds rows via the index structure.</li><li>Normalization reduces redundancy but requires more JOINs; denormalization trades redundancy for query speed in analytics workloads.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers NoSQL database paradigms and Azure's non-relational data services. Students learn when NoSQL is more appropriate than relational databases, the characteristics of each NoSQL data model, and how Azure Cosmos DB provides a single service supporting multiple NoSQL APIs.</p><h3>Key Concepts</h3><ul><li><strong>Key-Value Store</strong> — Simplest NoSQL model; extremely fast lookups by key; no complex querying by value; use cases: session state, caching, shopping carts; Azure: Azure Table Storage, Azure Cache for Redis.</li><li><strong>Document Store</strong> — Stores semi-structured JSON/BSON documents; each document is self-describing; supports complex querying within documents; Azure: Azure Cosmos DB for NoSQL.</li><li><strong>Column-Family Store</strong> — Data organized into column families; each row can have different columns; optimized for reading many rows but few columns; Apache Cassandra model; Azure: Cosmos DB for Apache Cassandra.</li><li><strong>Graph Database</strong> — Nodes (entities) and edges (relationships) with properties; optimized for traversing complex relationships; use cases: social networks, fraud detection; Azure: Cosmos DB for Apache Gremlin.</li><li><strong>Azure Cosmos DB</strong> — Globally distributed, multi-model NoSQL; supports NoSQL, MongoDB, Cassandra, Gremlin, and Table APIs; single-digit ms latency; 99.999% availability SLA; automatic multi-region replication.</li><li><strong>Cosmos DB Consistency Levels</strong> — Strong → Bounded Staleness → Session → Consistent Prefix → Eventual; stronger consistency = higher latency.</li></ul><h3>Exam Tips</h3><ul><li>NoSQL databases sacrifice some ACID properties for horizontal scalability and flexible schemas — eventual consistency is common.</li><li>Azure Table Storage and Cosmos DB for Table API are similar but Cosmos DB offers global distribution and lower latency at higher cost.</li><li>Choose document store for variable-schema data with rich querying; key-value for high-speed simple lookups; graph for relationship traversal.</li></ul></div>`,
    `<div class="ai-content"><h3>Overview</h3><p>This module covers Azure services used for large-scale data analytics — from traditional data warehousing through real-time streaming and self-service business intelligence. Students learn the modern lakehouse pattern and when each analytics service is appropriate.</p><h3>Key Concepts</h3><ul><li><strong>Data Warehouse</strong> — Central repository optimized for analytical queries (OLAP) rather than transactions (OLTP); stores historical, cleaned data from multiple sources; uses columnar storage for fast aggregations.</li><li><strong>ETL vs. ELT</strong> — ETL: transform before loading (traditional, when destination lacks compute); ELT: load raw data first, transform inside the destination system (preferred in modern cloud architectures).</li><li><strong>Azure Synapse Analytics</strong> — Unified analytics service combining data warehousing (Synapse SQL Pools), big data (Synapse Spark), data integration pipelines, and Power BI in one workspace.</li><li><strong>Azure Databricks</strong> — Apache Spark-based analytics platform; used for large-scale data engineering, ML, and streaming; notebook-based, supports Python/Scala/R/SQL.</li><li><strong>Azure HDInsight</strong> — Managed open-source analytics (Hadoop, Spark, Hive, HBase, Kafka, Storm); for organizations with existing Hadoop ecosystem investments.</li><li><strong>Microsoft Power BI</strong> — Business intelligence and visualization; Power BI Desktop (authoring) + Power BI Service (sharing) + Power BI Mobile (consumption); connects to Azure services and on-premises sources.</li></ul><h3>Exam Tips</h3><ul><li>Azure Synapse Analytics is the primary Azure data warehouse service on the DP-900 exam — it unifies warehousing and big data analytics.</li><li>ELT is preferred in modern cloud architectures because the destination (Synapse, Databricks) has ample compute for in-place transformation.</li><li>HDInsight = existing open-source (Hadoop) workloads; Databricks = new Spark-based data engineering and ML — both are big data but different target scenarios.</li><li>Power BI connects to Azure data sources and on-premises sources via an on-premises data gateway.</li></ul></div>`
  ]
};

function renderStudyCourseList() {
  const list = document.getElementById('study-course-list');
  if (!list) return;
  list.innerHTML = '';
  COURSES.forEach(c => {
    const btn = document.createElement('div');
    btn.className = 'study-course-btn' + (c.id === currentStudyCourseId ? ' active' : '');
    btn.innerHTML = `<div class="scb-dot" style="background:${c.accent}"></div><div class="scb-name">${getSavedTitle(c.id) || c.title}</div>`;
    btn.onclick = () => {
      currentStudyCourseId = c.id;
      currentStudyTopic = c.studyTopics[0];
      document.querySelectorAll('.study-course-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTopicPills();
      resetStudyOutputs();
    };
    list.appendChild(btn);
  });
  renderTopicPills();
}

function renderTopicPills() {
  const c = COURSES.find(x => x.id === currentStudyCourseId);
  const container = document.getElementById('topic-pills');
  if (!container || !c) return;
  container.innerHTML = '';
  c.studyTopics.forEach((topic, i) => {
    const pill = document.createElement('div');
    pill.className = 'topic-pill' + (i === 0 ? ' active' : '');
    pill.textContent = topic.split(':')[0].trim();
    pill.dataset.topic = topic;
    pill.onclick = () => {
      currentStudyTopic = topic;
      document.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      resetStudyOutputs();
    };
    container.appendChild(pill);
  });
  currentStudyTopic = c.studyTopics[0];
}

function resetStudyOutputs() {
  renderStudySummary();
  const notesEl = document.getElementById('notes-area');
  if (notesEl) notesEl.value = loadNote();
}

function switchSMode(name, el) {
  document.querySelectorAll('.smode').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.sview').forEach(v => v.classList.remove('active'));
  document.getElementById('sview-' + name).classList.add('active');
}


function getTopicIndex() {
  const c = COURSES.find(x => x.id === currentStudyCourseId);
  if (!c) return 0;
  const idx = c.studyTopics.indexOf(currentStudyTopic);
  return idx >= 0 ? idx : 0;
}

function renderStudySummary() {
  const box = document.getElementById('box-summary');
  if (!box) return;
  const summaries = STUDY_SUMMARIES[currentStudyCourseId];
  if (summaries && summaries[getTopicIndex()]) {
    box.innerHTML = summaries[getTopicIndex()];
  } else {
    box.innerHTML = '<div class="empty-state"><span class="empty-icon">📋</span>Summary not available for this topic.</div>';
  }
}

function saveNote() {
  const ta = document.getElementById('notes-area');
  if (!ta) return;
  const key = `note_${currentStudyCourseId}_${getTopicIndex()}`;
  const s = loadState();
  s[key] = ta.value;
  localStorage.setItem('bitacora', JSON.stringify(s));
}

function loadNote() {
  const key = `note_${currentStudyCourseId}_${getTopicIndex()}`;
  return loadState()[key] || '';
}

// ── PROGRESS SECTION ───────────────────────
function renderProgressSection() {
  const grid = document.getElementById('progress-grid');
  if (!grid) return;
  grid.innerHTML = '';
  COURSES.forEach(c => {
    const pct = getCourseProgress(c);
    const s = loadState();
    let total = 0, done = 0;
    c.weeks.forEach((w,wi) => w.items.forEach((_,ii) => {
      total++; if (s[`${c.id}_w${wi}_i${ii}`] === 'done') done++;
    }));
    const card = document.createElement('div');
    card.className = 'prog-card';
    card.innerHTML = `
      <div class="prog-card-top">
        <div class="prog-card-dot" style="background:${c.accent}"></div>
        <div class="prog-card-name">${getSavedTitle(c.id) || c.title}</div>
        <div class="prog-card-pct">${pct}%</div>
      </div>
      <div class="prog-card-bar"><div class="prog-card-fill" style="width:${pct}%;background:${c.accent}"></div></div>
      <div class="prog-card-meta">
        <span>${done} / ${total} items</span>
        <span>${c.hours}</span>
      </div>`;
    grid.appendChild(card);
  });
}

// ── MOBILE SEARCH ─────────────────────────
function openMobileSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.add('visible');
  document.getElementById('search-input-mobile').focus();
}
function closeMobileSearch() {
  document.getElementById('search-overlay').classList.remove('visible');
  document.getElementById('search-input-mobile').value = '';
}

// ── SEARCH ─────────────────────────────────
function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) { results.classList.remove('visible'); return; }
    const matches = [];
    COURSES.forEach(c => {
      const title = getSavedTitle(c.id) || c.title;
      if (title.toLowerCase().includes(q)) {
        matches.push({ name: title, course: c.num, id: c.id, type: 'course' });
      }
      c.weeks.forEach(w => w.items.forEach(item => {
        if (item.name.toLowerCase().includes(q)) {
          matches.push({ name: item.name, course: title, id: c.id, type: 'module' });
        }
      }));
    });
    if (!matches.length) { results.classList.remove('visible'); return; }
    matches.slice(0, 8).forEach(m => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      const c = COURSES.find(x => x.id === m.id);
      el.innerHTML = `<div class="sri-dot" style="background:${c?.accent||'var(--accent)'}"></div><div class="sri-name">${m.name}</div><div class="sri-course">${m.course}</div>`;
      el.onclick = () => {
        input.value = '';
        results.classList.remove('visible');
        navigate(m.type === 'course' ? 'courses' : 'plan', m.id);
      };
      results.appendChild(el);
    });
    results.classList.add('visible');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.topbar-search')) results.classList.remove('visible');
    if (!e.target.closest('.lang-dropdown') && !e.target.closest('#lang-btn')) {
      document.getElementById('lang-dropdown').classList.remove('visible');
    }
  });
}

// ── SETTINGS ──────────────────────────────
function saveUserName(name) {
  saveState({ userName: name });
  renderGreeting();
}

// ── TEXT FORMATTER ─────────────────────────
function fmt(text) {
  return text
    .replace(/###\s*(.*)/g,'<h3>$1</h3>')
    .replace(/##\s*(.*)/g,'<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/^-\s+(.*)/gm,'<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, m => '<ul>'+m+'</ul>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/^(?!<[hul])(.*\S.*)/gm,'<p>$1</p>')
    .replace(/<p><\/p>/g,'');
}

// ── INIT ───────────────────────────────────
function init() {
  // restore saved state
  const s = loadState();

  // theme
  if (s.theme) {
    isDark = s.theme === 'dark';
    document.documentElement.setAttribute('data-theme', s.theme);
    document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
    const tog = document.getElementById('theme-toggle-settings');
    if (tog) tog.checked = isDark;
  }

  // language
  if (s.lang) {
    currentLang = s.lang;
    document.getElementById('lang-btn').textContent = s.lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(el => {
      el.classList.toggle('active', el.getAttribute('onclick').includes(`'${s.lang}'`));
    });
  }
  applyI18n();

  // username
  if (s.userName) {
    document.getElementById('user-name').textContent = s.userName;
    document.getElementById('user-avatar').textContent = s.userName[0].toUpperCase();
    const sn = document.getElementById('settings-name');
    if (sn) sn.value = s.userName;
  }

  // initial renders
  renderGreeting();
  renderTracking();
  renderCalendar();
  renderCourseGrid();
  renderStudyCourseList();
  initSearch();

  // restore last section
  if (s.lastSection && s.lastSection !== 'plan') navigate(s.lastSection);
}

document.addEventListener('DOMContentLoaded', init);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
