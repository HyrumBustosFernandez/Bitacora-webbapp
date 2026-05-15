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
    study_sub:'AI-powered summaries, flashcards and quizzes',
    select_course:'Select course',
    mode_summary:'Summary', mode_flashcards:'Flashcards', mode_quiz:'Quiz',
    gen_summary:'Generate summary', gen_flashcards:'Generate flashcards', gen_quiz:'Generate quiz',
    empty_summary:'Select a module and generate a summary',
    empty_flashcards:'Generate flashcards to review key terms',
    empty_quiz:'Generate a quiz to test your knowledge',
    score_label:'Score:', progress_sub:'Completion by course',
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
    generating:'Generating...', error_retry:'Error. Try again.',
    regenerate:'↺ Regenerate',
    prev:'← Prev', next:'Next →',
    click_flip:'Click to flip',
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
    study_sub:'Resúmenes, flashcards y quizzes con IA',
    select_course:'Selecciona curso',
    mode_summary:'Resumen', mode_flashcards:'Flashcards', mode_quiz:'Quiz',
    gen_summary:'Generar resumen', gen_flashcards:'Generar flashcards', gen_quiz:'Generar quiz',
    empty_summary:'Selecciona un módulo y genera el resumen',
    empty_flashcards:'Genera flashcards para repasar términos clave',
    empty_quiz:'Genera un quiz para testear tus conocimientos',
    score_label:'Puntaje:', progress_sub:'Completado por curso',
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
    generating:'Generando...', error_retry:'Error. Intenta de nuevo.',
    regenerate:'↺ Regenerar',
    prev:'← Anterior', next:'Siguiente →',
    click_flip:'Clic para voltear',
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
    study_sub:'Résumés, flashcards et quiz IA',
    select_course:'Sélectionner cours',
    mode_summary:'Résumé', mode_flashcards:'Flashcards', mode_quiz:'Quiz',
    gen_summary:'Générer résumé', gen_flashcards:'Générer flashcards', gen_quiz:'Générer quiz',
    empty_summary:'Sélectionnez un module et générez un résumé',
    empty_flashcards:'Générez des flashcards pour réviser',
    empty_quiz:'Générez un quiz pour tester vos connaissances',
    score_label:'Score:', progress_sub:'Complétion par cours',
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
    generating:'Génération...', error_retry:'Erreur. Réessayez.',
    regenerate:'↺ Régénérer',
    prev:'← Préc', next:'Suiv →',
    click_flip:'Cliquez pour retourner',
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
    study_sub:'AI 요약, 플래시카드, 퀴즈',
    select_course:'과정 선택',
    mode_summary:'요약', mode_flashcards:'플래시카드', mode_quiz:'퀴즈',
    gen_summary:'요약 생성', gen_flashcards:'플래시카드 생성', gen_quiz:'퀴즈 생성',
    empty_summary:'모듈을 선택하고 요약을 생성하세요',
    empty_flashcards:'플래시카드를 생성하여 용어를 복습하세요',
    empty_quiz:'퀴즈를 생성하여 지식을 테스트하세요',
    score_label:'점수:', progress_sub:'과정별 완료율',
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
    generating:'생성 중...', error_retry:'오류. 다시 시도하세요.',
    regenerate:'↺ 재생성',
    prev:'← 이전', next:'다음 →',
    click_flip:'클릭하여 뒤집기',
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
    study_sub:'AIによる要約・フラッシュカード・クイズ',
    select_course:'コース選択',
    mode_summary:'要約', mode_flashcards:'フラッシュカード', mode_quiz:'クイズ',
    gen_summary:'要約を生成', gen_flashcards:'フラッシュカードを生成', gen_quiz:'クイズを生成',
    empty_summary:'モジュールを選択して要約を生成してください',
    empty_flashcards:'フラッシュカードを生成してキーワードを復習',
    empty_quiz:'クイズを生成して知識をテスト',
    score_label:'スコア:', progress_sub:'コース別完了率',
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
    generating:'生成中...', error_retry:'エラー。もう一度お試しください。',
    regenerate:'↺ 再生成',
    prev:'← 前へ', next:'次へ →',
    click_flip:'クリックして裏返す',
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
let flashcards = [], flashIdx = 0, flashFlipped = false;
let quizData = [], quizScore = 0, quizAnswered = 0;

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
  const emptyStates = [
    ['box-resumen', '📋', 'empty_summary'],
    ['fc-area', '🃏', 'empty_flashcards'],
    ['quiz-area', '🎯', 'empty_quiz'],
  ];
  emptyStates.forEach(([id, icon, key]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="empty-state"><span class="empty-icon">${icon}</span>${t(key)}</div>`;
  });
  document.getElementById('quiz-score').style.display = 'none';
  ['btn-resumen','btn-flash','btn-quiz'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.disabled = false; }
  });
  flashcards = []; quizData = [];
}

function switchSMode(name, el) {
  document.querySelectorAll('.smode').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.sview').forEach(v => v.classList.remove('active'));
  document.getElementById('sview-' + name).classList.add('active');
}

function getCourseContext() {
  const c = COURSES.find(x => x.id === currentStudyCourseId);
  return c ? `${c.num} - ${getSavedTitle(c.id) || c.title} (${c.type})` : '';
}

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  return data.content[0].text;
}

async function generateResumen() {
  const btn = document.getElementById('btn-resumen');
  const box = document.getElementById('box-resumen');
  btn.disabled = true; btn.querySelector('span').textContent = t('generating');
  box.innerHTML = ''; box.classList.add('loading');
  try {
    const lang = currentLang === 'en' ? 'English' : currentLang === 'es' ? 'Spanish' : currentLang === 'fr' ? 'French' : currentLang === 'ko' ? 'Korean' : 'Japanese';
    const text = await callClaude(`You are an instructor for the course "${getCourseContext()}" (Cisco NetAcad / Microsoft Learn, CCST Cybersecurity or Microsoft fundamentals certification). Generate a concise study summary for the topic: ${currentStudyTopic}. Use ### for section headers. Bold **key terms**. Include: key concepts, types/categories, 3-4 exam-likely points. Respond in ${lang}. Be concrete and practical.`);
    box.classList.remove('loading');
    box.innerHTML = '<div class="ai-content">' + fmt(text) + '</div>';
  } catch(e) {
    box.classList.remove('loading');
    box.innerHTML = `<div class="empty-state">${t('error_retry')}</div>`;
  }
  btn.disabled = false; btn.querySelector('span').textContent = t('regenerate');
}

