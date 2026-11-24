"use client";

import { useEffect, useRef } from "react";

/**
 * Original illustration: a developer coding at a desk late at night.
 *
 * - All shared colours come from CSS variables (--nd-*) in globals.css, so the
 *   same markup renders the night scene (dark theme) and the day scene (light
 *   theme). Theme-specific layers (.nd-night / .nd-day) crossfade on toggle.
 * - Ambient motion (steam, stars, typing, lamp flicker, hand taps) is pure
 *   CSS on transform/opacity and is disabled under prefers-reduced-motion.
 * - Mouse parallax shifts three layers a few pixels (fine pointers only).
 */

type Seg = readonly [width: number, color: 1 | 2 | 3 | 4];
// Each code line: [indent level, segments]. Blank lines are empty arrays.
const CODE: readonly (readonly [number, readonly Seg[]])[] = [
  [
    0,
    [
      [26, 4],
      [44, 1],
    ],
  ],
  [
    0,
    [
      [18, 2],
      [58, 3],
    ],
  ],
  [
    1,
    [
      [34, 1],
      [20, 2],
      [30, 3],
    ],
  ],
  [
    1,
    [
      [48, 3],
      [16, 4],
    ],
  ],
  [
    2,
    [
      [24, 2],
      [62, 1],
    ],
  ],
  [
    2,
    [
      [40, 4],
      [28, 3],
    ],
  ],
  [
    1,
    [
      [22, 1],
      [38, 2],
    ],
  ],
  [0, []],
  [
    0,
    [
      [34, 4],
      [46, 1],
    ],
  ],
];
const TYPING: readonly Seg[] = [
  [30, 1],
  [24, 2],
  [36, 3],
];

const STARS = [
  [78, 70, 1.3],
  [104, 112, 0.9],
  [136, 64, 1.1],
  [150, 96, 0.8],
  [190, 72, 1.2],
  [118, 150, 0.8],
  [254, 132, 1],
  [86, 186, 0.7],
  [178, 128, 0.9],
] as const;

const SKYLINE = [
  [58, 206, 22],
  [80, 190, 18],
  [98, 214, 26],
  [124, 180, 16],
  [140, 200, 30],
  [170, 186, 20],
  [190, 210, 24],
  [214, 194, 18],
  [232, 172, 22],
  [254, 204, 20],
] as const;

const CITY_LIGHTS = [
  [64, 214],
  [86, 198],
  [86, 210],
  [104, 222],
  [128, 190],
  [146, 208],
  [158, 220],
  [176, 196],
  [196, 218],
  [218, 204],
  [238, 182],
  [240, 196],
  [258, 214],
] as const;

const LINE_X = 316;
const CODE_X = 330;
const LINE_Y = 168;
const LINE_H = 11;
const INDENT = 12;

function CodeLine({ y, x, segs }: { y: number; x: number; segs: readonly Seg[] }) {
  let cursor = x;
  return (
    <>
      {segs.map(([w, c], i) => {
        const el = (
          <rect
            key={i}
            x={cursor}
            y={y}
            width={w}
            height={4}
            rx={2}
            fill={`var(--nd-code-${c})`}
          />
        );
        cursor += w + 5;
        return el;
      })}
    </>
  );
}

