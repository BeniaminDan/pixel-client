import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AuthMarketingPanel({
    title,
    subtitle,
}: {
    title: string
    subtitle: string
}) {
    return (
        <div className="bg-muted h-screen p-5 max-lg:hidden">
            <div className="text-card-foreground flex flex-col overflow-hidden gap-6 rounded-xl border shadow-sm bg-primary relative h-full justify-between border-none py-8">
                <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-6 px-8">
                    <div className="text-primary-foreground text-4xl font-bold lg:text-5xl/snug">
                        {title}
                    </div>
                    <p className="text-primary-foreground text-xl">{subtitle}</p>
                </div>
                <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 128 128"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-secondary/10 pointer-events-none absolute bottom-30 -left-50 size-130"
                >
                    <path
                        d="M63.6734 24.8486V49.3899C63.6734 57.4589 57.1322 64.0001 49.0632 64.0001H25.2041"
                        stroke="currentColor"
                        strokeWidth="8.11681"
                    ></path>
                    <path
                        d="M64.3266 103.152L64.3266 78.6106C64.3266 70.5416 70.8678 64.0003 78.9368 64.0003L102.796 64.0004"
                        stroke="currentColor"
                        strokeWidth="8.11681"
                    ></path>
                    <line
                        x1="93.3468"
                        y1="35.6108"
                        x2="76.555"
                        y2="52.205"
                        stroke="currentColor"
                        strokeWidth="8.11681"
                    ></line>
                    <line
                        x1="51.7697"
                        y1="77.0624"
                        x2="34.9778"
                        y2="93.6567"
                        stroke="currentColor"
                        strokeWidth="8.11681"
                    ></line>
                    <line
                        x1="50.9584"
                        y1="51.3189"
                        x2="34.2651"
                        y2="34.6256"
                        stroke="currentColor"
                        strokeWidth="8.11681"
                    ></line>
                    <line
                        x1="93.1625"
                        y1="93.6397"
                        x2="76.4692"
                        y2="76.9464"
                        stroke="currentColor"
                        strokeWidth="8.11681"
                    ></line>
                </svg>
                <div className="relative z-1 mx-8 h-62 overflow-hidden rounded-2xl px-0">
                    <svg
                        width="1094"
                        height="249"
                        viewBox="0 0 1094 249"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none absolute right-0 -z-1 select-none"
                    >
                        <path
                            d="M0.263672 16.8809C0.263672 8.0443 7.42712 0.880859 16.2637 0.880859H786.394H999.115C1012.37 0.880859 1023.12 11.626 1023.12 24.8808L1023.12 47.3809C1023.12 60.6357 1033.86 71.3809 1047.12 71.3809H1069.6C1082.85 71.3809 1093.6 82.126 1093.6 95.3809L1093.6 232.881C1093.6 241.717 1086.43 248.881 1077.6 248.881H16.2637C7.42716 248.881 0.263672 241.717 0.263672 232.881V16.8809Z"
                            fill="var(--card)"
                        ></path>
                    </svg>
                    <div className="bg-card absolute top-0 right-0 flex size-15 items-center justify-center rounded-2xl">
                        <svg
                            width="1em"
                            height="1em"
                            viewBox="0 0 128 128"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-15"
                        >
                            <path
                                d="M63.6734 24.8486V49.3899C63.6734 57.4589 57.1322 64.0001 49.0632 64.0001H25.2041"
                                stroke="currentColor"
                                strokeWidth="8.11681"
                            ></path>
                            <path
                                d="M64.3266 103.152L64.3266 78.6106C64.3266 70.5416 70.8678 64.0003 78.9368 64.0003L102.796 64.0004"
                                stroke="currentColor"
                                strokeWidth="8.11681"
                            ></path>
                            <line
                                x1="93.3468"
                                y1="35.6108"
                                x2="76.555"
                                y2="52.205"
                                stroke="currentColor"
                                strokeWidth="8.11681"
                            ></line>
                            <line
                                x1="51.7697"
                                y1="77.0624"
                                x2="34.9778"
                                y2="93.6567"
                                stroke="currentColor"
                                strokeWidth="8.11681"
                            ></line>
                            <line
                                x1="50.9584"
                                y1="51.3189"
                                x2="34.2651"
                                y2="34.6256"
                                stroke="currentColor"
                                strokeWidth="8.11681"
                            ></line>
                            <line
                                x1="93.1625"
                                y1="93.6397"
                                x2="76.4692"
                                y2="76.9464"
                                stroke="currentColor"
                                strokeWidth="8.11681"
                            ></line>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-5 p-6">
                        <p className="line-clamp-2 pr-12 text-3xl font-bold">
                            We&apos;re excited to have you join our community
                        </p>
                        <p className="line-clamp-2 text-lg">
                            Your account will allow you to securely save your progress, customize
                            your preferences.
                        </p>
                        <div className="flex -space-x-4 self-end">
                            <Avatar className="ring-background size-12 ring-2">
                                <AvatarImage
                                    src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png"
                                    alt="Olivia Sparks"
                                />
                                <AvatarFallback className="text-xs">OS</AvatarFallback>
                            </Avatar>
                            <Avatar className="ring-background size-12 ring-2">
                                <AvatarImage
                                    src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png"
                                    alt="Howard Lloyd"
                                />
                                <AvatarFallback className="text-xs">HL</AvatarFallback>
                            </Avatar>
                            <Avatar className="ring-background size-12 ring-2">
                                <AvatarImage
                                    src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
                                    alt="Hallie Richards"
                                />
                                <AvatarFallback className="text-xs">HR</AvatarFallback>
                            </Avatar>
                            <Avatar className="ring-background size-12 ring-2">
                                <AvatarFallback className="bg-muted flex size-full items-center justify-center rounded-full text-xs">
                                    +3695
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
