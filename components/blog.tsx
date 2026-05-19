"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { BlogPostListItem } from "@/lib/data/posts"

type BlogProps = {
  posts: BlogPostListItem[]
}

export function Blog({ posts }: BlogProps) {
  return (
    <section id="blog" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
            LATEST ARTICLES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Thoughts <span className="text-muted-foreground">&</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
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
                className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    {post.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    )}
                    {post.readTime && <span>{post.readTime}</span>}
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-full text-sm hover:bg-secondary/80 transition-colors"
          >
            Read more articles
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
