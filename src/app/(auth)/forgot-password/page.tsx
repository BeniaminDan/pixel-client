"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail } from "lucide-react"

import { forgotPasswordAction } from "@/modules/auth/api/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthMarketingPanel } from "@/modules/auth/components/auth-marketing-panel"

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string
    setSubmittedEmail(email)

    startTransition(async () => {
      await forgotPasswordAction(email)
      // Always show success to prevent email enumeration
      setEmailSent(true)
    })
  }

  if (emailSent) {
    return (
      <div className="h-dvh lg:grid lg:grid-cols-2">
        <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Mail className="size-8 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Check your email</h2>
              <p className="text-muted-foreground">
                If an account exists for{" "}
                <span className="font-medium text-foreground">{submittedEmail}</span>,
                we&apos;ve sent you a password reset link.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                className="text-foreground hover:underline"
                onClick={() => setEmailSent(false)}
              >
                try again
              </button>
              .
            </p>

            <Button variant="outline" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 size-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>

        <AuthMarketingPanel
          title="Reset your password"
          subtitle="We'll help you get back into your account."
        />
      </div>
    )
  }

  return (
    <div className="h-dvh lg:grid lg:grid-cols-2">
      <div className="flex h-full items-center justify-center space-y-6 sm:px-6 md:px-8">
        <div className="flex w-full flex-col gap-6 p-6 sm:max-w-lg">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>

          <div className="flex items-center gap-3">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 328 329"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-8.5"
            >
              <rect
                y="0.5"
                width="328"
                height="328"
                rx="164"
                fill="black"
                className="dark:fill-white"
              ></rect>
              <path
                d="M165.018 72.3008V132.771C165.018 152.653 148.9 168.771 129.018 168.771H70.2288"
                stroke="white"
                strokeWidth="20"
                className="dark:stroke-black"
              ></path>
              <path
                d="M166.627 265.241L166.627 204.771C166.627 184.889 182.744 168.771 202.627 168.771L261.416 168.771"
                stroke="white"
                strokeWidth="20"
                className="dark:stroke-black"
              ></path>
              <line
                x1="238.136"
                y1="98.8184"
                x2="196.76"
                y2="139.707"
                stroke="white"
                strokeWidth="20"
                className="dark:stroke-black"
              ></line>
              <line
                x1="135.688"
                y1="200.957"
                x2="94.3128"
                y2="241.845"
                stroke="white"
                strokeWidth="20"
                className="dark:stroke-black"
              ></line>
              <line
                x1="133.689"
                y1="137.524"
                x2="92.5566"
                y2="96.3914"
                stroke="white"
                strokeWidth="20"
                className="dark:stroke-black"
              ></line>
              <line
                x1="237.679"
                y1="241.803"
                x2="196.547"
                y2="200.671"
                stroke="white"
                strokeWidth="20"
                className="dark:stroke-black"
              ></line>
            </svg>
            <span className="text-xl font-semibold">Pixel Studio</span>
          </div>

          <div>
            <h2 className="mb-1.5 text-2xl font-semibold">Forgot your password?</h2>
            <p className="text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email address"
                type="email"
                required
                disabled={isPending}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-foreground hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <AuthMarketingPanel
        title="Reset your password"
        subtitle="We'll help you get back into your account."
      />
    </div>
  )
}
