"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const experiments = [
  {
    id: 1,
    title: "Motion UI",
    description: "Kinematic & Experiments",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Layer.ai",
    description: "Building the Future",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop"
  }
]

export function Experiments() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
            LAB
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore, experiment</h2>
          <p className="text-muted-foreground">Journeys, skills & experiences</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {experiments.map((experiment, index) => (
            <motion.div
              key={experiment.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href="#"
                className="group block relative overflow-hidden rounded-2xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={experiment.image}
                    alt={experiment.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                      {experiment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{experiment.description}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="#"
              className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-accent/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  Check out my favorite tools
                </h3>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="#contact"
              className="group flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-accent/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  Let me know you were here
                </h3>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
