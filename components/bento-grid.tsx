"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import Link from "next/link"

const bentoCards = [
  {
    title: "LET'S BUILD TOGETHER",
    description: "Clear communication, fast iterations, no surprises",
    className: "col-span-2 row-span-1",
    gradient: "from-pink-500/20 to-purple-500/20",
    icon: MessageCircle
  }
]

export function BentoGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main card - Let's Build Together */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 relative group"
          >
            <Link
              href="#contact"
              className="block h-full p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-border rounded-2xl hover:border-pink-500/30 transition-all"
            >
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <div>
                  <p className="text-xs text-pink-400 font-medium mb-2 uppercase tracking-wider">
                    {"LET'S BUILD TOGETHER"}
                  </p>
                  <p className="text-muted-foreground">
                    Clear communication, fast iterations, no surprises
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-pink-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 relative"
          >
            <div className="h-full p-6 bg-card border border-border rounded-2xl">
              <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
                THE STACK
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {"What you see, pixel-perfect UI, elegance in motion."}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-secondary text-xs rounded-md">React</span>
                <span className="px-2 py-1 bg-secondary text-xs rounded-md">Next.js</span>
                <span className="px-2 py-1 bg-secondary text-xs rounded-md">TypeScript</span>
              </div>
            </div>
          </motion.div>

          {/* Available for hire card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 relative"
          >
            <div className="h-full p-6 bg-card border border-border rounded-2xl flex flex-col justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                  PROJECTS
                </p>
                <p className="font-semibold text-3xl">20+</p>
              </div>
              <p className="text-sm text-muted-foreground">Globally shipped</p>
            </div>
          </motion.div>

          {/* Tools card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 md:col-span-2 relative group"
          >
            <Link
              href="#tools"
              className="block h-full p-6 bg-card border border-border rounded-2xl hover:border-border/80 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                    WORKFLOW
                  </p>
                  <p className="text-foreground font-medium">Check out my favorite tools</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          {/* Experience card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 md:col-span-2 relative"
          >
            <div className="h-full p-6 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                    EXPERIENCE
                  </p>
                  <p className="font-semibold text-3xl">4+ Years</p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-2 border-background"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