async function generateFlashcards() {
  const btn = document.getElementById('btn-flash');
  const area = document.getElementById('fc-area');
  btn.disabled = true; btn.querySelector('span').textContent = t('generating');
  area.innerHTML = '<div class="ai-box loading" style="min-height:80px"></div>';
  try {
    const lang = currentLang === 'en' ? 'English' : currentLang === 'es' ? 'Spanish' : currentLang === 'fr' ? 'French' : currentLang === 'ko' ? 'Korean' : 'Japanese';
    const text = await callClaude(`Generate exactly 8 flashcards for the topic "${currentStudyTopic}" from the course "${getCourseContext()}". Respond ONLY in valid JSON, no markdown, no backticks: [{"term":"term","def":"1-2 sentence definition"}]. Terms must be the most important for the exam. Respond in ${lang}.`);
    let clean = text.trim().replace(/```json|```/g,'').trim();
    const s = clean.indexOf('['), e = clean.lastIndexOf(']');
    flashcards = JSON.parse(clean.substring(s, e+1));
    flashIdx = 0; flashFlipped = false;
    renderFlashcard();
  } catch(e) {
    area.innerHTML = `<div class="empty-state">${t('error_retry')}</div>`;
  }
  btn.disabled = false; btn.querySelector('span').textContent = t('regenerate');
}

