"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { loginAction } from "@/actions/auth"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="h-dvh lg:grid lg:grid-cols-2">
            <div className="flex h-full items-center justify-center space-y-6 sm:px-6 md:px-8">
                <div className="flex w-full flex-col gap-6 p-6 sm:max-w-lg">
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
                        <h2 className="mb-1.5 text-2xl font-semibold">Welcome back</h2>
                        <p className="text-muted-foreground">
                            Login to your account to continue
                        </p>
                    </div>
                    <form action={loginAction}>
                        <Button type="submit" variant="outline" className="w-full">
                            <svg
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="google"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 488 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                ></path>
                            </svg>
                            Login with Google
                        </Button>
                    </form>
                    <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <p className="text-muted-foreground text-sm">or</p>
                        <Separator className="flex-1" />
                    </div>
                    <div className="space-y-4">
                        <form action={loginAction} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="userEmail">Email address</Label>
                                <Input
                                    id="userEmail"
                                    name="email"
                                    placeholder="Enter your email address"
                                    type="email"
                                    required
                                />
                            </div>
                            <div className="w-full space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="text-sm font-medium text-muted-foreground hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="••••••••••••••••"
                                        type={showPassword ? "text" : "password"}
                                        className="pr-9"
                                        required
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
                            <div className="flex items-center gap-3">
                                <Checkbox id="rememberMe" />
                                <Label htmlFor="rememberMe" className="font-normal text-muted-foreground">
                                    Remember me
                                </Label>
                            </div>
                            <Button type="submit" className="w-full">
                                Login to Shadcn Studio
                            </Button>
                        </form>
                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-foreground hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthMarketingPanel
                title="Welcome back!"
                subtitle="We're glad to see you again. Continue your journey with us."
            />
        </div>
    )
}
