export interface CourseItem {
  id: string;
  name: string;
  sub?: string;
  day?: string;
  done?: boolean;
  partial?: boolean;
  exam?: boolean;
}

export interface CourseWeek {
  id: string;
  tag: string;
  label: string;
  name: string;
  dates?: string;
  items: CourseItem[];
  tip?: string;
}

export interface Course {
  id: string;
  num: string;
  tag: 'cisco' | 'ms' | 'custom';
  accent: string;
  hours: string;
  hoursNumeric: number;
  type: string;
  title: string;
  studyTopics: string[];
  weeks: CourseWeek[];
  deadlineDate: string; // YYYY-MM-DD
}

export const START_DATE  = new Date('2026-05-12T00:00:00');
export const TARGET_DATE = new Date('2026-06-10T23:59:59');

export const COURSES: Course[] = [
  {
    id: 'c01', num: '01', tag: 'cisco', accent: '#5b9cf6', hours: '~6h', hoursNumeric: 6,
    type: 'CCST Ciberseguridad',
    title: 'Introducción a Ciberseguridad',
    deadlineDate: '2026-06-01',
    studyTopics: [
      'Módulo 2: Ataques y malware',
      'Módulo 3: Protección de datos',
      'Módulo 4: Protegiendo la organización',
      'Módulo 5: Futuro en ciberseguridad',
    ],
    weeks: [
      {
        id: 'c01-w0', tag: 'wb1', label: 'Week 1', name: 'Módulo 2 — Ataques, conceptos y técnicas',
        dates: 'May 12–18',
        tip: 'Módulo 2 is the densest. Finishing it this week gives you breathing room.',
        items: [
          { id: 'c01-w0-i0', name: 'Módulo 1 — Introducción a la Ciberseguridad', sub: '✓ Completado', day: '', done: true },
          { id: 'c01-w0-i1', name: '2.1 Analizando un ciberataque', sub: 'En progreso', day: 'Mon–Tue', partial: true },
          { id: 'c01-w0-i2', name: '2.2 Métodos de infiltración', day: 'Wed–Thu' },
          { id: 'c01-w0-i3', name: '2.3 Aprovechamiento de vulnerabilidades', day: 'Fri' },
          { id: 'c01-w0-i4', name: '2.4 El panorama de la ciberseguridad', day: 'Sat' },
          { id: 'c01-w0-i5', name: '2.5 Cuestionario Módulo 2', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c01-w1', tag: 'wb2', label: 'Week 2', name: 'Módulo 3 — Protegiendo sus datos',
        dates: 'May 19–25',
        tip: 'Usually shorter. If you finish early, start Módulo 4.',
        items: [
          { id: 'c01-w1-i0', name: 'Módulo 3 completo', sub: 'Mon–Fri, quiz Friday', day: 'Mon–Fri' },
          { id: 'c01-w1-i1', name: 'Cuestionario Módulo 3', day: 'Fri', exam: true },
        ],
      },
      {
        id: 'c01-w2', tag: 'wb3', label: 'Week 3', name: 'Módulos 4 & 5 + Final exam',
        dates: 'May 26–Jun 1',
        tip: "Reserve Friday for review. Don't leave the exam for the last minute.",
        items: [
          { id: 'c01-w2-i0', name: 'Módulo 4 — Protegiendo a la organización', day: 'Mon–Wed' },
          { id: 'c01-w2-i1', name: 'Módulo 5 — ¿Tu futuro en ciberseguridad?', sub: "Don't skip", day: 'Thu' },
          { id: 'c01-w2-i2', name: 'Encuesta de fin de curso', day: 'Fri' },
          { id: 'c01-w2-i3', name: 'Repaso general', day: 'Fri' },
          { id: 'c01-w2-i4', name: 'Examen final del curso', sub: '~25–30 questions', day: 'Sat', exam: true },
        ],
      },
    ],
  },
  {
    id: 'c02', num: '02', tag: 'cisco', accent: '#34d399', hours: '~10h', hoursNumeric: 10,
    type: 'CCST Ciberseguridad',
    title: 'Conceptos Básicos de Redes',
    deadlineDate: '2026-06-14',
    studyTopics: [
      'Módulo 1–4: Fundamentos y redes domésticas',
      'Módulo 5–11: Protocolos e IP',
      'Módulo 12–17: Enrutamiento y protocolos',
    ],
    weeks: [
      {
        id: 'c02-w0', tag: 'wb1', label: 'Week 1', name: 'Modules 1–4 — Fundamentos',
        dates: 'May 19–25',
        tip: 'Introductory week. Build vocab before diving into IP.',
        items: [
          { id: 'c02-w0-i0', name: 'Intro del curso', sub: '33% done', day: 'Mon' },
          { id: 'c02-w0-i1', name: 'Módulo 1 — Comunicación en un Mundo Conectado', day: 'Mon–Tue' },
          { id: 'c02-w0-i2', name: 'Módulo 2 — Componentes, tipos y conexiones', day: 'Wed' },
          { id: 'c02-w0-i3', name: 'Módulo 3 — Redes inalámbricas y móviles', day: 'Thu' },
          { id: 'c02-w0-i4', name: 'Módulo 4 — Crear una Red Doméstica', day: 'Fri–Sat' },
          { id: 'c02-w0-i5', name: 'Examen parcial: Construir una red pequeña', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c02-w1', tag: 'wb2', label: 'Week 2', name: 'Modules 5–11 — IP ⚠️',
        dates: 'May 26–Jun 1',
        tip: "⚠️ Hardest week. Don't move on if subnetting isn't clear.",
        items: [
          { id: 'c02-w1-i0', name: 'Módulo 5 — Principios de Comunicación', sub: 'OSI/TCP-IP', day: 'Mon' },
          { id: 'c02-w1-i1', name: 'Módulo 6 — Medios de red', day: 'Mon' },
          { id: 'c02-w1-i2', name: 'Módulo 7 — La capa de acceso', sub: 'Ethernet', day: 'Tue' },
          { id: 'c02-w1-i3', name: 'Examen parcial: Acceso a la red', day: 'Tue', exam: true },
          { id: 'c02-w1-i4', name: 'Módulo 8 — IPv4', day: 'Wed' },
          { id: 'c02-w1-i5', name: 'Módulo 9 — IPv4 y subnetting', sub: 'Hardest topic', day: 'Thu' },
          { id: 'c02-w1-i6', name: 'Módulo 10 — IPv6', day: 'Fri' },
          { id: 'c02-w1-i7', name: 'Módulo 11 — DHCP', day: 'Sat' },
          { id: 'c02-w1-i8', name: 'Examen parcial: Protocolo de Internet', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c02-w2', tag: 'wb3', label: 'Week 3', name: 'Modules 12–17 — Routing & Protocols',
        dates: 'Jun 2–7',
        tip: 'Módulo 16 has 8 subsections — give it two days.',
        items: [
          { id: 'c02-w2-i0', name: 'Módulo 12 — Gateway y NAT', day: 'Mon' },
          { id: 'c02-w2-i1', name: 'Módulo 13 — ARP', day: 'Mon' },
          { id: 'c02-w2-i2', name: 'Módulo 14 — Enrutamiento', day: 'Tue' },
          { id: 'c02-w2-i3', name: 'Examen parcial: Comunicación entre Redes', day: 'Tue', exam: true },
          { id: 'c02-w2-i4', name: 'Módulo 15 — TCP y UDP', day: 'Wed' },
          { id: 'c02-w2-i5', name: 'Módulo 16 — Servicios de Aplicación', sub: 'DNS, HTTP, FTP, SSH — longest', day: 'Thu–Fri' },
          { id: 'c02-w2-i6', name: 'Módulo 17 — Utilidades de red', sub: 'ping, traceroute, ipconfig', day: 'Sat' },
          { id: 'c02-w2-i7', name: 'Examen parcial: Protocolos', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c02-w3', tag: 'wb4', label: 'Week 4', name: 'Review + Final exam',
        dates: 'Jun 8–14',
        tip: 'You finish June 14 — 16 days before deadline.',
        items: [
          { id: 'c02-w3-i0', name: 'Repaso módulos 1–11', day: 'Mon–Tue' },
          { id: 'c02-w3-i1', name: 'Repaso módulos 12–17', day: 'Wed' },
          { id: 'c02-w3-i2', name: 'Examen final del curso', day: 'Thu–Fri', exam: true },
          { id: 'c02-w3-i3', name: 'Encuesta final', day: 'Fri' },
        ],
      },
    ],
  },
  {
    id: 'c04', num: '04', tag: 'cisco', accent: '#f97316', hours: '~8h', hoursNumeric: 8,
    type: 'CCST Ciberseguridad',
    title: 'Seguridad de Terminales',
    deadlineDate: '2026-06-04',
    studyTopics: [
      'Módulo 1: Amenazas y ataques',
      'Módulo 2–6: Protección de redes',
      'Módulo 7–8: Windows y Linux',
      'Módulo 9–10: Protección de terminales',
    ],
    weeks: [
      {
        id: 'c04-w0', tag: 'wb1', label: 'Week 1', name: 'Módulos 1–6 — Amenazas y redes',
        dates: 'May 19–25',
        tip: '',
        items: [
          { id: 'c04-w0-i0', name: 'Módulo 1 — Amenazas, vulnerabilidades y ataques', day: 'Mon–Tue' },
          { id: 'c04-w0-i1', name: 'Módulo 2 — Protección de redes', day: 'Wed' },
          { id: 'c04-w0-i2', name: 'Módulo 3 — Ataque a los fundamentos', day: 'Thu' },
          { id: 'c04-w0-i3', name: 'Módulo 4 — Atacando lo que hacemos', day: 'Fri' },
          { id: 'c04-w0-i4', name: 'Módulo 5 — Comunicación inalámbrica', day: 'Sat' },
          { id: 'c04-w0-i5', name: 'Módulo 6 — Infraestructura de seguridad', day: 'Sat' },
          { id: 'c04-w0-i6', name: 'Examen parcial: Seguridad de la red', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c04-w1', tag: 'wb2', label: 'Week 2', name: 'Módulos 7–10 — OS & Endpoints',
        dates: 'May 26–Jun 1',
        tip: "Module 8 (Linux) is the longest — don't leave it for the last day.",
        items: [
          { id: 'c04-w1-i0', name: 'Módulo 7 — Sistema operativo Windows', sub: 'Architecture, config, security', day: 'Mon–Tue' },
          { id: 'c04-w1-i1', name: 'Módulo 8 — Linux', sub: 'Shell, servers, filesystem — 8 subsections', day: 'Wed–Thu' },
          { id: 'c04-w1-i2', name: 'Módulo 9 — Protección de terminales', day: 'Fri' },
          { id: 'c04-w1-i3', name: 'Módulo 10 — Principios de ciberseguridad', day: 'Sat' },
          { id: 'c04-w1-i4', name: 'Examen parcial: SO y seguridad', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c04-w2', tag: 'wb3', label: 'Week 3', name: 'Final exam',
        dates: 'Jun 2–4',
        tip: '',
        items: [
          { id: 'c04-w2-i0', name: 'Repaso general', day: 'Mon–Tue' },
          { id: 'c04-w2-i1', name: 'Examen final del curso', day: 'Wed', exam: true },
          { id: 'c04-w2-i2', name: 'Encuesta final', day: 'Wed' },
        ],
      },
    ],
  },
  {
    id: 'c05', num: '05', tag: 'cisco', accent: '#a78bfa', hours: '~12h', hoursNumeric: 12,
    type: 'CCST Ciberseguridad',
    title: 'Defensa de la Red',
    deadlineDate: '2026-06-14',
    studyTopics: [
      'Módulo 1–3: Defensa y control de acceso',
      'Módulo 4–8: Firewalls, nube y criptografía',
      'Módulo 9–11: Tecnologías y alertas',
    ],
    weeks: [
      {
        id: 'c05-w0', tag: 'wb1', label: 'Week 1', name: 'Módulos 1–3 — Defense & Access',
        dates: 'May 26–Jun 1',
        tip: 'Module 2 has 8 subsections — one of the longest.',
        items: [
          { id: 'c05-w0-i0', name: "Intro + Packet Tracer setup", sub: "Install if you haven't", day: 'Mon' },
          { id: 'c05-w0-i1', name: 'Módulo 1 — Comprendiendo qué es Defensa', day: 'Mon–Tue' },
          { id: 'c05-w0-i2', name: 'Módulo 2 — Defensa del sistema y la red', sub: '8 subsections', day: 'Wed–Thu' },
          { id: 'c05-w0-i3', name: 'Módulo 3 — Control de Acceso', sub: 'AAA, accounts', day: 'Fri' },
          { id: 'c05-w0-i4', name: 'Examen parcial: Principios de Defensa', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c05-w1', tag: 'wb2', label: 'Week 2', name: 'Módulos 4–8 — ACL, Firewalls, Cloud & Crypto',
        dates: 'Jun 2–8',
        tip: 'Module 8 (Cryptography) is conceptually dense — take your time with PKI.',
        items: [
          { id: 'c05-w1-i0', name: 'Módulo 4 — ACL', sub: 'Wildcard, IPv4/IPv6', day: 'Mon–Tue' },
          { id: 'c05-w1-i1', name: 'Módulo 5 — Firewalls', day: 'Wed' },
          { id: 'c05-w1-i2', name: 'Módulo 6 — ZPF', sub: 'Zone-based firewalls', day: 'Thu' },
          { id: 'c05-w1-i3', name: 'Módulo 7 — Seguridad en la nube', sub: 'VMs, virtualization', day: 'Fri' },
          { id: 'c05-w1-i4', name: 'Módulo 8 — Criptografía', sub: 'Hash, PKI, encryption', day: 'Sat' },
          { id: 'c05-w1-i5', name: 'Examen parcial: Firewalls, Crypto, Cloud', day: 'Sat', exam: true },
        ],
      },
      {
        id: 'c05-w2', tag: 'wb3', label: 'Week 3', name: 'Módulos 9–11 + Final',
        dates: 'Jun 9–14',
        tip: "Protect your review days — don't compress them.",
        items: [
          { id: 'c05-w2-i0', name: 'Módulo 9 — Tecnologías y protocolos', day: 'Mon' },
          { id: 'c05-w2-i1', name: 'Módulo 10 — Datos de seguridad de red', day: 'Tue' },
          { id: 'c05-w2-i2', name: 'Módulo 11 — Evaluar alertas', day: 'Wed' },
          { id: 'c05-w2-i3', name: 'Examen parcial: Evaluación de alertas', day: 'Wed', exam: true },
          { id: 'c05-w2-i4', name: 'Repaso general', day: 'Thu' },
          { id: 'c05-w2-i5', name: 'Examen final del curso', day: 'Fri', exam: true },
          { id: 'c05-w2-i6', name: 'Encuesta final', day: 'Fri' },
        ],
      },
    ],
  },
  {
    id: 'c06', num: '06', tag: 'cisco', accent: '#2dd4bf', hours: '~6h', hoursNumeric: 6,
    type: 'CCST Ciberseguridad',
    title: 'Administración de Amenazas Cibernéticas',
    deadlineDate: '2026-06-04',
    studyTopics: [
      'Módulo 1–3: Gobernanza y threat intelligence',
      'Módulo 4–5: Vulnerabilidades y riesgos',
      'Módulo 6: Forense e incidentes',
    ],
    weeks: [
      {
        id: 'c06-w0', tag: 'wb1', label: 'Week 1', name: 'Módulos 1–5 — Governance, Testing & Risk',
        dates: 'May 26–Jun 1',
        tip: 'More conceptual than technical — read carefully and take notes.',
        items: [
          { id: 'c06-w0-i0', name: 'Módulo 1 — Gestión y Cumplimiento', sub: 'Governance, ethics, frameworks', day: 'Mon' },
          { id: 'c06-w0-i1', name: 'Módulo 2 — Pruebas de Seguridad', sub: 'Pen testing, tools', day: 'Tue' },
          { id: 'c06-w0-i2', name: 'Módulo 3 — Inteligencia contra Amenazas', sub: 'Sources, services', day: 'Wed' },
          { id: 'c06-w0-i3', name: 'Módulo 4 — Evaluación de vulnerabilidades', sub: 'CVSS, profiles', day: 'Thu' },
          { id: 'c06-w0-i4', name: 'Módulo 5 — Administración de Riesgos', sub: 'Risk assessment, controls', day: 'Fri' },
          { id: 'c06-w0-i5', name: 'Examen parcial: Vulnerabilidad y Riesgos', day: 'Fri', exam: true },
        ],
      },
      {
        id: 'c06-w1', tag: 'wb2', label: 'Week 2', name: 'Módulo 6 + Final',
        dates: 'Jun 2–4',
        tip: 'Module 6 — Cyber Kill Chain and Diamond Model are exam favorites.',
        items: [
          { id: 'c06-w1-i0', name: 'Módulo 6 — Análisis Forense y Respuesta', sub: 'Kill Chain, Diamond Model, IR', day: 'Mon–Tue' },
          { id: 'c06-w1-i1', name: 'Examen parcial: Respuesta a incidentes', day: 'Tue', exam: true },
          { id: 'c06-w1-i2', name: 'Repaso general', day: 'Wed' },
          { id: 'c06-w1-i3', name: 'Examen final del curso', day: 'Wed', exam: true },
          { id: 'c06-w1-i4', name: 'Encuesta final', day: 'Wed' },
        ],
      },
    ],
  },
  {
    id: 'c07', num: '07', tag: 'ms', accent: '#34d399', hours: '~5.5h', hoursNumeric: 5.5,
    type: 'Microsoft Learn',
    title: 'Intro a Aplicaciones y Agentes de IA en Azure',
    deadlineDate: '2026-06-03',
    studyTopics: [
      'IA en Azure',
      'IA Generativa y Agentes',
      'Análisis de Texto',
      'Servicios de Voz',
      'Computer Vision',
      'Extracción de Información',
    ],
    weeks: [
      {
        id: 'c07-w0', tag: 'block', label: 'Block', name: '6 modules — complete in 2–3 days',
        dates: 'Jun 1–3',
        tip: 'Each module has a ~30 min hands-on exercise in Microsoft Foundry. Needs Azure account.',
        items: [
          { id: 'c07-w0-i0', name: 'Intro a la IA en Azure', sub: '56 min', day: 'Day 1' },
          { id: 'c07-w0-i1', name: 'IA Generativa y Agentes', sub: '58 min', day: 'Day 1' },
          { id: 'c07-w0-i2', name: 'Análisis de texto', sub: '45 min', day: 'Day 2' },
          { id: 'c07-w0-i3', name: 'Servicios de voz', sub: '47 min', day: 'Day 2' },
          { id: 'c07-w0-i4', name: 'Computer Vision', sub: '50 min', day: 'Day 3' },
          { id: 'c07-w0-i5', name: 'Extracción de información', sub: '43 min', day: 'Day 3' },
        ],
      },
    ],
  },
  {
    id: 'c08', num: '08', tag: 'ms', accent: '#f472b6', hours: '~3.3h', hoursNumeric: 3.3,
    type: 'Microsoft Learn',
    title: 'Conceptos de IA para Desarrolladores',
    deadlineDate: '2026-05-20',
    studyTopics: [
      'Fundamentos de IA',
      'IA Generativa y LLMs',
      'NLP',
      'Voz',
      'Computer Vision',
      'Extracción de información',
    ],
    weeks: [
      {
        id: 'c08-w0', tag: 'block', label: 'Block', name: '6 modules — complete in 1–2 days',
        dates: 'May 19–20',
        tip: 'Shortest course (~3h). Start here to build momentum.',
        items: [
          { id: 'c08-w0-i0', name: 'Introducción a los conceptos de IA', sub: '40 min', day: 'Day 1' },
          { id: 'c08-w0-i1', name: 'Intro a IA generativa y agentes', sub: '37 min', day: 'Day 1' },
          { id: 'c08-w0-i2', name: 'Conceptos de NLP', sub: '30 min', day: 'Day 1' },
          { id: 'c08-w0-i3', name: 'Conceptos de voz', sub: '28 min', day: 'Day 2' },
          { id: 'c08-w0-i4', name: 'Conceptos de Computer Vision', sub: '34 min', day: 'Day 2' },
          { id: 'c08-w0-i5', name: 'Extracción de información', sub: '28 min', day: 'Day 2' },
        ],
      },
    ],
  },
  {
    id: 'c09', num: '09', tag: 'ms', accent: '#60a5fa', hours: '~5.5h', hoursNumeric: 5.5,
    type: 'Microsoft Learn · AZ-900',
    title: 'Introducción a la Infraestructura en la Nube',
    deadlineDate: '2026-05-24',
    studyTopics: [
      'Conceptos de la nube',
      'Arquitectura y servicios de Azure',
      'Administración y gobernanza de Azure',
    ],
    weeks: [
      {
        id: 'c09-w0', tag: 'wb1', label: 'Part 1', name: 'Cloud concepts (~1h)',
        dates: 'May 21',
        tip: '',
        items: [
          { id: 'c09-w0-i0', name: 'Descripción de la informática en la nube', sub: '1/8 units done' },
          { id: 'c09-w0-i1', name: 'Ventajas de servicios en la nube' },
          { id: 'c09-w0-i2', name: 'Tipos de servicio en la nube', sub: 'IaaS, PaaS, SaaS' },
        ],
      },
      {
        id: 'c09-w1', tag: 'wb2', label: 'Part 2', name: 'Architecture & services (~3h)',
        dates: 'May 22–23',
        tip: 'Identity & security connects directly to your CCST courses.',
        items: [
          { id: 'c09-w1-i0', name: 'Componentes arquitectónicos de Azure' },
          { id: 'c09-w1-i1', name: 'Servicios de proceso', sub: 'VMs, containers, Functions' },
          { id: 'c09-w1-i2', name: 'Servicios de red', sub: 'VNet, VPN, DNS' },
          { id: 'c09-w1-i3', name: 'Servicios de almacenamiento' },
          { id: 'c09-w1-i4', name: 'Identidad, acceso y seguridad', sub: 'AAD, RBAC, Zero Trust' },
        ],
      },
      {
        id: 'c09-w2', tag: 'wb3', label: 'Part 3', name: 'Management & governance (~1.5h)',
        dates: 'May 24',
        tip: '',
        items: [
          { id: 'c09-w2-i0', name: 'Administración de costos' },
          { id: 'c09-w2-i1', name: 'Gobernanza y cumplimiento' },
          { id: 'c09-w2-i2', name: 'Administrar e implementar recursos' },
          { id: 'c09-w2-i3', name: 'Herramientas de supervisión' },
        ],
      },
    ],
  },
  {
    id: 'c10', num: '10', tag: 'ms', accent: '#fb923c', hours: '~6h', hoursNumeric: 6,
    type: 'Microsoft Learn · DP-900',
    title: 'Introducción a los Datos de Microsoft Azure',
    deadlineDate: '2026-05-28',
    studyTopics: [
      'Conceptos de datos',
      'Datos relacionales',
      'Datos no relacionales',
      'Análisis de datos',
    ],
    weeks: [
      {
        id: 'c10-w0', tag: 'wb1', label: 'Part 1', name: 'Core data concepts',
        dates: 'May 25',
        tip: '',
        items: [
          { id: 'c10-w0-i0', name: 'Conceptos de datos principales', sub: '2/8 units done' },
          { id: 'c10-w0-i1', name: 'Roles y servicios de datos' },
        ],
      },
      {
        id: 'c10-w1', tag: 'wb2', label: 'Part 2', name: 'Relational data',
        dates: 'May 26',
        tip: '',
        items: [
          { id: 'c10-w1-i0', name: 'Fundamentos de datos relacionales', sub: 'SQL, normalization' },
          { id: 'c10-w1-i1', name: 'Servicios de BD relacionales', sub: 'Azure SQL, MySQL, PostgreSQL' },
        ],
      },
      {
        id: 'c10-w2', tag: 'wb3', label: 'Part 3', name: 'Non-relational data',
        dates: 'May 27',
        tip: '',
        items: [
          { id: 'c10-w2-i0', name: 'Azure Storage para datos no relacionales', sub: 'Blob, Data Lake, Tables' },
          { id: 'c10-w2-i1', name: 'Azure Cosmos DB', sub: 'APIs, global scale' },
        ],
      },
      {
        id: 'c10-w3', tag: 'wb4', label: 'Part 4', name: 'Data analytics',
        dates: 'May 28',
        tip: 'Most hands-on part — includes Fabric and Power BI exercises.',
        items: [
          { id: 'c10-w3-i0', name: 'Análisis a gran escala', sub: 'Data warehouse, Fabric' },
          { id: 'c10-w3-i1', name: 'Análisis en tiempo real', sub: 'Streaming, Spark' },
          { id: 'c10-w3-i2', name: 'Visualización de datos', sub: 'Power BI' },
        ],
      },
    ],
  },
];
