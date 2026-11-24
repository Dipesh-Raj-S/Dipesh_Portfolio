"use client";

import { domMax, LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {/* strict: only the lightweight `m` components may be used. */}
      <LazyMotion features={domMax} strict>
        {/* Honour prefers-reduced-motion for every Framer Motion animation. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
      <Toaster />
    </ThemeProvider>
  );
}
