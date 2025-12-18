"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  Heart,
  Users,
  Target,
  Rocket,
  Calendar,
  ArrowRight,
  Twitter,
  Github,
  MessageCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StickyCTABar } from "@/components/sticky-cta-bar"

const values = [
  {
    icon: Heart,
    title: "Creativity First",
    description:
      "We believe everyone has something unique to express. Our platform empowers creators of all skill levels.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Built by the community, for the community. Every decision we make puts our users first.",
  },
  {
    icon: Target,
    title: "Permanent Legacy",
    description:
      "What you create here stays forever. We're building digital history, one pixel at a time.",
  },
]

const team = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen",
    bio: "Former game designer with a passion for collaborative art.",
  },
  {
    name: "Sarah Kim",
    role: "Head of Product",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahKim",
    bio: "Product leader focused on delightful user experiences.",
  },
  {
    name: "Marcus Johnson",
    role: "Lead Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusJohnson",
    bio: "Full-stack engineer building scalable creative tools.",
  },
  {
    name: "Emma Davis",
    role: "Community Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaDavis",
    bio: "Connecting creators and fostering our growing community.",
  },
]

const milestones = [
  {
    date: "January 2024",
    title: "Idea Born",
    description: "The concept of Pixel was sketched on a napkin during a hackathon.",
  },
  {
    date: "March 2024",
    title: "First Prototype",
    description: "Built the first working canvas with 1,000 pixels.",
  },
  {
    date: "June 2024",
    title: "Beta Launch",
    description: "Opened to 500 early adopters who shaped the product.",
  },
  {
    date: "September 2024",
    title: "Throne System",
    description: "Introduced the competitive Focal Point bidding system.",
  },
  {
    date: "December 2024",
    title: "Public Launch",
    description: "Opened to the world with 1 million pixel capacity.",
  },
  {
    date: "2025",
    title: "The Future",
    description: "Expanding canvas, new features, and global community.",
  },
]

const socialLinks = [
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/pixelcanvas",
    description: "Follow for updates",
  },
  {
    name: "Discord",
    icon: MessageCircle,
    href: "https://discord.gg/pixel",
    description: "Join the community",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/pixel",
    description: "Open source tools",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center space-y-6">
          <Badge variant="outline" className="text-primary border-primary/30">
            Our Story
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            Building Digital History,{" "}
            <span className="text-primary">One Pixel at a Time</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Pixel started as a simple idea: what if everyone could own a small
            piece of the internet forever? Today, we&#39;re building the world&#39;s
            largest collaborative canvas.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline">
                <Target className="size-3 mr-1.5" />
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Democratizing Digital Ownership
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  In a world of temporary content and disappearing posts, we
                  believe in permanence. Your creations, your memories, your
                  mark on the internet should last forever.
                </p>
                <p>
                  Pixel is more than a canvas – it&#39;s a collaborative monument to
                  human creativity. Every pixel tells a story, and together,
                  we&#39;re creating something that will outlast us all.
                </p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-8 space-y-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <value.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">The Beginning</Badge>
            <h2 className="text-3xl font-bold">How It All Started</h2>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6 text-lg">
              <p>
                It was 2024, and our founder Alex was reflecting on the
                internet&#39;s ephemeral nature. Social posts disappear, websites
                shut down, and digital memories fade. What if there was a place
                where your creation could truly last forever?
              </p>
              <p>
                Inspired by collaborative art projects and the desire for true
                digital ownership, the first version of Pixel was born during a
                weekend hackathon. A simple 100x100 grid where anyone could claim
                a pixel and make it their own.
              </p>
              <p>
                The response was overwhelming. Within weeks, thousands of people
                were placing pixels, creating art, and forming a community around
                shared creativity. The Throne competition emerged organically as
                users competed for the coveted center position.
              </p>
              <p className="text-primary font-semibold">
                Today, Pixel is home to over 50,000 permanent creations, with
                more being added every day. And we&#39;re just getting started.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">
              <Users className="size-3 mr-1.5" />
              The Team
            </Badge>
            <h2 className="text-3xl font-bold">Meet the Creators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A small team with a big vision: making digital ownership accessible
              to everyone.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6 space-y-4">
                    <Avatar className="size-20 mx-auto">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-primary">{member.role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">
              <Calendar className="size-3 mr-1.5" />
              Milestones
            </Badge>
            <h2 className="text-3xl font-bold">Our Journey</h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.date}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Rocket className="size-5" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <Badge variant="outline" className="mb-2">
                    {milestone.date}
                  </Badge>
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Links */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Connect</Badge>
            <h2 className="text-3xl font-bold">Join the Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated, get support, and connect with fellow creators.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {socialLinks.map((link) => (
              <Card key={link.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
                    <link.icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{link.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      Follow
                      <ArrowRight className="size-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-t from-primary/10 to-background">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Make History?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who are building something permanent together.
          </p>
          <Button asChild size="lg" className="text-lg px-10">
            <Link href="/register">
              Start Creating
              <ArrowRight className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <StickyCTABar
        ctaText="Join Us"
        message="Be part of digital history"
      />
    </main>
  )
}
