import { Badge } from "@/shared/ui/reusable/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/shared/ui/reusable/card";
import { Label } from "@/shared/ui/reusable/label";
import {
  Bug,
  Clock,
  Headset,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui/reusable/select";
import { Input } from "@/shared/ui/reusable/input";
import {Textarea} from "@/shared/ui/reusable/textarea";
import {Button} from "@/shared/ui/reusable/button";

const contactChannels = [
  {
    title: "Call support",
    detail: "+1-316-555-1258",
    helper: "Mon–Fri · 9am–6pm CET",
    icon: Phone,
  },
  {
    title: "Email",
    detail: "support@pixel.dev",
    helper: "We reply in under one business day",
    icon: Mail,
  },
  {
    title: "Status & docs",
    detail: "status.pixel.dev",
    helper: "View uptime, changelog, and guides",
    icon: ShieldCheck,
  },
];

const bugChecklist = [
  "What happened vs. what you expected.",
  "Steps to reproduce and the environment (browser, OS).",
  "Relevant URLs, timestamps, and screenshots or console logs.",
];

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-background to-muted/30">
      <section className="container py-16">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase text-primary">
            Contact & Support
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Have a question or found a bug?
          </h1>
          <p className="text-muted-foreground text-lg">
            Reach the team for product help, report an issue, or ask for a new
            feature. We&apos;re ready to respond.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contactChannels.map(({ title, detail, helper, icon: Icon }) => (
            <Card key={title} className="h-full">
              <CardContent className="flex items-start gap-4">
                <span className="bg-muted text-foreground flex size-12 shrink-0 items-center justify-center rounded-md">
                  <Icon className="size-5" />
                </span>
                <div className="space-y-1">
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{helper}</p>
                  <p className="text-card-foreground font-semibold">{detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Priority support</Badge>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Clock className="size-4" />
                  Avg. first response &lt; 2h
                </div>
              </div>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
              <CardDescription className="text-base">
                Tell us what you need and we&apos;ll follow up with the next
                steps. Include details if it&apos;s a bug so we can reproduce it
                quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" name="name" placeholder="Alex Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select defaultValue="support" name="topic">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectItem value="support">Support request</SelectItem>
                        <SelectItem value="bug">Bug report</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="feature">Feature idea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Brief summary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Details</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Share what you need help with or steps to reproduce the issue."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">Links (logs, screenshots, repo)</Label>
                  <Input
                    id="attachment"
                    name="attachment"
                    placeholder="https://…"
                  />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <LifeBuoy className="size-4" />
                    We reply faster to bug details with steps or screenshots.
                  </div>
                  <Button size="lg" type="submit">
                    Send message
                    <Send className="size-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Report a bug</CardTitle>
              <CardDescription className="text-base">
                Give us enough context to recreate the problem so we can ship a
                fix quickly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {bugChecklist.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="bg-primary/10 text-primary mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full">
                      <Bug className="size-4" />
                    </span>
                    <p className="text-muted-foreground text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <Headset className="text-primary size-5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Live help</p>
                    <p className="text-muted-foreground text-sm">
                      Need to pair on a blocker? Ping us and we&apos;ll set up a
                      quick call.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        <Clock className="size-3" />
                        9am–6pm CET
                      </Badge>
                      <Badge variant="outline">
                        <MessageSquare className="size-3" />
                        Slack/Email
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card/60 p-4">
                <div className="flex items-start gap-3">
                  <LifeBuoy className="text-primary size-5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Need a status check?</p>
                    <p className="text-muted-foreground text-sm">
                      Track open tickets and maintenance windows on the status
                      page, or email{" "}
                      <a
                        className="text-primary underline"
                        href="mailto:support@pixel.dev"
                      >
                        support@pixel.dev
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
