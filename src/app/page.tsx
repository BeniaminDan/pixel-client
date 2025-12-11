import Link from "next/link";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    icon: <Sparkles className="size-5 text-primary" />,
    title: "Composable UI",
    description: "Use the shared components to spin up new screens fast.",
  },
  {
    icon: <Shield className="size-5 text-primary" />,
    title: "Typed Integrations",
    description: "API helpers and types keep your client code predictable.",
  },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-background to-muted/30">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-primary">Pixel Client</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              A clean shell for building the next Pixel experiences.
            </h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to start shipping: themeable layout, ready-made
              UI primitives, HTTP utilities, and typed state management. Extend
              it as product requirements land.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                Get started
                <ArrowRight className="size-4" />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://nextjs.org/docs">View docs</Link>
              </Button>
            </div>
            <div className="text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
                Next.js 16
              </span>
              <span>Shadcn UI · Zustand · Axios · Tailwind v4</span>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="flex h-full flex-col gap-6 p-8">
              <div className="bg-accent text-accent-foreground inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                Starter ready
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Page layout scaffold</h2>
                <p className="text-muted-foreground">
                  This page uses the shared header, footer, and container system
                  to keep every screen consistent. Drop in your own sections and
                  components to extend it.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border bg-card p-4 text-card-foreground"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <p className="text-sm font-semibold">{item.title}</p>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
