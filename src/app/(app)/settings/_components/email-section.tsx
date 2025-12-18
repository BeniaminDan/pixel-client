"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail } from "lucide-react"

import { refreshEmailAction } from "@/features/auth/api/actions/account"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmailSectionProps {
  email: string
}

export function EmailSection({ email }: EmailSectionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    const newEmail = formData.get("newEmail") as string

    if (newEmail === email) {
      setError("New email must be different from current email")
      return
    }

    startTransition(async () => {
      const result = await refreshEmailAction(newEmail)

      if (result.success) {
        setSuccess(true)
        router.refresh()
      } else {
        setError(result.error || "Failed to update email")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Address</CardTitle>
        <CardDescription>
          Manage your email address for notifications and sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Mail className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{email}</p>
              <p className="text-sm text-muted-foreground">Primary email</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Change email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Email Address</DialogTitle>
                <DialogDescription>
                  Enter your new email address. We&apos;ll send a confirmation link to
                  verify it.
                </DialogDescription>
              </DialogHeader>

              <form action={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-md border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    Confirmation email sent! Please check your inbox.
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentEmail">Current Email</Label>
                  <Input
                    id="currentEmail"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newEmail">New Email Address</Label>
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    placeholder="new@example.com"
                    required
                    disabled={isPending || success}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                      setError(null)
                      setSuccess(false)
                    }}
                    disabled={isPending}
                  >
                    {success ? "Close" : "Cancel"}
                  </Button>
                  {!success && (
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send confirmation"
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
