export type Lang = 'en' | 'es' | 'pt';

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

export const LANG_FLAGS: Record<Lang, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  pt: '🇧🇷',
};

const STORAGE_KEY = 'paceup_lang';

export function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'en' || v === 'es' || v === 'pt') return v;
  return 'en';
}

export function setStoredLang(lang: Lang) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
}

/* ── App-level translations ── */
export type AppStrings = {
  nav: { home: string; courses: string; study: string; calendar: string; overview: string; settings: string; assistant: string; };
  today: string;
  tomorrow: string;
  todayTip: string;
  tomorrowTip: string;
  settings: { appearance: string; theme: string; background: string; language: string; noBackground: string; accessibility: string; };
};

export const APP: Record<Lang, AppStrings> = {
  en: {
    nav: { home: 'Home', courses: 'Courses', study: 'Study', calendar: 'Calendar', overview: 'Overview', settings: 'Settings', assistant: 'AI Assistant' },
    today: 'Today', tomorrow: 'Tomorrow',
    todayTip: 'These cards are the study modules scheduled for today. Tap to mark them complete.',
    tomorrowTip: "These are tomorrow's study modules. Review them so you're ready.",
    settings: { appearance: 'Appearance', theme: 'Theme', background: 'Background', language: 'Language', noBackground: 'None', accessibility: 'Accessibility' },
  },
  es: {
    nav: { home: 'Inicio', courses: 'Cursos', study: 'Estudio', calendar: 'Calendario', overview: 'Resumen', settings: 'Ajustes', assistant: 'Asistente IA' },
    today: 'Hoy', tomorrow: 'Mañana',
    todayTip: 'Estas tarjetas son los módulos de estudio programados para hoy. Toca para marcarlos completos.',
    tomorrowTip: 'Estos son los módulos de estudio de mañana. Revísalos para estar preparado.',
    settings: { appearance: 'Apariencia', theme: 'Tema', background: 'Fondo', language: 'Idioma', noBackground: 'Ninguno', accessibility: 'Accesibilidad' },
  },
  pt: {
    nav: { home: 'Início', courses: 'Cursos', study: 'Estudo', calendar: 'Calendário', overview: 'Visão geral', settings: 'Configurações', assistant: 'Assistente IA' },
    today: 'Hoje', tomorrow: 'Amanhã',
    todayTip: 'Estes cartões são os módulos de estudo agendados para hoje. Toque para marcá-los como concluídos.',
    tomorrowTip: 'Estes são os módulos de estudo de amanhã. Revise-os para estar preparado.',
    settings: { appearance: 'Aparência', theme: 'Tema', background: 'Fundo', language: 'Idioma', noBackground: 'Nenhum', accessibility: 'Acessibilidade' },
  },
};

/* ── Landing page translations ── */
type LandingStrings = {
  badge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  startFree: string;
  viewSource: string;
  featuresTitle: string;
  featuresSub: string;
  whyTitle: string;
  faqTitle: string;
  openApp: string;
  footerCopy: string;
  features: { title: string; desc: string }[];
  why: string[];
  faq: { q: string; a: string }[];
};

