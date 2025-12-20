"use client"

import { Suspense, useState, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"

import { resetPasswordAction } from "@/modules/auth/api/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthMarketingPanel } from "@/modules/auth/components/auth-marketing-panel"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Check if we have required params
  const hasRequiredParams = email && token

  async function handleSubmit(formData: FormData) {
    setError(null)

    const newPassword = formData.get("newPassword") as string
    const confirmNewPassword = formData.get("confirmNewPassword") as string

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match")
      return
    }

    startTransition(async () => {
      const result = await resetPasswordAction({
        email,
        token,
        newPassword,
        confirmNewPassword,
      })

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to reset password")
      }
    })
  }

  if (!hasRequiredParams) {
    return (
      <div className="h-dvh lg:grid lg:grid-cols-2">
        <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="size-8 text-red-600 dark:text-red-400" />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Invalid reset link</h2>
              <p className="text-muted-foreground">
                This password reset link is invalid or has expired. Please request a
                new one.
              </p>
            </div>

            <Button asChild>
              <Link href="/forgot-password">Request new link</Link>
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

  if (success) {
    return (
      <div className="h-dvh lg:grid lg:grid-cols-2">
        <div className="flex h-full items-center justify-center sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center gap-6 p-6 text-center sm:max-w-lg">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold">Password reset!</h2>
              <p className="text-muted-foreground">
                Your password has been successfully reset. You can now log in with
                your new password.
              </p>
            </div>

            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>

        <AuthMarketingPanel
          title="Password updated!"
          subtitle="Your account is now secure with your new password."
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
            <h2 className="mb-1.5 text-2xl font-semibold">Reset your password</h2>
            <p className="text-muted-foreground">
              Enter your new password below.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="w-full space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  placeholder="••••••••••••••••"
                  type={showPassword ? "text" : "password"}
                  className="pr-9"
                  required
                  disabled={isPending}
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full w-9 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>

            <div className="w-full space-y-1">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  placeholder="••••••••••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-9"
                  required
                  disabled={isPending}
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full w-9 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </div>
      </div>

      <AuthMarketingPanel
        title="Reset your password"
        subtitle="Choose a strong password to keep your account secure."
      />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
