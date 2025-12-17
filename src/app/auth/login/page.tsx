import { signIn } from "@/auth";

export default function LoginPage() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("openiddict", { redirectTo: "/app" });
            }}
        >
            <button type="submit">Sign in</button>
        </form>
    );
}