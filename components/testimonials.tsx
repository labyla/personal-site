"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import Image from "next/image"

import type { TestimonialListItem } from "@/lib/data/testimonials"

type TestimonialsProps = {
  testimonials: TestimonialListItem[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="border-y border-border bg-card/20 px-4 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
            TESTIMONIALS
          </p>
          <h2 className="text-4xl font-bold uppercase leading-none md:text-6xl">Word on the street</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-border bg-card p-6 transition-colors hover:border-accent/30"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
