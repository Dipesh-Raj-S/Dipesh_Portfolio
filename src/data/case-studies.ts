import type { CaseStudy } from "@/types";

const repo = (name: string) => `https://github.com/Dipesh-Raj-S/${name}`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "jailbreakops",
    problem: [
      "GDG VIT Chennai's TechnoVIT event needed a prompt-injection CTF round: participants socially engineer an LLM into revealing a hidden secret, then submit it as a flag for points.",
      "The brief wanted a system prompt that is “just resilient enough” — so the real engineering problem isn't making an AI unbreakable. It's building a backend around an intentionally beatable AI that stays fast, cheap, abuse-resistant and horizontally scalable while every user is actively attacking it.",
    ],
    approach: [
      "A fully async FastAPI service, because every request blocks on an external LLM call. Each /prompt request runs a fixed pipeline: rate-limit check, cache lookup, system-prompt build via Gemini's native system_instruction, a capped LLM call, the output guardrail, a cache write of the sanitised response, then non-blocking background logging to PostgreSQL.",
      "Guardrails, caching and scoring live in pure modules with no FastAPI imports, so route handlers stay thin pipelines and the security logic is testable on its own.",
      "The API layer is stateless — all session, rate-limit and cache state is in Redis — so any number of replicas behave identically.",
    ],
    architecture: {
      caption:
        "Request path for a single /prompt call. The same Docker image runs on a local Kind cluster (2–6 pods behind an HPA) and on Render for the live event.",
      nodes: [
        {
          id: "client",
          label: "Participant",
          sub: "browser / CLI",
          col: 0,
          row: 1,
          tone: "client",
        },
        {
          id: "hpa",
          label: "Kubernetes HPA",
          sub: "2–6 replicas",
          col: 1,
          row: 0,
          tone: "service",
        },
        {
          id: "api",
          label: "FastAPI pods",
          sub: "guardrail · scoring",
          col: 1,
          row: 1,
          tone: "service",
        },
        {
          id: "redis",
          label: "Redis",
          sub: "rate limit · cache",
          col: 2,
          row: 0,
          tone: "data",
        },
        {
          id: "gemini",
          label: "Gemini API",
          sub: "system_instruction",
          col: 2,
          row: 1,
          tone: "external",
        },
        {
          id: "pg",
          label: "PostgreSQL",
          sub: "attempt log",
          col: 2,
          row: 2,
          tone: "data",
        },
      ],
      edges: [
        { from: "client", to: "api", label: "/prompt" },
        { from: "hpa", to: "api", label: "scales" },
        { from: "api", to: "redis" },
        { from: "api", to: "gemini" },
        { from: "api", to: "pg", label: "background" },
      ],
    },
    decisions: [
      {
        title: "Fail closed on rate limiting, fail open on caching",
        body: "If Redis is unreachable, an unenforced rate limiter is a cost and abuse risk, so requests are denied. A cache miss only costs latency, so the cache is skipped and the LLM is called directly. The asymmetry is unit-tested, not just commented.",
      },
      {
        title: "Guard the output, not just the input",
        body: "Every response is checked for the secret — case-insensitive and normalised for whitespace and punctuation to catch spaced-out obfuscation — before the participant sees it. Only sanitised responses are cached, so a leak can never be replayed from cache.",
      },
      {
        title: "Secrets go in system_instruction, never the user message",
        body: "Passing the level secret through Gemini's native system_instruction parameter keeps it out of the string the participant controls, which keeps the injection surface clean.",
      },
      {
        title: "Prove Kubernetes locally, deploy simply",
        body: "A managed control plane wasn't worth it for a three-service event app. Horizontal scaling is demonstrated on a local Kind cluster with k6; the live event ran on Render's free tier from a single Blueprint file.",
      },
    ],
    results: [
      { value: "2 → 6", label: "HPA replicas under k6 load, then back to 2" },
      { value: "0", label: "pod restarts during the scaling test" },
      { value: "58", label: "automated tests run in CI on every push" },
      { value: "$0", label: "infrastructure cost for the whole event" },
    ],
    snippet: {
      title: "Fixed-window rate limiter as a FastAPI dependency",
      lang: "python",
      note: "Illustrative — simplified from the idea in the repository, not copied from it.",
      code: `from fastapi import Depends, HTTPException, status
from redis.asyncio import Redis
from redis.exceptions import RedisError

WINDOW_SECONDS = 60
MAX_PROMPTS = 10


async def rate_limit(session_id: str, redis: Redis = Depends(get_redis)) -> None:
    """Allow MAX_PROMPTS per session per window. Fails *closed*."""
    key = f"rl:prompt:{session_id}"
    try:
        async with redis.pipeline(transaction=True) as pipe:
            count, _ = await pipe.incr(key).expire(key, WINDOW_SECONDS, nx=True).execute()
    except RedisError:
        # An unenforced limiter is an abuse/cost risk: deny instead of allowing.
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Try again shortly.")

    if count > MAX_PROMPTS:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Slow down.")`,
    },
    links: [
      { label: "Source on GitHub", href: repo("JailbreakOps") },
      { label: "Live API", href: "https://jailbreakops-api.onrender.com/" },
      { label: "Demo video", href: "https://youtu.be/xTBOeXSJgUI" },
    ],
  },
  {
    slug: "eventcheckin",
    problem: [
      "Event entry fails in predictable ways: two scanners accept the same ticket at once, a ticket screenshot gets shared with a friend, or the venue Wi-Fi drops mid-queue and scans are lost.",
      "The system had to guarantee one entry per ticket under real concurrency, keep working offline, and give organisers a live view of the door.",
    ],
    approach: [
      "Check-ins run inside a single PostgreSQL transaction that locks the registration row, so concurrent scans serialise on the database instead of racing in application code. Capacity on registration uses the same transactional guarantees.",
      "Each ticket carries a one-time opaque qr_token; once consumed, any re-scan is a 409 Conflict.",
      "The scanner page caches scans in IndexedDB when the network drops, tags each with a client_scan_id, and syncs the queue through the same transactional check-in path when connectivity returns.",
      "A Socket.IO channel pushes each check-in to the organiser dashboard; Gemini only explains stats that the backend has already computed from the database.",
    ],
    architecture: {
      caption:
        "Online and offline scans share one transactional check-in path; the dashboard is fed by Socket.IO events.",
      nodes: [
        {
          id: "scanner",
          label: "Scanner (React)",
          sub: "IndexedDB queue",
          col: 0,
          row: 0,
          tone: "client",
        },
        {
          id: "dash",
          label: "Organiser dashboard",
          sub: "live counts",
          col: 0,
          row: 2,
          tone: "client",
        },
        {
          id: "api",
          label: "Flask API",
          sub: "JWT · Flask-Limiter",
          col: 1,
          row: 1,
          tone: "service",
        },
        {
          id: "pg",
          label: "PostgreSQL",
          sub: "row-level locks",
          col: 2,
          row: 0,
          tone: "data",
        },
        {
          id: "redis",
          label: "Redis",
          sub: "rate-limit store",
          col: 2,
          row: 1,
          tone: "data",
        },
        {
          id: "gemini",
          label: "Gemini API",
          sub: "stats-grounded",
          col: 2,
          row: 2,
          tone: "external",
        },
      ],
      edges: [
        { from: "scanner", to: "api", label: "check-in" },
        { from: "api", to: "dash", label: "Socket.IO" },
        { from: "api", to: "pg" },
        { from: "api", to: "redis" },
        { from: "api", to: "gemini" },
      ],
    },
    decisions: [
      {
        title: "Let the database arbitrate races",
        body: "Rather than check-then-write in Python, the check-in locks the registration row with SELECT … FOR UPDATE and flips its state in the same transaction. Whoever commits first wins; everyone else sees a clean 409.",
      },
      {
        title: "Server-arrival order beats device timestamps",
        body: "Offline stations can't be trusted to have synchronised clocks, so conflicts are resolved by which sync acquires the lock first — not by device_scanned_at. Losing scans are reported in the sync response and written to a CheckInConflict audit table instead of failing the batch.",
      },
      {
        title: "AI explains numbers, it never computes them",
        body: "Registered, checked-in and capacity counts come straight from SQL and are injected into a strict prompt. If the Gemini key is missing or invalid, the panel falls back to the raw stats.",
      },
      {
        title: "Known limits, written down",
        body: "One-time tokens stop multiple entries per ticket but not a stolen ticket used first, and JWTs live in localStorage for development speed — both are documented in the README with the production alternative.",
      },
    ],
    results: [
      { value: "50", label: "simultaneous check-in requests on one ticket" },
      { value: "1", label: "success (200 OK)" },
      { value: "49", label: "rejections (409 Conflict)" },
      { value: "+1", label: "database check-in count — exactly once" },
    ],
    snippet: {
      title: "Row-locked check-in transaction",
      lang: "python",
      note: "Illustrative — a simplified version of the approach, not the repository's exact code.",
      code: `from sqlalchemy import select
from sqlalchemy.orm import Session


class AlreadyCheckedIn(Exception):
    """Mapped to HTTP 409 Conflict by the route handler."""


def check_in(db: Session, qr_token: str, station_id: str) -> Registration:
    with db.begin():  # one transaction: lock, verify, write
        reg = db.execute(
            select(Registration)
            .where(Registration.qr_token == qr_token)
            .with_for_update()  # SELECT ... FOR UPDATE: concurrent scans queue here
        ).scalar_one_or_none()

        if reg is None:
            raise LookupError("Unknown ticket")
        if reg.checked_in_at is not None:
            db.add(CheckInConflict(registration_id=reg.id, station_id=station_id))
            raise AlreadyCheckedIn(reg.id)

        reg.checked_in_at = utcnow()
        reg.checked_in_by = station_id
    return reg`,
    },
    links: [{ label: "Source on GitHub", href: repo("EventCheckIn") }],
  },
  {
    slug: "exampilot",
    problem: [
      "Candidates for exams like JEE, NEET, UPSC, SSC and GATE are often allocated an exam city they've never been to, with little notice.",
      "Within days they have to work out travel, somewhere quiet to stay near the centre, food, and what to pack — usually on a tight budget.",
    ],
    approach: [
      "A short wizard collects the exam, date and time, home city, centre, travel preference, budget and whether accommodation is needed.",
      "The Flask REST API runs separate travel, stay and food planning services over that input and stores the resulting plan per user.",
      "JWT-protected endpoints, a React + Tailwind frontend with an interactive packing checklist, and a Docker Compose stack that brings up PostgreSQL, a Gunicorn API and Nginx serving the built app.",
    ],
    architecture: {
      caption:
        "One authenticated REST API fans each plan request out to three independent planning services.",
      nodes: [
        {
          id: "web",
          label: "React SPA",
          sub: "served by Nginx",
          col: 0,
          row: 1,
          tone: "client",
        },
        {
          id: "api",
          label: "Flask REST API",
          sub: "Gunicorn · JWT",
          col: 1,
          row: 1,
          tone: "service",
        },
        {
          id: "travel",
          label: "Travel service",
          sub: "routes ≤ 2,000 km",
          col: 2,
          row: 0,
          tone: "service",
        },
        {
          id: "stay",
          label: "Stay service",
          sub: "budget-scaled",
          col: 2,
          row: 1,
          tone: "service",
        },
        {
          id: "food",
          label: "Food service",
          sub: "near the centre",
          col: 2,
          row: 2,
          tone: "service",
        },
        {
          id: "pg",
          label: "PostgreSQL",
          sub: "users · plans",
          col: 1,
          row: 2,
          tone: "data",
        },
      ],
      edges: [
        { from: "web", to: "api", label: "/api/plans" },
        { from: "api", to: "travel" },
        { from: "api", to: "stay" },
        { from: "api", to: "food" },
        { from: "api", to: "pg" },
      ],
    },
    decisions: [
      {
        title: "Planning logic as separate services",
        body: "Travel, stay and food each sit behind their own service module, so a mock engine can be swapped for a real provider without touching routes or the other planners.",
      },
      {
        title: "SQLite for development, PostgreSQL in production",
        body: "Local development needs nothing but Python; the Docker Compose stack runs the same app against PostgreSQL behind Gunicorn and Nginx.",
      },
      {
        title: "Every plan is owned",
        body: "Plan endpoints are JWT-protected and scoped to the current user, so listing, reading or deleting a plan never crosses accounts.",
      },
    ],
    results: [
      { value: "3", label: "independent planning services" },
      { value: "6", label: "exam families in mind: JEE, NEET, UPSC, SSC, banking, GATE" },
      { value: "1", label: "command for the full production stack" },
    ],
    snippet: {
      title: "JWT-protected plan endpoint fanning out to the planners",
      lang: "python",
      note: "Illustrative — shows the shape of the idea, not the repository's exact code.",
      code: `from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.services import food, stay, travel

plans = Blueprint("plans", __name__, url_prefix="/api/plans")


@plans.post("")
@jwt_required()
def create_plan():
    data = PlanRequest.model_validate(request.get_json())  # reject bad input early
    plan = Plan(user_id=get_jwt_identity(), **data.model_dump())

    plan.travel = travel.schedule(data.home_city, data.center_city, data.exam_date)
    if data.accommodation_required:
        plan.stays = stay.recommend(data.center_city, budget=data.budget)
    plan.food = food.nearby(data.center_address)

    db.session.add(plan)
    db.session.commit()
    return plan.to_dict(), 201`,
    },
    links: [{ label: "Source on GitHub", href: repo("ExamPilot") }],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