function renderFlashcard() {
  const area = document.getElementById('fc-area');
  if (!flashcards.length) return;
  const card = flashcards[flashIdx];
  flashFlipped = false;
  area.innerHTML = `
    <div class="fc-wrap">
      <div class="fc" id="fc-card" onclick="flipFC()">
        <div class="fc-face fc-front">
          <div class="fc-label">${flashIdx+1} / ${flashcards.length}</div>
          <div class="fc-term">${card.term}</div>
          <div class="fc-hint">${t('click_flip')}</div>
        </div>
        <div class="fc-face fc-back">
          <div class="fc-label">Definition</div>
          <div class="fc-def">${card.def}</div>
        </div>
      </div>
    </div>
    <div class="fc-nav">
      <button class="fc-nav-btn" onclick="prevFC()">${t('prev')}</button>
      <span class="fc-counter">${flashIdx+1} / ${flashcards.length}</span>
      <button class="fc-nav-btn" onclick="nextFC()">${t('next')}</button>
    </div>`;
}
function flipFC() { const fc = document.getElementById('fc-card'); flashFlipped=!flashFlipped; fc.classList.toggle('flipped',flashFlipped); }
function nextFC() { flashIdx=(flashIdx+1)%flashcards.length; renderFlashcard(); }
function prevFC() { flashIdx=(flashIdx-1+flashcards.length)%flashcards.length; renderFlashcard(); }

async function generateQuiz() {
  const btn = document.getElementById('btn-quiz');
  const area = document.getElementById('quiz-area');
  btn.disabled = true; btn.querySelector('span').textContent = t('generating');
  area.innerHTML = '<div class="ai-box loading" style="min-height:80px"></div>';
  document.getElementById('quiz-score').style.display = 'none';
  quizScore = 0; quizAnswered = 0;
  try {
    const lang = currentLang === 'en' ? 'English' : currentLang === 'es' ? 'Spanish' : currentLang === 'fr' ? 'French' : currentLang === 'ko' ? 'Korean' : 'Japanese';
    const text = await callClaude(`Generate 5 multiple choice questions for the certification exam of the course "${getCourseContext()}" on the topic: "${currentStudyTopic}". Respond ONLY in valid JSON, no markdown: [{"q":"question","opts":["A) opt","B) opt","C) opt","D) opt"],"correct":0,"exp":"brief explanation"}]. "correct" is the 0-indexed answer. Certification-exam level. Respond in ${lang}.`);
    let clean = text.trim().replace(/```json|```/g,'').trim();
    const s = clean.indexOf('['), e = clean.lastIndexOf(']');
    quizData = JSON.parse(clean.substring(s, e+1));
    renderQuiz();
  } catch(e) {
    area.innerHTML = `<div class="empty-state">${t('error_retry')}</div>`;
  }
  btn.disabled = false; btn.querySelector('span').textContent = t('regenerate');
}

function renderQuiz() {
  const area = document.getElementById('quiz-area');
  document.getElementById('quiz-score').style.display = 'flex';
  document.getElementById('score-val').textContent = `0/${quizData.length}`;
  area.innerHTML = quizData.map((q,qi) => `
    <div class="q-block" id="qb-${qi}">
      <div class="q-num">Q${qi+1} / ${quizData.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="options">${q.opts.map((o,oi) => `
        <div class="opt" id="opt-${qi}-${oi}" onclick="answerQ(${qi},${oi})">
          <span class="opt-l">${String.fromCharCode(65+oi)})</span>
          <span>${o.replace(/^[A-D]\)\s*/,'')}</span>
        </div>`).join('')}
      </div>
      <div class="opt-expl" id="exp-${qi}">${q.exp}</div>
    </div>`).join('');
}

function answerQ(qi, oi) {
  const q = quizData[qi];
  document.querySelectorAll(`#qb-${qi} .opt`).forEach(o => { o.classList.add('disabled'); o.onclick=null; });
  document.getElementById(`opt-${qi}-${oi}`).classList.add(oi===q.correct?'correct':'wrong');
  document.getElementById(`opt-${qi}-${q.correct}`).classList.add('correct');
  document.getElementById(`exp-${qi}`).classList.add('show');
  if (oi === q.correct) quizScore++;
  quizAnswered++;
  document.getElementById('score-val').textContent = `${quizScore}/${quizAnswered}`;
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
