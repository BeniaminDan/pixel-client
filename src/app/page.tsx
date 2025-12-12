import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { FluidHeroBackground } from '@/components'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const audienceAvatars = [
  {
    alt: 'Olivia Sparks',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
  },
  {
    alt: 'Howard Lloyd',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
  },
  {
    alt: 'Hallie Richards',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
  },
  {
    alt: 'Jenny Wilson',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',
  },
]

export default function Home() {
  return (
    <main className='relative flex min-h-screen flex-col bg-background text-foreground'>
      <section className='relative isolate flex min-h-[100dvh] w-full items-center overflow-hidden pt-header pb-12 sm:pb-16 lg:pb-24'>
        <FluidHeroBackground
          config={{
            BACK_TRANSPARENT: true,
            COLOR_PALETTE: ['var(--primary)'],
            BLOOM_INTENSITY: 0.6,        // Less glow (default 1.46)
            DENSITY_DISSIPATION: 2.0,    // Faster fade (default 1.3)
          }}
          overlayClassName='from-black/55 via-black/45 to-black/65'
        />

        <div className='container relative flex flex-col items-center gap-10 sm:gap-16 lg:gap-20'>
          <div className='flex max-w-3xl flex-col items-center gap-4 text-center'>
            <Badge className='border-white/20 bg-white/10 px-3 py-1 text-sm font-normal text-white'>
              Check new updates
            </Badge>
            <h1 className='text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl lg:font-bold'>
              Design High-Quality Websites
            </h1>
            <p className='max-w-2xl text-lg text-white/70'>
              Craft stunning websites faster with our UI kit. Access polished, fully
              customisable components and layouts for a smooth, visually striking UX.
            </p>
            <div className='flex flex-wrap items-center gap-4'>
              <Button
                asChild
                size='lg'
                className='rounded-lg bg-primary px-5 text-base text-white shadow-md transition-none hover:bg-[#d9784b]'
              >
                <Link href='#'>
                  Start Building now
                  <ArrowRight className='size-5' />
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='rounded-lg border-white/20 bg-white/10 px-6 text-base text-white hover:bg-white/20'
              >
                <Link href='#'>Sign up</Link>
              </Button>
            </div>
            <div className='mt-10 flex items-center rounded-full border border-white/10 bg-white/10 p-1.5 shadow-sm backdrop-blur'>
              <div className='flex -space-x-2'>
                {audienceAvatars.map((avatar) => (
                  <Avatar
                    key={avatar.alt}
                    className='ring-background size-12 ring-2'
                  >
                    <AvatarImage alt={avatar.alt} src={avatar.src} />
                    <AvatarFallback>{avatar.alt.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className='px-3 text-xs text-white/70'>
                Loved by <span className='text-primary'>+23k</span> more people
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
