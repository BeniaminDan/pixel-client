"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User } from "lucide-react"

import { updateProfileAction } from "@/actions/account"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileFormProps {
  initialData: {
    name: string
    email: string
    image?: string
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const userInitials = initialData.name
    ? initialData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : initialData.email.slice(0, 2).toUpperCase()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const name = formData.get("name") as string

      const result = await updateProfileAction({ name })

      if (result.success) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || "Failed to update profile")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="size-20">
              <AvatarImage src={initialData.image} alt={initialData.name} />
              <AvatarFallback className="text-lg">
                {userInitials || <User className="size-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Profile Picture</p>
              <p className="text-sm text-muted-foreground">
                Avatar is managed through your SSO provider.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              Profile updated successfully!
            </div>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                defaultValue={initialData.name}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={initialData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here. Visit{" "}
                <a href="/settings" className="underline hover:text-foreground">
                  Settings
                </a>{" "}
                to update your email.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
