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
  tag: 'cisco' | 'ms' | 'custom' | 'stem' | 'humanities' | 'social';
  accent: string;
  hours: string;
  hoursNumeric: number;
  type: string;
  title: string;
  studyTopics: string[];
  weeks: CourseWeek[];
  deadlineDate: string; // YYYY-MM-DD
}

export const START_DATE  = new Date('2026-09-01T00:00:00');
export const TARGET_DATE = new Date('2026-12-20T23:59:59');

export const COURSES: Course[] = [
  // ── 1. Calculus I ──────────────────────────────────────────────────────────
  {
    id: 'c01', num: '01', tag: 'stem', accent: '#3b82f6', hours: '~10h', hoursNumeric: 10,
    type: 'Mathematics',
    title: 'Calculus I',
    deadlineDate: '2026-10-31',
    studyTopics: [
      'Limits & Continuity',
      'Derivatives & Differentiation Rules',
      'Applications of Derivatives',
      'Introduction to Integration',
    ],
    weeks: [
      {
        id: 'c01-w0', tag: 'wb1', label: 'Unit 1', name: 'Limits & Continuity',
        dates: 'Sep 1–14',
        tip: 'Limits are the foundation of everything — spend extra time here.',
        items: [
          { id: 'c01-w0-i0', name: 'Introduction to limits', sub: 'Intuitive approach', day: 'Week 1' },
          { id: 'c01-w0-i1', name: 'Computing limits algebraically', day: 'Week 1' },
          { id: 'c01-w0-i2', name: 'Continuity & one-sided limits', day: 'Week 2' },
          { id: 'c01-w0-i3', name: 'Limits at infinity', day: 'Week 2' },
          { id: 'c01-w0-i4', name: 'Quiz — Limits', day: 'Week 2', exam: true },
        ],
      },
      {
        id: 'c01-w1', tag: 'wb2', label: 'Unit 2', name: 'Derivatives',
        dates: 'Sep 15–Oct 5',
        tip: 'Practice differentiation rules daily — repetition locks them in.',
        items: [
          { id: 'c01-w1-i0', name: 'Definition of the derivative', day: 'Week 3' },
          { id: 'c01-w1-i1', name: 'Power, product & quotient rules', day: 'Week 3–4' },
          { id: 'c01-w1-i2', name: 'Chain rule & implicit differentiation', day: 'Week 4–5' },
          { id: 'c01-w1-i3', name: 'Derivatives of trig & exponential functions', day: 'Week 5' },
          { id: 'c01-w1-i4', name: 'Midterm exam', day: 'Week 5', exam: true },
        ],
      },
      {
        id: 'c01-w2', tag: 'wb3', label: 'Unit 3', name: 'Applications & Integration',
        dates: 'Oct 6–31',
        tip: 'Related rates trips up many students — draw diagrams.',
        items: [
          { id: 'c01-w2-i0', name: 'Curve sketching & optimization', day: 'Week 6–7' },
          { id: 'c01-w2-i1', name: 'Related rates', day: 'Week 7' },
          { id: 'c01-w2-i2', name: 'Antiderivatives & indefinite integrals', day: 'Week 8' },
          { id: 'c01-w2-i3', name: 'The definite integral & area', day: 'Week 8' },
          { id: 'c01-w2-i4', name: 'Fundamental Theorem of Calculus', day: 'Week 8' },
          { id: 'c01-w2-i5', name: 'Final exam', day: 'Week 9', exam: true },
        ],
      },
    ],
  },

  // ── 2. General Physics ─────────────────────────────────────────────────────
  {
    id: 'c02', num: '02', tag: 'stem', accent: '#10b981', hours: '~12h', hoursNumeric: 12,
    type: 'Science',
    title: 'General Physics I',
    deadlineDate: '2026-11-15',
    studyTopics: [
      'Kinematics & Dynamics',
      'Work, Energy & Momentum',
      'Rotational Motion',
      'Thermodynamics',
    ],
    weeks: [
      {
        id: 'c02-w0', tag: 'wb1', label: 'Unit 1', name: 'Mechanics — Motion & Forces',
        dates: 'Sep 1–21',
        tip: "Newton's laws seem simple but applying them takes practice. Do every problem set.",
        items: [
          { id: 'c02-w0-i0', name: 'Kinematics in 1D & 2D', sub: 'Velocity, acceleration, projectiles', day: 'Week 1–2' },
          { id: 'c02-w0-i1', name: "Newton's Laws of Motion", day: 'Week 2–3' },
          { id: 'c02-w0-i2', name: 'Friction & circular motion', day: 'Week 3' },
          { id: 'c02-w0-i3', name: 'Quiz — Mechanics', day: 'Week 3', exam: true },
        ],
      },
      {
        id: 'c02-w1', tag: 'wb2', label: 'Unit 2', name: 'Energy, Momentum & Rotation',
        dates: 'Sep 22–Oct 19',
        tip: 'Conservation laws make hard problems easy — learn them cold.',
        items: [
          { id: 'c02-w1-i0', name: 'Work & kinetic energy', day: 'Week 4' },
          { id: 'c02-w1-i1', name: 'Potential energy & conservation of energy', day: 'Week 4–5' },
          { id: 'c02-w1-i2', name: 'Linear momentum & collisions', day: 'Week 5–6' },
          { id: 'c02-w1-i3', name: 'Rotational kinematics & dynamics', day: 'Week 6–7' },
          { id: 'c02-w1-i4', name: 'Midterm exam', day: 'Week 7', exam: true },
        ],
      },
      {
        id: 'c02-w2', tag: 'wb3', label: 'Unit 3', name: 'Waves & Thermodynamics',
        dates: 'Oct 20–Nov 15',
        tip: 'Temperature vs. heat is a classic conceptual trap — know the difference.',
        items: [
          { id: 'c02-w2-i0', name: 'Simple harmonic motion & waves', day: 'Week 8–9' },
          { id: 'c02-w2-i1', name: 'Temperature, heat & thermal expansion', day: 'Week 9' },
          { id: 'c02-w2-i2', name: 'Laws of thermodynamics', day: 'Week 10' },
          { id: 'c02-w2-i3', name: 'Heat engines & entropy', day: 'Week 10' },
          { id: 'c02-w2-i4', name: 'Final exam', day: 'Week 11', exam: true },
        ],
      },
    ],
  },

  // ── 3. World History ────────────────────────────────────────────────────────
  {
    id: 'c03', num: '03', tag: 'humanities', accent: '#f59e0b', hours: '~8h', hoursNumeric: 8,
    type: 'History',
    title: 'World History',
    deadlineDate: '2026-11-30',
    studyTopics: [
      'Ancient Civilizations',
      'Medieval & Early Modern World',
      'Age of Revolution & Industrialization',
      'The Modern Era (1900–present)',
    ],
    weeks: [
      {
        id: 'c03-w0', tag: 'wb1', label: 'Unit 1', name: 'Ancient & Classical World',
        dates: 'Sep 1–21',
        tip: 'Focus on cause-and-effect — why civilizations rose and fell matters more than dates.',
        items: [
          { id: 'c03-w0-i0', name: 'Prehistoric humans & early civilizations', sub: 'Mesopotamia, Egypt', day: 'Week 1' },
          { id: 'c03-w0-i1', name: 'Ancient Greece & Rome', day: 'Week 2' },
          { id: 'c03-w0-i2', name: 'Classical China, India & the Americas', day: 'Week 3' },
          { id: 'c03-w0-i3', name: 'Quiz — Ancient world', day: 'Week 3', exam: true },
        ],
      },
      {
        id: 'c03-w1', tag: 'wb2', label: 'Unit 2', name: 'Medieval to Early Modern',
        dates: 'Sep 22–Oct 19',
        tip: 'The Age of Exploration connects everything — pay attention to trade routes.',
        items: [
          { id: 'c03-w1-i0', name: 'The Middle Ages & Islamic Golden Age', day: 'Week 4–5' },
          { id: 'c03-w1-i1', name: 'Renaissance, Reformation & Age of Exploration', day: 'Week 5–6' },
          { id: 'c03-w1-i2', name: 'Early empires & colonialism', day: 'Week 6–7' },
          { id: 'c03-w1-i3', name: 'Midterm exam', day: 'Week 7', exam: true },
        ],
      },
      {
        id: 'c03-w2', tag: 'wb3', label: 'Unit 3', name: 'Revolutions to the Present',
        dates: 'Oct 20–Nov 30',
        tip: 'WWI, WWII, and the Cold War all connect — treat them as one continuous story.',
        items: [
          { id: 'c03-w2-i0', name: 'American & French Revolutions', day: 'Week 8' },
          { id: 'c03-w2-i1', name: 'Industrial Revolution & its effects', day: 'Week 9' },
          { id: 'c03-w2-i2', name: 'World Wars I & II', day: 'Week 10–11' },
          { id: 'c03-w2-i3', name: 'Cold War, decolonization & globalization', day: 'Week 11–12' },
          { id: 'c03-w2-i4', name: 'Final exam', day: 'Week 12', exam: true },
        ],
      },
    ],
  },

  // ── 4. English Composition ─────────────────────────────────────────────────
  {
    id: 'c04', num: '04', tag: 'humanities', accent: '#a78bfa', hours: '~7h', hoursNumeric: 7,
    type: 'Language',
    title: 'English Composition',
    deadlineDate: '2026-10-20',
    studyTopics: [
      'Writing Process & Grammar',
      'Paragraph & Essay Structure',
      'Argumentative & Analytical Writing',
      'Research Papers & Citations',
    ],
    weeks: [
      {
        id: 'c04-w0', tag: 'wb1', label: 'Unit 1', name: 'Foundations of Writing',
        dates: 'Sep 1–14',
        tip: 'Good writing is rewriting — always revise at least once before submitting.',
        items: [
          { id: 'c04-w0-i0', name: 'Grammar, punctuation & sentence structure', day: 'Week 1' },
          { id: 'c04-w0-i1', name: 'The writing process: brainstorm, draft, revise', day: 'Week 1–2' },
          { id: 'c04-w0-i2', name: 'Paragraph structure & coherence', day: 'Week 2' },
          { id: 'c04-w0-i3', name: 'Assignment — Descriptive paragraph', day: 'Week 2', exam: true },
        ],
      },
      {
        id: 'c04-w1', tag: 'wb2', label: 'Unit 2', name: 'Essay Types',
        dates: 'Sep 15–Oct 5',
        tip: 'Every essay needs a clear thesis — if you can\'t state it in one sentence, keep drafting.',
        items: [
          { id: 'c04-w1-i0', name: 'The 5-paragraph essay structure', day: 'Week 3' },
          { id: 'c04-w1-i1', name: 'Narrative & descriptive essays', day: 'Week 3–4' },
          { id: 'c04-w1-i2', name: 'Compare & contrast essays', day: 'Week 4' },
          { id: 'c04-w1-i3', name: 'Cause & effect essays', day: 'Week 5' },
          { id: 'c04-w1-i4', name: 'Midterm — Comparative essay', day: 'Week 5', exam: true },
        ],
      },
      {
        id: 'c04-w2', tag: 'wb3', label: 'Unit 3', name: 'Argument & Research',
        dates: 'Oct 6–20',
        tip: 'Use primary sources when possible — they make your argument much stronger.',
        items: [
          { id: 'c04-w2-i0', name: 'Argumentation & logical reasoning', day: 'Week 6' },
          { id: 'c04-w2-i1', name: 'Finding & evaluating sources', sub: 'Library databases, credibility', day: 'Week 6–7' },
          { id: 'c04-w2-i2', name: 'Citations: MLA & APA formats', day: 'Week 7' },
          { id: 'c04-w2-i3', name: 'Final — Argumentative research paper', day: 'Week 7', exam: true },
        ],
      },
    ],
  },

  // ── 5. Introduction to Psychology ─────────────────────────────────────────
  {
    id: 'c05', num: '05', tag: 'social', accent: '#f472b6', hours: '~9h', hoursNumeric: 9,
    type: 'Social Sciences',
    title: 'Introduction to Psychology',
    deadlineDate: '2026-11-30',
    studyTopics: [
      'Foundations & Research Methods',
      'Biological Bases of Behavior',
      'Cognition, Memory & Learning',
      'Social & Developmental Psychology',
    ],
    weeks: [
      {
        id: 'c05-w0', tag: 'wb1', label: 'Unit 1', name: 'Foundations & the Brain',
        dates: 'Sep 1–21',
        tip: 'Know the main perspectives (behavioral, cognitive, biological) — they explain everything else.',
        items: [
          { id: 'c05-w0-i0', name: 'History & major perspectives', day: 'Week 1' },
          { id: 'c05-w0-i1', name: 'Research methods in psychology', sub: 'Experiments, surveys, case studies', day: 'Week 2' },
          { id: 'c05-w0-i2', name: 'Neurons, brain structure & neuroscience', day: 'Week 3' },
          { id: 'c05-w0-i3', name: 'States of consciousness', day: 'Week 3' },
          { id: 'c05-w0-i4', name: 'Quiz — Foundations', day: 'Week 3', exam: true },
        ],
      },
      {
        id: 'c05-w1', tag: 'wb2', label: 'Unit 2', name: 'Cognition & Learning',
        dates: 'Sep 22–Oct 26',
        tip: 'Pavlov, Skinner, and Bandura are almost always on exams — know their experiments cold.',
        items: [
          { id: 'c05-w1-i0', name: 'Sensation & perception', day: 'Week 4–5' },
          { id: 'c05-w1-i1', name: 'Classical & operant conditioning', sub: 'Pavlov, Skinner', day: 'Week 5–6' },
          { id: 'c05-w1-i2', name: 'Observational learning & memory', sub: 'Encoding, storage, retrieval', day: 'Week 6–7' },
          { id: 'c05-w1-i3', name: 'Thinking, language & intelligence', day: 'Week 7' },
          { id: 'c05-w1-i4', name: 'Midterm exam', day: 'Week 7', exam: true },
        ],
      },
      {
        id: 'c05-w2', tag: 'wb3', label: 'Unit 3', name: 'Social & Developmental Psychology',
        dates: 'Oct 27–Nov 30',
        tip: 'This unit is the most intuitive — connect it to your own life to remember it.',
        items: [
          { id: 'c05-w2-i0', name: 'Lifespan development', sub: 'Piaget, Erikson, attachment', day: 'Week 8–9' },
          { id: 'c05-w2-i1', name: 'Motivation & emotion', day: 'Week 9' },
          { id: 'c05-w2-i2', name: 'Personality theories', sub: 'Freud, trait theories, humanistic', day: 'Week 10' },
          { id: 'c05-w2-i3', name: 'Social influence & group dynamics', day: 'Week 10–11' },
          { id: 'c05-w2-i4', name: 'Psychological disorders & treatment', day: 'Week 11' },
          { id: 'c05-w2-i5', name: 'Final exam', day: 'Week 12', exam: true },
        ],
      },
    ],
  },

  // ── 6. Microeconomics ──────────────────────────────────────────────────────
  {
    id: 'c06', num: '06', tag: 'social', accent: '#2dd4bf', hours: '~9h', hoursNumeric: 9,
    type: 'Economics',
    title: 'Microeconomics',
    deadlineDate: '2026-12-05',
    studyTopics: [
      'Supply, Demand & Market Equilibrium',
      'Consumer Choice & Utility',
      'Production, Costs & Firm Behavior',
      'Market Structures & Game Theory',
    ],
    weeks: [
      {
        id: 'c06-w0', tag: 'wb1', label: 'Unit 1', name: 'Supply, Demand & Elasticity',
        dates: 'Sep 1–21',
        tip: 'Draw every supply/demand diagram by hand at least once — it locks in the intuition.',
        items: [
          { id: 'c06-w0-i0', name: 'Economic thinking & trade-offs', sub: 'Opportunity cost, marginal analysis', day: 'Week 1' },
          { id: 'c06-w0-i1', name: 'Demand: determinants & shifts', day: 'Week 1–2' },
          { id: 'c06-w0-i2', name: 'Supply: determinants & shifts', day: 'Week 2' },
          { id: 'c06-w0-i3', name: 'Market equilibrium & price signals', day: 'Week 2–3' },
          { id: 'c06-w0-i4', name: 'Elasticity: price, income, cross-price', day: 'Week 3' },
          { id: 'c06-w0-i5', name: 'Quiz — Supply & demand', day: 'Week 3', exam: true },
        ],
      },
      {
        id: 'c06-w1', tag: 'wb2', label: 'Unit 2', name: 'Consumers & Producers',
        dates: 'Sep 22–Oct 26',
        tip: 'Utility maximization is where most students struggle — work through the algebra slowly.',
        items: [
          { id: 'c06-w1-i0', name: 'Consumer theory & utility maximization', day: 'Week 4–5' },
          { id: 'c06-w1-i1', name: 'Budget constraints & indifference curves', day: 'Week 5' },
          { id: 'c06-w1-i2', name: 'Production functions & costs', sub: 'Fixed vs. variable, marginal cost', day: 'Week 6–7' },
          { id: 'c06-w1-i3', name: 'Profit maximization for competitive firms', day: 'Week 7' },
          { id: 'c06-w1-i4', name: 'Midterm exam', day: 'Week 7', exam: true },
        ],
      },
      {
        id: 'c06-w2', tag: 'wb3', label: 'Unit 3', name: 'Market Structures',
        dates: 'Oct 27–Dec 5',
        tip: 'Monopoly vs. perfect competition is the classic exam comparison — nail the diagrams.',
        items: [
          { id: 'c06-w2-i0', name: 'Perfect competition', day: 'Week 8' },
          { id: 'c06-w2-i1', name: 'Monopoly & monopoly power', day: 'Week 9' },
          { id: 'c06-w2-i2', name: 'Oligopoly & game theory basics', day: 'Week 10' },
          { id: 'c06-w2-i3', name: 'Market failures & externalities', sub: 'Public goods, externalities', day: 'Week 10–11' },
          { id: 'c06-w2-i4', name: 'Labor markets & wage determination', day: 'Week 11' },
          { id: 'c06-w2-i5', name: 'Final exam', day: 'Week 12', exam: true },
        ],
      },
    ],
  },

  // ── 7. Intro to Computer Science ───────────────────────────────────────────
  {
    id: 'c07', num: '07', tag: 'stem', accent: '#f97316', hours: '~11h', hoursNumeric: 11,
    type: 'Computer Science',
    title: 'Intro to Computer Science',
    deadlineDate: '2026-12-15',
    studyTopics: [
      'Programming Fundamentals',
      'Data Structures',
      'Algorithms & Complexity',
      'Problem Solving & Projects',
    ],
    weeks: [
      {
        id: 'c07-w0', tag: 'wb1', label: 'Unit 1', name: 'Programming Fundamentals',
        dates: 'Sep 1–28',
        tip: 'Write code every single day, even for 15 minutes. Consistency beats cramming.',
        items: [
          { id: 'c07-w0-i0', name: 'What is computing? Algorithms & pseudocode', day: 'Week 1' },
          { id: 'c07-w0-i1', name: 'Variables, data types & operators', day: 'Week 1–2' },
          { id: 'c07-w0-i2', name: 'Conditionals & loops', day: 'Week 2–3' },
          { id: 'c07-w0-i3', name: 'Functions & scope', day: 'Week 3–4' },
          { id: 'c07-w0-i4', name: 'Lab — Build a number guessing game', day: 'Week 4', exam: true },
        ],
      },
      {
        id: 'c07-w1', tag: 'wb2', label: 'Unit 2', name: 'Data Structures',
        dates: 'Sep 29–Nov 2',
        tip: 'Visualize data structures on paper before coding them — it prevents bugs.',
        items: [
          { id: 'c07-w1-i0', name: 'Arrays & strings', day: 'Week 5' },
          { id: 'c07-w1-i1', name: 'Lists & dictionaries (hash maps)', day: 'Week 6' },
          { id: 'c07-w1-i2', name: 'Stacks & queues', day: 'Week 6–7' },
          { id: 'c07-w1-i3', name: 'Recursion', sub: 'Think base case first', day: 'Week 7' },
          { id: 'c07-w1-i4', name: 'Midterm — Data structures project', day: 'Week 7', exam: true },
        ],
      },
      {
        id: 'c07-w2', tag: 'wb3', label: 'Unit 3', name: 'Algorithms & Problem Solving',
        dates: 'Nov 3–Dec 15',
        tip: "Big-O notation is heavily tested — understand it intuitively, don't memorize blindly.",
        items: [
          { id: 'c07-w2-i0', name: 'Algorithm analysis & Big-O notation', day: 'Week 8–9' },
          { id: 'c07-w2-i1', name: 'Sorting algorithms', sub: 'Bubble, merge, quicksort', day: 'Week 9–10' },
          { id: 'c07-w2-i2', name: 'Searching & binary search', day: 'Week 10' },
          { id: 'c07-w2-i3', name: 'Introduction to object-oriented programming', day: 'Week 11' },
          { id: 'c07-w2-i4', name: 'Final project — Build a mini app', day: 'Week 11–12', exam: true },
          { id: 'c07-w2-i5', name: 'Final exam', day: 'Week 12', exam: true },
        ],
      },
    ],
  },
];
