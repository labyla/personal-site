"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

const INTRO_TEXT = "Aayush Bharti"
const MIN_INTRO_MS = 900
const EXIT_DELAY_MS = 220
const MAX_CONTENT_WAIT_MS = 6000

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function withTimeout(promise: Promise<unknown>, ms: number) {
  return Promise.race([promise, wait(ms)])
}

function waitForWindowLoad() {
  if (document.readyState === "complete") {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true })
  })
}

async function waitForFonts() {
  if (!("fonts" in document)) {
    return
  }

  await document.fonts.ready
}

async function waitForRequiredImages() {
  await new Promise((resolve) => window.requestAnimationFrame(resolve))

  const images = Array.from(document.images).filter((image) => {
    const rect = image.getBoundingClientRect()
    const isNearViewport = rect.top < window.innerHeight * 1.25 && rect.bottom > -120

    return image.loading !== "lazy" || isNearViewport
  })

  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) {
        return
      }

      await withTimeout(
        new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true })
          image.addEventListener("error", () => resolve(), { once: true })
        }),
        2500,
      )
    }),
  )
}

export function IntroOverlay() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [shouldPlay, setShouldPlay] = useState(true)
  const [isTextExiting, setIsTextExiting] = useState(false)

  useEffect(() => {
    let isCancelled = false
    let progressFrame = 0

    function finish() {
      setProgress(100)

      window.setTimeout(() => {
        if (!isCancelled) {
          setIsTextExiting(true)
        }
      }, EXIT_DELAY_MS)

      window.setTimeout(() => {
        if (!isCancelled) {
          setShouldPlay(false)
        }
      }, EXIT_DELAY_MS + 420)
    }

    function animateProgress() {
      setProgress((currentProgress) => {
        if (currentProgress >= 92) {
          return currentProgress
        }

        return currentProgress + Math.max((92 - currentProgress) * 0.035, 0.35)
      })

      progressFrame = window.requestAnimationFrame(animateProgress)
    }

    setIsTextExiting(false)
    setProgress(8)
    setShouldPlay(true)
    progressFrame = window.requestAnimationFrame(animateProgress)

    const minimumIntro = new Promise<void>((resolve) => {
      window.setTimeout(resolve, MIN_INTRO_MS)
    })

    withTimeout(Promise.all([
      minimumIntro,
      waitForWindowLoad(),
      waitForFonts(),
      waitForRequiredImages(),
    ]), MAX_CONTENT_WAIT_MS).then(() => {
      window.cancelAnimationFrame(progressFrame)

      if (!isCancelled) {
        finish()
      }
    })

    return () => {
      isCancelled = true
      window.cancelAnimationFrame(progressFrame)
    }
  }, [pathname])

  const letters = useMemo(() => INTRO_TEXT.split(""), [])

  return (
    <AnimatePresence>
      {shouldPlay && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-2%" }}
          transition={{ duration: 0.32, ease: "easeInOut" }}
        >
          <div className="flex max-w-full flex-col items-stretch px-5">
            <motion.div
              className="intro-word flex max-w-full overflow-hidden text-center text-4xl font-bold uppercase leading-none tracking-normal sm:text-6xl md:text-7xl lg:text-8xl"
              initial="hidden"
              animate={isTextExiting ? "exit" : "visible"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.045,
                    delayChildren: 0.15,
                  },
                },
                exit: {
                  transition: {
                    staggerChildren: 0.025,
                    staggerDirection: -1,
                  },
                },
              }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  className={letter === " " ? "w-3 sm:w-5" : "inline-block"}
                  variants={{
                    hidden: { y: "120%", opacity: 0 },
                    visible: {
                      y: "0%",
                      opacity: 1,
                      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                    },
                    exit: {
                      y: "120%",
                      opacity: 0,
                      transition: { duration: 0.34, ease: [0.64, 0, 0.78, 0] },
                    },
                  }}
                >
                  {letter === " " ? "\u00a0" : letter}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="mt-5 h-px overflow-hidden bg-border/70"
              initial={{ opacity: 0, scaleX: 0.94 }}
              animate={{
                opacity: isTextExiting ? 0 : 1,
                scaleX: isTextExiting ? 0.94 : 1,
              }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full origin-left bg-accent"
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: progress === 100 ? 0.18 : 0.24, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
