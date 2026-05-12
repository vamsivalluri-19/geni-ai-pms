const WEBSITE_KNOWLEDGE_BASE = [
  {
    id: 'platform-overview',
    keywords: ['what is this website', 'what can this website do', 'career intelligence', 'placement management system', 'platform overview', 'what is this', 'about this'],
    question: 'What is this platform?',
    answer: 'Gen-AI Placement Management System is a role-separated campus placement portal for students, staff, HR, and admins. It brings together profiles, applications, interview tools, exams, certifications, analytics, notifications, and AI chat in one place.'
  },
  {
    id: 'student-dashboard',
    keywords: ['student dashboard', 'student page', 'student features', 'what can students do', 'ask student', 'student'],
    question: 'What can a student do in the dashboard?',
    answer: 'Students can manage their profile, track applications, prepare for interviews, view exam papers, add certifications, review notifications, and use the AI assistant for placement guidance.'
  },
  {
    id: 'staff-dashboard',
    keywords: ['staff dashboard', 'staff features', 'what can staff do', 'staff upload', 'staff certificate', 'staff'],
    question: 'What can staff do in the portal?',
    answer: 'Staff can monitor students, verify records, manage placement updates, review certifications, and work with reports and placement oversight tools.'
  },
  {
    id: 'hr-dashboard',
    keywords: ['hr dashboard', 'hr copilot', 'hr tools', 'candidate analytics', 'job requisitions', 'hr'],
    question: 'What can HR do in the portal?',
    answer: 'HR users can review candidate analytics, build interview questions, generate readiness plans, create outreach drafts, review applications, run risk predictions, and manage job requisitions.'
  },
  {
    id: 'separate-chats',
    keywords: ['separate chats', 'role chats', 'chat history', 'different role', 'chat'],
    question: 'How does chat separation work?',
    answer: 'Chat history is stored separately per role, so student, staff, and HR conversations stay isolated from one another.'
  },
  {
    id: 'resume-match',
    keywords: ['resume match', 'resume matching', 'match resume', 'resume tool', 'resume', 'resume check', 'my resume'],
    question: 'What does resume match do?',
    answer: 'Resume match helps compare a student profile or resume against a job description so you can see gaps, strengths, and likely fit for a role. You can upload your resume and see detailed feedback.'
  },
  {
    id: 'interview-questions',
    keywords: ['interview questions', 'prepare questions', 'interview prep', 'technical questions', 'interview', 'interview training', 'prepare for interview'],
    question: 'Can the system generate interview questions?',
    answer: 'Yes. The platform can generate interview questions based on a role, company, and skill focus, with both technical and HR-style prompts. Use these to practice and prepare for placement interviews.'
  },
  {
    id: 'exam-papers',
    keywords: ['exam papers', 'sample papers', 'previous year paper', 'online assessment', 'exam', 'test', 'practice test'],
    question: 'Are sample exam papers available?',
    answer: 'Yes. Students can access exam papers and assessments that mirror placement drives, including sample papers and previous-year style questions to help you practice.'
  },
  {
    id: 'certifications',
    keywords: ['certifications', 'certificate upload', 'upload certificate', 'add certification', 'certificate'],
    question: 'How are certifications handled?',
    answer: 'Certifications are part of the student profile and can be added or tracked alongside source information, issuer, dates, and credential details.'
  },
  {
    id: 'login-register',
    keywords: ['login', 'register', 'sign in', 'how do i create account', 'account', 'signup'],
    question: 'How do I get started?',
    answer: 'Use the login or register flow to enter the platform. After signing in, the dashboard adapts to the user role so students, staff, HR, and admins see the right tools.'
  },
  {
    id: 'job-applications',
    keywords: ['apply for job', 'applications', 'how to apply', 'job application', 'apply'],
    question: 'How do I apply for jobs?',
    answer: 'Visit the jobs section, browse available positions, and click "Apply" on any job. You can track all your applications in the Applications dashboard to see their status.'
  },
  {
    id: 'placement-status',
    keywords: ['placement status', 'am i placed', 'placement result', 'placement', 'selected', 'got placed'],
    question: 'Where can I see my placement status?',
    answer: 'Your placement status is displayed on the main dashboard under Placement Results. You can also view detailed information about selected jobs, offers, and next steps there.'
  }
];

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getRoleCapabilitySummary(role = 'guest') {
  const normalizedRole = normalizeText(role);

  if (normalizedRole === 'admin') {
    return 'Admin users can manage the user directory, roles, approvals, workflow settings, system settings, reports, onboarding, and support escalation.';
  }

  if (normalizedRole === 'hr') {
    return 'HR users can review candidate analytics, build interview questions, generate readiness plans, create outreach drafts, review applications, run risk predictions, and manage job requisitions.';
  }

  if (normalizedRole === 'staff') {
    return 'Staff users can support students, verify records, manage placement updates, review certifications, and track reports and announcements.';
  }

  return 'Candidate or student users can manage profiles, applications, interview prep, exam papers, certifications, placement status, and dashboard actions.';
}

function scoreKnowledgeBaseEntry(question, entry) {
  const normalizedQuestion = normalizeText(question);
  if (!normalizedQuestion) return 0;

  let score = 0;
  for (const keyword of entry.keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;
    if (normalizedQuestion === normalizedKeyword) score += 5;
    if (normalizedQuestion.includes(normalizedKeyword)) score += 4;
    if (normalizedKeyword.split(' ').some((token) => token.length > 2 && normalizedQuestion.includes(token))) score += 1;
  }
  return score;
}

