"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

const INTRO_TEXT = "Aayush Bharti"
const TEXT_EXIT_START_MS = 820
const INTRO_DURATION_MS = 1180

export function IntroOverlay() {
  const [shouldPlay, setShouldPlay] = useState(false)
  const [isTextExiting, setIsTextExiting] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      return
    }

    setIsTextExiting(false)
    setShouldPlay(true)

    const textExitTimeout = window.setTimeout(() => {
      setIsTextExiting(true)
    }, TEXT_EXIT_START_MS)

    const overlayExitTimeout = window.setTimeout(() => {
      setShouldPlay(false)
    }, INTRO_DURATION_MS)

    return () => {
      window.clearTimeout(textExitTimeout)
      window.clearTimeout(overlayExitTimeout)
    }
  }, [])

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
          <motion.div
            className="intro-word flex max-w-full overflow-hidden px-5 text-center text-4xl font-bold uppercase leading-none tracking-normal sm:text-6xl md:text-7xl lg:text-8xl"
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
