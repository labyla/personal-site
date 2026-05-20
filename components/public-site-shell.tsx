import type { ReactNode } from "react"

import { GlobalBackground } from "@/components/global-background"
import { IntroOverlay } from "@/components/intro-overlay"

type PublicSiteShellProps = {
  children: ReactNode
}

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  return (
    <>
      <GlobalBackground />
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
      <IntroOverlay />
    </>
  )
}
