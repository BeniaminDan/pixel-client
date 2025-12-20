import { redirect } from "next/navigation"
import { auth } from "@/modules/auth/lib/auth"
import { ChangePasswordForm } from "./_components/change-password-form"
import { DeleteAccountSection } from "./_components/delete-account-section"
import { EmailSection } from "./_components/email-section"

export const metadata = {
  title: "Settings | Pixel Studio",
  description: "Manage your account settings",
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/settings")
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and security preferences.
        </p>
      </div>

      <div className="space-y-8">
        <EmailSection email={session.user?.email || ""} />
        <ChangePasswordForm />
        <DeleteAccountSection />
      </div>
    </div>
  )
}
