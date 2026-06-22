"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties, FocusEvent, PointerEvent } from "react"

import type { TechStackItem } from "@/components/tech-stack-data"

const marqueeGroupCount = 6
const baseSpeed = 0.035
const hoverSpeedMultiplier = 0.72
const maxFrameMovement = 72

type MarqueeRowProps = {
  ariaLabel: string
  direction: -1 | 1
  items: TechStackItem[]
  rowClassName?: string
}

function MarqueeChip({ item }: { item: TechStackItem }) {
  return (
    <div
      className="group flex items-center gap-2 whitespace-nowrap border border-border bg-secondary/40 px-3 py-2 transition-colors hover:border-accent/35 hover:bg-secondary/70"
      style={{ "--skill-color": item.color } as CSSProperties}
    >
      {item.icon && (
        <img
          alt=""
          className="h-4 w-4 object-contain opacity-65 brightness-0 invert transition duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
          src={item.icon}
        />
      )}
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
        {item.name}
      </span>
    </div>
  )
}

function MarqueeRow({ ariaLabel, direction, items, rowClassName }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const groupWidthRef = useRef(0)
  const speedMultiplierRef = useRef(1)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)

  useEffect(() => {
    function measureGroupWidth() {
      const group = groupRef.current

      if (!group) {
        return 0
      }

      const groupWidth = group.getBoundingClientRect().width
      groupWidthRef.current = groupWidth

      return groupWidth
    }

    function renderOffset() {
      const track = trackRef.current
      const groupWidth = groupWidthRef.current || measureGroupWidth()

      if (!track || groupWidth === 0) {
        return
      }

      offsetRef.current = ((offsetRef.current % groupWidth) + groupWidth) % groupWidth

      if (offsetRef.current > 0) {
        offsetRef.current -= groupWidth
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
    }

    function handleResize() {
      window.requestAnimationFrame(renderOffset)
    }

    function tick(timestamp: number) {
      const track = trackRef.current

      if (!track) {
        return
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp
      }

      const delta = timestamp - lastFrameTimeRef.current
      lastFrameTimeRef.current = timestamp

      const movement = direction * baseSpeed * speedMultiplierRef.current * delta
      const clampedMovement = Math.max(
        -maxFrameMovement,
        Math.min(maxFrameMovement, movement),
      )

      offsetRef.current += clampedMovement
      renderOffset()

      frameRef.current = window.requestAnimationFrame(tick)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    renderOffset()
    window.requestAnimationFrame(renderOffset)

    frameRef.current = window.requestAnimationFrame(tick)

    if (groupRef.current) {
      resizeObserver.observe(groupRef.current)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", handleResize)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  function slowMarquee() {
    speedMultiplierRef.current = hoverSpeedMultiplier
  }

  function pauseMarquee() {
    speedMultiplierRef.current = 0
  }

  function resumeMarqueeSpeed() {
    speedMultiplierRef.current = 1
    lastFrameTimeRef.current = null
  }

  function handleMouseLeave() {
    if (!isDraggingRef.current) {
      resumeMarqueeSpeed()
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resumeMarqueeSpeed()
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && isDraggingRef.current) {
      isDraggingRef.current = false

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      if (!event.currentTarget.matches(":hover")) {
        resumeMarqueeSpeed()
      } else {
        slowMarquee()
      }
    }

    if (event.pointerType !== "mouse") {
      resumeMarqueeSpeed()
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pauseMarquee()

    if (event.pointerType !== "mouse" || event.button !== 0) {
      return
    }

    isDraggingRef.current = true
    dragStartXRef.current = event.clientX
    dragStartOffsetRef.current = offsetRef.current
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return
    }

    event.preventDefault()
    const dragDistance = event.clientX - dragStartXRef.current
    offsetRef.current = dragStartOffsetRef.current + dragDistance

    const track = trackRef.current
    const groupWidth = groupWidthRef.current

    if (!track || groupWidth === 0) {
      return
    }

    offsetRef.current = ((offsetRef.current % groupWidth) + groupWidth) % groupWidth

    if (offsetRef.current > 0) {
      offsetRef.current -= groupWidth
    }

    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
  }

  return (
    <div
      aria-label={ariaLabel}
      className={`skills-marquee py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rowClassName || ""}`}
      tabIndex={0}
      onMouseEnter={slowMarquee}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onFocus={slowMarquee}
      onBlur={handleBlur}
    >
      <div ref={trackRef} className="skills-marquee__track flex w-max">
        {Array.from({ length: marqueeGroupCount }, (_, groupIndex) => (
          <div
            ref={groupIndex === 0 ? groupRef : undefined}
            key={groupIndex}
            className="skills-marquee__group flex gap-3 pr-3"
            aria-hidden={groupIndex !== 0}
          >
            {items.map((item) => (
              <MarqueeChip key={`${groupIndex}-${item.name}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

type TechMarqueeProps = {
  skills: TechStackItem[]
  tools: TechStackItem[]
}

export function TechMarquee({ skills, tools }: TechMarqueeProps) {
  return (
    <div className="border-y border-border bg-background/60">
      <MarqueeRow
        ariaLabel="Scrollable skills list"
        direction={-1}
        items={skills}
        rowClassName="border-b border-border/70"
      />
      <MarqueeRow
        ariaLabel="Scrollable tools and apps list"
        direction={1}
        items={tools}
      />
    </div>
  )
}