export function getWebsiteKnowledgeMatches(question, limit = 3) {
  return WEBSITE_KNOWLEDGE_BASE
    .map((entry) => ({
      ...entry,
      score: scoreKnowledgeBaseEntry(question, entry)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getWebsiteKnowledgeAnswer(question, role = 'guest') {
  const normalizedQuestion = normalizeText(question);
  const matches = getWebsiteKnowledgeMatches(question, 1);
  if (matches.length > 0) {
    return {
      matched: true,
      answer: matches[0].answer,
      question: matches[0].question,
      source: matches[0].id,
      matches
    };
  }

  const normalizedRole = normalizeText(role);
  if (
    normalizedQuestion.includes('user directory') ||
    normalizedQuestion.includes('manage users') ||
    normalizedQuestion.includes('user list') ||
    normalizedQuestion === 'users' ||
    normalizedQuestion.includes('view users')
  ) {
    const answer = normalizedRole === 'admin'
      ? 'Admins can open Admin → User Directory to view all users, add or edit accounts, update roles, and deactivate users.'
      : normalizedRole === 'hr'
        ? 'The full User Directory is admin-only. HR users can manage HR tools and their own profile, but not the complete user list.'
        : normalizedRole === 'staff'
          ? 'The full User Directory is admin-only. Staff users can work with placement and student support tools, but not the complete user list.'
          : 'The full User Directory is restricted to admins. You can still use your own dashboard tools for profiles, applications, interviews, and notifications.';

    return {
      matched: true,
      answer,
      question: 'User Directory access',
      source: 'role-specific-user-directory',
      matches: []
    };
  }

  // Role-aware handling for offer-related queries
  if (
    normalizedQuestion.includes('offer') ||
    normalizedQuestion.includes('offers') ||
    normalizedQuestion.includes('offer template') ||
    normalizedQuestion.includes('accept offer') ||
    normalizedQuestion.includes('offer status')
  ) {
    const answer = normalizedRole === 'admin'
      ? 'Admins can create and manage offer templates in Admin → Offers. Steps: 1) Create template → 2) Configure approval workflow → 3) Save and publish. Use Reports to audit sent offers.'
      : normalizedRole === 'hr'
        ? 'HR can prepare and send offers: 1) Choose template → 2) Fill candidate details → 3) Send offer. Track acceptance in the candidate profile or Offers dashboard.'
        : normalizedRole === 'staff'
          ? 'Staff can view offer statuses for candidates and help coordinate follow-ups with HR; creating or modifying templates is admin/HR responsibility.'
          : 'Candidates receive offers via a secure link or in the Offers section of their dashboard. To accept, click the secure accept link or follow the instructions in your offer notification.';

    return {
      matched: true,
      answer,
      question: 'Offers guidance',
      source: 'role-specific-offers',
      matches: []
    };
  }

  // Role-aware handling for generic 'steps' queries when user asks a short/ambiguous "steps" prompt
  if (normalizedQuestion === 'steps' || normalizedQuestion === 'step' || normalizedQuestion === 'how to' || normalizedQuestion === 'how do i') {
    const answer = normalizedRole === 'admin'
      ? 'Common admin steps: 1) Open Admin panel → 2) Select area (Users, Offers, Settings) → 3) Make changes → 4) Save and audit.'
      : normalizedRole === 'hr'
        ? 'Common HR steps: 1) Open HR dashboard → 2) Choose candidate or requisition → 3) Use analytics or templates → 4) Send communications or offers.'
        : normalizedRole === 'staff'
          ? 'Common staff steps: 1) Open Staff dashboard → 2) Select student record → 3) Verify documents or update placements → 4) Notify HR if escalation needed.'
          : 'Common candidate steps: 1) Open your dashboard → 2) Find jobs or applications → 3) Apply or prepare → 4) Track status and respond to messages.';

    return {
      matched: true,
      answer,
      question: 'Short steps guidance',
      source: 'role-specific-steps',
      matches: []
    };
  }

  const defaultAnswer = normalizedRole === 'hr'
    ? 'I can help with HR tools like candidate analytics, interview questions, readiness plans, outreach drafts, risk prediction, and knowledge-base answers.'
    : normalizedRole === 'staff'
      ? 'I can help with staff workflows like student verification, placement updates, certifications, and report tracking.'
      : normalizedRole === 'admin'
        ? 'I can help with admin workflows like the user directory, role management, approvals, workflow settings, reports, and system configuration.'
        : 'I can help with student workflows like applications, interviews, exam papers, certifications, and dashboard actions.';

  return {
    matched: false,
    answer: defaultAnswer,
    question: 'General website guidance',
    source: 'role-default',
    matches: []
  };
}

export function buildKnowledgeContext(question, role = 'guest') {
  const result = getWebsiteKnowledgeAnswer(question, role);
  const matchLines = (result.matches || []).map((entry) => `- ${entry.question}: ${entry.answer}`);

  return {
    ...result,
    context: [
      `Website answer source: ${result.source}`,
      `Primary guidance: ${result.answer}`,
      matchLines.length ? `Related FAQs:\n${matchLines.join('\n')}` : ''
    ].filter(Boolean).join('\n')
  };
}
