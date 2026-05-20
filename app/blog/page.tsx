import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getPosts } from "@/lib/data/posts"
import { getFooter, getHeader } from "@/lib/data/site-settings"

export const revalidate = 60

export default async function BlogPage() {
  const [header, footer, posts] = await Promise.all([
    getHeader(),
    getFooter(),
    getPosts(),
  ])

  return (
    <PublicSiteShell>
      <Header header={header} />

      <section className="px-4 pt-32 pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="mt-10 mb-14">
            <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
              ARTICLES
            </p>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              All articles
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground leading-8">
              Notes on building, shipping, tools, and the details that make web
              products feel better.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={post.href}
                className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all"
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
                  <h2 className="font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer footer={footer} />
    </PublicSiteShell>
  )
}