export function NightDesk({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const px = (e.clientX / window.innerWidth - 0.5) * 2;
        const py = (e.clientY / window.innerHeight - 0.5) * 2;
        svg.style.setProperty("--nd-px", px.toFixed(3));
        svg.style.setProperty("--nd-py", py.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const typingY = LINE_Y + CODE.length * LINE_H;
  const typingX = CODE_X + INDENT;

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 520"
      role="img"
      aria-label="Illustration: a developer seen from behind, coding at a desk at night. A desk lamp on the right casts warm light, a mug steams beside the keyboard, and a window shows the moon over distant city lights."
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nd-sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0f1c" />
          <stop offset="1" stopColor="#1d2843" />
        </linearGradient>
        <linearGradient id="nd-sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7cfe4" />
          <stop offset="1" stopColor="#efe4cf" />
        </linearGradient>
        <linearGradient id="nd-cone" x1="0.55" y1="0" x2="0.4" y2="1">
          <stop offset="0" style={{ stopColor: "var(--nd-light)" }} stopOpacity="0.42" />
          <stop offset="1" style={{ stopColor: "var(--nd-light)" }} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="nd-pool">
          <stop offset="0" style={{ stopColor: "var(--nd-light)" }} stopOpacity="0.45" />
          <stop offset="1" style={{ stopColor: "var(--nd-light)" }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nd-glow">
          <stop
            offset="0"
            style={{ stopColor: "var(--nd-screen-glow)" }}
            stopOpacity="0.55"
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--nd-screen-glow)" }}
            stopOpacity="0"
          />
        </radialGradient>
        <linearGradient id="nd-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--nd-wall)" }} />
          <stop offset="1" style={{ stopColor: "var(--nd-wall-2)" }} />
        </linearGradient>
        <clipPath id="nd-window">
          <rect x="58" y="50" width="216" height="194" rx="2" />
        </clipPath>
        <clipPath id="nd-screen">
          <rect x="308" y="156" width="204" height="128" rx="3" />
        </clipPath>
        <mask id="nd-moon">
          <rect x="190" y="70" width="60" height="60" fill="#fff" />
          <circle cx="229" cy="90" r="16" fill="#000" />
        </mask>
      </defs>

      {/* ── Back layer: wall and window ───────────────────────────── */}
      <g id="room" className="nd-layer nd-layer-back">
        <rect x="-20" y="-20" width="680" height="560" fill="url(#nd-shade)" />

        <g id="window">
          <rect x="48" y="40" width="236" height="214" rx="6" fill="var(--nd-frame)" />
          <g clipPath="url(#nd-window)">
            <g id="sky-day" className="nd-day">
              <rect x="58" y="50" width="216" height="194" fill="url(#nd-sky-day)" />
              <circle cx="226" cy="94" r="17" fill="#f7e6bb" />
              <circle cx="226" cy="94" r="30" fill="#f7e6bb" opacity="0.25" />
              <g fill="#fbf8f1" opacity="0.85">
                <ellipse cx="110" cy="96" rx="26" ry="8" />
                <ellipse cx="126" cy="90" rx="16" ry="9" />
                <ellipse cx="184" cy="140" rx="20" ry="6" />
              </g>
              <g fill="#a7b5c4" opacity="0.7">
                {SKYLINE.map(([x, y, w]) => (
                  <rect key={x} x={x} y={y} width={w} height={260 - y} />
                ))}
              </g>
            </g>

            <g id="sky-night" className="nd-night">
              <rect x="58" y="50" width="216" height="194" fill="url(#nd-sky-night)" />
              <g id="stars" fill="#e9e4d6">
                {STARS.map(([cx, cy, r]) => (
                  <circle key={`${cx}-${cy}`} className="nd-star" cx={cx} cy={cy} r={r} />
                ))}
              </g>
              <circle cx="220" cy="96" r="30" fill="#e9e2cf" opacity="0.07" />
              <circle cx="220" cy="96" r="17" fill="#e9e2cf" mask="url(#nd-moon)" />
              <g fill="#0c1220">
                {SKYLINE.map(([x, y, w]) => (
                  <rect key={x} x={x} y={y} width={w} height={260 - y} />
                ))}
              </g>
              <g fill="var(--nd-light)" opacity="0.55">
                {CITY_LIGHTS.map(([x, y]) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" />
                ))}
              </g>
            </g>
          </g>
          <rect x="163" y="50" width="6" height="194" fill="var(--nd-frame)" />
          <rect x="58" y="144" width="216" height="6" fill="var(--nd-frame)" />
          <rect x="40" y="252" width="252" height="10" rx="3" fill="var(--nd-sill)" />
        </g>

        <g id="wall-notes">
          <rect
            x="330"
            y="70"
            width="26"
            height="26"
            rx="2"
            fill="var(--nd-note-1)"
            transform="rotate(-6 343 83)"
          />
          <rect
            x="362"
            y="82"
            width="24"
            height="24"
            rx="2"
            fill="var(--nd-note-2)"
            transform="rotate(5 374 94)"
          />
          <g stroke="var(--nd-wall)" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <path d="M336 80h14M336 86h10" transform="rotate(-6 343 83)" />
            <path d="M367 92h13M367 98h9" transform="rotate(5 374 94)" />
          </g>
        </g>
      </g>

      {/* ── Mid layer: light, desk and everything on it ───────────── */}
      <g id="desk-scene" className="nd-layer nd-layer-mid">
        <g id="lamp-light" className="nd-lamp-light">
          <g className="nd-flicker">
            <polygon points="510,229 548,247 618,372 366,372" fill="url(#nd-cone)" />
            <ellipse cx="492" cy="374" rx="132" ry="12" fill="url(#nd-pool)" />
            <circle cx="528" cy="238" r="30" fill="url(#nd-pool)" />
          </g>
        </g>

        <ellipse
          id="monitor-glow"
          className="nd-screen-glow"
          cx="410"
          cy="226"
          rx="176"
          ry="128"
          fill="url(#nd-glow)"
        />

        <g id="desk">
          <rect x="-20" y="372" width="680" height="16" fill="var(--nd-desk)" />
          <rect x="-20" y="388" width="680" height="152" fill="var(--nd-desk-front)" />
        </g>

        <g id="plant">
          <g fill="var(--nd-plant)">
            <path d="M84 336c-12-20-14-40-4-56 6 18 9 36 4 56z" />
            <path d="M92 336c4-24 16-42 32-50-4 20-14 38-32 50z" />
            <path d="M88 336c-20-8-34-22-38-40 18 6 32 20 38 40z" />
          </g>
          <g fill="var(--nd-plant-2)">
            <path d="M90 336c0-22 6-42 18-58 0 22-6 42-18 58z" />
            <path d="M86 336c-8-14-22-22-34-24 6 12 18 22 34 24z" />
          </g>
          <path d="M68 334h44l-6 38H74z" fill="var(--nd-pot)" />
          <rect x="66" y="330" width="48" height="7" rx="2" fill="var(--nd-pot)" />
        </g>

        <g id="books">
          <rect x="126" y="360" width="66" height="12" rx="2" fill="var(--nd-book-1)" />
          <rect x="132" y="349" width="58" height="11" rx="2" fill="var(--nd-book-2)" />
          <rect x="128" y="339" width="54" height="10" rx="2" fill="var(--nd-book-3)" />
          <path
            d="M136 365h46M140 354h40"
            stroke="var(--nd-desk-front)"
            strokeWidth="1.2"
            opacity="0.4"
          />
        </g>

        <g id="mug">
          <g
            className="nd-steam"
            fill="none"
            stroke="var(--nd-mug)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.6"
          >
            <path d="M204 334c-4-6 4-10 0-16s4-10 0-16" />
            <path d="M212 334c-4-6 4-10 0-16s4-10 0-16" />
            <path d="M220 334c-4-6 4-10 0-16s4-10 0-16" />
          </g>
          <path
            d="M226 350a8 8 0 0 1 0 14"
            fill="none"
            stroke="var(--nd-mug)"
            strokeWidth="4"
          />
          <rect x="198" y="340" width="30" height="32" rx="5" fill="var(--nd-mug)" />
          <rect
            x="198"
            y="340"
            width="30"
            height="5"
            rx="2.5"
            fill="var(--nd-desk-front)"
            opacity="0.25"
          />
        </g>

        <g id="monitor">
          <rect x="378" y="364" width="64" height="8" rx="3" fill="var(--nd-monitor)" />
          <rect x="402" y="290" width="16" height="76" fill="var(--nd-monitor)" />
          <rect
            x="298"
            y="146"
            width="224"
            height="148"
            rx="8"
            fill="var(--nd-monitor)"
          />
          <rect x="308" y="156" width="204" height="128" rx="3" fill="var(--nd-screen)" />
          <g id="code" clipPath="url(#nd-screen)">
            {CODE.map(([indent, segs], i) => {
              const y = LINE_Y + i * LINE_H;
              return (
                <g key={i}>
                  <rect
                    x={LINE_X}
                    y={y}
                    width="7"
                    height="4"
                    rx="1"
                    fill="var(--nd-code-dim)"
                  />
                  <CodeLine y={y} x={CODE_X + indent * INDENT} segs={segs} />
                </g>
              );
            })}
            <rect
              x={LINE_X}
              y={typingY}
              width="7"
              height="4"
              rx="1"
              fill="var(--nd-code-dim)"
            />
            <g className="nd-typing">
              <CodeLine y={typingY} x={typingX} segs={TYPING} />
            </g>
            <rect
              className="nd-cursor"
              x={typingX}
              y={typingY - 2}
              width="5"
              height="8"
              fill="var(--nd-code-2)"
            />
          </g>
          <rect
            x="500"
            y="150"
            width="17"
            height="17"
            rx="1.5"
            fill="var(--nd-note-1)"
            transform="rotate(9 508 158)"
          />
        </g>

        <g id="keyboard">
          <rect
            x="336"
            y="361"
            width="142"
            height="10"
            rx="2.5"
            fill="var(--nd-monitor)"
          />
          <path
            d="M342 364.5h130M342 367.5h130"
            stroke="var(--nd-screen-glow)"
            strokeWidth="1"
            strokeDasharray="5 2"
            opacity="0.35"
          />
          <ellipse cx="497" cy="367" rx="9" ry="4.5" fill="var(--nd-monitor)" />
        </g>

        <g id="headphones" fill="none" stroke="var(--nd-chair)" strokeLinecap="round">
          <path d="M522 366c0-20 40-20 40 0" strokeWidth="4" />
          <rect
            x="515"
            y="360"
            width="11"
            height="12"
            rx="4"
            fill="var(--nd-chair)"
            stroke="none"
          />
          <rect
            x="558"
            y="360"
            width="11"
            height="12"
            rx="4"
            fill="var(--nd-chair)"
            stroke="none"
          />
        </g>

        <g id="lamp">
          <rect x="582" y="362" width="44" height="10" rx="4" fill="var(--nd-lamp)" />
          <g stroke="var(--nd-lamp)" strokeWidth="5" strokeLinecap="round">
            <path d="M604 362 588 262" />
            <path d="M588 262 550 220" />
          </g>
          <circle cx="588" cy="262" r="5.5" fill="var(--nd-lamp)" />
          <path d="M528 199 568 216 548 248 508 229z" fill="var(--nd-lamp)" />
          <circle cx="527" cy="239" r="6" fill="var(--nd-lamp)" />
          <circle className="nd-lamp-light" cx="527" cy="239" r="6" fill="#f6d7a8" />
        </g>
      </g>

      {/* ── Front layer: the developer and chair ──────────────────── */}
      <g id="person" className="nd-layer nd-layer-front">
        <g id="arm">
          <path
            d="M386 400q34-8 60-32"
            fill="none"
            stroke="var(--nd-hoodie)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <ellipse
            className="nd-hand"
            cx="453"
            cy="364"
            rx="10"
            ry="5.5"
            fill="var(--nd-skin)"
          />
        </g>

        <path
          id="torso"
          d="M218 540 226 424q8-56 74-66h30q64 10 76 64l8 118z"
          fill="var(--nd-hoodie)"
        />
        <path d="M262 368q44-12 88 0l-8 18q-36-10-72 0z" fill="var(--nd-hoodie-shade)" />

        <g id="head">
          <rect
            x="294"
            y="336"
            width="22"
            height="26"
            rx="6"
            fill="var(--nd-skin-shade)"
          />
          <path d="M334 304q10 22-2 46l-10 6 4-50z" fill="var(--nd-skin)" />
          <ellipse cx="304" cy="316" rx="33" ry="36" fill="var(--nd-hair)" />
          <ellipse cx="337" cy="324" rx="4.5" ry="8" fill="var(--nd-skin)" />
          <path
            d="M340 314l-14-2"
            stroke="var(--nd-hair)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="nd-screen-glow">
            <ellipse
              cx="338"
              cy="322"
              rx="9"
              ry="22"
              fill="var(--nd-screen-glow)"
              opacity="0.55"
            />
            <path
              d="M296 282q30-4 40 24"
              fill="none"
              stroke="var(--nd-screen-glow)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        </g>

        <path
          className="nd-lamp-light"
          d="M338 360q56 8 68 58"
          fill="none"
          stroke="var(--nd-light)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />

        <g id="chair">
          <rect x="246" y="410" width="138" height="140" rx="20" fill="var(--nd-chair)" />
          <rect x="258" y="422" width="114" height="10" rx="5" fill="var(--nd-chair-2)" />
        </g>
      </g>
    </svg>
  );
}
