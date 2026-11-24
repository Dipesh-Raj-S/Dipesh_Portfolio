"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/data/profile";

function format(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: false,
  });
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  // Server HTML (and no-JS visitors) get the real number.
  const [display, setDisplay] = useState(format(stat.value, stat.decimals));
  const armed = useRef(false);

  // If the counter starts off-screen, reset it so it can count up on reveal.
  useEffect(() => {
    const el = ref.current;
    if (!el || stat.text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      armed.current = true;
      setDisplay(format(0, stat.decimals));
    }
  }, [stat]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, stat.value, {
      duration: 1.4,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setDisplay(format(v, stat.decimals)),
    });
    return () => controls.stop();
  }, [inView, stat]);

  return (
    <span ref={ref} className="tabular-nums">
      {stat.text ?? display}
      {stat.suffix ? <span className="text-primary">{stat.suffix}</span> : null}
    </span>
  );
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section
      aria-label="At a glance"
      className="border-y border-border bg-background-2/60"
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse gap-1 px-2 py-7 text-center"
          >
            <dt className="text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
            <dd className="font-mono text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              <Counter stat={stat} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
