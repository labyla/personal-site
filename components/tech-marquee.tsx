"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties, FocusEvent, PointerEvent } from "react"
import {
  Blocks,
  Braces,
  Code2,
  Database,
  FileText,
  Figma,
  Layers3,
  NotebookTabs,
  PenTool,
  Server,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react"

type Skill = {
  name: string
  color: string
  icon: LucideIcon
}

const skills: Skill[] = [
  { name: "React", color: "#61dafb", icon: Blocks },
  { name: "Next.js", color: "#ffffff", icon: Triangle },
  { name: "TypeScript", color: "#3178c6", icon: Braces },
  { name: "Tailwind CSS", color: "#38bdf8", icon: Wind },
  { name: "CSS", color: "#663399", icon: Code2 },
  { name: "Motion.dev", color: "#facc15", icon: Zap },
  { name: "Sanity CMS", color: "#f03e2f", icon: Layers3 },
  { name: "Figma", color: "#a259ff", icon: Figma },
  { name: "Notion", color: "#f5f5f5", icon: NotebookTabs },
  { name: "Markdown", color: "#ffffff", icon: FileText },
  { name: "Node.js", color: "#68a063", icon: Server },
  { name: "Express.js", color: "#f5f5f5", icon: PenTool },
  { name: "Redis", color: "#dc382d", icon: Database },
]

const marqueeItems = [...skills, ...skills, ...skills]
const marqueeGroupCount = 3

function SkillChip({ skill }: { skill: Skill }) {
  const Icon = skill.icon

  return (
    <div
      className="group flex items-center gap-2 whitespace-nowrap border border-border bg-secondary/40 px-3 py-2 transition-colors hover:border-accent/35 hover:bg-secondary/70"
      style={{ "--skill-color": skill.color } as CSSProperties}
    >
      <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[var(--skill-color)]" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
        {skill.name}
      </span>
    </div>
  )
}

export function TechMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const groupWidthRef = useRef(0)
  const isResettingScrollRef = useRef(false)

  useEffect(() => {
    function measureGroupWidth() {
      const container = scrollRef.current

      if (!container) {
        return 0
      }

      const groupWidth = container.scrollWidth / marqueeGroupCount
      groupWidthRef.current = groupWidth

      return groupWidth
    }

    function setInitialScrollPosition() {
      const container = scrollRef.current

      if (!container) {
        return
      }

      const groupWidth = measureGroupWidth()

      if (groupWidth === 0) {
        return
      }

      container.scrollLeft = groupWidth
    }

    function normalizeScrollPosition() {
      const container = scrollRef.current
      const groupWidth = groupWidthRef.current || measureGroupWidth()

      if (
        !container ||
        groupWidth === 0 ||
        isResettingScrollRef.current
      ) {
        return
      }

      if (container.scrollLeft < groupWidth * 0.45) {
        isResettingScrollRef.current = true
        container.scrollLeft += groupWidth
        isResettingScrollRef.current = false
      } else if (container.scrollLeft > groupWidth * 1.55) {
        isResettingScrollRef.current = true
        container.scrollLeft -= groupWidth
        isResettingScrollRef.current = false
      }
    }

    function tick(timestamp: number) {
      const container = scrollRef.current

      if (!container) {
        return
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }

      const delta = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      if (!isPausedRef.current) {
        groupWidthRef.current ||= measureGroupWidth()
        container.scrollLeft += delta * 0.035
        normalizeScrollPosition()
      }

      frameRef.current = window.requestAnimationFrame(tick)
    }

    const container = scrollRef.current
    setInitialScrollPosition()

    frameRef.current = window.requestAnimationFrame(tick)

    container?.addEventListener("scroll", normalizeScrollPosition, { passive: true })
    window.addEventListener("resize", setInitialScrollPosition)

    return () => {
      container?.removeEventListener("scroll", normalizeScrollPosition)
      window.removeEventListener("resize", setInitialScrollPosition)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  function pauseMarquee() {
    isPausedRef.current = true
  }

  function resumeMarquee() {
    isPausedRef.current = false
    lastTimeRef.current = null
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resumeMarquee()
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      resumeMarquee()
    }
  }

  return (
    <div className="border-y border-border bg-background/60">
      <div
        ref={scrollRef}
        aria-label="Scrollable skills list"
        className="skills-marquee py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={0}
        onMouseEnter={pauseMarquee}
        onMouseLeave={resumeMarquee}
        onPointerDown={pauseMarquee}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onFocus={pauseMarquee}
        onBlur={handleBlur}
      >
        <div className="flex w-max">
          {Array.from({ length: marqueeGroupCount }, (_, groupIndex) => (
            <div
              key={groupIndex}
              className="skills-marquee__group flex gap-3 pr-3"
              aria-hidden={groupIndex !== 1}
            >
              {marqueeItems.slice(groupIndex * skills.length, (groupIndex + 1) * skills.length).map((skill) => (
                <SkillChip key={`${groupIndex}-${skill.name}`} skill={skill} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
