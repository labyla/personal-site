"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { BlogPostListItem } from "@/lib/data/posts"

type BlogProps = {
  posts: BlogPostListItem[]
}

export function Blog({ posts }: BlogProps) {
  return (
    <section id="blog" className="border-y border-border bg-card/20 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end"
        >
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              LATEST ARTICLES
            </p>
            <h2 className="max-w-3xl text-4xl font-bold uppercase leading-none md:text-6xl">
              Notes from the build floor.
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Short reads on frontend craft, product clarity, and the practical
            details behind durable interfaces.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={post.href}
                className="group relative isolate flex h-full min-h-72 flex-col overflow-hidden border border-border bg-card/70 p-5 transition-colors hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative z-10 mb-8 flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-px flex-1 bg-border" />
                  {post.readTime && <span>{post.readTime}</span>}
                </div>

                {post.image && (
                  <div
                    aria-hidden="true"
                    className="relative z-10 mb-6 max-h-72 translate-y-0 overflow-hidden border border-border opacity-100 transition-[max-height,opacity,transform,margin] duration-500 ease-out md:mb-0 md:max-h-0 md:-translate-y-4 md:opacity-0 md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:mb-6 md:group-hover:max-h-72 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:mb-6 md:group-focus-within:max-h-72 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-focus-visible:mb-6 md:group-focus-visible:max-h-72 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-focus-within:scale-105 group-focus-visible:scale-105"
                      />
                      <div className="absolute inset-0 bg-background/18" />
                    </div>
                  </div>
                )}

                <h3 className="relative z-10 mb-4 text-2xl font-bold uppercase leading-none text-foreground transition-colors group-hover:text-accent group-focus-visible:text-accent md:text-3xl">
                  {post.title}
                </h3>
                <p className="relative z-10 mb-8 line-clamp-3 text-sm leading-7 text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="relative z-10 mt-auto flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-wider text-muted-foreground">
                  <span>{post.date || "Article"}</span>
                  <span className="inline-flex items-center gap-1 text-foreground transition-colors group-hover:text-accent group-focus-visible:text-accent">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-border bg-secondary px-5 py-3 text-sm transition-colors hover:border-accent/40 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Read more articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
