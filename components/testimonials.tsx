"use client"

import { useEffect, useRef } from "react"
import { Quote, Star } from "lucide-react"
import Image from "next/image"

import type { TestimonialListItem } from "@/lib/data/testimonials"

type TestimonialsProps = {
  testimonials: TestimonialListItem[]
}

const marqueeGroupCount = 6
const baseSpeed = 0.048
const hoverSpeedMultiplier = 0.72
const maxVelocityBoost = 0.32
const maxFrameMovement = 96

function TestimonialCard({ testimonial }: { testimonial: TestimonialListItem }) {
  return (
    <article className="w-[82vw] max-w-[24rem] shrink-0 border border-border bg-card p-5 transition-colors hover:border-accent/35 focus-within:border-accent/35 sm:w-[23rem] md:w-[25rem] md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
          ))}
        </div>
        <Quote className="h-7 w-7 text-muted-foreground/25" />
      </div>

      <p className="min-h-32 text-sm leading-7 text-muted-foreground md:text-base">
        {testimonial.quote}
      </p>

      <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-border bg-secondary">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </article>
  )
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const lastScrollYRef = useRef(0)
  const lastScrollTimeRef = useRef(0)
  const directionRef = useRef(-1)
  const offsetRef = useRef(0)
  const velocityBoostRef = useRef(0)
  const groupWidthRef = useRef(0)
  const speedMultiplierRef = useRef(1)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY
    lastScrollTimeRef.current = performance.now()

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

      if (!track) {
        return
      }

      const groupWidth = measureGroupWidth()

      if (groupWidth === 0) {
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

    function addVelocityBoost(amount: number) {
      velocityBoostRef.current = Math.min(
        maxVelocityBoost,
        velocityBoostRef.current + amount,
      )
    }

    function handleWheel(event: WheelEvent) {
      if (event.deltaY === 0) {
        return
      }

      directionRef.current = event.deltaY > 0 ? -1 : 1
      addVelocityBoost(Math.abs(event.deltaY) * 0.001)
    }

    function handleScroll() {
      const scrollY = window.scrollY
      const now = performance.now()
      const deltaY = scrollY - lastScrollYRef.current
      const deltaTime = Math.max(16, now - lastScrollTimeRef.current)

      if (deltaY !== 0) {
        directionRef.current = deltaY > 0 ? -1 : 1
        addVelocityBoost(Math.min(maxVelocityBoost, Math.abs(deltaY / deltaTime) * 0.11))
      }

      lastScrollYRef.current = scrollY
      lastScrollTimeRef.current = now
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

      const groupWidth = groupWidthRef.current || measureGroupWidth()

      if (groupWidth === 0) {
        renderOffset()
        frameRef.current = window.requestAnimationFrame(tick)
        return
      }

      const movement =
        directionRef.current *
        (baseSpeed + velocityBoostRef.current) *
        speedMultiplierRef.current *
        delta
      const clampedMovement = Math.max(
        -maxFrameMovement,
        Math.min(maxFrameMovement, movement),
      )

      offsetRef.current += clampedMovement
      velocityBoostRef.current *= Math.pow(0.88, delta / 16.67)
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

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  function slowMarquee() {
    speedMultiplierRef.current = hoverSpeedMultiplier
  }

  function resumeMarqueeSpeed() {
    speedMultiplierRef.current = 1
    lastFrameTimeRef.current = null
  }

  return (
    <section className="overflow-hidden border-y border-border bg-card/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 md:mb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            TESTIMONIALS
          </p>
          <h2 className="text-4xl font-bold uppercase leading-none md:text-6xl">Word on the street</h2>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="testimonials-marquee focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onMouseEnter={slowMarquee}
        onMouseLeave={resumeMarqueeSpeed}
        onFocus={slowMarquee}
        onBlur={resumeMarqueeSpeed}
      >
        <div ref={trackRef} className="testimonials-marquee__track flex w-max">
          {Array.from({ length: marqueeGroupCount }, (_, groupIndex) => (
            <div
              ref={groupIndex === 0 ? groupRef : undefined}
              key={groupIndex}
              className="testimonials-marquee__group flex gap-4 pr-4 md:gap-5 md:pr-5"
              aria-hidden={groupIndex !== 0}
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={`${groupIndex}-${testimonial.id}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            {testimonial.quote} - {testimonial.name}, {testimonial.role}
          </li>
        ))}
      </ul>
    </section>
  )
}
