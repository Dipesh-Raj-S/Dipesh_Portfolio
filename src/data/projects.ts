import type { Project, ProjectCategory } from "@/types";

/**
 * Every project shown on the site. Descriptions and tech chips are based on
 * each repository's README (read 2026-11-24). Live stars, language and
 * last-pushed date are merged in from the GitHub API at build time.
 */
export const projects: Project[] = [
  {
    slug: "jailbreakops",
    name: "JailbreakOps",
    repo: "JailbreakOps",
    featured: true,
    order: 1,
    categories: ["backend", "ai-ml", "security"],
    pitch:
      "AI-security CTF backend — players throw prompt-injection and jailbreak attacks at a Gemini-powered target while an output guardrail judges every response.",
    description:
      "Prompt-injection CTF sandbox: async FastAPI around an intentionally-beatable Gemini target, with Redis rate limiting and caching, PostgreSQL attempt logging and an output guardrail that catches leaks before players see them.",
    tech: [
      "Python",
      "FastAPI",
      "Redis",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "Gemini API",
      "Docker",
      "Kubernetes",
      "k6",
      "GitHub Actions",
    ],
    highlights: [
      "Kubernetes HPA scaled {{2 → 6}} replicas under k6 load and back down, with {{0}} pod restarts",
      "{{58}} automated tests in GitHub Actions CI — guardrail leak detection, scoring idempotency, fail-open / fail-closed Redis paths",
      "Rate limiter fails closed, cache fails open; only sanitised responses are ever cached, and the whole event ran at {{$0}}",
    ],
  },
  {
    slug: "eventcheckin",
    name: "EventCheckIn",
    repo: "EventCheckIn",
    featured: true,
    order: 2,
    categories: ["full-stack", "backend"],
    pitch:
      "Real-time QR event entry with concurrency-safe check-ins, offline-first scanning and a live organiser dashboard.",
    description:
      "QR event check-in with row-locked PostgreSQL transactions, an offline IndexedDB scan queue, a live Socket.IO organiser dashboard and Gemini insights grounded in database stats.",
    tech: [
      "Python",
      "Flask",
      "PostgreSQL",
      "SQLAlchemy",
      "Redis",
      "Socket.IO",
      "IndexedDB",
      "JWT",
      "React",
      "Docker Compose",
      "Gemini API",
    ],
    highlights: [
      "{{50}} concurrent check-ins on one ticket → exactly {{1}} success and {{49}} × 409 Conflict",
      "Offline scans queue in IndexedDB and sync in server-arrival order; every losing scan is kept in a conflict audit table",
      "One-time opaque QR tokens stop screenshot sharing; organiser dashboard updates live over Socket.IO",
    ],
  },
  {
    slug: "exampilot",
    name: "ExamPilot",
    repo: "ExamPilot",
    featured: true,
    order: 3,
    categories: ["full-stack", "backend"],
    pitch:
      "Trip planner for competitive-exam candidates hit by last-minute exam-city allocation — exam date, budget and location in; travel, stay and food plan out.",
    description:
      "Full-stack exam-trip planner: a Flask REST API with separate travel, stay and food planning services, JWT auth, a React frontend and a Docker Compose production stack (PostgreSQL, Gunicorn, Nginx).",
    // TODO: confirm — the README describes Google sign-in as "simulated" and the
    // planners as mock engines, and does not mention 3-tier (budget / standard /
    // premium) plans. Update this entry once the repo documents them.
    tech: [
      "Python",
      "Flask",
      "SQLAlchemy",
      "PostgreSQL",
      "JWT",
      "React",
      "Tailwind CSS",
      "Docker Compose",
      "Gunicorn",
      "Nginx",
      "pytest",
    ],
    highlights: [
      "Separate travel, stay and food planning services behind one JWT-protected REST API",
      "Plans scaled to the candidate's budget, with travel routes capped at {{2,000 km}}",
      "Full production stack in {{1}} command — PostgreSQL, Gunicorn and Nginx via Docker Compose",
    ],
  },
  {
    slug: "threatgraph",
    name: "ThreatGraph",
    repo: "ThreatGraph",
    status: "In progress",
    order: 4,
    categories: ["security", "backend"],
    description:
      "Team project: attack-path discovery and risk prioritisation. Nmap discovery in an isolated cyber range, CVE correlation, an idempotent Neo4j attack graph and multi-stage attack paths ranked by a CVSS + EPSS + criticality risk score.",
    // Planned per my notes, not yet in the README's 20% slice: Nuclei + NVD
    // findings, MITRE ATT&CK correlation, CISA KEV weighting, remediation hints.
    tech: ["Python", "FastAPI", "Neo4j", "Nmap", "Next.js", "React", "Docker"],
  },
  {
    slug: "cerberus-ebpf",
    name: "Cerberus",
    repo: "Cerberus-eBPF",
    status: "Prototype",
    order: 5,
    categories: ["security", "iot-systems"],
    description:
      "Linux intrusion-prevention system: a BPF LSM program blocks unauthorised file opens and outbound connections in the kernel before they complete, steered by a C++ agent with process-scoped and IP-based policies.",
    tech: [
      "C",
      "C++",
      "eBPF",
      "BPF LSM",
      "libbpf",
      "bpftool",
      "Clang/LLVM",
      "CO-RE",
      "Linux",
    ],
  },
  {
    slug: "authforge",
    name: "AuthForge",
    repo: "AuthForge",
    order: 6,
    categories: ["backend", "security"],
    // TODO: confirm — the repo has no README yet; features beyond this are unverified.
    description:
      "OAuth 2.0 authorization server built with FastAPI and PostgreSQL, containerised with Docker Compose.",
    tech: ["Python", "FastAPI", "OAuth 2.0", "PostgreSQL", "Docker Compose"],
  },
  {
    slug: "lassi-house",
    name: "Lassi House",
    repo: "Lassi-House",
    order: 7,
    categories: ["full-stack"],
    description:
      "Campus juice-shop ordering system: FastAPI + PostgreSQL backend, React/Vite/TypeScript frontend, Razorpay payments verified server-side with HMAC, and live order status over WebSockets.",
    tech: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "WebSockets",
      "Razorpay",
      "Docker Compose",
    ],
  },
  {
    slug: "organlink",
    name: "OrganLink",
    repo: "OrganLink",
    order: 8,
    categories: ["backend", "ai-ml"],
    description:
      "Graph-based organ and blood donor–recipient matching network: async FastAPI over Neo4j 5 with geodesic distance queries, role-based access with PBKDF2 hashes, and concurrency-safe transactional allocation.",
    tech: ["Python", "FastAPI", "Neo4j", "Cypher", "Docker", "React", "pytest"],
  },
  {
    slug: "traditional-rag-pipeline",
    name: "Traditional RAG Pipeline",
    repo: "traditional-rag-pipeline",
    order: 9,
    categories: ["ai-ml"],
    description:
      "PDF-reader chatbot on a classic RAG pipeline: recursive chunking, Sentence Transformer embeddings in ChromaDB, semantic top-k retrieval and Groq LLM answers with source attribution.",
    tech: ["Python", "LangChain", "ChromaDB", "Sentence Transformers", "Groq", "PyMuPDF"],
  },
  {
    slug: "python-port-scanner",
    name: "Port Scanner",
    repo: "Python-Port-Scanner",
    order: 10,
    categories: ["security"],
    description:
      "Multithreaded TCP connect scanner with hostname resolution, custom port ranges, timeout handling and service banner grabbing, driven from an argparse CLI.",
    tech: ["Python", "socket", "threading", "argparse"],
  },
  {
    slug: "flask-smorest-api",
    name: "Flask-Smorest REST API",
    repo: "flask-smorest-api-with-Docker",
    order: 11,
    categories: ["backend"],
    // TODO: confirm — no README; summarised from requirements.txt and app.py.
    description:
      "REST API with Flask-Smorest and auto-generated OpenAPI docs, SQLAlchemy models with Flask-Migrate, JWT auth with a token blocklist, containerised with Docker.",
    tech: [
      "Python",
      "Flask",
      "Flask-Smorest",
      "SQLAlchemy",
      "JWT",
      "Swagger/OpenAPI",
      "Docker",
    ],
  },
  {
    slug: "library-hostel-return-system",
    name: "Library & Hostel Return System",
    repo: "Library-Hostel-return-system",
    order: 12,
    categories: ["iot-systems", "ai-ml"],
    // TODO: confirm — no README; summarised from the repo description and folder layout.
    description:
      "Timed entry and return monitoring: real-time student movement tracking with face recognition, Arduino gate control and a monitoring dashboard.",
    tech: ["Python", "Face recognition", "Arduino"],
  },
  {
    slug: "face-recognition-model",
    name: "Face Recognition Model",
    repo: "Face-recognition-model",
    order: 13,
    categories: ["ai-ml"],
    // TODO: confirm — no README yet.
    description: "Face-recognition model in Python.",
    tech: ["Python"],
  },
  {
    slug: "medroute-ai",
    name: "MedRoute AI",
    repo: "MedRoute-AI",
    order: 14,
    categories: ["full-stack", "ai-ml"],
    // TODO: confirm — no README; summarised from index.html. No AI features are
    // visible in the code yet, and the demo runs on simulated lab data.
    description:
      "Front-end prototype of a personal health-tracking dashboard: lab-report history with Chart.js trends, doctor search and appointment views, running on simulated data.",
    tech: ["HTML", "CSS", "JavaScript", "Chart.js"],
  },
  {
    slug: "expense-splitter",
    name: "Expense Splitter",
    repo: "Expense-Splitter",
    order: 15,
    categories: ["full-stack"],
    // TODO: confirm — no README; summarised from index.html.
    description:
      "Browser expense splitter: add members and categorised expenses, then calculate who owes whom.",
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    slug: "car-service-centre",
    name: "Car Service Centre Manager",
    repo: "AUTOMOBILE-CAR-SERVICE-CENTRE",
    order: 16,
    categories: ["backend"],
    description:
      "Service-centre management program: a Python front end over a SQL database tracking clients, vehicles and service and delivery dates.",
    tech: ["Python", "SQL"],
  },
  {
    slug: "arduino-website-bridge",
    name: "Arduino–Web Captcha Bridge",
    repo: "Physics-Project-arduino-website-bridge",
    order: 17,
    categories: ["iot-systems"],
    description: "Connects a captcha generated on an Arduino to a web page.",
    tech: ["Arduino", "HTML"],
  },
];

/** Repositories that never appear on the site, even when the API returns them. */
export const excludedRepos: readonly string[] = [
  "Dipesh-Raj-S",
  "AuthForge-old",
  "GitHub-Practice",
  "HTML",
  "webpage1",
  "Physics_Project_Ishan",
];

export const categoryLabels: Record<ProjectCategory, string> = {
  "full-stack": "Full Stack",
  backend: "Backend",
  "ai-ml": "AI / ML",
  security: "Security",
  "iot-systems": "IoT & Systems",
  other: "Other",
};

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