export const LANDING: Record<Lang, LandingStrings> = {
  en: {
    badge: 'Certification Prep Tool',
    heroTitle1: 'Study smarter.',
    heroTitle2: 'Pass faster.',
    heroSub: 'The student productivity tracker built for certification prep. Know exactly what to study, track your progress, and never fall behind again.',
    startFree: 'Start for free',
    viewSource: 'View source',
    openApp: 'Open App',
    featuresTitle: 'Everything you need to pass.',
    featuresSub: 'Built for focused, deadline-driven certification study — not generic note-taking.',
    whyTitle: 'Why PaceUp?',
    faqTitle: 'Frequently asked questions',
    footerCopy: '© 2026 PaceUp',
    features: [
      { title: 'Focused Study Plans',   desc: 'Course-aware task management designed for certification prep — not generic productivity apps.' },
      { title: 'Progress Tracking',     desc: 'Know exactly how far you are, how far behind, and what to study today to catch up.' },
      { title: 'Calendar & Tasks',      desc: 'Visual calendar with tasks, events, and daily agenda. Never miss a deadline.' },
      { title: 'Pomodoro Study Timer',  desc: 'Built-in focus timer with session history to build consistent study habits.' },
      { title: 'Quick Study Mode',      desc: 'Only have 15 minutes? PaceUp tells you exactly what to study for maximum impact.' },
      { title: 'Exam Countdown',        desc: 'Track days remaining to each exam with urgency-aware priority sorting.' },
    ],
    why: [
      'Built for certification prep — not generic task management',
      'Local-first: your data stays on your device, no account needed',
      'Designed for the student who needs to pass, not just plan',
      'Track exactly how far behind you are and what to study next',
    ],
    faq: [
      { q: 'Is PaceUp free?', a: 'Yes, completely free. No account required — all data is stored locally on your device.' },
      { q: 'Which certifications does PaceUp support?', a: 'It comes pre-loaded with Cisco CCST and Microsoft certification tracks, with custom course support coming soon.' },
      { q: 'Does my data sync across devices?', a: 'Currently local-only. Cloud sync is on the roadmap — your data stays on device until then.' },
      { q: 'Can I use it on mobile?', a: 'Yes — PaceUp is fully responsive with a dedicated mobile navigation bar.' },
      { q: 'Do I need to create an account?', a: 'Not yet. The app works immediately in demo mode. Accounts will be optional when cloud sync launches.' },
      { q: 'Is the source code available?', a: 'Yes — PaceUp is open source on GitHub. Pull requests and feedback are welcome.' },
    ],
  },

  es: {
    badge: 'Herramienta de Preparación para Certificaciones',
    heroTitle1: 'Estudia más inteligente.',
    heroTitle2: 'Aprueba más rápido.',
    heroSub: 'El rastreador de productividad estudiantil diseñado para la preparación de certificaciones. Sabe exactamente qué estudiar, rastrea tu progreso y nunca te quedes atrás.',
    startFree: 'Comenzar gratis',
    viewSource: 'Ver código fuente',
    openApp: 'Abrir app',
    featuresTitle: 'Todo lo que necesitas para aprobar.',
    featuresSub: 'Construido para el estudio enfocado con plazos — no para tomar notas genéricas.',
    whyTitle: '¿Por qué PaceUp?',
    faqTitle: 'Preguntas frecuentes',
    footerCopy: '© 2026 PaceUp',
    features: [
      { title: 'Planes de Estudio Enfocados',     desc: 'Gestión de tareas orientada a cursos, diseñada para preparación de certificaciones.' },
      { title: 'Seguimiento de Progreso',          desc: 'Sabe exactamente cuán lejos estás, qué tan retrasado y qué estudiar hoy para ponerte al día.' },
      { title: 'Calendario y Tareas',              desc: 'Calendario visual con tareas, eventos y agenda diaria. Nunca pierdas una fecha límite.' },
      { title: 'Temporizador Pomodoro',            desc: 'Temporizador de enfoque integrado con historial de sesiones para construir hábitos de estudio consistentes.' },
      { title: 'Modo Estudio Rápido',              desc: '¿Solo tienes 15 minutos? PaceUp te dice exactamente qué estudiar para el máximo impacto.' },
      { title: 'Cuenta Regresiva del Examen',      desc: 'Rastrea los días restantes para cada examen con ordenamiento de prioridades por urgencia.' },
    ],
    why: [
      'Construido para preparación de certificaciones — no gestión genérica de tareas',
      'Local primero: tus datos permanecen en tu dispositivo, sin necesidad de cuenta',
      'Diseñado para el estudiante que necesita aprobar, no solo planear',
      'Rastrea exactamente cuánto te has retrasado y qué estudiar a continuación',
    ],
    faq: [
      { q: '¿PaceUp es gratuito?', a: 'Sí, completamente gratis. No se requiere cuenta — todos los datos se almacenan localmente en tu dispositivo.' },
      { q: '¿Qué certificaciones admite PaceUp?', a: 'Viene precargado con los cursos de Cisco CCST y certificaciones de Microsoft, con soporte de cursos personalizados próximamente.' },
      { q: '¿Mis datos se sincronizan entre dispositivos?', a: 'Actualmente solo local. La sincronización en la nube está en la hoja de ruta.' },
      { q: '¿Puedo usarlo en móvil?', a: 'Sí — PaceUp es completamente responsivo con una barra de navegación móvil dedicada.' },
      { q: '¿Necesito crear una cuenta?', a: 'Todavía no. La app funciona inmediatamente en modo demo.' },
      { q: '¿El código fuente está disponible?', a: 'Sí — PaceUp es de código abierto en GitHub. Se bienvenidos los pull requests y comentarios.' },
    ],
  },

  pt: {
    badge: 'Ferramenta de Preparação para Certificações',
    heroTitle1: 'Estude de forma mais inteligente.',
    heroTitle2: 'Passe mais rápido.',
    heroSub: 'O rastreador de produtividade estudantil criado para preparação de certificações. Saiba exatamente o que estudar, acompanhe seu progresso e nunca fique para trás.',
    startFree: 'Começar gratuitamente',
    viewSource: 'Ver código-fonte',
    openApp: 'Abrir app',
    featuresTitle: 'Tudo o que você precisa para passar.',
    featuresSub: 'Criado para estudo focado com prazos — não para anotações genéricas.',
    whyTitle: 'Por que PaceUp?',
    faqTitle: 'Perguntas frequentes',
    footerCopy: '© 2026 PaceUp',
    features: [
      { title: 'Planos de Estudo Focados',       desc: 'Gerenciamento de tarefas orientado a cursos, projetado para preparação de certificações.' },
      { title: 'Acompanhamento de Progresso',    desc: 'Saiba exatamente o quão longe você está, o quanto está atrasado e o que estudar hoje para se atualizar.' },
      { title: 'Calendário e Tarefas',           desc: 'Calendário visual com tarefas, eventos e agenda diária. Nunca perca um prazo.' },
      { title: 'Temporizador Pomodoro',          desc: 'Temporizador de foco integrado com histórico de sessões para construir hábitos de estudo consistentes.' },
      { title: 'Modo Estudo Rápido',             desc: 'Tem apenas 15 minutos? O PaceUp diz exatamente o que estudar para máximo impacto.' },
      { title: 'Contagem Regressiva do Exame',   desc: 'Acompanhe os dias restantes para cada exame com ordenação de prioridades por urgência.' },
    ],
    why: [
      'Criado para preparação de certificações — não gestão de tarefas genérica',
      'Local primeiro: seus dados ficam no seu dispositivo, sem conta necessária',
      'Projetado para o estudante que precisa passar, não apenas planejar',
      'Acompanhe exatamente o quanto está atrasado e o que estudar a seguir',
    ],
    faq: [
      { q: 'O PaceUp é gratuito?', a: 'Sim, completamente gratuito. Não é necessária conta — todos os dados são armazenados localmente no seu dispositivo.' },
      { q: 'Quais certificações o PaceUp suporta?', a: 'Vem pré-carregado com os cursos Cisco CCST e certificações Microsoft, com suporte a cursos personalizados em breve.' },
      { q: 'Meus dados sincronizam entre dispositivos?', a: 'Atualmente apenas local. A sincronização em nuvem está no roadmap.' },
      { q: 'Posso usar no celular?', a: 'Sim — o PaceUp é totalmente responsivo com uma barra de navegação móvel dedicada.' },
      { q: 'Preciso criar uma conta?', a: 'Ainda não. O app funciona imediatamente no modo demo.' },
      { q: 'O código-fonte está disponível?', a: 'Sim — o PaceUp é open source no GitHub. Pull requests e feedbacks são bem-vindos.' },
    ],
  },
};
