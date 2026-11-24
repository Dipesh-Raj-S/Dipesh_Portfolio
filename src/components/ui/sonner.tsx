"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: "!bg-card !text-foreground !border-border !font-sans",
          description: "!text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
