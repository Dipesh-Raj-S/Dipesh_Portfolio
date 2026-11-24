import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-muted-foreground">
        <span className="text-primary">$</span> cd this-page
      </p>
      <p className="mt-1 font-mono text-sm text-[#a3412c] dark:text-[#e39a86]">
        cd: no such file or directory
      </p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        Whatever you were looking for broke — or never existed. Let&apos;s get you back.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back home</Link>
      </Button>
    </section>
  );
}
