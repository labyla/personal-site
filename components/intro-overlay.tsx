"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

const INTRO_TEXT = "Aayush Bharti"
const INTRO_DURATION_MS = 2300

export function IntroOverlay() {
  const [shouldPlay, setShouldPlay] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      return
    }

    setShouldPlay(true)

    const timeout = window.setTimeout(() => {
      setShouldPlay(false)
    }, INTRO_DURATION_MS)

    return () => window.clearTimeout(timeout)
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
          exit={{ opacity: 0, y: "-3%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <motion.div
            className="intro-word flex max-w-full overflow-hidden px-5 text-center text-4xl font-bold uppercase leading-none tracking-normal sm:text-6xl md:text-7xl lg:text-8xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.045,
                  delayChildren: 0.15,
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
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
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
