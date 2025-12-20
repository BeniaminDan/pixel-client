import { redirect } from "next/navigation"
import { auth } from "@/modules/auth";
import { getProfileAction } from "@/modules/account/server/actions/account";
import { ProfileForm } from "./_components/profile-form"

export const metadata = {
  title: "Profile | Pixel Studio",
  description: "Manage your profile settings",
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/profile")
  }

  const profileResult = await getProfileAction()

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="space-y-8">
        <ProfileForm
          initialData={{
            name: profileResult.data?.name || session.user?.name || "",
            email: profileResult.data?.email || session.user?.email || "",
          }}
        />
      </div>
      <pre>{JSON.stringify(profileResult)}</pre>
    </div>
  )
}
