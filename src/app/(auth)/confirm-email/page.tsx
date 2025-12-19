"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"

import { confirmEmailAction, resendConfirmationAction } from "@/features/auth/api/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthMarketingPanel } from "@/features/auth/components/auth-marketing-panel"

type ConfirmationState = "loading" | "success" | "error" | "expired"

function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId") || ""
  const token = searchParams.get("token") || ""
  const hasRequiredParams = !!(userId && token)

  const [state, setState] = useState<ConfirmationState>(
    hasRequiredParams ? "loading" : "error"
  )
  const [error, setError] = useState<string | null>(
    hasRequiredParams ? null : "Invalid confirmation link"
  )
  const [resendEmail, setResendEmail] = useState("")
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Use ref to track if confirmation has been attempted
  const hasAttemptedRef = useRef(false)

  // Perform confirmation on mount
  useEffect(() => {
    if (!hasRequiredParams || hasAttemptedRef.current) {
      return
    }

    hasAttemptedRef.current = true

    // Use startTransition to trigger the confirmation
    startTransition(async () => {
      const result = await confirmEmailAction(userId, token)

      if (result.success) {
        setState("success")
      } else {
        setState("error")
        setError(result.error || "Failed to confirm email")
      }
    })
  }, [hasRequiredParams, userId, token, startTransition])

  async function handleResend(formData: FormData) {
    const email = formData.get("email") as string
    setResendEmail(email)

    startTransition(async () => {
      const result = await resendConfirmationAction(email)

      if (result.success) {
        setResendSuccess(true)
      } else {
        setError(result.error || "Failed to resend confirmation email")
      }
    })
  }

  // Loading state
  if (state === "loading") {
    return (
      <div className="h-dvh lg:grid lg:grid-cols-2">
        <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
            <Loader2 className="size-12 animate-spin text-muted-foreground" />
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Confirming your email...</h2>
              <p className="text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        </div>

        <AuthMarketingPanel
          title="Email verification"
          subtitle="Almost there! We're verifying your email address."
        />
      </div>
    )
  }

  // Success state
  if (state === "success") {
    return (
      <div className="h-dvh lg:grid lg:grid-cols-2">
        <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Email confirmed!</h2>
              <p className="text-muted-foreground">
                Your email has been verified. You can now log in to your account.
              </p>
            </div>

            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>

        <AuthMarketingPanel
          title="Welcome aboard!"
          subtitle="Your email is verified and you're ready to get started."
        />
      </div>
    )
  }

  // Resend success state
  if (resendSuccess) {
    return (
      <div className="h-dvh lg:grid lg:grid-cols-2">
        <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Mail className="size-8 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Confirmation email sent</h2>
              <p className="text-muted-foreground">
                We&apos;ve sent a new confirmation link to{" "}
                <span className="font-medium text-foreground">{resendEmail}</span>.
                Please check your inbox.
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </div>

        <AuthMarketingPanel
          title="Check your inbox"
          subtitle="A new confirmation email is on its way."
        />
      </div>
    )
  }

  // Error state with resend option
  return (
    <div className="h-dvh lg:grid lg:grid-cols-2">
      <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
        <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="size-8 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Confirmation failed</h2>
            <p className="text-muted-foreground">
              {error || "The confirmation link is invalid or has expired."}
            </p>
          </div>

          <div className="w-full max-w-sm">
            <p className="mb-4 text-sm text-muted-foreground">
              Enter your email to receive a new confirmation link:
            </p>

            <form action={handleResend} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="sr-only">
                  Email address
                </Label>
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
                  "Resend confirmation email"
                )}
              </Button>
            </form>
          </div>

          <Button variant="outline" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>

      <AuthMarketingPanel
        title="Email verification"
        subtitle="Let's get your email verified."
      />
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh lg:grid lg:grid-cols-2">
          <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
            <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
              <Loader2 className="size-12 animate-spin text-muted-foreground" />
              <div>
                <h2 className="mb-2 text-2xl font-semibold">Loading...</h2>
                <p className="text-muted-foreground">
                  Please wait while we load the page.
                </p>
              </div>
            </div>
          </div>
          <AuthMarketingPanel
            title="Email verification"
            subtitle="Almost there!"
          />
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  )
}

// Import Suspense
import { Suspense } from "react"
